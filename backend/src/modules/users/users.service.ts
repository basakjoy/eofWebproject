import { OverrideEffect, Prisma, Scope } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../../database';
import { writeAuditLog } from '../audit/audit.service';
import { verifyPasswordConfirmation } from '../auth/reauth.service';
import { canWithSubject, scopeFor } from '../rbac/permission-resolver';
import { canCreateRole, canGrantPermission, canManageUser, ManagedUser } from '../rbac/rbac.service';
import { scopeToPrismaWhere } from '../rbac/scope-filter';
import { PermissionKey, PermissionResource, PermissionSubject } from '../rbac/permissions.types';

export class UsersServiceError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'UsersServiceError';
  }
}

export interface RequestAuditContext {
  actor: PermissionSubject;
  ip?: string;
}

export interface CreateUserInput {
  name: string;
  email?: string;
  username?: string;
  password: string;
  passwordConfirm?: string;
  roleId: string;
  teamId?: string;
  departmentId?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  teamId?: string | null;
  departmentId?: string | null;
}

export interface OverrideInput {
  effect: OverrideEffect;
  scope?: Scope;
  expiresAt?: Date;
}

const managedUserSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  phone: true,
  status: true,
  isActive: true,
  roleId: true,
  teamId: true,
  departmentId: true,
  createdById: true,
  userRole: { select: { id: true, name: true, level: true, isSystem: true } },
} satisfies Prisma.UserSelect;

type UserWithRole = Prisma.UserGetPayload<{ select: typeof managedUserSelect }>;

const toManagedUser = (user: UserWithRole): ManagedUser => {
  if (!user.userRole) throw new UsersServiceError('User role is not assigned', 409);
  return {
    id: user.id,
    teamId: user.teamId,
    departmentId: user.departmentId,
    role: user.userRole,
  };
};

const currentUserInTransaction = async (
  tx: Prisma.TransactionClient,
  actor: PermissionSubject
): Promise<void> => {
  const current = await tx.user.findUnique({
    where: { id: actor.id },
    select: { roleId: true, permissionsVersion: true, status: true, isActive: true },
  });
  if (
    !current ||
    current.roleId !== actor.roleId ||
    current.permissionsVersion !== actor.permissionsVersion ||
    current.status !== 'active' ||
    !current.isActive
  ) {
    throw new UsersServiceError('Authentication state changed; sign in again', 401);
  }
};

const auditDeniedUserAction = async (
  context: RequestAuditContext,
  action: string,
  targetId: string
): Promise<never> => {
  await writeAuditLog({
    actorId: context.actor.id,
    action: 'AUTHORIZATION_DENIED',
    targetType: 'User',
    targetId,
    after: { attemptedAction: action },
    ip: context.ip,
  });
  throw new UsersServiceError('Resource not found', 404);
};

const loadAuthorizedTarget = async (
  context: RequestAuditContext,
  targetId: string,
  action: Parameters<typeof canManageUser>[2]
): Promise<{ row: UserWithRole; target: ManagedUser }> => {
  const row = await prisma.user.findUnique({ where: { id: targetId }, select: managedUserSelect });
  if (!row) return auditDeniedUserAction(context, action, targetId);
  const target = toManagedUser(row);
  if (!canManageUser(context.actor, target, action)) {
    return auditDeniedUserAction(context, action, targetId);
  }
  return { row, target };
};

const confirmPassword = async (
  context: RequestAuditContext,
  passwordConfirm: string | undefined,
  targetId: string,
  attemptedAction: string
): Promise<void> => {
  const confirmed = await verifyPasswordConfirmation({
    actorId: context.actor.id,
    passwordConfirm,
    action: attemptedAction,
    targetType: 'User',
    targetId,
    ip: context.ip,
  });
  if (!confirmed) {
    throw new UsersServiceError('Password confirmation failed', 403);
  }
};

const ensureRoleExists = async (roleId: string) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    select: { id: true, name: true, level: true, isSystem: true },
  });
  if (!role) throw new UsersServiceError('Role not found', 404);
  return role;
};

