import { describe, expect, it } from '@jest/globals';
import {
  permissionMatrix,
  systemRoles,
} from './permissions.config';
import { canWithSubject } from './permission-resolver';
import { PermissionSubject, permissionKeys, roleNames, Scope } from './permissions.types';
import { canCreateRole, canGrantPermission, canManageUser } from './rbac.service';
import { assertActiveSuperAdminCount } from '../users/users.service';

const resourceForScope = (scope: Scope) => {
  if (scope === 'OWN') {
    return { userId: 'actor', teamId: 'other-team', departmentId: 'other-department' };
  }
  if (scope === 'TEAM') {
    return { userId: 'other-user', teamId: 'team-1', departmentId: 'other-department' };
  }
  if (scope === 'DEPARTMENT') {
    return { userId: 'other-user', teamId: 'other-team', departmentId: 'department-1' };
  }
  return { userId: 'other-user', teamId: 'other-team', departmentId: 'other-department' };
};

const subjectForRole = (roleName: (typeof roleNames)[number]): PermissionSubject => {
  const definition = systemRoles.find((role) => role.name === roleName);
  if (!definition) throw new Error(`Unknown role: ${roleName}`);
  return {
    id: 'actor',
    roleId: roleName,
    permissionsVersion: 1,
    teamId: 'team-1',
    departmentId: 'department-1',
    role: {
      name: definition.name,
      level: definition.level,
      isSystem: definition.isSystem,
      permissions: permissionMatrix[roleName],
    },
    overrides: {},
  };
};

const matrixCases = roleNames.flatMap((roleName) =>
  permissionKeys.flatMap((permissionKey) =>
    (['OWN', 'TEAM', 'DEPARTMENT', 'ALL'] as const).map((scope) => {
      const grantScope = permissionMatrix[roleName][permissionKey];
      return {
        roleName,
        permissionKey,
        scope,
        allowed: grantScope === scope || grantScope === 'ALL',
      };
    })
  )
);

describe('default permission matrix', () => {
  it.each(matrixCases)(
    '$roleName $permissionKey at $scope (allowed: $allowed)',
    ({ roleName, permissionKey, scope, allowed }) => {
      const subject = subjectForRole(roleName);
      expect(canWithSubject(subject, permissionKey, resourceForScope(scope))).toBe(allowed);
    }
  );
});

describe('permission overrides', () => {
  it('ignores expired grants', () => {
    const subject = subjectForRole('staff');
    subject.overrides['task:delete'] = {
      effect: 'GRANT',
      scope: 'ALL',
      expiresAt: new Date('2020-01-01T00:00:00.000Z'),
    };
    expect(canWithSubject(subject, 'task:delete', undefined, new Date('2026-01-01'))).toBe(false);
  });

  it('lets explicit DENY override a role grant', () => {
    const subject = subjectForRole('staff');
    subject.overrides['task:read'] = {
      effect: 'DENY',
      scope: 'ALL',
      expiresAt: null,
    };
    expect(canWithSubject(subject, 'task:read', { userId: subject.id })).toBe(false);
  });

  it('applies an explicit grant to a permission missing from the role', () => {
    const subject = subjectForRole('staff');
    subject.overrides['task:delete'] = {
      effect: 'GRANT',
      scope: null,
      expiresAt: null,
    };
    expect(canWithSubject(subject, 'task:delete', { userId: subject.id })).toBe(true);
    expect(canWithSubject(subject, 'task:delete', { userId: 'another-user' })).toBe(false);
  });

  it('does not allow a grant to widen the actor scope', () => {
    const actor = subjectForRole('team_leader');
    const target = {
      id: 'staff-1',
      teamId: 'team-1',
      departmentId: 'department-1',
      role: { name: 'staff', level: 20, isSystem: true },
    };
    expect(canGrantPermission(actor, 'task:read', 'TEAM', target)).toBe(true);
    expect(canGrantPermission(actor, 'task:read', 'ALL', target)).toBe(false);
  });

  it('keeps TEAM_LEADER grants bounded to their team', () => {
    const subject = subjectForRole('team_leader');
    subject.overrides['task:read'] = {
      effect: 'GRANT',
      scope: 'ALL',
      expiresAt: null,
    };
    expect(canWithSubject(subject, 'task:read', {
      teamId: 'team-2',
      departmentId: 'department-1',
    })).toBe(false);
    expect(canWithSubject(subject, 'task:read', {
      teamId: 'team-1',
      departmentId: 'department-1',
    })).toBe(true);
  });
});

describe('hierarchy enforcement', () => {
  it('allows an ADMIN to create another ADMIN', () => {
    expect(canCreateRole(subjectForRole('admin'), {
      name: 'admin',
      level: 80,
      isSystem: true,
    })).toBe(true);
  });

  it('blocks an ADMIN from creating a SUPER_ADMIN', () => {
    expect(canCreateRole(subjectForRole('admin'), {
      name: 'super_admin',
      level: 100,
      isSystem: true,
    })).toBe(false);
  });

  it('blocks an ADMIN from editing a peer ADMIN', () => {
    const actor = subjectForRole('admin');
    expect(canManageUser(actor, {
      id: 'peer-admin',
      teamId: 'team-1',
      departmentId: 'department-1',
      role: { name: 'admin', level: 80, isSystem: true },
    }, 'update')).toBe(false);
  });

  it('blocks a TEAM_LEADER from managing a user in another team', () => {
    const actor = subjectForRole('team_leader');
    expect(canManageUser(actor, {
      id: 'other-team-staff',
      teamId: 'team-2',
      departmentId: 'department-1',
      role: { name: 'staff', level: 20, isSystem: true },
    }, 'update')).toBe(false);
  });

  it('blocks demoting the last active SUPER_ADMIN', () => {
    expect(() => assertActiveSuperAdminCount(1, 'demote')).toThrow(
      'Cannot demote the last active SUPER_ADMIN'
    );
    expect(() => assertActiveSuperAdminCount(2, 'demote')).not.toThrow();
  });
});
