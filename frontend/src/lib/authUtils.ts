import { User, UserRole } from '@/types';

export type AuthUserInput = User | Record<string, unknown>;

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
    email: String(data.email ?? ''),
    phone: typeof data.phone === 'string' ? data.phone : undefined,
    name: String(data.name ?? ''),
    role,
    adminScope,
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

