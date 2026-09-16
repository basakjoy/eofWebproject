import { create } from 'zustand';
import { User } from '@/types';
import { clearAuthSession, normalizeAuthUser } from '@/lib/authUtils';
import { signOut } from 'next-auth/react';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setSession: (token: string, user: User) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  hydrateSession: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hasHydrated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('token', token);
    }
  },
  setSession: (token, user) => {
    set({ token, user, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
  hydrateSession: () => {
    if (typeof window === 'undefined') {
      set({ hasHydrated: true });
      return;
    }
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        const parsedUser = normalizeAuthUser(JSON.parse(storedUser));
        set({
          token: storedToken,
          user: parsedUser,
          isAuthenticated: true,
          hasHydrated: true,
        });
        return;
      }
    } catch (e) {
      console.error('Failed to hydrate auth session:', e);
    }
    set({ user: null, token: null, isAuthenticated: false, hasHydrated: true });
  },
  logout: async () => {
    set({ user: null, token: null, isAuthenticated: false });
    clearAuthSession();
    try {
      await signOut({ redirect: false });
    } catch {
      // Ignore if next-auth is not in an active session
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
}));

