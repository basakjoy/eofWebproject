import apiClient from './api';

// Comprehensive Investment & Portfolio API Wrapper
export const investmentApi = {
  // Portfolio Overview
  getPortfolioOverview: async (userId: string) => {
    try {
      const response = await apiClient.get(`/investments/portfolio/overview/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio overview:', error);
      throw error;
    }
  },

  // Get all investments
  getAllInvestments: async (options?: { 
    userId?: string; 
    status?: string; 
    plan?: string; 
    limit?: number; 
    offset?: number 
  }) => {
    try {
      const response = await apiClient.get('/investments', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching investments:', error);
      throw error;
    }
  },

  // Get user investments
  getUserInvestments: async (userId: string, options?: { 
    status?: string; 
    limit?: number; 
    offset?: number 
  }) => {
    try {
      const response = await apiClient.get('/investments', { 
        params: { userId, ...options } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user investments:', error);
      throw error;
    }
  },

  // Get single investment
  getInvestment: async (investmentId: string) => {
    try {
      const response = await apiClient.get(`/investments/${investmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment:', error);
      throw error;
    }
  },

  // Create investment
  createInvestment: async (data: {
    userId: string;
    amount: number;
    plan: string;
    duration: number;
    returnRate?: number;
  }) => {
    try {
      const response = await apiClient.post('/investments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating investment:', error);
      throw error;
    }
  },

  // Update investment
  updateInvestment: async (investmentId: string, data: {
    status?: string;
    returns?: number;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.put(`/investments/${investmentId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  },

  // Get investment stats
  getInvestmentStats: async (userId: string) => {
    try {
      const response = await apiClient.get(`/investments/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment stats:', error);
      throw error;
    }
  },

  // TRANSACTION APIs
  // Get user transactions
  getUserTransactions: async (userId: string, options?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get(`/transactions/user/${userId}`, { 
        params: options 
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

  // Create transaction
  createTransaction: async (data: {
    userId: string;
    type: string;
    amount: number;
    description?: string;
    status?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const response = await apiClient.post('/transactions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (transactionId: string, data: {
    status?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.put(`/transactions/${transactionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Get transaction stats
  getTransactionStats: async (userId: string) => {
    try {
      const response = await apiClient.get(`/transactions/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw error;
    }
  },

  // PORTFOLIO CALCULATIONS
  calculateROI: (totalInvested: number, totalReturns: number) => {
    if (totalInvested === 0) return 0;
    return ((totalReturns / totalInvested) * 100).toFixed(2);
  },

  calculateEstimatedReturns: (amount: number, duration: number, returnRate: number = 0.06) => {
    return (amount * returnRate * duration).toFixed(2);
  },
};

export default investmentApi;
