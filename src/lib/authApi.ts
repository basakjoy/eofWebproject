import apiClient from './api';

export const authApi = {
  // Register new user
  register: async (data: {
    name: string;
    email: string;
    password: string;
    userType?: 'user' | 'investor';
  }) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  // Logout user (client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from storage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Set user data after login
  setUserData: (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  // Get stored token
  getToken: () => localStorage.getItem('token'),
};
