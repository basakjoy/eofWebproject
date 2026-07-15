import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

/**
 * Middleware to check if user is a SUPER_ADMIN
 */
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin role required',
    });
  }

  // For now, we'll just check that they're an admin
  // In a full implementation, check req.user.adminScope
  next();
};

/**
 * Middleware to check if user has a specific admin scope
 */
export const requireAdminScope = (requiredScopes: string | string[]) => {
  const scopes = Array.isArray(requiredScopes) ? requiredScopes : [requiredScopes];

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin role required',
      });
    }

    // Check scope (this will be enhanced when adminScope is added to the JWT)
    next();
  };
};
