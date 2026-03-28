import apiClient from './api';

export const withdrawalsApi = {
  // Get all withdrawals
  getAllWithdrawals: async (options?: {
    status?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/withdrawals', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  },

  // Get withdrawal by ID
  getWithdrawalById: async (withdrawalId: string) => {
    try {
      const response = await apiClient.get(`/withdrawals/${withdrawalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal:', error);
      throw error;
    }
  },

  // Request withdrawal
  requestWithdrawal: async (data: {
    amount: number;
    method?: string;
    accountId?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.post('/withdrawals', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  },

  // Approve withdrawal (admin)
  approveWithdrawal: async (withdrawalId: string) => {
    try {
      const response = await apiClient.put(`/withdrawals/${withdrawalId}/approve`, {});
      return response.data;
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      throw error;
    }
  },

  // Reject withdrawal (admin)
  rejectWithdrawal: async (withdrawalId: string, reason?: string) => {
    try {
      const response = await apiClient.put(`/withdrawals/${withdrawalId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      throw error;
    }
  },

  // Complete withdrawal (admin)
  completeWithdrawal: async (withdrawalId: string, txHash?: string) => {
    try {
      const response = await apiClient.put(`/withdrawals/${withdrawalId}/complete`, {
        txHash,
      });
      return response.data;
    } catch (error) {
      console.error('Error completing withdrawal:', error);
      throw error;
    }
  },

  // Get withdrawal methods
  getWithdrawalMethods: async () => {
    try {
      const response = await apiClient.get('/withdrawals/methods/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal methods:', error);
      throw error;
    }
  },

  // Add withdrawal method (admin)
  addWithdrawalMethod: async (data: {
    name: string;
    type: string;
    fee?: number;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    try {
      const response = await apiClient.post('/withdrawals/methods', data);
      return response.data;
    } catch (error) {
      console.error('Error adding withdrawal method:', error);
      throw error;
    }
  },

  // Get user withdrawal accounts
  getUserWithdrawalAccounts: async () => {
    try {
      const response = await apiClient.get('/withdrawals/accounts/my-accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal accounts:', error);
      throw error;
    }
  },

  // Get withdrawal report
  getWithdrawalReport: async (period: string) => {
    try {
      const response = await apiClient.get(`/withdrawals/report/${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal report:', error);
      throw error;
    }
  },
};
