import express, { Request, Response, NextFunction, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken, AuthRequest, requireRole } from '../middleware/auth';
import { requireAdmin, validateAdminRequest } from '../middleware/admin.middleware';
import * as adminController from '../controllers/admin.controller';

const router = express.Router();


// Rate limiting
const adminUsersLimiter = rateLimit({
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
router.post('/users', verifyToken, requireRole(['admin','superadmin']), validateAdminRequest(['name', 'email', 'password']), adminController.createAdminUser);
router.put('/users/:id', verifyToken, requireRole(['admin','superadmin']),blockSelfAction, adminController.updateAdminUser);
router.delete('/users/:id', verifyToken, requireRole(['admin','superadmin']),blockSelfAction ,adminController.deleteAdminUser);

/**
 * Admin Action Logging
 */
router.post('/logs', verifyToken, requireRole(['admin','superadmin']), adminController.logAdminAction);
router.get('/logs', verifyToken, requireRole(['admin','superadmin']), adminController.getAdminLogs);

/**
 * Dashboard
 */
router.get('/dashboard/stats', verifyToken, requireRole(['admin','superadmin']), adminController.getDashboardStats);
    
export default router;
