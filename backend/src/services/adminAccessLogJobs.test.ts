import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AdminSessionExitReason } from '@prisma/client';

jest.mock('../database', () => ({
  prisma: {
    adminSession: {
      findMany: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    pageVisit: { deleteMany: jest.fn() },
    adminActivity: { deleteMany: jest.fn() },
    refreshToken: { updateMany: jest.fn() },
  },
}));

import { prisma } from '../database';
import { closeAdminSession } from '../websocket/adminPresence';
import { closeTimedOutAdminSessions, purgeExpiredAdminAccessLogs } from './adminAccessLogJobs';

const mockFindMany = prisma.adminSession.findMany as jest.Mock;
const mockUpdateMany = prisma.adminSession.updateMany as jest.Mock;

describe('admin access session lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('records an explicit logout and does not close an already closed session', async () => {
    mockUpdateMany.mockResolvedValueOnce({ count: 1 } as never).mockResolvedValueOnce({ count: 0 } as never);

    await expect(closeAdminSession('session-1', 'admin-1', AdminSessionExitReason.LOGOUT)).resolves.toBe(1);
    await expect(closeAdminSession('session-1', 'admin-1', AdminSessionExitReason.LOGOUT)).resolves.toBe(0);

    expect(mockUpdateMany).toHaveBeenNthCalledWith(1, {
      where: { id: 'session-1', adminId: 'admin-1', logoutAt: null },
      data: { logoutAt: expect.any(Date), exitReason: AdminSessionExitReason.LOGOUT },
    });
  });

  it('closes sessions stale for more than two minutes at their last heartbeat', async () => {
    const now = new Date('2026-11-06T10:00:00.000Z');
    const lastSeenAt = new Date('2026-11-06T09:57:00.000Z');
    mockFindMany.mockResolvedValue([{ id: 'session-1', adminId: 'admin-1', lastSeenAt }] as never);
    mockUpdateMany.mockResolvedValue({ count: 1 } as never);

    await expect(closeTimedOutAdminSessions(now)).resolves.toBe(1);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { logoutAt: null, lastSeenAt: { lte: new Date('2026-11-06T09:58:00.000Z') } },
      select: { id: true, adminId: true, lastSeenAt: true },
    });
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: 'session-1', logoutAt: null, lastSeenAt },
      data: { logoutAt: lastSeenAt, exitReason: AdminSessionExitReason.TIMEOUT },
    });
  });

  it('purges page visits after 90 days and session records after one year', async () => {
    const now = new Date('2026-11-06T10:00:00.000Z');
    (prisma.pageVisit.deleteMany as jest.Mock).mockResolvedValue({ count: 2 } as never);
    (prisma.adminActivity.deleteMany as jest.Mock).mockResolvedValue({ count: 3 } as never);
    (prisma.adminSession.deleteMany as jest.Mock).mockResolvedValue({ count: 1 } as never);

    await expect(purgeExpiredAdminAccessLogs(now)).resolves.toEqual({
      pageVisits: 2,
      activities: 3,
      sessions: 1,
    });
    expect(prisma.pageVisit.deleteMany).toHaveBeenCalledWith({
      where: { enteredAt: { lt: new Date('2026-08-08T10:00:00.000Z') } },
    });
    expect(prisma.adminActivity.deleteMany).toHaveBeenCalledWith({
      where: { createdAt: { lt: new Date('2025-11-06T10:00:00.000Z') } },
    });
    expect(prisma.adminSession.deleteMany).toHaveBeenCalledWith({
      where: { loginAt: { lt: new Date('2025-11-06T10:00:00.000Z') } },
    });
  });
});
