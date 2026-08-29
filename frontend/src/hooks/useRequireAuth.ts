'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    const hasStoredSession =
      typeof window !== 'undefined' &&
      !!localStorage.getItem('token') &&
      !!localStorage.getItem('user');

    if (!isAuthenticated && !hasStoredSession) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, token, router, redirectTo]);

  return { isAuthenticated, user };
}

export function useRequireAdmin(redirectTo = '/home') {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(false);
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!isAuthenticated || !token || !user || !storedUser || !storedToken) {
      router.replace('/login');
      return;
    }

    const role = String(user.role).toLowerCase();
    if (role !== 'admin' && role !== 'superadmin') {
      router.replace(redirectTo);
      return;
    }

    let active = true;
    apiClient.get('/admin/dashboard/stats')
      .then(() => { if (active) setIsAuthorized(true); })
      .catch(() => { if (active) router.replace(redirectTo); });

    return () => { active = false; };
  }, [isAuthenticated, token, user, router, redirectTo]);

  return { isAuthorized, user };
}
