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
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      permissions TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Admin Actions Log table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS admin_actions (
      id VARCHAR(36) PRIMARY KEY,
      adminId VARCHAR(36) NOT NULL,
      action VARCHAR(255) NOT NULL,
      targetId VARCHAR(36),
      targetType VARCHAR(100),
      changes TEXT,
      reason TEXT,
      ipAddress VARCHAR(45),
      status VARCHAR(50) DEFAULT 'success',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adminId) REFERENCES admin_users(id) ON DELETE CASCADE
    )
  `);

  // Admin Roles table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS admin_roles (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
