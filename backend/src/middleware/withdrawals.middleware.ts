import { Response, NextFunction } from 'express';
import { AuthRequest, requireAdminCapability } from '../middleware/auth';
import { Permission } from '../types/roles';

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

  return requireAdminCapability(Permission.MANAGE_DEPOSITS, ['admin', 'moderator'])(req, res, next);
};

export const requireWithdrawalViewer = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  return requireAdminCapability(
    [Permission.VIEW_DEPOSITS, Permission.MANAGE_DEPOSITS],
    ['admin', 'moderator']
  )(req, res, next);
};
