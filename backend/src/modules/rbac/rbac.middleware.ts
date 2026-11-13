import { NextFunction, Response } from 'express';
import { writeAuditLog } from '../audit/audit.service';
import { canWithSubject } from './permission-resolver';
import { PermissionKey, PermissionResource } from './permissions.types';
import { RbacRequest } from '../auth/auth.middleware';

const sensitivePermission = (key: PermissionKey): boolean =>
  key.startsWith('user:') || key.startsWith('payroll:') ||
  key === 'audit:read' || key === 'settings:manage';

const auditDenied = async (
  req: RbacRequest,
  key: PermissionKey,
  targetId?: string
): Promise<void> => {
  await writeAuditLog({
    actorId: req.rbacUser?.id ?? null,
    action: 'AUTHORIZATION_DENIED',
    targetType: req.baseUrl + req.path,
    targetId: targetId ?? null,
    after: { permission: key },
    ip: req.ip,
  });
};

export const requirePermission = (key: PermissionKey) => async (
  req: RbacRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.rbacUser) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    if (canWithSubject(req.rbacUser, key)) {
      next();
      return;
    }
    if (sensitivePermission(key)) await auditDenied(req, key);
    res.status(403).json({ success: false, message: 'Forbidden' });
  } catch (error) {
    next(error);
  }
};

export const requireRecordPermission = (
  key: PermissionKey,
  getResource: (req: RbacRequest) => PermissionResource | Promise<PermissionResource>
) => async (
  req: RbacRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.rbacUser) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    const resource = await getResource(req);
    if (canWithSubject(req.rbacUser, key, resource)) {
      next();
      return;
    }
    if (sensitivePermission(key)) {
      await auditDenied(req, key, resource.id ?? resource.userId ?? req.params.userId);
    }
    res.status(404).json({ success: false, message: 'Resource not found' });
  } catch (error) {
    next(error);
  }
};
