import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

/**
 * Middleware to validate withdrawal request
 */
export const validateWithdrawalRequest = (req: any, res: Response, next: NextFunction) => {
  const { amount, method } = req.body;

  if (!amount) {
    return res.status(400).json({
      success: false,
      message: 'amount is required',
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'amount must be greater than 0',
    });
  }

  if (!method) {
    return res.status(400).json({
      success: false,
      message: 'method is required',
    });
  }

  const validMethods = ['bank', 'crypto', 'wallet', 'card'];
  if (!validMethods.includes(method)) {
    return res.status(400).json({
      success: false,
      message: `Invalid method. Must be one of: ${validMethods.join(', ')}`,
    });
  }

  next();
};

/**
 * Middleware to check admin permission for withdrawal approval
 */
export const requireWithdrawalAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const allowedRoles = ['admin', 'moderator'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Permission denied. Admin role required',
    });
  }

  next();
};
