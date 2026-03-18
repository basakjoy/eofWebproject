import { Response, NextFunction } from 'express';

/**
 * Middleware to validate broker creation/update
 */
export const validateBroker = (req: any, res: Response, next: NextFunction) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      success: false,
      message: 'name and code are required',
    });
  }

  if (code.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'code must be at least 2 characters',
    });
  }

  next();
};

/**
 * Middleware to validate broker review
 */
export const validateBrokerReview = (req: any, res: Response, next: NextFunction) => {
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({
      success: false,
      message: 'rating is required',
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'rating must be between 1 and 5',
    });
  }

  if (comment && comment.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'comment cannot exceed 1000 characters',
    });
  }

  next();
};
