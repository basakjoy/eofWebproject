import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database';
import { getPermissionsForRole, Permission } from '../types/roles';
import { isAdminAccount, verifyAccessToken } from '../lib/tokens';

export interface AuthRequest extends Request {
  sessionId?: string;
  user?: {
    userId: string;
    email: string | null;
    name: string;
    role: string;
    roleId: string;
    adminScope?: string;
    adminPermissionsConfigured: boolean;
    permissions: Permission[];
  };
}

export const isSuperAdminUser = (
  user: Pick<NonNullable<AuthRequest['user']>, 'role' | 'adminScope'> | null | undefined
): boolean =>
  Boolean(user && (
    user.role === 'super_admin' ||
    user.role === 'superadmin' ||
    (user.role === 'admin' && user.adminScope?.toUpperCase() === 'SUPER_ADMIN')
  ));

export const getBearerToken = (req: Request): string | undefined => {
  const match = /^Bearer\s+([^\s]+)$/i.exec(req.headers.authorization || '');
  return match?.[1];
};

export const getIp = (req: Request): string | null => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const forwarded = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
    ?.split(',')
    .map((address) => address.trim())
    .filter(Boolean);
  return req.ip || forwarded?.[0] || req.socket.remoteAddress || null;
};

/**
 * Verify JWT token and load user with roles and permissions
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = verifyAccessToken(token);
    if (decoded.sid) {
      const session = await prisma.adminSession.findUnique({
        where: { id: decoded.sid },
        select: { adminId: true, logoutAt: true },
      });
      if (!session || session.adminId !== decoded.userId || session.logoutAt) {
        return res.status(401).json({ success: false, message: 'Admin session is closed or invalid' });
      }
      req.sessionId = decoded.sid;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRole: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        },
        adminPermissions: true,
      }
    });

    if (
      !user ||
      user.status !== 'active' ||
      !user.isActive ||
      user.roleId !== decoded.roleId ||
      user.permissionsVersion !== decoded.permissionsVersion ||
      (isAdminAccount(user) && decoded.sid === undefined) ||
      (decoded.sid !== undefined && !isAdminAccount(user))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or revoked token'
      });
    }

    // Extract permissions
    let permissions: Permission[] = [];
    if (user.adminPermissionsConfigured) {
      permissions = user.adminPermissions.map(({ permission }) => permission as Permission);
    } else if (user.userRole && user.userRole.rolePermissions) {
      permissions = user.userRole.rolePermissions.map((rp: any) => rp.permission.name as Permission);
    } else {
      // Fallback if role is predefined or role relation is missing
      permissions = getPermissionsForRole(user.role as any);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      roleId: user.roleId || '',
      adminScope: user.adminScope || undefined,
      adminPermissionsConfigured: user.adminPermissionsConfigured,
      permissions
    };

    next();
  } catch (error) {
    if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
      return res.status(401).json({
        success: false,
        message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware to require specific permission
 */
export const requirePermission = (requiredPermission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!isSuperAdminUser(req.user) && !req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermission,
        userPermissions: req.user.permissions
      });
    }

    next();
  };

};

export const requireAdminCapability = (
  requiredPermission: Permission | Permission[],
  allowedRoles: string[] = ['admin']
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (isSuperAdminUser(req.user)) return next();

    const isAdmin = allowedRoles.includes(req.user.role);
    const requiredPermissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const allowed = isAdmin && (
      !req.user.adminPermissionsConfigured ||
      requiredPermissions.some((permission) => req.user!.permissions.includes(permission))
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermission: Array.isArray(requiredPermission) ? requiredPermissions : requiredPermissions[0],
      });
    }

    next();
  };
};

/**
 * Middleware to require one of multiple permissions
 */
export const requireAnyPermission = (requiredPermissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const hasPermission = isSuperAdminUser(req.user) || requiredPermissions.some((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermissions,
        userPermissions: req.user.permissions
      });
    }

    next();
  };
};

/**
 * Middleware to require all permissions
 */
export const requireAllPermissions = (requiredPermissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const hasAllPermissions = isSuperAdminUser(req.user) || requiredPermissions.every((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermissions,
        userPermissions: req.user.permissions
      });
    }

    next();
  };
};

/**
 * Optional: Middleware to check if user has specific role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if user's role is in allowed roles
    const hasRole = allowedRoles.includes(req.user.role);
    
    // Also check if user has SUPER_ADMIN scope (super admin can do everything)
    const isSuperAdmin = isSuperAdminUser(req.user);

    if (!hasRole && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};