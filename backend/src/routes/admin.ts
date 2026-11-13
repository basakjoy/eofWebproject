import express, { Request, Response, NextFunction, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createSharedRateLimitStore } from '../middleware/rateLimiter';
import { verifyToken, AuthRequest, requireAdminCapability } from '../middleware/auth';
import { validateBody } from '../middleware/admin.middleware';
import * as adminController from '../controllers/admin.controller';
import { z } from 'zod';
import { Permission } from '../types/roles';
import { forceCloseSessionsOnSuccess, logActivity } from '../middleware/adminActivityLogger';

const router = express.Router();

const adminUserCreateSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    password: z.string().min(6).max(72),
    role: z.enum(['user', 'trader', 'admin', 'super_admin', 'marketing_admin', 'signal_admin', 'content_admin', 'analyst']).optional(),
    passwordConfirm: z.string().min(1).max(72).optional(),
    permissions: z.array(z.string().max(100)).max(50).optional(),
}).strict();

const adminUserUpdateSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    role: z.enum(['user', 'trader', 'admin', 'super_admin', 'marketing_admin', 'signal_admin', 'content_admin', 'analyst']).optional(),
    status: z.enum(['active', 'inactive', 'banned']).optional(),
    passwordConfirm: z.string().min(1).max(72).optional(),
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
const adminUsersMutationLimiter = rateLimit({
    store: createSharedRateLimitStore('rl:admin-users-mutations:'),
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many admin users requests. Please try again later.',
    },
});

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
router.get('/users', verifyToken, requireAdminCapability([Permission.VIEW_USERS, Permission.MANAGE_USERS]), adminController.getAllAdminUsers);
router.get('/users/:id', verifyToken, requireAdminCapability([Permission.VIEW_USERS, Permission.MANAGE_USERS]), adminController.getAdminUser);
router.post('/users', verifyToken, requireAdminCapability(Permission.MANAGE_USERS), adminUsersMutationLimiter, logActivity('USER_CREATE'), validateBody(adminUserCreateSchema), adminController.createAdminUser);
router.put('/users/:id', verifyToken, requireAdminCapability(Permission.MANAGE_USERS), adminUsersMutationLimiter, logActivity('USER_UPDATE_OR_ROLE_CHANGE', (req) => req.params.id), validateBody(adminUserUpdateSchema), blockSelfAction, forceCloseSessionsOnSuccess((req) => req.params.id, (req) => ['inactive', 'banned'].includes(req.body?.status)), adminController.updateAdminUser);
router.delete('/users/:id', verifyToken, requireAdminCapability(Permission.MANAGE_USERS), adminUsersMutationLimiter, logActivity('USER_DELETE', (req) => req.params.id), blockSelfAction, forceCloseSessionsOnSuccess((req) => req.params.id), adminController.deleteAdminUser);

/**
 * Admin Action Logging
 */
router.post('/logs', verifyToken, requireAdminCapability(Permission.VIEW_ACTIVITY_LOGS), validateBody(adminLogSchema), adminController.logAdminAction);
router.get('/logs', verifyToken, requireAdminCapability(Permission.VIEW_ACTIVITY_LOGS), adminController.getAdminLogs);

/**
 * Dashboard
 */
router.get('/dashboard/stats', verifyToken, requireAdminCapability(Permission.VIEW_ADMIN_DASHBOARD), adminController.getDashboardStats);
    
export default router;
