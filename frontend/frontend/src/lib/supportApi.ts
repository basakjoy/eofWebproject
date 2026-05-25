import apiClient from './api';

export const supportApi = {
  // Get FAQ articles
  getFAQArticles: async (options?: {
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/support/faq', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ articles:', error);
      throw error;
    }
  },

  // Get support categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/support/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching support categories:', error);
      throw error;
    }
  },

  // Get all support tickets (admin)
  getAllTickets: async (options?: {
    status?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/support/tickets', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Get user's support tickets
  getUserTickets: async (options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await apiClient.get('/support/tickets/my-tickets', {
        params: options,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  },

  // Get ticket by ID
  getTicketById: async (ticketId: string) => {
    try {
      const response = await apiClient.get(`/support/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  // Create support ticket
  createTicket: async (data: {
    title: string;
    description: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
    attachments?: string[];
  }) => {
    try {
      const response = await apiClient.post('/support/tickets', data);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Update ticket
  updateTicket: async (ticketId: string, data: any) => {
    try {
      const response = await apiClient.put(`/support/tickets/${ticketId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Close ticket
  closeTicket: async (ticketId: string, resolution?: string) => {
    try {
      const response = await apiClient.put(`/support/tickets/${ticketId}/close`, {
        resolution,
      });
      return response.data;
    } catch (error) {
      console.error('Error closing ticket:', error);
      throw error;
    }
  },

  // Get ticket messages
  getTicketMessages: async (ticketId: string) => {
    try {
      const response = await apiClient.get(`/support/tickets/${ticketId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
      throw error;
    }
  },

  // Add message to ticket
  addMessage: async (
    ticketId: string,
    data: {
      message: string;
      attachments?: string[];
    }
  ) => {
    try {
      const response = await apiClient.post(`/support/tickets/${ticketId}/messages`, data);
      return response.data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Get support metrics (admin)
  getSupportMetrics: async (period: string) => {
    try {
      const response = await apiClient.get(`/support/metrics/${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching support metrics:', error);
      throw error;
    }
  },
};
