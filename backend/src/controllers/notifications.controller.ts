import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { prisma } from '../database';
import { AuthRequest } from '../middleware/auth';

const preferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
  notificationTypes: z.array(z.string().max(100)).max(100).optional(),
  quietHours: z.record(z.string().max(50)).optional(),
}).strict();

const fail = (res: Response, message: string) =>
  res.status(500).json({ success: false, message });

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const offset = Math.min(Math.max(Number(req.query.offset) || 0, 0), 10_000);
    if (req.query.read !== undefined && !['true', 'false'].includes(String(req.query.read))) {
      return res.status(400).json({ success: false, message: 'Invalid read filter' });
    }
    const where = {
      userId: req.user!.userId,
      ...(req.query.read !== undefined ? { read: String(req.query.read) === 'true' } : {}),
    };
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
    ]);
    return res.json({ success: true, data: notifications, total, limit, offset });
  } catch {
    return fail(res, 'Failed to fetch notifications');
  }
};

export const getNotificationById = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, data: notification });
  } catch {
    return fail(res, 'Failed to fetch notification');
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { read: true, readAt: new Date() },
    });
    if (result.count === 0) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch {
    return fail(res, 'Failed to mark notification as read');
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, read: false },
      data: { read: true, readAt: new Date() },
    });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch {
    return fail(res, 'Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.notification.deleteMany({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (result.count === 0) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, message: 'Notification deleted successfully' });
  } catch {
    return fail(res, 'Failed to delete notification');
  }
};

export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const preferences = await prisma.notificationPreference.findUnique({ where: { userId: req.user!.userId } });
    return res.json({ success: true, data: preferences || { message: 'No preferences set' } });
  } catch {
    return fail(res, 'Failed to fetch preferences');
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  const parsed = preferencesSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid notification preferences' });
  try {
    const values = parsed.data;
    await prisma.notificationPreference.upsert({
      where: { userId: req.user!.userId },
      create: {
        id: randomUUID(),
        userId: req.user!.userId,
        emailNotifications: values.emailNotifications ?? true,
        pushNotifications: values.pushNotifications ?? true,
        smsNotifications: values.smsNotifications ?? false,
        inAppNotifications: values.inAppNotifications ?? true,
        notificationTypes: values.notificationTypes ? JSON.stringify(values.notificationTypes) : null,
        quietHours: values.quietHours ? JSON.stringify(values.quietHours) : null,
      },
      update: {
        ...(values.emailNotifications !== undefined ? { emailNotifications: values.emailNotifications } : {}),
        ...(values.pushNotifications !== undefined ? { pushNotifications: values.pushNotifications } : {}),
        ...(values.smsNotifications !== undefined ? { smsNotifications: values.smsNotifications } : {}),
        ...(values.inAppNotifications !== undefined ? { inAppNotifications: values.inAppNotifications } : {}),
        ...(values.notificationTypes !== undefined ? { notificationTypes: JSON.stringify(values.notificationTypes) } : {}),
        ...(values.quietHours !== undefined ? { quietHours: JSON.stringify(values.quietHours) } : {}),
      },
    });
    return res.json({ success: true, message: 'Notification preferences updated successfully' });
  } catch {
    return fail(res, 'Failed to update preferences');
  }
};

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, data, actionUrl } = req.body;
    const notification = await prisma.notification.create({
      data: {
        id: randomUUID(),
        userId,
        type,
        title,
        message,
        data: data === undefined ? null : JSON.stringify(data),
        actionUrl: actionUrl || null,
      },
    });
    return res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: { id: notification.id, status: 'sent' },
    });
  } catch {
    return fail(res, 'Failed to send notification');
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const unreadCount = await prisma.notification.count({ where: { userId: req.user!.userId, read: false } });
    return res.json({ success: true, data: { unreadCount } });
  } catch {
    return fail(res, 'Failed to fetch unread count');
  }
};