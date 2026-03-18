import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { validateNotification, validatePreferences } from '../middleware/notifications.middleware';
import * as notificationsController from '../controllers/notifications.controller';

const router = express.Router();

/**
 * User Notifications
 */
router.get('/', verifyToken, notificationsController.getNotifications);
router.get('/unread-count', verifyToken, notificationsController.getUnreadCount);
router.get('/:id', verifyToken, notificationsController.getNotificationById);
router.put('/:id/read', verifyToken, notificationsController.markAsRead);
router.put('/mark-all-read', verifyToken, notificationsController.markAllAsRead);
router.delete('/:id', verifyToken, notificationsController.deleteNotification);

/**
 * Preferences
 */
router.get('/preferences/get', verifyToken, notificationsController.getPreferences);
router.put('/preferences/update', verifyToken, validatePreferences, notificationsController.updatePreferences);

/**
 * Send Notification (Admin/System only)
 */
router.post('/send', validateNotification, notificationsController.sendNotification);

export default router;
