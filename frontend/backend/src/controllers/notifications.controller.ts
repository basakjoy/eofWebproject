import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest extends Request {
  user?: any;
}

// Get user notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { read, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM notifications WHERE userId = ?';
    const params: any[] = [userId];

    if (read !== undefined) {
      query += ' AND read = ?';
      params.push(read === 'true' ? 1 : 0);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const notifications = await allAsync(query, params);
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications',
    });
  }
};

// Get notification by ID
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await getAsync('SELECT * FROM notifications WHERE id = ?', [id]);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notification',
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await getAsync('SELECT * FROM notifications WHERE id = ?', [id]);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await runAsync(
      'UPDATE notifications SET read = 1, readAt = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read',
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    await runAsync(
      'UPDATE notifications SET read = 1, readAt = CURRENT_TIMESTAMP WHERE userId = ? AND read = 0',
      [userId]
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
    });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await getAsync('SELECT * FROM notifications WHERE id = ?', [id]);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await runAsync('DELETE FROM notifications WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notification',
    });
  }
};

// Get notification preferences
export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const preferences = await getAsync(
      'SELECT * FROM notification_preferences WHERE userId = ?',
      [userId]
    );

    res.json({
      success: true,
      data: preferences || { message: 'No preferences set' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch preferences',
    });
  }
};

// Update notification preferences
export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { emailNotifications, pushNotifications, smsNotifications, inAppNotifications, notificationTypes, quietHours } = req.body;

    const prefId = uuidv4();
    const existingPref = await getAsync(
      'SELECT id FROM notification_preferences WHERE userId = ?',
      [userId]
    );

    if (existingPref) {
      await runAsync(
        `UPDATE notification_preferences SET 
         emailNotifications = ?, pushNotifications = ?, smsNotifications = ?, 
         inAppNotifications = ?, notificationTypes = ?, quietHours = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE userId = ?`,
        [emailNotifications ?? 1, pushNotifications ?? 1, smsNotifications ?? 0, inAppNotifications ?? 1,
         JSON.stringify(notificationTypes), JSON.stringify(quietHours), userId]
      );
    } else {
      await runAsync(
        `INSERT INTO notification_preferences 
         (id, userId, emailNotifications, pushNotifications, smsNotifications, inAppNotifications, notificationTypes, quietHours)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [prefId, userId, emailNotifications ?? 1, pushNotifications ?? 1, smsNotifications ?? 0, inAppNotifications ?? 1,
         JSON.stringify(notificationTypes), JSON.stringify(quietHours)]
      );
    }

    res.json({ success: true, message: 'Notification preferences updated successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update preferences',
    });
  }
};

// Send notification
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, data, actionUrl } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'userId, type, title, and message are required',
      });
    }

    const notificationId = uuidv4();
    await runAsync(
      `INSERT INTO notifications (id, userId, type, title, message, data, actionUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [notificationId, userId, type, title, message, JSON.stringify(data || {}), actionUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: { id: notificationId, status: 'sent' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send notification',
    });
  }
};

// Get unread count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await getAsync(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND read = 0',
      [userId]
    );

    res.json({
      success: true,
      data: { unreadCount: result?.count || 0 },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch unread count',
    });
  }
};
