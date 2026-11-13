import { Server as HttpServer } from 'http';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { prisma } from '../database';
import { isSuperAdminUser } from '../middleware/auth';
import { isAdminAccount, verifyAccessToken } from '../lib/tokens';
import { AdminSessionExitReason } from '@prisma/client';

interface AdminSocketData {
  adminId: string;
  adminName: string;
  sessionId: string;
  role: string;
  adminScope?: string;
}

type AdminSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, AdminSocketData>;

const sessionSockets = new Map<string, Set<string>>();
const disconnectTimers = new Map<string, NodeJS.Timeout>();
let socketServer: Server | undefined;

export const setupAdminPresenceSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map((origin) => origin.trim()),
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
  });
  socketServer = io;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== 'string') return next(new Error('Authentication required'));
      const claims = verifyAccessToken(token);
      if (!claims.sid) return next(new Error('Admin session required'));

      const [user, session] = await Promise.all([
        prisma.user.findUnique({
          where: { id: claims.userId },
          select: {
            id: true,
            name: true,
            role: true,
            roleId: true,
            adminScope: true,
            permissionsVersion: true,
            status: true,
            isActive: true,
          },
        }),
        prisma.adminSession.findUnique({
          where: { id: claims.sid },
          select: { id: true, adminId: true, logoutAt: true },
        }),
      ]);
      if (
        !user || !session || session.adminId !== user.id || session.logoutAt || !isAdminAccount(user) ||
        user.status !== 'active' || !user.isActive ||
        user.roleId !== claims.roleId || user.permissionsVersion !== claims.permissionsVersion
      ) {
        return next(new Error('Invalid or closed admin session'));
      }

      socket.data = {
        adminId: user.id,
        adminName: user.name,
        sessionId: session.id,
        role: user.role,
        adminScope: user.adminScope || undefined,
      };
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const adminSocket = socket as AdminSocket;
    const { adminId, sessionId, role, adminScope } = adminSocket.data;
    const reconnectTimer = disconnectTimers.get(sessionId);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      disconnectTimers.delete(sessionId);
    }

    const sockets = sessionSockets.get(sessionId) || new Set<string>();
    sockets.add(adminSocket.id);
    sessionSockets.set(sessionId, sockets);
    if (isSuperAdminUser({ role, adminScope })) {
      adminSocket.join('super-admins');
      void prisma.adminSession.findMany({
        where: { logoutAt: null, lastSeenAt: { gt: new Date(Date.now() - 2 * 60 * 1000) } },
        select: { id: true, adminId: true },
      }).then((active) => {
        adminSocket.emit('admin:online-sessions', active.map(({ id, adminId: activeAdminId }) => ({
          sessionId: id,
          adminId: activeAdminId,
          online: true,
        })));
      }).catch((error: unknown) => console.error('Failed to load online admin sessions', error));
    }
    io.to('super-admins').emit('admin:presence', { adminId, sessionId, online: true });

    adminSocket.on('disconnect', () => {
      const currentSockets = sessionSockets.get(sessionId);
      if (!currentSockets) return;
      currentSockets?.delete(adminSocket.id);
      if (currentSockets?.size) return;
      sessionSockets.delete(sessionId);

      const disconnectedAt = new Date();
      const timer = setTimeout(() => {
        disconnectTimers.delete(sessionId);
        void prisma.adminSession.updateMany({
          where: { id: sessionId, logoutAt: null, lastSeenAt: { lte: disconnectedAt } },
          data: { logoutAt: new Date(), exitReason: AdminSessionExitReason.TIMEOUT },
        }).then(({ count }) => {
          if (count) io.to('super-admins').emit('admin:presence', { adminId, sessionId, online: false });
        }).catch((error: unknown) => console.error('Failed to close disconnected admin session', error));
      }, 60 * 1000);
      timer.unref();
      disconnectTimers.set(sessionId, timer);
    });
  });

  return io;
};

export const closeAdminSession = async (
  sessionId: string,
  adminId: string,
  exitReason: AdminSessionExitReason
) => {
  const result = await prisma.adminSession.updateMany({
    where: { id: sessionId, adminId, logoutAt: null },
    data: { logoutAt: new Date(), exitReason },
  });
  const timer = disconnectTimers.get(sessionId);
  if (timer) clearTimeout(timer);
  disconnectTimers.delete(sessionId);
  const sockets = sessionSockets.get(sessionId);
  sessionSockets.delete(sessionId);
  sockets?.forEach((socketId) => socketServer?.sockets.sockets.get(socketId)?.disconnect(true));
  if (result.count) {
    notifyAdminPresence({ adminId, sessionId, online: false });
  }
  return result.count;
};

export const forceCloseAdminSessions = async (adminId: string): Promise<void> => {
  const sessions = await prisma.adminSession.findMany({
    where: { adminId, logoutAt: null },
    select: { id: true },
  });
  await Promise.all(sessions.map(({ id }) =>
    closeAdminSession(id, adminId, AdminSessionExitReason.FORCED)
  ));
  if (sessions.length) {
    await prisma.refreshToken.updateMany({
      where: { sessionId: { in: sessions.map(({ id }) => id) }, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
};

export const notifyAdminPresence = (presence: AdminPresence) => {
  socketServer?.to('super-admins').emit('admin:presence', presence);
};

interface AdminPresence {
  adminId: string;
  sessionId: string;
  online: boolean;
}
