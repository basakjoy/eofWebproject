import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { requireAdmin, validateAdminRequest } from '../middleware/admin.middleware';
import * as adminController from '../controllers/admin.controller';

const router = express.Router();

/**
 * Admin Users Management
 */
router.get('/users', verifyToken, requireAdmin, adminController.getAllAdminUsers);
router.get('/users/:id', verifyToken, requireAdmin, adminController.getAdminUser);
router.post('/users', verifyToken, requireAdmin, validateAdminRequest(['userId']), adminController.createAdminUser);
router.put('/users/:id', verifyToken, requireAdmin, adminController.updateAdminUser);
router.delete('/users/:id', verifyToken, requireAdmin, adminController.deleteAdminUser);

/**
 * Admin Action Logging
 */
router.post('/logs', verifyToken, requireAdmin, adminController.logAdminAction);
router.get('/logs', verifyToken, requireAdmin, adminController.getAdminLogs);

/**
 * Dashboard
 */
router.get('/dashboard/stats', verifyToken, requireAdmin, adminController.getDashboardStats);

export default router;
