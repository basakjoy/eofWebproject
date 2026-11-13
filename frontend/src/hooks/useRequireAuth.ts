'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { isAdminRole, isSuperAdminUser } from '@/lib/authUtils';

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
  const pathname = usePathname();
  const { isAuthenticated, user, token, hasHydrated } = useAuthStore();
  const [authorizedKey, setAuthorizedKey] = useState<string | null>(null);
  const routePermissions: Record<string, string[]> = {
    '/admin': ['view_admin_dashboard'],
    '/admin/dashboard': ['view_admin_dashboard'],
    '/admin/users': ['view_users', 'manage_users'],
    '/admin/analytics': ['view_analytics'],
    '/admin/signals': ['create_signal', 'view_signals', 'edit_signals', 'delete_signals'],
    '/admin/articles': ['view_articles', 'manage_articles', 'view_insights'],
    '/admin/brokers': ['view_brokers', 'manage_brokers'],
    '/admin/deposits': ['view_deposits', 'manage_deposits'],
    '/admin/support': ['view_support', 'manage_support'],
    '/admin/logs': ['view_activity_logs'],
  };
  const matchedRoute = Object.keys(routePermissions)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || (route !== '/admin' && pathname.startsWith(`${route}/`)));
  const requiredPermissions = matchedRoute ? routePermissions[matchedRoute] : [];
  const hasRoutePermission = !user?.adminPermissionsConfigured ||
    isSuperAdminUser(user) ||
    !requiredPermissions.length ||
    requiredPermissions.some((permission) => user?.permissions?.includes(permission));
  const authorizationKey = [
    token || '',
    user?.id || '',
    user?.role || '',
    user?.adminScope || '',
    user?.permissions?.join(',') || '',
    pathname,
  ].join(':');
  const isAuthorized = authorizedKey === authorizationKey;

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || !token || !user) {
      router.replace('/login');
      return;
    }

    if (!isAdminRole(user.role)) {
      router.replace(redirectTo);
      return;
    }
    if (!hasRoutePermission) {
      router.replace('/admin/dashboard');
      return;
    }

    let active = true;
    apiClient.get('/admin/dashboard/stats')
      .then(() => { if (active) setAuthorizedKey(authorizationKey); })
      .catch(() => { if (active) router.replace(redirectTo); });

    return () => { active = false; };
  }, [hasHydrated, isAuthenticated, token, user, router, redirectTo, pathname, hasRoutePermission, authorizationKey]);

  return { isAuthorized, user, isReady: hasHydrated };
}

export function useRequireSuperAdmin() {
  const router = useRouter();
  const { isAuthenticated, user, token, hasHydrated } = useAuthStore();
  const [authorizedKey, setAuthorizedKey] = useState<string | null>(null);
  const authorizationKey = [token || '', user?.id || '', user?.role || '', user?.adminScope || ''].join(':');
  const isAuthorized = authorizedKey === authorizationKey;

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || !token || !user) {
      router.replace('/login');
      return;
    }
    if (!isSuperAdminUser(user)) {
      router.replace('/admin');
      return;
    }

    let active = true;
    apiClient.get('/admin/management/admins')
      .then(() => { if (active) setAuthorizedKey(authorizationKey); })
      .catch(() => { if (active) router.replace('/admin'); });

    return () => { active = false; };
  }, [hasHydrated, isAuthenticated, token, user, router, authorizationKey]);

  return { isAuthorized, user, isReady: hasHydrated };
}
