import apiClient from './api';

export const transactionsApi = {
  // Get user transactions
  getUserTransactions: async (
    userId: string,
    options?: {
      type?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ) => {
    try {
      const response = await apiClient.get(`/transactions/user/${userId}`, {
        params: options,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  },

  // Get all transactions (admin)
  getAllTransactions: async (options?: {
    userId?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/transactions', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (transactionId: string) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Create transaction
  createTransaction: async (data: {
    userId: string;
    type: string;
    amount: number;
    description?: string;
    status?: string;
  }) => {
    try {
      const response = await apiClient.post('/transactions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
};
