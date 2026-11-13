'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isAdminRole } from '@/lib/authUtils';
import { getApiBaseUrl } from '@/lib/apiUrl';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

interface TrackedVisit {
  path: string;
  enteredAt: Date;
  visibleMs: number;
  visibleSince: number | null;
  finished: boolean;
}

export function usePageTracker() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const activeVisit = useRef<TrackedVisit | null>(null);

  useEffect(() => {
    if (!token || !user || !isAdminRole(user.role)) return;
    const visit: TrackedVisit = {
      path: pathname,
      enteredAt: new Date(),
      visibleMs: 0,
      visibleSince: document.visibilityState === 'visible' ? Date.now() : null,
      finished: false,
    };
    activeVisit.current = visit;

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && visit.visibleSince !== null) {
        visit.visibleMs += Date.now() - visit.visibleSince;
        visit.visibleSince = null;
      } else if (document.visibilityState === 'visible' && visit.visibleSince === null) {
        visit.visibleSince = Date.now();
      }
    };
    const finishVisit = () => {
      if (visit.finished) return;
      visit.finished = true;
      const exitedAt = new Date();
      const visibleMs = visit.visibleMs +
        (visit.visibleSince === null ? 0 : Date.now() - visit.visibleSince);
      const payload = JSON.stringify({
        token,
        path: visit.path,
        enteredAt: visit.enteredAt.toISOString(),
        exitedAt: exitedAt.toISOString(),
        durationSec: Math.min(86_400, Math.floor(visibleMs / 1000)),
      });
      const body = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
      if (!navigator.sendBeacon(`${getApiBaseUrl()}/admin/page-visit`, body)) {
        void fetch(`${getApiBaseUrl()}/admin/page-visit`, {
          method: 'POST',
          body,
          keepalive: true,
        }).catch((error: unknown) => console.error('Failed to send admin page visit', error));
      }
      if (activeVisit.current === visit) activeVisit.current = null;
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', finishVisit);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', finishVisit);
      finishVisit();
    };
  }, [pathname, token, user]);

  return activeVisit;
}

export function useAdminHeartbeat() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!token || !user || !isAdminRole(user.role)) return;
    const heartbeat = () => {
      if (document.visibilityState !== 'visible') return;
      void apiClient.post('/admin/heartbeat').catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) return;
        console.error('Failed to send admin heartbeat', error);
      });
    };

    const timer = window.setInterval(heartbeat, 30_000);
    heartbeat();
    document.addEventListener('visibilitychange', heartbeat);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', heartbeat);
    };
  }, [token, user]);
}
