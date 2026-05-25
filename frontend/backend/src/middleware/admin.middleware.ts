import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required',
    });
  }

  next();
};

/**
 * Validate admin request body
 */
export const validateAdminRequest = (requiredFields: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter(field => !req.body[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    next();
  };
};
