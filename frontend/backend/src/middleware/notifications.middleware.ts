import { Response, NextFunction } from 'express';

/**
 * Middleware to validate notification request
 */
export const validateNotification = (req: any, res: Response, next: NextFunction) => {
  const { userId, type, title, message } = req.body;

  if (!userId || !type || !title || !message) {
    return res.status(400).json({
      success: false,
      message: 'userId, type, title, and message are required',
    });
  }

  const validTypes = ['alert', 'info', 'warning', 'success', 'error'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
    });
  }

  next();
};

/**
 * Middleware to validate notification preferences
 */
export const validatePreferences = (req: any, res: Response, next: NextFunction) => {
  const { emailNotifications, pushNotifications } = req.body;

  if (typeof emailNotifications !== 'boolean' && emailNotifications !== undefined) {
    return res.status(400).json({
      success: false,
      message: 'emailNotifications must be a boolean',
    });
  }

  if (typeof pushNotifications !== 'boolean' && pushNotifications !== undefined) {
    return res.status(400).json({
      success: false,
      message: 'pushNotifications must be a boolean',
    });
  }

  next();
};
