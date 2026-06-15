'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

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
