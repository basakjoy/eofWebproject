 'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getDashboardPath } from '@/lib/authUtils';

export default function Home() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isAuthenticated && user) {
      router.replace(getDashboardPath(user));
      return;
    }

    // Anonymous visitors must be able to reach the public landing page
    // without being forced through login or registration.
    router.replace('/home');
  }, [hasHydrated, isAuthenticated, user, router]);

  return null;
}
