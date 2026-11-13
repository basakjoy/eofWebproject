import { AdminScope, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../database';
import { Permission } from '../types/roles';

export interface AdminSummary {
  id: string;
  email: string | null;
  username: string | null;
  name: string;
  role: string;
  status: string;
  adminScope: AdminScope | null;
  adminScopeGrantedAt: Date | null;
  adminScopeGrantedBy?: string;
  permissions: string[];
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const adminRoles = ['admin', 'super_admin', 'marketing_admin', 'signal_admin', 'content_admin'];

export async function listAdmins(): Promise<ApiResult<AdminSummary[]>> {
  try {
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { adminScope: { not: null } },
          { role: { in: adminRoles } },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true,
        adminScope: true,
        adminScopeGrantedAt: true,
        adminScopeGrantedBy: true,
        adminPermissions: { select: { permission: true } },
      },
      orderBy: { adminScopeGrantedAt: 'desc' },
    });

    return {
      success: true,
      data: admins.map((admin) => ({
        ...admin,
        adminScopeGrantedBy: admin.adminScopeGrantedBy || undefined,
        permissions: admin.adminPermissions.map(({ permission }) => permission),
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to list admins: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function createAdminUser(
  username: string,
  password: string,
  role: 'admin' | 'super_admin',
  permissions: Permission[],
  performedBy: string
): Promise<ApiResult<AdminSummary>> {
  try {
    const normalizedUsername = username.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: normalizedUsername,
          username: normalizedUsername,
          email: null,
          password: hashedPassword,
          role,
          adminScope: role === 'super_admin' ? 'SUPER_ADMIN' : null,
          adminScopeGrantedAt: role === 'super_admin' ? new Date() : null,
          adminScopeGrantedBy: performedBy,
          adminPermissionsConfigured: role === 'admin',
          ...(role === 'admin' ? {
            adminPermissions: {
              create: [...new Set([Permission.VIEW_ADMIN_DASHBOARD, ...permissions])]
                .map((permission) => ({ permission })),
            },
          } : {}),
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
          status: true,
          adminScope: true,
          adminScopeGrantedAt: true,
          adminScopeGrantedBy: true,
          adminPermissions: { select: { permission: true } },
        },
      });

      await tx.log.create({
        data: {
          userId: performedBy,
          action: `CREATE_${role === 'super_admin' ? 'SUPER_ADMIN' : 'ADMIN'}: ${normalizedUsername}`,
          status: 'success',
        },
      });
      return created;
    });

    return {
      success: true,
      data: {
        ...user,
        adminScopeGrantedBy: user.adminScopeGrantedBy || undefined,
        permissions: user.adminPermissions.map(({ permission }) => permission),
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: 'Username is already taken' };
    }
    return {
      success: false,
      error: `Failed to create admin: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function updateAdminPermissions(
  userId: string,
  permissions: Permission[],
  performedBy: string
): Promise<ApiResult<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { userRole: { select: { name: true, level: true, isSystem: true } } },
      });
      const actor = await tx.user.findUnique({
        where: { id: performedBy },
        include: { userRole: { select: { level: true } } },
      });
      if (!user || user.role !== 'admin' || user.adminScope === 'SUPER_ADMIN') {
        throw new Error('Admin user not found');
      }
      if (!actor?.userRole || !user.userRole || actor.userRole.level <= user.userRole.level) {
        throw new Error('You cannot manage a peer or higher-level administrator');
      }

      const nextPermissions = [...new Set([Permission.VIEW_ADMIN_DASHBOARD, ...permissions])];
      await tx.adminPermission.deleteMany({ where: { adminId: userId } });
      if (nextPermissions.length) {
        await tx.adminPermission.createMany({
          data: nextPermissions.map((permission) => ({ adminId: userId, permission })),
        });
      }
      await tx.user.update({
        where: { id: userId },
        data: {
          adminScope: null,
          adminPermissionsConfigured: true,
          tokenVersion: { increment: 1 },
          permissionsVersion: { increment: 1 },
        },
      });
      await tx.log.create({
        data: {
          userId: performedBy,
          action: `UPDATE_ADMIN_PERMISSIONS: ${user.username || user.id}`,
          status: 'success',
        },
      });
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update admin permissions',
    };
  }
}

export async function updateAdminStatus(
  userId: string,
  status: 'active' | 'banned',
  performedBy: string
): Promise<ApiResult<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { userRole: { select: { name: true, level: true, isSystem: true } } },
      });
      const actor = await tx.user.findUnique({
        where: { id: performedBy },
        include: { userRole: { select: { level: true } } },
      });
      if (!user || (!user.adminScope && !adminRoles.includes(user.role))) {
        throw new Error('Admin user not found');
      }
      if (!actor?.userRole || !user.userRole || actor.userRole.level <= user.userRole.level) {
        throw new Error('You cannot manage a peer or higher-level administrator');
      }
      if (userId === performedBy) {
        throw new Error('You cannot suspend or reactivate yourself');
      }

      if (status === 'banned' && user.userRole.name === 'super_admin' && user.status === 'active') {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(671238901)`;
        const activeSuperAdmins = await tx.user.count({
          where: {
            status: 'active',
            isActive: true,
            userRole: { is: { name: 'super_admin', isSystem: true } },
          },
        });
        if (activeSuperAdmins <= 1) {
          throw new Error('Cannot suspend the last active super admin');
        }
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          status,
          isActive: status === 'active',
          tokenVersion: { increment: 1 },
          permissionsVersion: { increment: 1 },
        },
      });
      await tx.log.create({
        data: {
          userId: performedBy,
          action: `${status === 'banned' ? 'SUSPEND' : 'REACTIVATE'}_ADMIN: ${user.username || user.email || user.id}`,
          status: 'success',
        },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update admin status',
    };
  }
}

export async function listAdminActivity(
  adminId: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number
) {
  const searchFilter = search
    ? { contains: search, mode: 'insensitive' as const }
    : undefined;
  const where: Prisma.AdminActivityWhereInput = {
    ...(adminId ? { adminId } : {}),
    ...(searchFilter ? {
      OR: [
        { action: searchFilter },
        { target: searchFilter },
        { ipAddress: searchFilter },
      ],
    } : {}),
  };
  const [activities, total] = await prisma.$transaction([
    prisma.adminActivity.findMany({
      where,
      select: {
        id: true,
        adminId: true,
        sessionId: true,
        action: true,
        target: true,
        ipAddress: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.adminActivity.count({ where }),
  ]);
  const admins = await prisma.user.findMany({
    where: { id: { in: [...new Set(activities.map(({ adminId }) => adminId))] } },
    select: { id: true, username: true, email: true, name: true },
  });
  const adminById = new Map(admins.map((admin) => [admin.id, admin]));
  return {
    data: activities.map((activity) => ({
      ...activity,
      admin: adminById.get(activity.adminId) || null,
    })),
    total,
  };
}
