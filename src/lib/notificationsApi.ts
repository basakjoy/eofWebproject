import apiClient from './api';

export const notificationsApi = {
  // Get user notifications
  getNotifications: async (options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }) => {
    try {
      const response = await apiClient.get('/notifications', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Get notification by ID
  getNotificationById: async (notificationId: string) => {
    try {
      const response = await apiClient.get(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`, {});
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put('/notifications/mark-all-read', {});
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await apiClient.get('/notifications/preferences/get');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  },

  // Update notification preferences
  updatePreferences: async (data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    preferences?: Record<string, boolean>;
  }) => {
    try {
      const response = await apiClient.put('/notifications/preferences/update', data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  // Send notification (admin/system only)
  sendNotification: async (data: {
    userId?: string;
    title: string;
    message: string;
    type?: string;
    actionUrl?: string;
  }) => {
    try {
      const response = await apiClient.post('/notifications/send', data);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },
};
