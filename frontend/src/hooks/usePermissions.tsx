'use client';

import { useCallback, useEffect, useState } from 'react';
import { createContext, ReactNode, useContext } from 'react';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export type PermissionGrant = {
  key: string;
  scope: 'OWN' | 'TEAM' | 'DEPARTMENT' | 'ALL';
};

interface PermissionsResponse {
  success: boolean;
  data: PermissionGrant[];
}

interface PermissionsContextValue {
  grants: PermissionGrant[];
  loading: boolean;
  error: Error | null;
  hasPermission: (permission: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);
const noPermissionGrants: PermissionGrant[] = [];

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<{
    token: string;
    grants: PermissionGrant[];
    error: Error | null;
  } | null>(null);
  const { token, hasHydrated } = useAuthStore();

  useEffect(() => {
    let active = true;
    if (!hasHydrated || !token) return () => { active = false; };
    apiClient.get<PermissionsResponse>('/me/permissions')
      .then(({ data }) => {
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error('Invalid permissions response');
        }
        if (active) setResult({ token, grants: data.data, error: null });
      })
      .catch((cause: unknown) => {
        if (active) {
          setResult({
            token,
            grants: [],
            error: cause instanceof Error ? cause : new Error('Failed to load permissions'),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [hasHydrated, token]);

  const currentResult = token && result?.token === token ? result : null;
  const grants = currentResult ? currentResult.grants : noPermissionGrants;
  const loading = !hasHydrated || Boolean(token && !currentResult);
  const error = currentResult?.error ?? null;
  const hasPermission = useCallback(
    (permission: string) => grants.some((grant) => grant.key === permission),
    [grants]
  );

  return (
    <PermissionsContext.Provider value={{ grants, loading, error, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextValue {
  const context = useContext(PermissionsContext);
  if (!context) throw new Error('usePermissions must be used within PermissionsProvider');
  return context;
}
