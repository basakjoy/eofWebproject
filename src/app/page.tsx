'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user?.role === 'investor') {
        router.push('/dashboard/investments');
      } else if (user?.role === 'premium') {
        router.push('/dashboard/premium');
      } else {
        router.push('/dashboard/user');
      }
    } else {
      router.push('/home');
    }
  }, [isAuthenticated, user, router]);

  return null;
}
