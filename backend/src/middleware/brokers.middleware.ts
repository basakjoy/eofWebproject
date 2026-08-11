import { Response, NextFunction } from 'express';
import { z } from 'zod';


const connectAccountSchema = z.object({
  brokerId: z.string().min(1, 'brokerId is required'),
  accountNumber: z.string().trim().min(1, 'accountNumber is required').max(50),
  accountType: z.string().trim().max(50).optional(),
  balance: z.number().nonnegative('balance cannot be negative').optional(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'BDT']).optional(), // match your supported currencies
}).strict();

/**
 * Broker create/update schema
 */
const brokerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'name must be at least 2 characters')
    .max(100, 'name cannot exceed 100 characters'),
  code: z
    .string()
    .trim()
    .min(2, 'code must be at least 2 characters')
    .max(20, 'code cannot exceed 20 characters')
    .regex(/^[A-Z0-9_-]+$/, 'code must be uppercase letters, numbers, - or _ only'),
  // add other real fields here (e.g. website, description, rating fields)
  // with .optional() where appropriate, but keep them explicit —
  // never spread req.body directly into Prisma.
}).strict(); // rejects any field not explicitly listed above

export const validateBroker = (req: any, res: Response, next: NextFunction) => {
  const result = brokerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? 'Invalid broker data',
      errors: result.error.issues,
    });
  }

  // normalize code to uppercase and overwrite body with the parsed/sanitized data
  req.body = { ...result.data, code: result.data.code.toUpperCase() };
  next();
};

/**
 * Broker review schema
 */
const brokerReviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'rating must be a number' })
    .int('rating must be a whole number')
    .min(1, 'rating must be between 1 and 5')
    .max(5, 'rating must be between 1 and 5'),
  comment: z
    .string()
    .trim()
    .max(1000, 'comment cannot exceed 1000 characters')
    .optional(),
}).strict();

export const validateBrokerReview = (req: any, res: Response, next: NextFunction) => {
  const result = brokerReviewSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? 'Invalid review data',
      errors: result.error.issues,
    });
  }

  req.body = result.data;
  next();
};

export const validateConnectAccount = (req: any, res: Response, next: NextFunction) => {
  const result = connectAccountSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? 'Invalid account data',
      errors: result.error.issues,
    });
  }
  req.body = result.data;
  next();
};

