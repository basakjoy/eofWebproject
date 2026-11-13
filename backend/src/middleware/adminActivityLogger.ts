import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database';
import { AuthRequest, getIp } from './auth';
import { forceCloseAdminSessions } from '../websocket/adminPresence';

type ActivityRequest = AuthRequest & {
  rbacUser?: { id: string };
};

export const logActivity = (
  action: string,
  resolveTarget?: (req: Request) => string | null
) => (req: Request, res: Response, next: NextFunction) => {
  res.once('finish', () => {
    const activityRequest = req as ActivityRequest;
    const adminId = activityRequest.user?.userId || activityRequest.rbacUser?.id;
    if (res.statusCode >= 400 || !adminId || !activityRequest.sessionId) return;

    void prisma.adminActivity.create({
      data: {
        adminId,
        sessionId: activityRequest.sessionId,
        action,
        target: resolveTarget?.(req) || null,
        ipAddress: getIp(req),
      },
    }).catch((error: unknown) => {
      console.error('Failed to record admin access activity', error);
    });
  });
  next();
};

export const forceCloseSessionsOnSuccess = (
  resolveAdminId: (req: Request) => string | null,
  shouldClose: (req: Request) => boolean = () => true
) => (req: Request, res: Response, next: NextFunction) => {
  res.once('finish', () => {
    const adminId = resolveAdminId(req);
    if (res.statusCode >= 400 || !adminId || !shouldClose(req)) return;
    void forceCloseAdminSessions(adminId).catch((error: unknown) => {
      console.error('Failed to close a removed or deactivated admin session', error);
    });
  });
  next();
};
