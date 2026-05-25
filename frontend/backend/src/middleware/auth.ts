import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getAsync, allAsync } from '../database';
import { getPermissionsForRole, Permission } from '../types/roles';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    role: string;
    roleId: string;
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
    const user = await getAsync(
      'SELECT id, email, name, role, roleId, status FROM users WHERE id = ? AND status = ?',
      [decoded.userId, 'active']
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Get user's permissions through role_permissions table
    const rolePermissions = await allAsync(
      `SELECT p.name as permission FROM permissions p
       INNER JOIN role_permissions rp ON p.id = rp.permissionId
       WHERE rp.roleId = ?`,
      [user.roleId]
    );

    const permissions = rolePermissions.map((rp: any) => rp.permission) as Permission[];

    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      roleId: user.roleId,
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

    if (!allowedRoles.includes(req.user.role)) {
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