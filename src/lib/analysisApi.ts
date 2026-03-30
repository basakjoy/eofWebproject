import apiClient from './api';

export const analysisApi = {
  // Get all analyses
  getAllAnalyses: async (options?: {
    limit?: number;
    offset?: number;
    userId?: string;
  }) => {
    try {
      const response = await apiClient.get('/analysis', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    }
  },

  // Get analysis by ID
  getAnalysisById: async (analysisId: string) => {
    try {
      const response = await apiClient.get(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  },

  // Create new analysis
  createAnalysis: async (data: {
    title: string;
    description: string;
    content?: string;
    pair?: string;
    timeframe?: string;
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    tags?: string[];
  }) => {
    try {
      const response = await apiClient.post('/analysis', data);
      return response.data;
    } catch (error) {
      console.error('Error creating analysis:', error);
      throw error;
    }
  },

  // Update analysis
  updateAnalysis: async (analysisId: string, data: any) => {
    try {
      const response = await apiClient.put(`/analysis/${analysisId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating analysis:', error);
      throw error;
    }
  },

  // Delete analysis
  deleteAnalysis: async (analysisId: string) => {
    try {
      const response = await apiClient.delete(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  },

  // Add comment to analysis
  addComment: async (
    analysisId: string,
    data: {
      comment: string;
      rating?: number;
    }
  ) => {
    try {
      const response = await apiClient.post(`/analysis/${analysisId}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
};
