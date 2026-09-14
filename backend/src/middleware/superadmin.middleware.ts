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

  if ((req.user.adminScope || '').toUpperCase() !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Super admin scope required',
    });
  }

  next();
};

/**
 * Middleware to check if user has a specific admin scope
 */
export const requireAdminScope = (requiredScopes: string | string[]) => {
  const scopes = Array.isArray(requiredScopes) ? requiredScopes : [requiredScopes];
  const normalizedScopes = scopes.map((scope) => String(scope).toUpperCase());

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

    const userScope = String(req.user.adminScope || '').toUpperCase();
    if (userScope === 'SUPER_ADMIN') {
      return next();
    }

    if (!normalizedScopes.includes(userScope)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient admin scope',
        requiredScopes: normalizedScopes,
        userScope,
      });
    }

    next();
  };
};
