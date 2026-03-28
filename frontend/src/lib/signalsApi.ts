import apiClient from './api';

export const signalsApi = {
  // Get all signals with filtering
  getAllSignals: async (options?: {
    status?: string;
    pair?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/signals', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },

  // Get signal by ID
  getSignalById: async (signalId: string) => {
    try {
      const response = await apiClient.get(`/signals/${signalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching signal:', error);
      throw error;
    }
  },

  // Create new signal
  createSignal: async (data: {
    pair: string;
    type: string;
    direction?: string;
    entryPrice: number;
    stopLoss: number;
    takeProfit?: number;
    takeProfits?: number[];
    accuracy?: number;
    reliability?: number;
    timeframe?: string;
    status?: string;
  }) => {
    try {
      const response = await apiClient.post('/signals', data);
      return response.data;
    } catch (error) {
      console.error('Error creating signal:', error);
      throw error;
    }
  },

  // Update signal
  updateSignal: async (signalId: string, data: any) => {
    try {
      const response = await apiClient.put(`/signals/${signalId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating signal:', error);
      throw error;
    }
  },

  // Delete signal
  deleteSignal: async (signalId: string) => {
    try {
      const response = await apiClient.delete(`/signals/${signalId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting signal:', error);
      throw error;
    }
  },
};
