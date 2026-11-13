import { User, UserRole } from '@/types';

export type AuthUserInput = User | Record<string, unknown>;

export function isSuperAdminUser(user: Pick<User, 'role' | 'adminScope'> | null | undefined): boolean {
  return Boolean(user && (
    user.role === 'super_admin' ||
    String(user.role).toLowerCase() === 'superadmin' ||
    (user.role === 'admin' && user.adminScope?.toUpperCase() === 'SUPER_ADMIN')
  ));
}

export function isAdminRole(role: string | null | undefined): boolean {
  return ['admin', 'super_admin', 'superadmin'].includes(String(role || '').toLowerCase());
}

export function hasAdminPermission(
  user: Pick<User, 'role' | 'adminScope' | 'adminPermissionsConfigured' | 'permissions'> | null | undefined,
  permission: string
): boolean {
  if (!user) return false;
  if (isSuperAdminUser(user)) return true;
  if (user.adminPermissionsConfigured) return user.permissions?.includes(permission) ?? false;
  return isAdminRole(user.role);
}

export function getDashboardPath(user: Pick<User, 'role' | 'adminScope'>): string {
  if (isSuperAdminUser(user)) return '/super-admin';
  if (isAdminRole(user.role)) return '/admin/dashboard';
  if (user.role === 'investor') return '/dashboard/investments';
  if (user.role === 'premium') return '/dashboard/premium';
  return '/dashboard/user';
}

export function isNormalizedUser(data: AuthUserInput): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data &&
    'name' in data &&
    'role' in data &&
    typeof data.id === 'string'
  );
}

export function toAuthUser(data: AuthUserInput): User {
  return isNormalizedUser(data) ? data : normalizeAuthUser(data);
}

export function normalizeAuthUser(data: Record<string, unknown>): User {
  const role = (data.role as UserRole) || 'user';
  const adminScope = typeof data.adminScope === 'string'
    ? data.adminScope
    : typeof data.scope === 'string'
      ? data.scope
      : undefined;

  return {
    id: String(data.id ?? data.userId ?? ''),
    email: typeof data.email === 'string' ? data.email : null,
    username: typeof data.username === 'string' ? data.username : null,
    phone: typeof data.phone === 'string' ? data.phone : undefined,
    name: String(data.name ?? ''),
    role,
    adminScope,
    adminPermissionsConfigured: data.adminPermissionsConfigured === true,
    permissions: Array.isArray(data.permissions)
      ? data.permissions.filter((permission): permission is string => typeof permission === 'string')
      : undefined,
    createdAt: String(data.createdAt ?? ''),
    updatedAt: String(data.updatedAt ?? ''),
  };
}

export function persistAuthSession(token: string, user: User): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authStore');
  sessionStorage.clear();

  // Clear potential NextAuth and auth cookies
  const cookiesToClear = [
    'token',
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.callback-url',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
  ];

  cookiesToClear.forEach((cookieName) => {
    document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = `${cookieName}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  });
}
