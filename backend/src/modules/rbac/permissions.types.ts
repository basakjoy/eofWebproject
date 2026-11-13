export const scopes = ['OWN', 'TEAM', 'DEPARTMENT', 'ALL'] as const;
export type Scope = (typeof scopes)[number];

export const roleNames = ['super_admin', 'admin', 'team_leader', 'senior', 'staff'] as const;
export type SystemRoleName = (typeof roleNames)[number];

export const overrideEffects = ['GRANT', 'DENY'] as const;
export type OverrideEffect = (typeof overrideEffects)[number];

export const permissionKeys = [
  'user:read',
  'user:create',
  'user:update',
  'user:deactivate',
  'user:role-change',
  'user:override-manage',
  'task:read',
  'task:create',
  'task:update',
  'task:delete',
  'task:review',
  'attendance:read',
  'attendance:create',
  'attendance:update',
  'profile:read',
  'profile:update',
  'team:read',
  'team:manage',
  'department:read',
  'department:manage',
  'leave:read',
  'leave:create',
  'leave:update',
  'leave:approve',
  'payroll:read',
  'payroll:manage',
  'audit:read',
  'settings:manage',
] as const;
export type PermissionKey = (typeof permissionKeys)[number];

export interface PermissionResource {
  id?: string;
  userId?: string | null;
  ownerId?: string | null;
  createdById?: string | null;
  teamId?: string | null;
  departmentId?: string | null;
}

export interface PermissionSubject {
  id: string;
  roleId: string;
  permissionsVersion: number;
  teamId: string | null;
  departmentId: string | null;
  role: {
    name: string;
    level: number;
    isSystem: boolean;
    permissions: Partial<Record<PermissionKey, Scope>>;
  };
  overrides: Partial<Record<PermissionKey, {
    effect: OverrideEffect;
    scope: Scope | null;
    expiresAt: Date | null;
  }>>;
}
