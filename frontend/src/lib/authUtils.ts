import { User, UserRole } from '@/types';

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
