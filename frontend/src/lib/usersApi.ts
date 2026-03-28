import apiClient from './api';

export const usersApi = {
  // Get all users (admin)
  getAllUsers: async (options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    try {
      const response = await apiClient.get('/users', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create user (admin)
  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    status?: string;
  }) => {
    try {
      const response = await apiClient.post('/users', data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId: string, data: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
    password?: string;
  }) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user (admin)
  deleteUser: async (userId: string) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  // Update current user profile
  updateCurrentUserProfile: async (data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }) => {
    try {
      const response = await apiClient.put('/users/me', data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.post('/users/change-password', data);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};
