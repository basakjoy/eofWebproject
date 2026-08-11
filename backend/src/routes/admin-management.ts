import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/superadmin.middleware';
import * as adminManagementService from '../services/adminManagementService';
import { AdminScope } from '@prisma/client';

const router = express.Router();


const adminManagementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    {
      success: false,
      message: 'Too many admin management requests. Please try again later.',
    },
});

router.use(adminManagementLimiter);

// Validation schemas
const grantAdminSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  scope: z.enum(['SIGNAL_ADMIN', 'CONTENT_ADMIN', 'SUPER_ADMIN']),
});

const updateAdminScopeSchema = z.object({
  scope: z.enum(['SIGNAL_ADMIN', 'CONTENT_ADMIN', 'SUPER_ADMIN']),
});

const revokeAdminSchema = z.object({
  revertTo: z.string().min(1, 'Revert role is required'),
});

// userid route params should match your id. you can't update or delete your own admin access
const userIdParamSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),

});

// Middleware to validate request body
const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction ) => {
  const result = schema.safeParse(req.body);
  if (!result.success){
   return res.status(400).json ({
    success: false,
    message: 'Invalid request parameters  ',
    errors: result.error.issues.map ((e) => `${e.path.join('.')}: ${e.message}`),
   });  
  }
  next();
  };
};

// Validate route params against a schema
const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction ) => {
  const result = schema.safeParse(req.params);
  if (!result.success){
   return res.status(400).json ({  
    success: false,
    message: 'Invalid request parameters  ',
    errors: result.error.issues.map ((e) => `${e.path.join('.')}: ${e.message}`),
   });  
  }
  next();
  };
};

// Block a super admin from revoking his own admin access
// Prevent accidental self-lockout (at least two super admin must be active at all times) 
// where a compromised session immediately revokes all admin access

const blockSelfAction =(req: AuthRequest, res: Response, next: NextFunction) => {
  const targetUserId = req.params.userId;
  if (req.user?.userId && targetUserId && req.user.userId === targetUserId ) {
    return res.status(400).json({
      success: false,
      message: 'You cannot perform this action on yourself. Have another super admin to do it.',
    });
  }
  next();
};


// Routes
// GET /api/admin/management/admins - List all admins

router.get('/admins', verifyToken, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await adminManagementService.listAdmins();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});


// POST /api/admin/management/admins - Grant admin access
 
router.post(
  '/admins',
  verifyToken,
  requireSuperAdmin,
  validateBody(grantAdminSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { email, scope } = req.body;

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await adminManagementService.grantAdminByEmail(
        email,
        scope as AdminScope,
        req.user.userId
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }

      return res.status(201).json({
        success: true,
        data: result.data,
        message: `${email} promoted to ${scope}`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// PATCH /api/admin/management/admins/:userId - Update admin scope
 
router.patch(
  '/admins/:userId',
  verifyToken,
  requireSuperAdmin,
  validateParams(userIdParamSchema),
  blockSelfAction,
  validateBody(updateAdminScopeSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const { scope } = req.body;

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await adminManagementService.updateAdminScope(
        userId,
        scope as AdminScope,
        req.user.userId
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }

      return res.json({
        success: true,
        data: result.data,
        message: `Admin scope updated to ${scope}`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

//  DELETE /api/admin/management/admins/:userId - Revoke admin access

router.delete(
  '/admins/:userId',
  verifyToken,
  requireSuperAdmin,
  validateParams(userIdParamSchema),
  blockSelfAction,
  validateBody(revokeAdminSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const { revertTo } = req.body;

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await adminManagementService.revokeAdmin(
        userId,
        revertTo,
        req.user.userId
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }

      return res.json({
        success: true,
        message: 'Admin access revoked',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

export default router;
