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
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data TEXT,
      read BOOLEAN DEFAULT 0,
      readAt DATETIME,
      actionUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Notification Preferences table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notification_preferences (
      id TEXT PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL,
      emailNotifications BOOLEAN DEFAULT 1,
      pushNotifications BOOLEAN DEFAULT 1,
      smsNotifications BOOLEAN DEFAULT 0,
      inAppNotifications BOOLEAN DEFAULT 1,
      notificationTypes TEXT,
      quietHours TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Notification History table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notification_history (
      id TEXT PRIMARY KEY,
      notificationId TEXT,
      userId TEXT NOT NULL,
      deliveryMethod TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      failureReason TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (notificationId) REFERENCES notifications(id) ON DELETE SET NULL
    )
  `);

  // Notification Templates table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notification_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subject TEXT,
      template TEXT NOT NULL,
      variables TEXT,
      category TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bulk Notifications table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS bulk_notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      recipientCount INTEGER DEFAULT 0,
      sentCount INTEGER DEFAULT 0,
      failedCount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft',
      scheduledFor DATETIME,
      sentAt DATETIME,
      createdBy TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
