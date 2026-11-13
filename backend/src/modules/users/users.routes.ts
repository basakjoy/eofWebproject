import { Router } from 'express';
import { prisma } from '../../database';
import {
  deactivateUser,
  deletePermissionOverride,
  getTeamMembers,
  getMyPermissions,
  getUsers,
  patchUser,
  patchUserRole,
  postUser,
  putPermissionOverride,
  reactivateUser,
} from './users.controller';
import { authenticate, RbacRequest } from '../auth/auth.middleware';
import { requirePermission, requireRecordPermission } from '../rbac/rbac.middleware';
import { PermissionResource } from '../rbac/permissions.types';
import { forceCloseSessionsOnSuccess, logActivity } from '../../middleware/adminActivityLogger';

const router = Router();

const targetResource = async (req: RbacRequest): Promise<PermissionResource> => {
  const userId = req.params.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, teamId: true, departmentId: true },
  });
  return user
    ? { userId: user.id, teamId: user.teamId, departmentId: user.departmentId }
    : { userId };
};

router.get('/me/permissions', authenticate, getMyPermissions);
router.get('/office/team', authenticate, requirePermission('team:read'), getTeamMembers);

router.get('/office/users', authenticate, requirePermission('user:read'), getUsers);
router.post('/office/users', authenticate, requirePermission('user:create'), logActivity('USER_CREATE'), postUser);
router.patch(
  '/office/users/:userId',
  authenticate,
  requireRecordPermission('user:update', targetResource),
  logActivity('USER_UPDATE', (req) => req.params.userId),
  patchUser
);
router.patch(
  '/office/users/:userId/role',
  authenticate,
  requireRecordPermission('user:role-change', targetResource),
  logActivity('USER_ROLE_CHANGE', (req) => req.params.userId),
  patchUserRole
);
router.post(
  '/office/users/:userId/deactivate',
  authenticate,
  requireRecordPermission('user:deactivate', targetResource),
  logActivity('USER_DEACTIVATE', (req) => req.params.userId),
  forceCloseSessionsOnSuccess((req) => req.params.userId),
  deactivateUser
);
router.post(
  '/office/users/:userId/reactivate',
  authenticate,
  requireRecordPermission('user:deactivate', targetResource),
  logActivity('USER_REACTIVATE', (req) => req.params.userId),
  reactivateUser
);
router.put(
  '/office/users/:userId/overrides/:permissionKey',
  authenticate,
  requireRecordPermission('user:override-manage', targetResource),
  logActivity('USER_PERMISSION_OVERRIDE', (req) => req.params.userId),
  putPermissionOverride
);
router.delete(
  '/office/users/:userId/overrides/:permissionKey',
  authenticate,
  requireRecordPermission('user:override-manage', targetResource),
  logActivity('USER_PERMISSION_OVERRIDE_DELETE', (req) => req.params.userId),
  deletePermissionOverride
);

export default router;
