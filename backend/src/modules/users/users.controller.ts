import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { listEffectivePermissions } from '../rbac/permission-resolver';
import { permissionKeys, scopes } from '../rbac/permissions.types';
import { RbacRequest } from '../auth/auth.middleware';
import {
  changeUserRole,
  createUser,
  listUsers,
  listTeamMembers,
  OverrideInput,
  removePermissionOverride,
  setPermissionOverride,
  setUserActive,
  updateUser,
} from './users.service';

const userIdParams = z.object({ userId: z.string().trim().min(1).max(64) }).strict();
const permissionParams = z.object({
  userId: z.string().trim().min(1).max(64),
  permissionKey: z.enum(permissionKeys),
}).strict();
const listQuery = z.object({
  offset: z.coerce.number().int().min(0).max(1_000_000).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(50),
}).strict();
const createUserBody = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254).optional(),
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9._-]+$/).optional(),
  password: z.string().min(12).max(72),
  passwordConfirm: z.string().min(1).max(72).optional(),
  roleId: z.string().trim().min(1).max(64),
  teamId: z.string().trim().min(1).max(64).optional(),
  departmentId: z.string().trim().min(1).max(64).optional(),
}).strict().refine((value) => Boolean(value.email || value.username), {
  message: 'Email or username is required',
});
const updateUserBody = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.union([z.string().trim().email().max(254), z.null()]).optional(),
  phone: z.union([z.string().trim().max(30), z.null()]).optional(),
  teamId: z.union([z.string().trim().min(1).max(64), z.null()]).optional(),
  departmentId: z.union([z.string().trim().min(1).max(64), z.null()]).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required',
});
const changeRoleBody = z.object({
  roleId: z.string().trim().min(1).max(64),
  passwordConfirm: z.string().min(1).max(72),
}).strict();
const passwordConfirmBody = z.object({
  passwordConfirm: z.string().min(1).max(72),
}).strict();
const overrideBody = z.object({
  effect: z.enum(['GRANT', 'DENY']),
  scope: z.enum(scopes).optional(),
  expiresAt: z.string().datetime({ offset: true }).optional(),
}).strict().transform((value): OverrideInput => ({
  effect: value.effect,
  ...(value.scope ? { scope: value.scope } : {}),
  ...(value.expiresAt ? { expiresAt: new Date(value.expiresAt) } : {}),
}));

const execute = (
  handler: (req: RbacRequest, res: Response) => Promise<void>
) => (req: Request, res: Response, next: NextFunction): void => {
  void handler(req as RbacRequest, res).catch(next);
};

const auditContext = (req: RbacRequest) => {
  if (!req.rbacUser) throw new Error('Authenticated RBAC subject is missing');
  return { actor: req.rbacUser, ip: req.ip };
};

export const getMyPermissions = execute(async (req, res) => {
  if (!req.rbacUser) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  res.json({ success: true, data: listEffectivePermissions(req.rbacUser) });
});

export const getUsers = execute(async (req, res) => {
  const parsed = listQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
    return;
  }
  const result = await listUsers(auditContext(req).actor, parsed.data.offset, parsed.data.limit);
  res.json({ success: true, ...result, ...parsed.data });
});

export const getTeamMembers = execute(async (req, res) => {
  if (!req.rbacUser) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  const members = await listTeamMembers(req.rbacUser);
  res.json({ success: true, data: members });
});

export const postUser = execute(async (req, res) => {
  const parsed = createUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid user details' });
    return;
  }
  const user = await createUser(auditContext(req), parsed.data);
  res.status(201).json({ success: true, data: user });
});

export const patchUser = execute(async (req, res) => {
  const params = userIdParams.safeParse(req.params);
  const body = updateUserBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ success: false, message: 'Invalid user update' });
    return;
  }
  const user = await updateUser(auditContext(req), params.data.userId, body.data);
  res.json({ success: true, data: user });
});

export const patchUserRole = execute(async (req, res) => {
  const params = userIdParams.safeParse(req.params);
  const body = changeRoleBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ success: false, message: 'Invalid role change request' });
    return;
  }
  const user = await changeUserRole(
    auditContext(req),
    params.data.userId,
    body.data.roleId,
    body.data.passwordConfirm
  );
  res.json({ success: true, data: user });
});

const setActive = (active: boolean) => execute(async (req, res) => {
  const params = userIdParams.safeParse(req.params);
  const body = passwordConfirmBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ success: false, message: 'Password confirmation is required' });
    return;
  }
  const user = await setUserActive(
    auditContext(req),
    params.data.userId,
    active,
    body.data.passwordConfirm
  );
  res.json({ success: true, data: user });
});

export const deactivateUser = setActive(false);
export const reactivateUser = setActive(true);

export const putPermissionOverride = execute(async (req, res) => {
  const params = permissionParams.safeParse(req.params);
  const body = overrideBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ success: false, message: 'Invalid permission override' });
    return;
  }
  const override = await setPermissionOverride(
    auditContext(req),
    params.data.userId,
    params.data.permissionKey,
    body.data
  );
  res.json({ success: true, data: override });
});

export const deletePermissionOverride = execute(async (req, res) => {
  const params = permissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ success: false, message: 'Invalid permission key' });
    return;
  }
  await removePermissionOverride(
    auditContext(req),
    params.data.userId,
    params.data.permissionKey
  );
  res.status(204).end();
});
