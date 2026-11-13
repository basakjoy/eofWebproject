'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getApiBaseUrl } from '@/lib/apiUrl';
import { useAuthStore } from '@/store/authStore';

interface AdminPresence {
  sessionId: string;
  adminId: string;
  online: boolean;
}

const isPresence = (value: unknown): value is AdminPresence =>
  Boolean(value && typeof value === 'object' &&
    'sessionId' in value && typeof value.sessionId === 'string' &&
    'adminId' in value && typeof value.adminId === 'string' &&
    'online' in value && typeof value.online === 'boolean');

export function useAdminPresence() {
  const token = useAuthStore((state) => state.token);
  const [onlineSessionIds, setOnlineSessionIds] = useState<Set<string>>(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    const socketUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
    const socket = io(socketUrl, {
      auth: { token },
    });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (error) => {
      setConnected(false);
      console.error('Admin presence connection failed', error.message);
    });
    socket.on('admin:online-sessions', (sessions: unknown) => {
      if (!Array.isArray(sessions)) return;
      setOnlineSessionIds(new Set(
        sessions.filter(isPresence).map(({ sessionId }) => sessionId)
      ));
    });
    socket.on('admin:presence', (presence: unknown) => {
      if (!isPresence(presence)) return;
      setOnlineSessionIds((current) => {
        const next = new Set(current);
        if (presence.online) next.add(presence.sessionId);
        else next.delete(presence.sessionId);
        return next;
      });
    });
    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [token]);

  return { onlineSessionIds, connected };
}
