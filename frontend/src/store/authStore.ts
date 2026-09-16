import { create } from 'zustand';
import { User } from '@/types';
import { clearAuthSession } from '@/lib/authUtils';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setSession: (token: string, user: User) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  logout: () => void;
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
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        clearAuthSession();
        if (typeof window !== 'undefined') {
          window.location.assign('/login');
        }
      },
    }));
