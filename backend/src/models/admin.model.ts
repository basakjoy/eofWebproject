// Admin Model Types and Interfaces
export interface AdminUser {
  id: string;
  userId: string;
  status: 'active' | 'inactive';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  targetType: string;
  changes?: Record<string, any>;
  reason?: string;
  ipAddress: string;
  status: 'success' | 'failed';
  createdAt: Date;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Initialize admin tables in database
 */
export const initAdminTables = async (runAsync: (sql: string, params?: any[]) => Promise<void>) => {
  // Admin Users table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      permissions TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Admin Actions Log table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS admin_actions (
      id TEXT PRIMARY KEY,
      adminId TEXT NOT NULL,
      action TEXT NOT NULL,
      targetId TEXT,
      targetType TEXT,
      changes TEXT,
      reason TEXT,
      ipAddress TEXT,
      status TEXT DEFAULT 'success',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adminId) REFERENCES admin_users(id) ON DELETE CASCADE
    )
  `);

  // Admin Roles table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS admin_roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
