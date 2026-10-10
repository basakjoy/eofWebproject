import express, { Request, Response, NextFunction, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createSharedRateLimitStore } from '../middleware/rateLimiter';
import { verifyToken, AuthRequest, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/admin.middleware';
import * as adminController from '../controllers/admin.controller';
import { z } from 'zod';

const router = express.Router();

const adminUserCreateSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    password: z.string().min(6).max(72),
    role: z.enum(['user', 'trader', 'admin', 'super_admin', 'marketing_admin', 'signal_admin', 'content_admin', 'analyst']).optional(),
    permissions: z.array(z.string().max(100)).max(50).optional(),
}).strict();

const adminUserUpdateSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    role: z.enum(['user', 'trader', 'admin', 'super_admin', 'marketing_admin', 'signal_admin', 'content_admin', 'analyst']).optional(),
    status: z.enum(['active', 'inactive', 'banned']).optional(),
    permissions: z.array(z.string().max(100)).max(50).optional(),
}).strict();

const adminLogSchema = z.object({
    adminId: z.string().max(100).optional(),
    action: z.string().trim().min(1).max(100),
    targetId: z.string().max(100).optional(),
    targetType: z.string().max(100).optional(),
    changes: z.record(z.unknown()).optional(),
    reason: z.string().max(500).optional(),
    ipAddress: z.string().max(100).optional(),
}).strict();


// Rate limiting
const adminUsersLimiter = rateLimit({
    store: createSharedRateLimitStore('rl:admin-users:'),
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many admin users requests. Please try again later.',
    },
});

router.use(adminUsersLimiter);

// Blocks an admin from deleting or modifing their own admin user record
// through this endpoint.Prevents accidental self-lockout

const blockSelfAction = (req: AuthRequest, res: Response, next: NextFunction) => {
    const targetUserId = req.params.id;
    if (req.user?.userId && targetUserId && req.user.userId === targetUserId) {
        return res.status(400).json({
            success: false,
            message: 'You cannot perform this action on yourself. Have another admin to do it.',
        });
    }
    next();
};




/**
 * Admin Users Management
 */
router.get('/users', verifyToken, requireRole(['admin','superadmin']), adminController.getAllAdminUsers);
router.get('/users/:id', verifyToken, requireRole(['admin','superadmin']), adminController.getAdminUser);
router.post('/users', verifyToken, requireRole(['admin','superadmin']), validateBody(adminUserCreateSchema), adminController.createAdminUser);
router.put('/users/:id', verifyToken, requireRole(['admin','superadmin']), validateBody(adminUserUpdateSchema), blockSelfAction, adminController.updateAdminUser);
router.delete('/users/:id', verifyToken, requireRole(['admin','superadmin']),blockSelfAction ,adminController.deleteAdminUser);

/**
 * Admin Action Logging
 */
router.post('/logs', verifyToken, requireRole(['admin','superadmin']), validateBody(adminLogSchema), adminController.logAdminAction);
router.get('/logs', verifyToken, requireRole(['admin','superadmin']), adminController.getAdminLogs);

/**
 * Dashboard
 */
router.get('/dashboard/stats', verifyToken, requireRole(['admin','superadmin']), adminController.getDashboardStats);
    
export default router;
