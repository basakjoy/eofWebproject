import { Response, NextFunction } from 'express';

/**
 * Middleware to validate support ticket creation
 */
export const validateTicket = (req: any, res: Response, next: NextFunction) => {
  const { subject, description, category } = req.body;

  if (!subject || !description || !category) {
    return res.status(400).json({
      success: false,
      message: 'subject, description, and category are required',
    });
  }

  if (subject.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'subject must be at least 5 characters',
    });
  }

  if (description.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'description must be at least 10 characters',
    });
  }

  next();
};

/**
 * Middleware to validate support message
 */
export const validateMessage = (req: any, res: Response, next: NextFunction) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'message is required',
    });
  }

  if (message.length < 1 || message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'message must be between 1 and 5000 characters',
    });
  }

  next();
};

/**
 * Middleware to check if user is support agent or admin
 */
export const requireSupportRole = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const allowedRoles = ['admin', 'support_agent'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Permission denied. Support staff role required',
    });
  }

  next();
};
