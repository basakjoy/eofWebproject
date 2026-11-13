import { prisma } from '../../database';
import { PermissionKey, PermissionResource, PermissionSubject, Scope } from './permissions.types';

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 10_000;

interface CacheEntry {
  expiresAt: number;
  subject: PermissionSubject;
}

const permissionCache = new Map<string, CacheEntry>();

const cacheKey = (userId: string, roleId: string, permissionsVersion: number): string =>
  `${userId}:${roleId}:${permissionsVersion}`;

const resolveScope = (
  subject: PermissionSubject,
  permissionKey: PermissionKey,
  now: Date
): Scope | undefined => {
  const override = subject.overrides[permissionKey];
  if (override && (!override.expiresAt || override.expiresAt > now)) {
    if (override.effect === 'DENY') return undefined;
    return override.scope ?? subject.role.permissions[permissionKey] ?? 'OWN';
  }
  return subject.role.permissions[permissionKey];
};

const resourceMatchesScope = (
  subject: PermissionSubject,
  scope: Scope,
  resource: PermissionResource
): boolean => {
  if (scope === 'ALL') return true;
  if (scope === 'OWN') {
    const ownerId = resource.ownerId ?? resource.userId ?? resource.createdById;
    return typeof ownerId === 'string' && ownerId === subject.id;
  }
  if (scope === 'TEAM') {
    return Boolean(subject.teamId && resource.teamId && subject.teamId === resource.teamId);
  }
  return Boolean(
    subject.departmentId &&
    resource.departmentId &&
    subject.departmentId === resource.departmentId
  );
};

export const canWithSubject = (
  subject: PermissionSubject,
  permissionKey: PermissionKey,
  resource?: PermissionResource,
  now = new Date()
): boolean => {
  const scope = scopeFor(subject, permissionKey, now);
  return scope !== undefined && (!resource || resourceMatchesScope(subject, scope, resource));
};

export const scopeFor = (
  subject: PermissionSubject,
  permissionKey: PermissionKey,
  now = new Date()
): Scope | undefined => {
  const scope = resolveScope(subject, permissionKey, now);
  if (scope === undefined) return undefined;
  if (subject.role.name === 'team_leader' && scope !== 'OWN') {
    return subject.teamId ? 'TEAM' : undefined;
  }
  return scope;
};

export const loadPermissionSubject = async (
  userId: string,
  roleId: string,
  permissionsVersion: number
): Promise<PermissionSubject> => {
  const key = cacheKey(userId, roleId, permissionsVersion);
  const cached = permissionCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.subject;
  if (cached) permissionCache.delete(key);

  const user = await prisma.user.findFirst({
    where: { id: userId, roleId, permissionsVersion, status: 'active', isActive: true },
    select: {
      id: true,
      roleId: true,
      permissionsVersion: true,
      teamId: true,
      departmentId: true,
      userRole: {
        select: {
          name: true,
          level: true,
          isSystem: true,
          rolePermissions: { select: { scope: true, permission: { select: { key: true } } } },
        },
      },
      permissionOverrides: {
        where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        select: {
          effect: true,
          scope: true,
          expiresAt: true,
          permission: { select: { key: true } },
        },
      },
    },
  });
  if (!user || !user.roleId || !user.userRole) throw new Error('Active user role could not be resolved');

  const permissions: PermissionSubject['role']['permissions'] = {};
  for (const rolePermission of user.userRole.rolePermissions) {
    if (rolePermission.permission.key) {
      permissions[rolePermission.permission.key as PermissionKey] = rolePermission.scope;
    }
  }

  const overrides: PermissionSubject['overrides'] = {};
  for (const override of user.permissionOverrides) {
    const permissionKey = override.permission.key as PermissionKey;
    if (permissionKey) {
      overrides[permissionKey] = {
        effect: override.effect,
        scope: override.scope,
        expiresAt: override.expiresAt,
      };
    }
  }

  const subject: PermissionSubject = {
    id: user.id,
    roleId: user.roleId,
    permissionsVersion: user.permissionsVersion,
    teamId: user.teamId,
    departmentId: user.departmentId,
    role: {
      name: user.userRole.name,
      level: user.userRole.level,
      isSystem: user.userRole.isSystem,
      permissions,
    },
    overrides,
  };

  if (permissionCache.size >= MAX_CACHE_ENTRIES) {
    for (const [cacheEntryKey, entry] of permissionCache) {
      if (entry.expiresAt <= Date.now() || permissionCache.size >= MAX_CACHE_ENTRIES * 0.9) {
        permissionCache.delete(cacheEntryKey);
      }
    }
  }
  const cacheExpiration = user.permissionOverrides.reduce(
    (expiration, override) => override.expiresAt
      ? Math.min(expiration, override.expiresAt.getTime())
      : expiration,
    Date.now() + CACHE_TTL_MS
  );
  permissionCache.set(key, { subject, expiresAt: cacheExpiration });
  return subject;
};

export const can = async (
  user: Pick<PermissionSubject, 'id' | 'roleId' | 'permissionsVersion'>,
  permissionKey: PermissionKey,
  resource?: PermissionResource
): Promise<boolean> => {
  const subject = await loadPermissionSubject(user.id, user.roleId, user.permissionsVersion);
  return canWithSubject(subject, permissionKey, resource);
};

export const listEffectivePermissions = (
  subject: PermissionSubject,
  now = new Date()
): Array<{ key: PermissionKey; scope: Scope }> => {
  const keys = new Set([
    ...Object.keys(subject.role.permissions),
    ...Object.keys(subject.overrides),
  ] as PermissionKey[]);
  return [...keys].flatMap((key) => {
    const scope = scopeFor(subject, key, now);
    return scope ? [{ key, scope }] : [];
  });
};

export const clearPermissionCache = (): void => {
  permissionCache.clear();
};