const resolvePlacement = async (
  client: Prisma.TransactionClient | typeof prisma,
  teamId: string | null | undefined,
  departmentId: string | null | undefined
): Promise<{ teamId: string | null; departmentId: string | null }> => {
  let resolvedDepartmentId = departmentId ?? null;
  if (teamId) {
    const team = await client.team.findUnique({ where: { id: teamId }, select: { departmentId: true } });
    if (!team) throw new UsersServiceError('Team not found', 400);
    if (resolvedDepartmentId && team.departmentId && team.departmentId !== resolvedDepartmentId) {
      throw new UsersServiceError('Team and department do not match', 400);
    }
    resolvedDepartmentId = resolvedDepartmentId ?? team.departmentId;
  }
  if (resolvedDepartmentId) {
    const department = await client.department.findUnique({
      where: { id: resolvedDepartmentId },
      select: { id: true },
    });
    if (!department) throw new UsersServiceError('Department not found', 400);
  }
  return { teamId: teamId ?? null, departmentId: resolvedDepartmentId };
};

const ensureLastSuperAdminRemains = async (
  tx: Prisma.TransactionClient,
  current: UserWithRole,
  action: string
): Promise<void> => {
  if (current.userRole?.name !== 'super_admin' || current.status !== 'active' || !current.isActive) return;
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(671238901)`;
  const activeSuperAdmins = await tx.user.count({
    where: {
      status: 'active',
      isActive: true,
      userRole: { is: { name: 'super_admin', isSystem: true } },
    },
  });
  assertActiveSuperAdminCount(activeSuperAdmins, action);
};

export const assertActiveSuperAdminCount = (activeSuperAdmins: number, action: string): void => {
  if (activeSuperAdmins <= 1) {
    throw new UsersServiceError(`Cannot ${action} the last active SUPER_ADMIN`, 409);
  }
};

const userAuditValue = (user: UserWithRole) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  roleId: user.roleId,
  role: user.userRole?.name ?? null,
  teamId: user.teamId,
  departmentId: user.departmentId,
  status: user.status,
  isActive: user.isActive,
});

export const listUsers = async (
  actor: PermissionSubject,
  offset: number,
  limit: number
) => {
  const effectiveScope = scopeFor(actor, 'user:read');
  if (!effectiveScope) return { items: [], total: 0 };

  const where: Prisma.UserWhereInput = scopeToPrismaWhere(effectiveScope, actor);
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        status: true,
        isActive: true,
        roleId: true,
        teamId: true,
        departmentId: true,
        userRole: { select: { name: true, level: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: offset,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total };
};

export const listTeamMembers = async (actor: PermissionSubject) => {
  const scope = scopeFor(actor, 'team:read');
  if (!scope) return [];
  return prisma.user.findMany({
    where: {
      ...scopeToPrismaWhere(scope, actor),
      status: 'active',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      roleId: true,
      teamId: true,
      departmentId: true,
      userRole: { select: { name: true, level: true } },
    },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });
};

export const createUser = async (
  context: RequestAuditContext,
  input: CreateUserInput
): Promise<UserWithRole> => {
  const role = await ensureRoleExists(input.roleId);
  if (!canCreateRole(context.actor, role)) {
    await writeAuditLog({
      actorId: context.actor.id,
      action: 'AUTHORIZATION_DENIED',
      targetType: 'Role',
      targetId: role.id,
      after: { attemptedAction: 'create-user-with-role' },
      ip: context.ip,
    });
    throw new UsersServiceError('Forbidden', 403);
  }

  let teamId = input.teamId ?? null;
  let departmentId = input.departmentId ?? null;
  if (scopeFor(context.actor, 'user:create') === 'TEAM') {
    if (!context.actor.teamId) {
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'AUTHORIZATION_DENIED',
        targetType: 'User',
        after: { attemptedAction: 'create-user-without-team' },
        ip: context.ip,
      });
      throw new UsersServiceError('Forbidden', 403);
    }
    if (teamId && teamId !== context.actor.teamId) {
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'AUTHORIZATION_DENIED',
        targetType: 'User',
        after: { attemptedAction: 'create-user-outside-team' },
        ip: context.ip,
      });
      throw new UsersServiceError('Forbidden', 403);
    }
    teamId = context.actor.teamId;
    if (departmentId && departmentId !== context.actor.departmentId) {
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'AUTHORIZATION_DENIED',
        targetType: 'User',
        after: { attemptedAction: 'create-user-outside-department' },
        ip: context.ip,
      });
      throw new UsersServiceError('Forbidden', 403);
    }
    departmentId = context.actor.departmentId;
  }
  const placement = await resolvePlacement(prisma, teamId, departmentId);
  teamId = placement.teamId;
  departmentId = placement.departmentId;
  const newResource: PermissionResource = { teamId, departmentId };
  if (!canWithSubject(context.actor, 'user:create', newResource)) {
    await writeAuditLog({
      actorId: context.actor.id,
      action: 'AUTHORIZATION_DENIED',
      targetType: 'User',
      after: { attemptedAction: 'create-user' },
      ip: context.ip,
    });
    throw new UsersServiceError('Forbidden', 403);
  }
  if (role.level >= 80) {
    await confirmPassword(context, input.passwordConfirm, role.id, 'create-admin');
  }
  const password = await bcrypt.hash(input.password, 12);
  try {
    return await prisma.$transaction(async (tx) => {
      await currentUserInTransaction(tx, context.actor);
      const created = await tx.user.create({
        data: {
          name: input.name,
          email: input.email ?? null,
          username: input.username ?? null,
          password,
          role: role.name,
          roleId: role.id,
          teamId,
          departmentId,
          createdById: context.actor.id,
          status: 'active',
          isActive: true,
        },
        select: managedUserSelect,
      });
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'USER_CREATED',
        targetType: 'User',
        targetId: created.id,
        after: userAuditValue(created),
        ip: context.ip,
      }, tx);
      return created;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new UsersServiceError('Email or username is already in use', 409);
    }
    throw error;
  }
};

export const updateUser = async (
  context: RequestAuditContext,
  targetId: string,
  input: UpdateUserInput
): Promise<UserWithRole> => {
  const { row, target } = await loadAuthorizedTarget(context, targetId, 'update');
  if (scopeFor(context.actor, 'user:update') === 'TEAM' &&
      ((input.teamId !== undefined && input.teamId !== target.teamId) ||
       (input.departmentId !== undefined && input.departmentId !== target.departmentId))) {
    await auditDeniedUserAction(context, 'move-user-between-teams', targetId);
  }
  const hasPlacementUpdate = input.teamId !== undefined || input.departmentId !== undefined;
  const placement = hasPlacementUpdate
    ? await resolvePlacement(
      prisma,
      input.teamId === undefined ? row.teamId : input.teamId,
      input.departmentId === undefined ? row.departmentId : input.departmentId
    )
    : { teamId: row.teamId, departmentId: row.departmentId };

  return prisma.$transaction(async (tx) => {
    await currentUserInTransaction(tx, context.actor);
    const current = await tx.user.findUnique({ where: { id: targetId }, select: managedUserSelect });
    if (!current || !canManageUser(context.actor, toManagedUser(current), 'update')) {
      return auditDeniedUserAction(context, 'update', targetId);
    }
    const updated = await tx.user.update({
      where: { id: targetId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
        ...(hasPlacementUpdate ? {
          teamId: placement.teamId,
          departmentId: placement.departmentId,
          permissionsVersion: { increment: 1 },
        } : {}),
      },
      select: managedUserSelect,
    });
    await writeAuditLog({
      actorId: context.actor.id,
      action: 'USER_UPDATED',
      targetType: 'User',
      targetId,
      before: userAuditValue(current),
      after: userAuditValue(updated),
      ip: context.ip,
    }, tx);
    return updated;
  });
};

export const changeUserRole = async (
  context: RequestAuditContext,
  targetId: string,
  roleId: string,
  passwordConfirm: string
): Promise<UserWithRole> => {
  const { row, target } = await loadAuthorizedTarget(context, targetId, 'change-role');
  const role = await ensureRoleExists(roleId);
  if (!canCreateRole(context.actor, role) || role.level >= context.actor.role.level) {
    await auditDeniedUserAction(context, 'change-user-role', targetId);
  }
  await confirmPassword(context, passwordConfirm, targetId, 'change-user-role');

  try {
    return await prisma.$transaction(async (tx) => {
      await currentUserInTransaction(tx, context.actor);
      const current = await tx.user.findUnique({ where: { id: targetId }, select: managedUserSelect });
      if (!current || !canManageUser(context.actor, toManagedUser(current), 'change-role')) {
        return auditDeniedUserAction(context, 'change-user-role', targetId);
      }
      if (current.userRole?.name === 'super_admin' && role.name !== 'super_admin') {
        await ensureLastSuperAdminRemains(tx, current, 'demote');
      }
      const updated = await tx.user.update({
        where: { id: targetId },
        data: {
          role: role.name,
          roleId: role.id,
          permissionsVersion: { increment: 1 },
        },
        select: managedUserSelect,
      });
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'USER_ROLE_CHANGED',
        targetType: 'User',
        targetId,
        before: { roleId: current.roleId, role: current.userRole?.name ?? null },
        after: { roleId: role.id, role: role.name },
        ip: context.ip,
      }, tx);
      return updated;
    });
  } catch (error) {
    if (error instanceof UsersServiceError && error.message.includes('last active SUPER_ADMIN')) {
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'LAST_SUPER_ADMIN_PROTECTION_TRIGGERED',
        targetType: 'User',
        targetId,
        after: { attemptedAction: 'demote' },
        ip: context.ip,
      });
    }
    throw error;
  }
};

export const setUserActive = async (
  context: RequestAuditContext,
  targetId: string,
  active: boolean,
  passwordConfirm: string
): Promise<UserWithRole> => {
  const action = active ? 'reactivate' : 'deactivate';
  const { row } = await loadAuthorizedTarget(context, targetId, action);
  await confirmPassword(context, passwordConfirm, targetId, `${action}-user`);

  try {
    return await prisma.$transaction(async (tx) => {
      await currentUserInTransaction(tx, context.actor);
      const current = await tx.user.findUnique({ where: { id: targetId }, select: managedUserSelect });
      if (!current || !canManageUser(context.actor, toManagedUser(current), action)) {
        return auditDeniedUserAction(context, `${action}-user`, targetId);
      }
      if (!active) await ensureLastSuperAdminRemains(tx, current, 'deactivate');
      const updated = await tx.user.update({
        where: { id: targetId },
        data: {
          status: active ? 'active' : 'inactive',
          isActive: active,
          tokenVersion: { increment: 1 },
          permissionsVersion: { increment: 1 },
        },
        select: managedUserSelect,
      });
      if (!active) {
        await tx.refreshToken.updateMany({
          where: { userId: targetId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      await writeAuditLog({
        actorId: context.actor.id,
        action: active ? 'USER_REACTIVATED' : 'USER_DEACTIVATED',
        targetType: 'User',
        targetId,
        before: { status: current.status, isActive: current.isActive },
        after: { status: updated.status, isActive: updated.isActive },
        ip: context.ip,
      }, tx);
      return updated;
    });
  } catch (error) {
    if (error instanceof UsersServiceError && error.message.includes('last active SUPER_ADMIN')) {
      await writeAuditLog({
        actorId: context.actor.id,
        action: 'LAST_SUPER_ADMIN_PROTECTION_TRIGGERED',
        targetType: 'User',
        targetId,
        after: { attemptedAction: 'deactivate' },
        ip: context.ip,
      });
    }
    throw error;
  }
};

export const setPermissionOverride = async (
  context: RequestAuditContext,
  targetId: string,
  permissionKey: PermissionKey,
  input: OverrideInput
) => {
  const { target } = await loadAuthorizedTarget(context, targetId, 'manage-overrides');
  if (
    input.effect === 'GRANT' &&
    !canGrantPermission(context.actor, permissionKey, input.scope, target)
  ) {
    await auditDeniedUserAction(context, 'grant-permission-override', targetId);
  }
  const overrideScope = input.effect === 'GRANT'
    ? input.scope ?? scopeFor(context.actor, permissionKey) ?? null
    : input.scope ?? null;
  const permission = await prisma.permission.findUnique({
    where: { key: permissionKey },
    select: { id: true },
  });
  if (!permission) throw new UsersServiceError('Permission not found', 404);

  return prisma.$transaction(async (tx) => {
    await currentUserInTransaction(tx, context.actor);
    const current = await tx.user.findUnique({ where: { id: targetId }, select: managedUserSelect });
    if (!current || !canManageUser(context.actor, toManagedUser(current), 'manage-overrides')) {
      return auditDeniedUserAction(context, 'manage-permission-override', targetId);
    }
    const existing = await tx.userPermissionOverride.findUnique({
      where: { userId_permissionId: { userId: targetId, permissionId: permission.id } },
      select: { effect: true, scope: true, expiresAt: true },
    });
    const updated = await tx.userPermissionOverride.upsert({
      where: { userId_permissionId: { userId: targetId, permissionId: permission.id } },
      update: {
        effect: input.effect,
        scope: overrideScope,
        expiresAt: input.expiresAt ?? null,
        grantedById: context.actor.id,
      },
      create: {
        userId: targetId,
        permissionId: permission.id,
        effect: input.effect,
        scope: overrideScope,
        expiresAt: input.expiresAt ?? null,
        grantedById: context.actor.id,
      },
      select: { effect: true, scope: true, expiresAt: true },
    });
    await tx.user.update({
      where: { id: targetId },
      data: { permissionsVersion: { increment: 1 } },
    });
    await writeAuditLog({
      actorId: context.actor.id,
      action: 'USER_PERMISSION_OVERRIDE_SET',
      targetType: 'User',
      targetId,
      before: existing,
      after: {
        permission: permissionKey,
        effect: updated.effect,
        scope: updated.scope,
        expiresAt: updated.expiresAt?.toISOString() ?? null,
      },
      ip: context.ip,
    }, tx);
    return updated;
  });
};

export const removePermissionOverride = async (
  context: RequestAuditContext,
  targetId: string,
  permissionKey: PermissionKey
): Promise<void> => {
  await loadAuthorizedTarget(context, targetId, 'manage-overrides');
  const permission = await prisma.permission.findUnique({
    where: { key: permissionKey },
    select: { id: true },
  });
  if (!permission) throw new UsersServiceError('Permission not found', 404);

  await prisma.$transaction(async (tx) => {
    await currentUserInTransaction(tx, context.actor);
    const current = await tx.user.findUnique({ where: { id: targetId }, select: managedUserSelect });
    if (!current || !canManageUser(context.actor, toManagedUser(current), 'manage-overrides')) {
      return auditDeniedUserAction(context, 'remove-permission-override', targetId);
    }
    const removed = await tx.userPermissionOverride.deleteMany({
      where: { userId: targetId, permissionId: permission.id },
    });
    if (removed.count === 0) throw new UsersServiceError('Permission override not found', 404);
    await tx.user.update({
      where: { id: targetId },
      data: { permissionsVersion: { increment: 1 } },
    });
    await writeAuditLog({
      actorId: context.actor.id,
      action: 'USER_PERMISSION_OVERRIDE_REMOVED',
      targetType: 'User',
      targetId,
      before: { permission: permissionKey },
      after: null,
      ip: context.ip,
    }, tx);
  });
};
