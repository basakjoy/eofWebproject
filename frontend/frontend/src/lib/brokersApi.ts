import apiClient from './api';

export const brokersApi = {
  // Get all brokers
  getAllBrokers: async (options?: {
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/brokers', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching brokers:', error);
      throw error;
    }
  },

  // Get broker by ID
  getBrokerById: async (brokerId: string) => {
    try {
      const response = await apiClient.get(`/brokers/${brokerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching broker:', error);
      throw error;
    }
  },

  // Get broker reviews
  getBrokerReviews: async (brokerId: string, options?: {
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get(`/brokers/${brokerId}/reviews`, {
        params: options,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching broker reviews:', error);
      throw error;
    }
  },

  // Create broker (admin)
  createBroker: async (data: {
    name: string;
    website?: string;
    logo?: string;
    description?: string;
    rating?: number;
    features?: string[];
    minDeposit?: number;
    maxLeverage?: number;
    regulationStatus?: string;
  }) => {
    try {
      const response = await apiClient.post('/brokers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating broker:', error);
      throw error;
    }
  },

  // Update broker (admin)
  updateBroker: async (brokerId: string, data: any) => {
    try {
      const response = await apiClient.put(`/brokers/${brokerId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating broker:', error);
      throw error;
    }
  },

  // Delete broker (admin)
  deleteBroker: async (brokerId: string) => {
    try {
      const response = await apiClient.delete(`/brokers/${brokerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting broker:', error);
      throw error;
    }
  },

  // Add broker review
  addReview: async (
    brokerId: string,
    data: {
      rating: number;
      comment: string;
      pros?: string[];
      cons?: string[];
    }
  ) => {
    try {
      const response = await apiClient.post(`/brokers/${brokerId}/reviews`, data);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Connect broker account
  connectBrokerAccount: async (data: {
    brokerId: string;
    accountNumber?: string;
    apiKey?: string;
    apiSecret?: string;
  }) => {
    try {
      const response = await apiClient.post('/brokers/accounts/connect', data);
      return response.data;
    } catch (error) {
      console.error('Error connecting broker account:', error);
      throw error;
    }
  },

  // Get user broker accounts
  getUserBrokerAccounts: async () => {
    try {
      const response = await apiClient.get('/brokers/accounts/my-accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching user broker accounts:', error);
      throw error;
    }
  },
};
