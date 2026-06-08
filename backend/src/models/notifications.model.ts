// Notifications Model Types and Interfaces
export interface Notification {
  id: string;
  userId: string;
  type: 'alert' | 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  createdAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: Record<string, boolean>; // e.g., { "investment": true, "withdrawal": false }
  quietHours?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationHistory {
  id: string;
  notificationId: string;
  userId: string;
  deliveryMethod: 'email' | 'push' | 'sms' | 'in-app';
  status: 'sent' | 'failed' | 'bounced';
  sentAt: Date;
  failureReason?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  slug: string;
  subject?: string;
  template: string;
  variables: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkNotification {
  id: string;
  title: string;
  message: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledFor?: Date;
  sentAt?: Date;
  createdBy: string;
  createdAt: Date;
}

/**
 * Initialize notifications tables in database
 */
export const initNotificationsTables = async (runAsync: (sql: string, params?: any[]) => Promise<void>) => {
  // Notifications table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      type VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      data TEXT,
      read BOOLEAN DEFAULT false,
      readAt TIMESTAMP NULL,
      actionUrl VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Notification Preferences table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notification_preferences (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) UNIQUE NOT NULL,
      emailNotifications BOOLEAN DEFAULT true,
      pushNotifications BOOLEAN DEFAULT true,
      smsNotifications BOOLEAN DEFAULT false,
      inAppNotifications BOOLEAN DEFAULT true,
      notificationTypes TEXT,
      quietHours TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Notification History table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notification_history (
      id VARCHAR(36) PRIMARY KEY,
      notificationId VARCHAR(36),
      userId VARCHAR(36) NOT NULL,
      deliveryMethod VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'sent',
      sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      failureReason TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (notificationId) REFERENCES notifications(id) ON DELETE SET NULL
    )
  `);

  // Notification Templates table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notification_templates (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      subject VARCHAR(255),
      template TEXT NOT NULL,
      variables TEXT,
      category VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bulk Notifications table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS bulk_notifications (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      recipientCount INT DEFAULT 0,
      sentCount INT DEFAULT 0,
      failedCount INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'draft',
      scheduledFor TIMESTAMP NULL,
      sentAt TIMESTAMP NULL,
      createdBy VARCHAR(36) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
