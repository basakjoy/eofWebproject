import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdminSessionExitReason, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../database';
import { AuthRequest, verifyToken } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/superadmin.middleware';

const router = express.Router();
const asyncHandler = (
  handler: (req: AuthRequest, res: Response) => Promise<unknown>
): RequestHandler => (req, res, next) => {
  void handler(req as AuthRequest, res).catch(next);
};

const bearerBodySchema = z.object({
  token: z.string().min(20).max(8192),
  path: z.string().min(1).max(512),
  enteredAt: z.string().datetime(),
  exitedAt: z.string().datetime(),
  durationSec: z.number().int().min(0).max(86_400),
}).strict();

const authenticateBeacon = (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid page visit payload' });
    }
  }
  const token = req.body && typeof req.body === 'object' ? req.body.token : undefined;
  if (typeof token !== 'string') {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  req.headers.authorization = `Bearer ${token}`;
  next();
};

const allowCrossOriginBeaconResponse = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

const requireActiveAdminSession = (req: AuthRequest, res: Response): string | null => {
  if (!req.user || !req.sessionId) {
    res.status(401).json({ success: false, message: 'An active admin session is required' });
    return null;
  }
  return req.sessionId;
};

router.post('/admin/heartbeat', verifyToken, asyncHandler(async (req, res) => {
  const sessionId = requireActiveAdminSession(req, res);
  if (!sessionId) return;
  const result = await prisma.adminSession.updateMany({
    where: { id: sessionId, adminId: req.user!.userId, logoutAt: null },
    data: { lastSeenAt: new Date() },
  });
  if (!result.count) return res.status(401).json({ success: false, message: 'Admin session is closed' });
  return res.json({ success: true });
}));

router.post(
  '/admin/page-visit',
  allowCrossOriginBeaconResponse,
  express.text({ type: 'text/plain', limit: '8kb' }),
  authenticateBeacon,
  verifyToken,
  asyncHandler(async (req, res) => {
    const sessionId = requireActiveAdminSession(req, res);
    if (!sessionId) return;
    const parsed = bearerBodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid page visit payload' });

    const path = new URL(parsed.data.path, 'https://local.invalid').pathname;
    const result = await prisma.pageVisit.create({
      data: {
        sessionId,
        path: path.slice(0, 512),
        enteredAt: new Date(parsed.data.enteredAt),
        exitedAt: new Date(parsed.data.exitedAt),
        durationSec: parsed.data.durationSec,
      },
    });
    await prisma.adminSession.updateMany({
      where: { id: sessionId, logoutAt: null },
      data: { lastSeenAt: new Date() },
    });
    return res.status(201).json({ success: true, id: result.id });
  })
);

const querySchema = z.object({
  admin: z.string().min(1).max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  ip: z.string().trim().min(1).max(100).optional(),
  exitReason: z.nativeEnum(AdminSessionExitReason).optional(),
  status: z.enum(['online', 'offline']).optional(),
  page: z.coerce.number().int().min(1).max(100_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
}).strict();

router.get('/super-admin/access-logs', verifyToken, requireSuperAdmin, asyncHandler(async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success || (parsed.data.from && parsed.data.to && parsed.data.from > parsed.data.to)) {
    return res.status(400).json({ success: false, message: 'Invalid access-log filters' });
  }

  const now = new Date();
  const onlineThreshold = new Date(now.getTime() - 2 * 60 * 1000);
  const where: Prisma.AdminSessionWhereInput = {
    ...(parsed.data.admin ? { adminId: parsed.data.admin } : {}),
    ...(parsed.data.ip ? { ipAddress: { contains: parsed.data.ip, mode: 'insensitive' } } : {}),
    ...(parsed.data.exitReason ? { exitReason: parsed.data.exitReason } : {}),
    ...(parsed.data.from || parsed.data.to ? {
      loginAt: {
        ...(parsed.data.from ? { gte: parsed.data.from } : {}),
        ...(parsed.data.to ? { lte: parsed.data.to } : {}),
      },
    } : {}),
    ...(parsed.data.status === 'online'
      ? { logoutAt: null, lastSeenAt: { gt: onlineThreshold } }
      : parsed.data.status === 'offline'
        ? { OR: [{ logoutAt: { not: null } }, { lastSeenAt: { lte: onlineThreshold } }] }
        : {}),
  };

  const [sessions, total] = await Promise.all([
    prisma.adminSession.findMany({
      where,
      orderBy: { loginAt: 'desc' },
      skip: (parsed.data.page - 1) * parsed.data.limit,
      take: parsed.data.limit,
    }),
    prisma.adminSession.count({ where }),
  ]);
  const admins = await prisma.user.findMany({
    where: { id: { in: [...new Set(sessions.map(({ adminId }) => adminId))] } },
    select: { id: true, name: true, username: true, email: true },
  });
  const adminById = new Map(admins.map((admin) => [admin.id, admin]));

  return res.json({
    success: true,
    data: sessions.map((session) => ({
      ...session,
      admin: adminById.get(session.adminId) || null,
      online: !session.logoutAt && session.lastSeenAt > onlineThreshold,
    })),
    total,
    page: parsed.data.page,
    limit: parsed.data.limit,
  });
}));

router.get('/super-admin/access-logs/:sessionId', verifyToken, requireSuperAdmin, asyncHandler(async (req, res) => {
  if (req.params.sessionId.length > 100) {
    return res.status(400).json({ success: false, message: 'Invalid session id' });
  }
  const session = await prisma.adminSession.findUnique({
    where: { id: req.params.sessionId },
    include: {
      pageVisits: { orderBy: { enteredAt: 'asc' } },
      activities: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!session) return res.status(404).json({ success: false, message: 'Admin session not found' });
  const admin = await prisma.user.findUnique({
    where: { id: session.adminId },
    select: { id: true, name: true, username: true, email: true },
  });
  return res.json({
    success: true,
    data: {
      ...session,
      admin,
      online: !session.logoutAt && session.lastSeenAt > new Date(Date.now() - 2 * 60 * 1000),
    },
  });
}));

export default router;
