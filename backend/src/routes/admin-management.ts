import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { createSharedRateLimitStore } from '../middleware/rateLimiter';
import { AuthRequest, verifyToken } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/superadmin.middleware';
import * as adminManagementService from '../services/adminManagementService';
import { Permission } from '../types/roles';
import { verifyPasswordConfirmation } from '../modules/auth/reauth.service';
import { logActivity } from '../middleware/adminActivityLogger';
import { forceCloseAdminSessions } from '../websocket/adminPresence';

const router = express.Router();

const adminManagementWriteLimiter = rateLimit({
  store: createSharedRateLimitStore('rl:admin-management-write:'),
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many admin changes. Please try again later.' },
});

const createAdminSchema = z.object({
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9._-]+$/),
  password: z.string().min(12).max(72),
  passwordConfirm: z.string().min(1).max(72),
  role: z.enum(['admin', 'super_admin']).default('super_admin'),
  permissions: z.array(z.nativeEnum(Permission)).max(30).default([]),
}).strict();

const updateAdminPermissionsSchema = z.object({
  permissions: z.array(z.nativeEnum(Permission)).max(30),
}).strict();

const updateAdminStatusSchema = z.object({
  status: z.enum(['active', 'banned']),
  passwordConfirm: z.string().min(1).max(72),
}).strict();

router.get('/admins', verifyToken, requireSuperAdmin, async (_req: AuthRequest, res: Response) => {
  const result = await adminManagementService.listAdmins();
  if (!result.success) {
    return res.status(500).json({ success: false, message: result.error });
  }
  return res.json({ success: true, data: result.data });
});

router.post('/users', verifyToken, requireSuperAdmin, adminManagementWriteLimiter, logActivity('ADMIN_CREATE'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Enter a valid username, account role, permissions, and a password of at least 12 characters.',
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    });
  }
  if (!req.user?.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  let confirmed: boolean;
  try {
    confirmed = await verifyPasswordConfirmation({
      actorId: req.user.userId,
      passwordConfirm: parsed.data.passwordConfirm,
      action: 'create-admin',
      targetType: 'User',
      ip: req.ip,
    });
  } catch (error) {
    next(error);
    return;
  }
  if (!confirmed) {
    return res.status(403).json({ success: false, message: 'Password confirmation failed' });
  }

  const result = await adminManagementService.createAdminUser(
    parsed.data.username,
    parsed.data.password,
    parsed.data.role,
    parsed.data.permissions,
    req.user.userId
  );
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error });
  }
  return res.status(201).json({ success: true, data: result.data });
});

router.patch('/admins/:userId/permissions', verifyToken, requireSuperAdmin, adminManagementWriteLimiter, logActivity('ADMIN_PERMISSIONS_CHANGE', (req) => req.params.userId), async (req: AuthRequest, res: Response) => {
  const parsed = updateAdminPermissionsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Select valid admin permissions' });
  }
  if (!req.user?.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const result = await adminManagementService.updateAdminPermissions(
    req.params.userId,
    parsed.data.permissions,
    req.user.userId
  );
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error });
  }
  return res.json({ success: true, message: 'Admin permissions updated' });
});

router.patch('/admins/:userId/status', verifyToken, requireSuperAdmin, adminManagementWriteLimiter, logActivity('ADMIN_STATUS_CHANGE', (req) => req.params.userId), async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const parsed = updateAdminStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid admin status' });
  }
  if (!req.user?.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  let confirmed: boolean;
  try {
    confirmed = await verifyPasswordConfirmation({
      actorId: req.user.userId,
      passwordConfirm: parsed.data.passwordConfirm,
      action: parsed.data.status === 'banned' ? 'deactivate-user' : 'reactivate-user',
      targetType: 'User',
      targetId: req.params.userId,
      ip: req.ip,
    });
  } catch (error) {
    next(error);
    return;
  }
  if (!confirmed) {
    return res.status(403).json({ success: false, message: 'Password confirmation failed' });
  }

  const result = await adminManagementService.updateAdminStatus(
    req.params.userId,
    parsed.data.status,
    req.user.userId
  );
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error });
  }
  if (parsed.data.status === 'banned') {
    try {
      await forceCloseAdminSessions(req.params.userId);
    } catch (error) {
      next(error);
      return;
    }
  }
  return res.json({ success: true, message: 'Admin status updated' });
});

router.get('/activity', verifyToken, requireSuperAdmin, async (req: Request, res: Response) => {
  const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).max(1_000_000).default(0),
    adminId: z.string().min(1).optional(),
    search: z.string().trim().min(1).max(150).optional(),
  }).strict();
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid activity filters' });
  }

  try {
    const result = await adminManagementService.listAdminActivity(
      parsed.data.adminId,
      parsed.data.search,
      parsed.data.limit,
      parsed.data.offset
    );
    return res.json({ success: true, ...result, limit: parsed.data.limit, offset: parsed.data.offset });
  } catch (error) {
    console.error('Failed to fetch super-admin admin activity', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin activity' });
  }
});

export default router;
