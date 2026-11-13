import apiClient from './api';

export type AdminScope = 'SIGNAL_ADMIN' | 'CONTENT_ADMIN' | 'SUPER_ADMIN';
export type AdminStatus = 'active' | 'banned';
export type AdminRole = 'admin' | 'super_admin';

export interface AdminRecord {
  id: string;
  email: string | null;
  username: string | null;
  name: string;
  role: string;
  status: string;
  adminScope: AdminScope | null;
  adminScopeGrantedAt: string | null;
  permissions: string[];
}

export interface AdminActivityRecord {
  id: string;
  adminId: string;
  sessionId: string;
  action: string;
  target: string | null;
  ipAddress: string | null;
  createdAt: string;
  admin: {
    username: string | null;
    email: string | null;
    name: string;
  } | null;
}

export interface AdminAccessLogSession {
  id: string;
  adminId: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginAt: string;
  lastSeenAt: string;
  logoutAt: string | null;
  exitReason: 'LOGOUT' | 'TIMEOUT' | 'TOKEN_EXPIRED' | 'FORCED' | null;
  online: boolean;
  admin: {
    id: string;
    name: string;
    username: string | null;
    email: string | null;
  } | null;
  pageVisits?: Array<{
    id: string;
    path: string;
    enteredAt: string;
    exitedAt: string;
    durationSec: number;
  }>;
  activities?: Array<{
    id: string;
    action: string;
    target: string | null;
    ipAddress: string | null;
    createdAt: string;
  }>;
}

export interface AdminAccessLogFilters {
  admin?: string;
  from?: string;
  to?: string;
  ip?: string;
  exitReason?: AdminAccessLogSession['exitReason'];
  status?: 'online' | 'offline';
  page?: number;
  limit?: number;
}

export const adminManagementApi = {
  listAdmins: async (): Promise<{ success: boolean; data?: AdminRecord[]; message?: string }> => {
    const response = await apiClient.get('/admin/management/admins');
    return response.data;
  },

  createAdmin: async (data: {
    username: string;
    password: string;
    passwordConfirm: string;
    role: AdminRole;
    permissions: string[];
  }): Promise<{ success: boolean; data?: AdminRecord; message?: string }> => {
    const response = await apiClient.post('/admin/management/users', data);
    return response.data;
  },

  updateAdminPermissions: async (
    userId: string,
    permissions: string[]
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.patch(`/admin/management/admins/${userId}/permissions`, { permissions });
    return response.data;
  },

  updateAdminStatus: async (
    userId: string,
    status: AdminStatus,
    passwordConfirm: string
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.patch(`/admin/management/admins/${userId}/status`, { status, passwordConfirm });
    return response.data;
  },

  listActivity: async (filters: {
    adminId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    success: boolean;
    data?: AdminActivityRecord[];
    total?: number;
    message?: string;
  }> => {
    const response = await apiClient.get('/admin/management/activity', { params: filters });
    return response.data;
  },

  listAccessLogs: async (filters: AdminAccessLogFilters): Promise<{
    success: boolean;
    data?: AdminAccessLogSession[];
    total?: number;
    page?: number;
    limit?: number;
    message?: string;
  }> => {
    const response = await apiClient.get('/super-admin/access-logs', { params: filters });
    return response.data;
  },

  listAllAccessLogs: async (
    filters: Omit<AdminAccessLogFilters, 'page' | 'limit'>
  ): Promise<{ success: boolean; data?: AdminAccessLogSession[]; message?: string }> => {
    const sessions: AdminAccessLogSession[] = [];
    let total = 0;
    let page = 1;

    do {
      const result = await adminManagementApi.listAccessLogs({ ...filters, page, limit: 100 });
      if (!result.success || !result.data) {
        return { success: false, message: result.message || 'Unable to load admin access logs for export' };
      }

      sessions.push(...result.data);
      total = result.total ?? sessions.length;
      if (result.data.length === 0) break;
      page += 1;
    } while (sessions.length < total);

    return { success: true, data: sessions };
  },

  listAllAccessLogDetails: async (
    filters: Omit<AdminAccessLogFilters, 'page' | 'limit'>
  ): Promise<{ success: boolean; data?: AdminAccessLogSession[]; message?: string }> => {
    const sessionsResult = await adminManagementApi.listAllAccessLogs(filters);
    if (!sessionsResult.success || !sessionsResult.data) {
      return { success: false, message: sessionsResult.message || 'Unable to load admin access logs for export' };
    }

    const detailedSessions: AdminAccessLogSession[] = [];
    const batchSize = 10;
    for (let index = 0; index < sessionsResult.data.length; index += batchSize) {
      const batch = sessionsResult.data.slice(index, index + batchSize);
      const details = await Promise.all(batch.map((session) => adminManagementApi.getAccessLog(session.id)));
      const failedDetail = details.find((detail) => !detail.success || !detail.data);
      if (failedDetail) {
        return {
          success: false,
          message: failedDetail.message || 'Unable to load page visits for export',
        };
      }
      detailedSessions.push(...details.map((detail) => detail.data!));
    }

    return { success: true, data: detailedSessions };
  },

  getAccessLog: async (sessionId: string): Promise<{
    success: boolean;
    data?: AdminAccessLogSession;
    message?: string;
  }> => {
    const response = await apiClient.get(`/super-admin/access-logs/${encodeURIComponent(sessionId)}`);
    return response.data;
  },
};
