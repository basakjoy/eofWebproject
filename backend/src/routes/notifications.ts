import express, { Request, Response} from 'express';
import { verifyToken} from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { validateNotification } from '../middleware/notifications.middleware';
import * as notificationController from '../controllers/notifications.controller';
import rateLimit from 'express-rate-limit';
const router = express.Router();

const sendNotificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many notification requests, try again later'}
});


// user notifications
router.get('/', verifyToken, notificationController.getNotifications);
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);
router.get('/:id', verifyToken, notificationController.getNotificationById);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.put('/mark-all-read', verifyToken, notificationController.markAllAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

// Preferences
router.get('/preferences', verifyToken, notificationController.getPreferences);
router.put('/preferences', verifyToken, notificationController.updatePreferences);


// Admin Notification API (Broadcast / User targeted)
router.post('/send', verifyToken, requireRole(['SUPER_ADMIN', 'SIGNAL_ADMIN', 'CONTENT_ADMIN']), sendNotificationLimiter, validateNotification, notificationController.sendNotification);

export default router;
