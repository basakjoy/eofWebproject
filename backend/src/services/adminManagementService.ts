import { prisma } from '../database';
import { AdminScope } from '@prisma/client';

export interface AdminSummary {
  id: string;
  email: string;
  name: string;
  adminScope: AdminScope;
  adminScopeGrantedAt: Date;
  adminScopeGrantedBy?: string;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * List all admin users with their scopes
 */
export async function listAdmins(): Promise<ApiResult<AdminSummary[]>> {
  try {
    const admins = await prisma.user.findMany({
      where: {
        adminScope: {
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        adminScope: true,
        adminScopeGrantedAt: true,
        adminScopeGrantedBy: true,
      },
      orderBy: { adminScopeGrantedAt: 'desc' },
    });

    return {
      success: true,
      data: admins as AdminSummary[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to list admins: ${error.message}`,
    };
  }
}

/**
 * Grant admin access by email
 */
export async function grantAdminByEmail(
  email: string,
  scope: AdminScope,
  performedBy: string
): Promise<ApiResult<AdminSummary>> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: `User with email ${email} not found`,
      };
    }

    // Check if user already has this scope
    if (user.adminScope === scope) {
      return {
        success: false,
        error: `User is already a ${scope}`,
      };
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'admin',
        adminScope: scope,
        adminScopeGrantedAt: new Date(),
        adminScopeGrantedBy: performedBy,
      },
    });

    // Log the action
    await prisma.log.create({
      data: {
        userId: performedBy,
        action: `GRANT_ADMIN: ${user.email} -> ${scope}`,
        status: 'success',
      },
    });

    return {
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        adminScope: updatedUser.adminScope as AdminScope,
        adminScopeGrantedAt: updatedUser.adminScopeGrantedAt as Date,
        adminScopeGrantedBy: updatedUser.adminScopeGrantedBy || undefined,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to grant admin: ${error.message}`,
    };
  }
}

/**
 * Revoke admin access
 */
export async function revokeAdmin(
  userId: string,
  revertTo: string,
  performedBy: string
): Promise<ApiResult<void>> {
  try {
    // Find the admin user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Prevent self-revocation
    if (userId === performedBy) {
      return {
        success: false,
        error: 'You cannot remove your own admin access',
      };
    }

    // Prevent removing the last SUPER_ADMIN
    if (user.adminScope === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: {
          adminScope: 'SUPER_ADMIN',
        },
      });

      if (superAdminCount === 1) {
        return {
          success: false,
          error: 'Cannot remove the last Super Admin. Promote another admin first.',
        };
      }
    }

    // Update user: remove admin access and revert role
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: revertTo,
        adminScope: null,
        adminScopeGrantedAt: null,
        adminScopeGrantedBy: null,
      },
    });

    // Log the action
    await prisma.log.create({
      data: {
        userId: performedBy,
        action: `REVOKE_ADMIN: ${user.email} (was ${user.adminScope}, reverted to ${revertTo})`,
        status: 'success',
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to revoke admin: ${error.message}`,
    };
  }
}

/**
 * Update admin scope
 */
export async function updateAdminScope(
  userId: string,
  newScope: AdminScope,
  performedBy: string
): Promise<ApiResult<AdminSummary>> {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (!user.adminScope) {
      return {
        success: false,
        error: 'User is not an admin',
      };
    }

    if (user.adminScope === newScope) {
      return {
        success: false,
        error: `User is already a ${newScope}`,
      };
    }

    const oldScope = user.adminScope;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        adminScope: newScope,
      },
    });

    // Log the action
    await prisma.log.create({
      data: {
        userId: performedBy,
        action: `UPDATE_ADMIN_SCOPE: ${user.email} (${oldScope} -> ${newScope})`,
        status: 'success',
      },
    });

    return {
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        adminScope: updatedUser.adminScope as AdminScope,
        adminScopeGrantedAt: updatedUser.adminScopeGrantedAt as Date,
        adminScopeGrantedBy: updatedUser.adminScopeGrantedBy || undefined,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to update admin scope: ${error.message}`,
    };
  }
}
