import apiClient from './api';

export type AdminScope = 'SIGNAL_ADMIN' | 'CONTENT_ADMIN' | 'SUPER_ADMIN';

export interface AdminRecord {
  id: string;
  email: string;
  name: string;
  adminScope: AdminScope;
  adminScopeGrantedAt: string;
  adminScopeGrantedBy?: string;
}

export const adminManagementApi = {
  // List all admins
  listAdmins: async (): Promise<{ success: boolean; data?: AdminRecord[]; message?: string }> => {
    try {
      const response = await apiClient.get('/admin/management/admins');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Grant admin access by email
  grantAdmin: async (data: {
    email: string;
    scope: AdminScope;
  }): Promise<{ success: boolean; data?: AdminRecord; message?: string }> => {
    try {
      const response = await apiClient.post('/admin/management/admins', data);
      return response.data;
    } catch (error: any) {
      console.error('Error granting admin:', error);
      throw error;
    }
  },

  // Update admin scope
  updateAdminScope: async (
    userId: string,
    data: { scope: AdminScope }
  ): Promise<{ success: boolean; data?: AdminRecord; message?: string }> => {
    try {
      const response = await apiClient.patch(`/admin/management/admins/${userId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating admin scope:', error);
      throw error;
    }
  },

  // Revoke admin access
  revokeAdmin: async (
    userId: string,
    revertTo: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.delete(`/admin/management/admins/${userId}`, {
        data: { revertTo },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error revoking admin:', error);
      throw error;
    }
  },
};
