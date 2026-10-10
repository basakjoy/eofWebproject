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
  email: string;
  role: string;
  tokenVersion: number;
}

export interface AccessTokenClaims extends JwtPayload {
  userId: string;
  authVersion: number;
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

export const createAccessToken = (user: AccessTokenUser): string => jwt.sign(
  { userId: user.id, email: user.email, role: user.role, authVersion: user.tokenVersion },
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
  if (typeof decoded === 'string' || typeof decoded.userId !== 'string' || !Number.isInteger(decoded.authVersion)) {
    throw new jwt.JsonWebTokenError('Invalid token claims');
  }
  return decoded as AccessTokenClaims;
};

export const hashRefreshToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const createRefreshToken = async (
  userId: string,
  tokenVersion: number,
  familyId = randomUUID()
): Promise<{ token: string; familyId: string }> => {
  const token = crypto.randomBytes(48).toString('base64url');
  await prisma.refreshToken.create({
    data: {
      id: randomUUID(),
      userId,
      tokenHash: hashRefreshToken(token),
      familyId,
      tokenVersion,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return { token, familyId };
};

export const createSessionTokens = async (user: AccessTokenUser) => {
  const refresh = await createRefreshToken(user.id, user.tokenVersion);
  return { token: createAccessToken(user), refreshToken: refresh.token };
};
