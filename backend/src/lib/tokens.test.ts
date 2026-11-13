import { describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshTokenValue, verifyAccessToken } from './tokens';

describe('admin session token claims', () => {
  it('keeps the same sid in access and refresh tokens', () => {
    const sessionId = 'admin-session-1';
    const accessToken = createAccessToken({
      id: 'admin-1',
      tokenVersion: 0,
      roleId: 'super-admin-role',
      permissionsVersion: 3,
      sessionId,
    });
    const refreshToken = createRefreshTokenValue('admin-1', 0, sessionId);
    const refreshClaims = jwt.decode(refreshToken);

    expect(verifyAccessToken(accessToken).sid).toBe(sessionId);
    expect(refreshClaims).toMatchObject({ sid: sessionId, tokenType: 'refresh' });
  });
});
