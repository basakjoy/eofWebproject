import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { prisma } from '../database';

const JWT_ISSUER = process.env.JWT_ISSUER || 'empire-of-forex-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'empire-of-forex';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DEV_FALLBACK_JWT_SECRET = 'development-jwt-secret-32chars!';

export interface AccessTokenUser {
  id: string;
  tokenVersion: number;
  role?: string;
  adminScope?: string | null;
  roleId?: string | null;
  permissionsVersion?: number;
  sessionId?: string;
}

export interface AccessTokenClaims extends JwtPayload {
  userId: string;
  roleId: string;
  permissionsVersion: number;
  sid?: string;
}

export const resolveJwtSecret = (): string => {
  const configuredSecret = process.env.JWT_SECRET?.trim();

  if (configuredSecret && configuredSecret.length >= 32) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to at least 32 characters');
  }

  return DEV_FALLBACK_JWT_SECRET;
};

const jwtSecret = (): string => resolveJwtSecret();

export const createAccessToken = (
  user: AccessTokenUser & { roleId: string; permissionsVersion: number }
): string => jwt.sign(
  {
    userId: user.id,
    roleId: user.roleId,
    permissionsVersion: user.permissionsVersion,
    ...(user.sessionId ? { sid: user.sessionId } : {}),
  },
  jwtSecret(),
  {
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  }
);

export const verifyAccessToken = (token: string): AccessTokenClaims => {
  const decoded = jwt.verify(token, jwtSecret(), {
    algorithms: ['HS256'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
  if (
    typeof decoded === 'string' ||
    typeof decoded.userId !== 'string' ||
    typeof decoded.roleId !== 'string' ||
    (decoded.sid !== undefined && typeof decoded.sid !== 'string') ||
    !Number.isInteger(decoded.permissionsVersion)
  ) {
    throw new jwt.JsonWebTokenError('Invalid token claims');
  }
  return decoded as AccessTokenClaims;
};

export const hashRefreshToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const createRefreshTokenValue = (
  userId: string,
  tokenVersion: number,
  sessionId?: string
): string => jwt.sign(
  {
    userId,
    tokenVersion,
    ...(sessionId ? { sid: sessionId } : {}),
    jti: randomUUID(),
    tokenType: 'refresh',
  },
  jwtSecret(),
  {
    algorithm: 'HS256',
    expiresIn: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  }
);

export const createRefreshToken = async (
  userId: string,
  tokenVersion: number,
  familyId = randomUUID(),
  sessionId?: string
): Promise<{ token: string; familyId: string }> => {
  const token = createRefreshTokenValue(userId, tokenVersion, sessionId);
  await prisma.refreshToken.create({
    data: {
      id: randomUUID(),
      userId,
      sessionId,
      tokenHash: hashRefreshToken(token),
      familyId,
      tokenVersion,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return { token, familyId };
};

export const isAdminAccount = (user: Pick<AccessTokenUser, 'role' | 'adminScope'>): boolean =>
  Boolean(user.adminScope) || ['admin', 'super_admin', 'superadmin', 'marketing_admin', 'signal_admin', 'content_admin']
    .includes((user.role || '').toLowerCase());

export const createSessionTokens = async (
  user: AccessTokenUser,
  request?: { ipAddress: string | null; userAgent: string | null }
) => {
  let roleId = user.roleId;
  let permissionsVersion = user.permissionsVersion ?? 0;
  if (!roleId) {
    const requestedRoleName = user.adminScope === 'SUPER_ADMIN' || user.role === 'superadmin'
      ? 'super_admin'
      : user.role === 'user' || user.role === 'investor'
        ? 'staff'
        : user.role || 'staff';
    let role = await prisma.role.findUnique({ where: { name: requestedRoleName }, select: { id: true } });
    if (!role) {
      role = await prisma.role.findUnique({ where: { name: 'staff' }, select: { id: true } });
    }
    if (!role) throw new Error('RBAC roles must be seeded before issuing sessions');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { roleId: role.id, permissionsVersion: { increment: 1 } },
      select: { permissionsVersion: true },
    });
    roleId = role.id;
    permissionsVersion = updatedUser.permissionsVersion;
  }
  let sessionId: string | undefined;
  if (request && isAdminAccount(user)) {
    sessionId = randomUUID();
    const now = new Date();
    const previousSessions = await prisma.adminSession.findMany({
      where: { adminId: user.id },
      orderBy: { loginAt: 'desc' },
      take: 20,
      select: { ipAddress: true, userAgent: true, logoutAt: true },
    });
    await prisma.adminSession.create({
      data: {
        id: sessionId,
        adminId: user.id,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        loginAt: now,
        lastSeenAt: now,
      },
    });

    const newIpOrDevice = previousSessions.length > 0 && !previousSessions.some(
      (session) => session.ipAddress === request.ipAddress && session.userAgent === request.userAgent
    );
    const simultaneousDifferentIp = previousSessions.some(
      (session) => !session.logoutAt && session.ipAddress !== request.ipAddress
    );
    if (newIpOrDevice || simultaneousDifferentIp) {
      const superAdmins = await prisma.user.findMany({
        where: {
          status: 'active',
          isActive: true,
          OR: [{ role: { in: ['super_admin', 'superadmin'] } }, { adminScope: 'SUPER_ADMIN' }],
        },
        select: { id: true },
      });
      if (superAdmins.length) {
        try {
          await prisma.notification.createMany({
            data: superAdmins.map(({ id }) => ({
              userId: id,
              type: 'security',
              title: 'Unusual admin login detected',
              message: 'An administrator signed in from a new IP address or device, or from a different IP while another session was active.',
              data: JSON.stringify({ adminId: user.id, sessionId }),
              actionUrl: '/super-admin/access-logs',
            })),
          });
        } catch (error) {
          console.error('Failed to notify Super Admins about an unusual admin login', error);
        }
      }
    }
  }
  const refresh = await createRefreshToken(user.id, user.tokenVersion, randomUUID(), sessionId);
  return {
    token: createAccessToken({
      ...user,
      roleId,
      permissionsVersion,
      sessionId,
    }),
    refreshToken: refresh.token,
    ...(sessionId ? { sid: sessionId } : {}),
  };
};
