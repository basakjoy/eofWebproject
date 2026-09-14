 'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isAuthenticated && user) {
      const role = String(user.role || '').toLowerCase();

      if (role === 'admin' || role === 'superadmin') {
        router.replace('/admin/dashboard');
      } else if (role === 'investor') {
        router.replace('/dashboard/investments');
      } else if (role === 'premium') {
        router.replace('/dashboard/premium');
      } else {
        router.replace('/dashboard/user');
      }
      return;
    }

    // Anonymous visitors must be able to reach the public landing page
    // without being forced through login or registration.
    router.replace('/home');
  }, [hasHydrated, isAuthenticated, user, router]);

  return null;
}
