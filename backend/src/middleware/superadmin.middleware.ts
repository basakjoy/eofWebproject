import { Response, NextFunction } from 'express';
import { AuthRequest, isSuperAdminUser } from '../middleware/auth';
import { Permission } from '../types/roles';

/**
 * Middleware to check if user is a SUPER_ADMIN
 */
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (!isSuperAdminUser(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Super admin access required',
    });
  }

  next();
};

/**
 * Middleware to check if user has a specific admin scope
 */
export const requireAdminScope = (requiredScopes: string | string[]) => {
  const scopes = Array.isArray(requiredScopes) ? requiredScopes : [requiredScopes];
  const normalizedScopes = scopes.map((scope) => String(scope).toUpperCase());

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin role required',
      });
    }

    const userScope = String(req.user.adminScope || '').toUpperCase();
    if (isSuperAdminUser(req.user)) {
      return next();
    }

    const permissionByScope: Record<string, Permission[]> = {
      SIGNAL_ADMIN: [
        Permission.CREATE_SIGNAL,
        Permission.VIEW_SIGNALS,
        Permission.EDIT_SIGNALS,
        Permission.DELETE_SIGNALS,
      ],
      CONTENT_ADMIN: [
        Permission.MANAGE_ARTICLES,
        Permission.VIEW_ARTICLES,
        Permission.CREATE_INSIGHTS,
        Permission.VIEW_INSIGHTS,
        Permission.EDIT_INSIGHTS,
        Permission.DELETE_INSIGHTS,
      ],
      BROKER_ADMIN: [Permission.MANAGE_BROKERS, Permission.VIEW_BROKERS],
      DEPOSIT_ADMIN: [Permission.MANAGE_DEPOSITS, Permission.VIEW_DEPOSITS],
      SUPPORT_ADMIN: [Permission.MANAGE_SUPPORT, Permission.VIEW_SUPPORT],
    };
    const hasScopePermission = req.user.adminPermissionsConfigured && normalizedScopes
      .flatMap((scope) => permissionByScope[scope] || [])
      .some((permission) => req.user!.permissions.includes(permission));

    const hasLegacyScope = !req.user.adminPermissionsConfigured && normalizedScopes.includes(userScope);
    if (!hasLegacyScope && !hasScopePermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient admin scope',
        requiredScopes: normalizedScopes,
        userScope,
      });
    }

    next();
  };
};
