import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { clearAuthSession } from '@/lib/authUtils';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        clearAuthSession();
      },
    }),
    {
      name: 'authStore',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const tokenInStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const userInStorage = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        if (!tokenInStorage || !userInStorage || !state.user || !state.token) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.setHasHydrated(true);
          clearAuthSession();
          return;
        }

        state.isAuthenticated = Boolean(state.user && state.token);
        state.setHasHydrated(true);
      },
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') return null;
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (key, value) => {
          if (typeof window === 'undefined') return;
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(key);
        },
      },
    }
  )
);
