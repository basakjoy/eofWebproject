import { isScopeNoBroaderThan } from './permissions.config';
import { canWithSubject, scopeFor } from './permission-resolver';
import { PermissionKey, PermissionResource, PermissionSubject, Scope } from './permissions.types';

export type UserManagementAction = 'update' | 'deactivate' | 'reactivate' | 'change-role' | 'manage-overrides';

export interface ManagedUser {
  id: string;
  teamId: string | null;
  departmentId: string | null;
  role: { name: string; level: number; isSystem: boolean };
}

const permissionForAction = (action: UserManagementAction): PermissionKey => {
  if (action === 'update') return 'user:update';
  if (action === 'deactivate' || action === 'reactivate') return 'user:deactivate';
  if (action === 'change-role') return 'user:role-change';
  return 'user:override-manage';
};

const resourceForUser = (target: ManagedUser): PermissionResource => ({
  userId: target.id,
  teamId: target.teamId,
  departmentId: target.departmentId,
});

export const canManageUser = (
  actor: PermissionSubject,
  target: ManagedUser,
  action: UserManagementAction
): boolean => {
  if (target.id === actor.id || actor.role.level <= target.role.level) return false;
  if (actor.role.name === 'team_leader' && actor.teamId !== target.teamId) return false;
  return canWithSubject(actor, permissionForAction(action), resourceForUser(target));
};

export interface CreatableRole {
  name: string;
  level: number;
  isSystem: boolean;
}

export const isSystemRbacRole = (
  role: { isSystem: boolean } | null | undefined
): boolean => role?.isSystem === true;

export const canCreateRole = (
  actor: PermissionSubject,
  role: CreatableRole
): boolean => {
  if (role.name === 'super_admin') {
    return actor.role.name === 'super_admin' && actor.role.isSystem && role.isSystem;
  }
  return role.level <= actor.role.level;
};

export const canGrantPermission = (
  actor: PermissionSubject,
  permissionKey: Parameters<typeof scopeFor>[1],
  requestedScope: Scope | undefined,
  target: ManagedUser
): boolean => {
  const resource = resourceForUser(target);
  if (!canWithSubject(actor, 'user:override-manage', resource)) return false;
  if (!canWithSubject(actor, permissionKey, resource)) return false;
  const heldScope = scopeFor(actor, permissionKey);
  if (!heldScope) return false;
  const scopeToGrant = requestedScope ?? heldScope;
  return isScopeNoBroaderThan(scopeToGrant, heldScope);
};
