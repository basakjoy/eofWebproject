import { NextFunction, Request, Response } from 'express';
import { getBearerToken } from '../../middleware/auth';
import { isAdminAccount, verifyAccessToken } from '../../lib/tokens';
import { prisma } from '../../database';
import { loadPermissionSubject } from '../rbac/permission-resolver';
import { PermissionSubject } from '../rbac/permissions.types';

export interface RbacRequest extends Request {
  rbacUser?: PermissionSubject;
  sessionId?: string;
}

export const authenticate = async (
  req: RbacRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  let claims: ReturnType<typeof verifyAccessToken>;
  try {
    claims = verifyAccessToken(token);
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }

  try {
    if (claims.sid) {
      const session = await prisma.adminSession.findUnique({
        where: { id: claims.sid },
        select: { adminId: true, logoutAt: true },
      });
      if (!session || session.adminId !== claims.userId || session.logoutAt) {
        res.status(401).json({ success: false, message: 'Admin session is closed or invalid' });
        return;
      }
      req.sessionId = claims.sid;
    }
    const user = await prisma.user.findUnique({
      where: { id: claims.userId },
      select: { id: true, roleId: true, role: true, adminScope: true, permissionsVersion: true, status: true, isActive: true },
    });
    if (
      !user ||
      user.status !== 'active' ||
      !user.isActive ||
      !user.roleId ||
      user.roleId !== claims.roleId ||
      user.permissionsVersion !== claims.permissionsVersion ||
      (isAdminAccount(user) && claims.sid === undefined) ||
      (claims.sid !== undefined && !isAdminAccount(user))
    ) {
      res.status(401).json({ success: false, message: 'Invalid or revoked token' });
      return;
    }

    req.rbacUser = await loadPermissionSubject(user.id, user.roleId, user.permissionsVersion);
    next();
  } catch (error) {
    next(error);
  }
};
