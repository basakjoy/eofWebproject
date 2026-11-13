import { describe, expect, it, jest } from '@jest/globals';
import { Response } from 'express';
import { AuthRequest } from './auth';
import { requireSuperAdmin } from './superadmin.middleware';

const response = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
};

describe('Super Admin access-log RBAC', () => {
  it('rejects unauthenticated requests', () => {
    const res = response();
    const next = jest.fn();

    requireSuperAdmin({} as AuthRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an authenticated non-super-admin', () => {
    const res = response();
    const next = jest.fn();
    const req = {
      user: {
        userId: 'admin-1',
        email: null,
        name: 'Admin',
        role: 'admin',
        roleId: 'admin-role',
        adminPermissionsConfigured: true,
        permissions: [],
      },
    } as unknown as AuthRequest;

    requireSuperAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows a Super Admin through', () => {
    const res = response();
    const next = jest.fn();
    const req = {
      user: {
        userId: 'owner-1',
        email: null,
        name: 'Owner',
        role: 'super_admin',
        roleId: 'owner-role',
        adminPermissionsConfigured: true,
        permissions: [],
      },
    } as unknown as AuthRequest;

    requireSuperAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
