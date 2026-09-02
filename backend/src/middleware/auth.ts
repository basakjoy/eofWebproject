import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../database';
import { getPermissionsForRole, Permission } from '../types/roles';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    role: string;
    roleId: string;
    adminScope?: string;
    permissions: Permission[];
  };
}

/**
 * Verify JWT token and load user with roles and permissions
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

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
        }
      }
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Extract permissions
    let permissions: Permission[] = [];
    if (user.userRole && user.userRole.rolePermissions) {
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
      permissions
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error instanceof Error ? error.message : 'Unknown error'
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

    if (!req.user.permissions.includes(requiredPermission)) {
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

    const hasPermission = requiredPermissions.some(perm =>
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

    const hasAllPermissions = requiredPermissions.every(perm =>
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
    const isSuperAdmin = req.user.adminScope === 'SUPER_ADMIN';

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