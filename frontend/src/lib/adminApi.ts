import apiClient from './api';

// Admin Users APIs
export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Users Management
  getAllUsers: async (options?: { limit?: number; offset?: number }) => {
    try {
      const response = await apiClient.get('/admin/users', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUser: async (userId: string) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userId: string, permissions?: string[]) => {
    try {
      const response = await apiClient.post('/admin/users', {
        userId,
        permissions: permissions || [],
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId: string, data: { permissions?: string[]; status?: string }) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Admin Logs
  getAdminLogs: async (options?: { adminId?: string; action?: string; limit?: number; offset?: number }) => {
    try {
      const response = await apiClient.get('/admin/logs', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      throw error;
    }
  },

  logAdminAction: async (data: {
    adminId: string;
    action: string;
    targetId?: string;
    targetType?: string;
    changes?: Record<string, any>;
    reason?: string;
    ipAddress?: string;
  }) => {
    try {
      const response = await apiClient.post('/admin/logs', data);
      return response.data;
    } catch (error) {
      console.error('Error logging admin action:', error);
      throw error;
    }
  },

  // Withdrawals
  getAllWithdrawals: async (options?: { status?: string; userId?: string; limit?: number; offset?: number }) => {
    try {
      const response = await apiClient.get('/withdrawals', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  },

  getWithdrawal: async (withdrawalId: string) => {
    try {
      const response = await apiClient.get(`/withdrawals/${withdrawalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal:', error);
      throw error;
    }
  },

  updateWithdrawalStatus: async (withdrawalId: string, status: string) => {
    try {
      const response = await apiClient.put(`/withdrawals/${withdrawalId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      throw error;
    }
  },

  // Signals
  getAllSignals: async () => {
    try {
      const response = await apiClient.get('/signals');
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },

  getSignal: async (signalId: string) => {
    try {
      const response = await apiClient.get(`/signals/${signalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching signal:', error);
      throw error;
    }
  },

  createSignal: async (data: {
    pair: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    takeProfit: number;
    stopLoss: number;
    reliability?: number;
  }) => {
    try {
      const response = await apiClient.post('/signals', data);
      return response.data;
    } catch (error) {
      console.error('Error creating signal:', error);
      throw error;
    }
  },

  updateSignal: async (signalId: string, data: { status?: string; reliability?: number }) => {
    try {
      const response = await apiClient.put(`/signals/${signalId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating signal:', error);
      throw error;
    }
  },

  // Analysis
  getAllAnalysis: async (options?: { type?: string; status?: string; limit?: number; offset?: number }) => {
    try {
      const response = await apiClient.get('/analysis', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  },

  getAnalysis: async (analysisId: string) => {
    try {
      const response = await apiClient.get(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  },

  // Notifications
  getAllNotifications: async (options?: { limit?: number; offset?: number }) => {
    try {
      const response = await apiClient.get('/notifications', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  markNotificationAsRead: async (notificationId: string) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`, {});
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
};

export default adminApi;
