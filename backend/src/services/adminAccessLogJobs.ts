import { AdminSessionExitReason } from '@prisma/client';
import { prisma } from '../database';
import { notifyAdminPresence } from '../websocket/adminPresence';

const SESSION_TIMEOUT_MS = 2 * 60 * 1000;
const PAGE_VISIT_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const LOG_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

export const closeTimedOutAdminSessions = async (now = new Date()): Promise<number> => {
  const cutoff = new Date(now.getTime() - SESSION_TIMEOUT_MS);
  const staleSessions = await prisma.adminSession.findMany({
    where: { logoutAt: null, lastSeenAt: { lte: cutoff } },
    select: { id: true, adminId: true, lastSeenAt: true },
  });
  let closed = 0;
  for (const session of staleSessions) {
    const result = await prisma.adminSession.updateMany({
      where: { id: session.id, logoutAt: null, lastSeenAt: session.lastSeenAt },
      data: {
        logoutAt: session.lastSeenAt,
        exitReason: AdminSessionExitReason.TIMEOUT,
      },
    });
    closed += result.count;
    if (result.count) notifyAdminPresence({
      adminId: session.adminId,
      sessionId: session.id,
      online: false,
    });
  }
  return closed;
};

export const purgeExpiredAdminAccessLogs = async (now = new Date()) => {
  const pageVisitCutoff = new Date(now.getTime() - PAGE_VISIT_RETENTION_MS);
  const logCutoff = new Date(now.getTime() - LOG_RETENTION_MS);
  const pageVisits = await prisma.pageVisit.deleteMany({
    where: { enteredAt: { lt: pageVisitCutoff } },
  });
  const activities = await prisma.adminActivity.deleteMany({
    where: { createdAt: { lt: logCutoff } },
  });
  const sessions = await prisma.adminSession.deleteMany({
    where: { loginAt: { lt: logCutoff } },
  });
  return { pageVisits: pageVisits.count, activities: activities.count, sessions: sessions.count };
};

export const startAdminAccessLogJobs = () => {
  const sessionTimer = setInterval(() => {
    void closeTimedOutAdminSessions().catch((error: unknown) => {
      console.error('Admin session timeout job failed', error);
    });
  }, 5 * 60 * 1000);
  const retentionTimer = setInterval(() => {
    void purgeExpiredAdminAccessLogs().catch((error: unknown) => {
      console.error('Admin access-log retention job failed', error);
    });
  }, 24 * 60 * 60 * 1000);
  sessionTimer.unref();
  retentionTimer.unref();
  return () => {
    clearInterval(sessionTimer);
    clearInterval(retentionTimer);
  };
};
