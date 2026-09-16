'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter();
  const { isAuthenticated, user, token, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || !token || !user) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, isAuthenticated, token, user, router, redirectTo]);

  return {
    isAuthenticated,
    user,
    token,
    isReady: hasHydrated && isAuthenticated && !!token && !!user,
  };
}

export function useRequireAdmin(redirectTo = '/home') {
  const router = useRouter();
  const { isAuthenticated, user, token, hasHydrated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    setIsAuthorized(false);

    if (!isAuthenticated || !token || !user) {
      router.replace('/login');
      return;
    }

    const role = String(user.role || '').toLowerCase();
    if (role !== 'admin' && role !== 'superadmin') {
      router.replace(redirectTo);
      return;
    }

    let active = true;
    apiClient.get('/admin/dashboard/stats')
      .then(() => { if (active) setIsAuthorized(true); })
      .catch(() => { if (active) router.replace(redirectTo); });

    return () => { active = false; };
  }, [hasHydrated, isAuthenticated, token, user, router, redirectTo]);

  return { isAuthorized, user, isReady: hasHydrated };
}

