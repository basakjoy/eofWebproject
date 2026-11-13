import { PermissionKey, Scope, SystemRoleName } from './permissions.types';

export interface SystemRoleDefinition {
  name: SystemRoleName;
  level: number;
  description: string;
  isSystem: true;
}

export const systemRoles: readonly SystemRoleDefinition[] = [
  { name: 'super_admin', level: 100, description: 'Full system access', isSystem: true },
  { name: 'admin', level: 80, description: 'Organization-wide operational administration', isSystem: true },
  { name: 'team_leader', level: 60, description: 'Operational administration within the assigned team', isSystem: true },
  { name: 'senior', level: 40, description: 'Team task review and own work', isSystem: true },
  { name: 'staff', level: 20, description: 'Own work and profile', isSystem: true },
];

export type PermissionMatrix = Readonly<Record<SystemRoleName, Partial<Record<PermissionKey, Scope>>>>;

const grant = <K extends PermissionKey>(keys: readonly K[], scope: Scope): Partial<Record<PermissionKey, Scope>> =>
  Object.fromEntries(keys.map((key) => [key, scope])) as Partial<Record<PermissionKey, Scope>>;

const operationalPermissions: readonly PermissionKey[] = [
  'user:read', 'user:create', 'user:update', 'user:deactivate', 'user:role-change', 'user:override-manage',
  'task:read', 'task:create', 'task:update', 'task:delete', 'task:review',
  'attendance:read', 'attendance:create', 'attendance:update',
  'profile:read', 'profile:update',
  'team:read', 'team:manage', 'department:read', 'department:manage',
  'leave:read', 'leave:create', 'leave:update', 'leave:approve',
  'payroll:read', 'payroll:manage',
];

const allPermissions: readonly PermissionKey[] = [
  ...operationalPermissions,
  'audit:read',
  'settings:manage',
];

export const permissionMatrix: PermissionMatrix = {
  super_admin: grant(allPermissions, 'ALL'),
  admin: grant(operationalPermissions, 'ALL'),
  team_leader: grant(operationalPermissions, 'TEAM'),
  senior: {
    'task:read': 'TEAM',
    'task:review': 'TEAM',
    'task:create': 'OWN',
    'task:update': 'OWN',
    'attendance:read': 'OWN',
    'profile:read': 'OWN',
    'profile:update': 'OWN',
    'team:read': 'TEAM',
  },
  staff: {
    'task:read': 'OWN',
    'task:create': 'OWN',
    'task:update': 'OWN',
    'attendance:read': 'OWN',
    'attendance:create': 'OWN',
    'profile:read': 'OWN',
    'profile:update': 'OWN',
  },
};

export interface PermissionDefinition {
  key: PermissionKey;
  description: string;
}

export const permissionDefinitions: readonly PermissionDefinition[] = [
  ...allPermissions.map((key) => ({ key, description: `Allows ${key.replace(':', ' ')}` })),
];

export const scopeRank: Readonly<Record<Scope, number>> = {
  OWN: 0,
  TEAM: 1,
  DEPARTMENT: 1,
  ALL: 2,
};

export const isScopeNoBroaderThan = (requested: Scope, held: Scope): boolean => {
  if (requested === 'OWN') return true;
  if (requested === held) return true;
  return held === 'ALL';
};
