import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

/**
 * Middleware to validate analysis creation/update
 */
export const validateAnalysis = (req: any, res: Response, next: NextFunction) => {
  const { title, type, content } = req.body;

  if (!title || !type || !content) {
    return res.status(400).json({
      success: false,
      message: 'title, type, and content are required',
    });
  }

  const validTypes = ['market', 'technical', 'fundamental', 'sentiment'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
    });
  }

  next();
};

/**
 * Middleware to check if user can edit analysis
 */
export const checkAnalysisOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  // This is a simple check - you might want to query the database
  // for now we'll just allow if user exists
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  next();
};
