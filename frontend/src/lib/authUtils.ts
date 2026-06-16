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

  return {
    id: String(data.id ?? data.userId ?? ''),
    email: String(data.email ?? ''),
    name: String(data.name ?? ''),
    role,
    createdAt: String(data.createdAt ?? ''),
    updatedAt: String(data.updatedAt ?? ''),
  };
}

export function persistAuthSession(token: string, user: User): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authStore');
}
