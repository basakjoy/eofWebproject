
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory');
}

const dbPath = path.join(dataDir, 'database.db');
console.log('Database path:', dbPath);

// Create database instance with verbose mode
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('✓ Connected to SQLite database at:', dbPath);
  }
});

// Enable foreign keys
db.configure('busyTimeout', 5000);
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) {
    console.error('Error enabling foreign keys:', err);
  } else {
    console.log('✓ Foreign keys enabled');
  }
});

// Promisify database methods
export const runAsync = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const getAsync = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allAsync = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Initialize database tables
export const initializeTables = async () => {
  try {
    console.log('Initializing database tables...');

    // Roles table (create first)
    await runAsync(`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Roles table ready');

    // Permissions table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        resource TEXT,
        action TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Permissions table ready');

    // Role-Permission mapping
    await runAsync(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id TEXT PRIMARY KEY,
        roleId TEXT NOT NULL,
        permissionId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(roleId, permissionId),
        FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Role-Permissions table ready');

    // Users table (with roleId reference)
    await runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user',
        roleId TEXT,
        status TEXT DEFAULT 'active',
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roleId) REFERENCES roles(id)
      )
    `);
    console.log('✓ Users table ready');

    // Investments table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        amount REAL NOT NULL,
        plan TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        roi REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Investments table ready');

    // Trading Signals table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS signals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        strength TEXT NOT NULL,
        source TEXT NOT NULL,
        targetPrice TEXT,
        entryPoint TEXT,
        accuracy TEXT DEFAULT '0%',
        status TEXT DEFAULT 'active',
        createdBy TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Signals table ready');

    // Marketing Campaigns table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        budget REAL,
        spent REAL DEFAULT 0,
        roi REAL DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        startDate DATE,
        endDate DATE,
        createdBy TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Campaigns table ready');

    // Activity Logs table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        userId TEXT,
        action TEXT NOT NULL,
        ipAddress TEXT,
        status TEXT DEFAULT 'success',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      )
  `);
    console.log('✓ Logs table ready');

    // Admin Permissions table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS admin_permissions (
        id TEXT PRIMARY KEY,
        adminId TEXT NOT NULL,
        permission TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(adminId, permission),
        FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Admin Permissions table ready');

    // Market Analysis table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS market_analysis (
        id TEXT PRIMARY KEY,
        asset TEXT NOT NULL,
        price TEXT NOT NULL,
        change TEXT,
        volume TEXT,
        marketCap TEXT,
        high TEXT,
        low TEXT,
        trend TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Market Analysis table ready');

    console.log('✓ All database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
};

// Seed initial data (optional)
export const seedInitialData = async () => {
  try {
    // Check if super admin exists
    const superAdminExists = await getAsync(
      'SELECT id FROM users WHERE email = ?',
      ['superadmin@admin.com']
    );

    if (!superAdminExists) {
      console.log('Seeding initial data...');
      const bcrypt = require('bcryptjs');
      const { v4: uuidv4 } = require('uuid');

      // Create roles
      const superAdminRoleId = uuidv4();
      const adminRoleId = uuidv4();
      const marketingAdminRoleId = uuidv4();
      const analystRoleId = uuidv4();
      const userRoleId = uuidv4();

      await runAsync(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [superAdminRoleId, 'super_admin', 'Super Administrator with all permissions']
      );

      await runAsync(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [adminRoleId, 'admin', 'Administrator with most permissions']
      );

      await runAsync(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [marketingAdminRoleId, 'marketing_admin', 'Marketing Admin with limited permissions']
      );

      await runAsync(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [analystRoleId, 'analyst', 'Analyst with read-only access']
      );

      await runAsync(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [userRoleId, 'user', 'Regular user with basic access']
      );

      console.log('✓ Roles created');

      // Create permissions
      const permissions = [
        // User Management
        { name: 'manage_users', description: 'Manage all users', resource: 'users', action: 'manage' },
        { name: 'create_admin', description: 'Create admin accounts', resource: 'users', action: 'create' },
        { name: 'delete_admin', description: 'Delete admin accounts', resource: 'users', action: 'delete' },
        { name: 'edit_admin', description: 'Edit admin accounts', resource: 'users', action: 'edit' },
        
        // Signals
        { name: 'create_signal', description: 'Create trading signals', resource: 'signals', action: 'create' },
        { name: 'view_signals', description: 'View trading signals', resource: 'signals', action: 'view' },
        { name: 'edit_signal', description: 'Edit trading signals', resource: 'signals', action: 'edit' },
        { name: 'delete_signal', description: 'Delete trading signals', resource: 'signals', action: 'delete' },
        
        // Campaigns
        { name: 'create_campaign', description: 'Create campaigns', resource: 'campaigns', action: 'create' },
        { name: 'view_campaigns', description: 'View campaigns', resource: 'campaigns', action: 'view' },
        { name: 'edit_campaign', description: 'Edit campaigns', resource: 'campaigns', action: 'edit' },
        { name: 'delete_campaign', description: 'Delete campaigns', resource: 'campaigns', action: 'delete' },
        
        // Analytics
        { name: 'view_analytics', description: 'View analytics', resource: 'analytics', action: 'view' },
        { name: 'view_reports', description: 'View reports', resource: 'reports', action: 'view' },
        
        // System
        { name: 'view_logs', description: 'View activity logs', resource: 'logs', action: 'view' },
        { name: 'manage_settings', description: 'Manage system settings', resource: 'settings', action: 'manage' },
      ];

      const permissionIds: Record<string, string> = {};

      for (const perm of permissions) {
        const permId = uuidv4();
        permissionIds[perm.name] = permId;
        await runAsync(
          'INSERT INTO permissions (id, name, description, resource, action) VALUES (?, ?, ?, ?, ?)',
          [permId, perm.name, perm.description, perm.resource, perm.action]
        );
      }

      console.log('✓ Permissions created');

      // Map permissions to roles
      const rolePermissionMap: Record<string, string[]> = {
        [superAdminRoleId]: Object.values(permissionIds), // All permissions
        [adminRoleId]: [
          permissionIds['create_admin'],
          permissionIds['delete_admin'],
          permissionIds['edit_admin'],
          permissionIds['create_signal'],
          permissionIds['view_signals'],
          permissionIds['edit_signal'],
          permissionIds['delete_signal'],
          permissionIds['create_campaign'],
          permissionIds['view_campaigns'],
          permissionIds['edit_campaign'],
          permissionIds['delete_campaign'],
          permissionIds['view_analytics'],
          permissionIds['view_reports'],
          permissionIds['view_logs'],
        ],
        [marketingAdminRoleId]: [
          permissionIds['view_signals'],
          permissionIds['create_campaign'],
          permissionIds['view_campaigns'],
          permissionIds['edit_campaign'],
          permissionIds['view_analytics'],
        ],
        [analystRoleId]: [
          permissionIds['view_signals'],
          permissionIds['view_campaigns'],
          permissionIds['view_analytics'],
          permissionIds['view_reports'],
        ],
        [userRoleId]: [permissionIds['view_analytics']],
      };

      for (const [roleId, permIds] of Object.entries(rolePermissionMap)) {
        for (const permId of permIds) {
          await runAsync(
            'INSERT INTO role_permissions (id, roleId, permissionId) VALUES (?, ?, ?)',
            [uuidv4(), roleId, permId]
          );
        }
      }

      console.log('✓ Role-Permission mappings created');

      // Create super admin user
      const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);
      const superAdminId = uuidv4();

      await runAsync(
        `INSERT INTO users (id, name, email, password, role, roleId, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [superAdminId, 'Super Admin', 'superadmin@admin.com', hashedPassword, 'super_admin', superAdminRoleId, 'active']
      );

      console.log('✓ Super admin created');
      console.log('  Email: superadmin@admin.com');
      console.log('  Password: SuperAdmin@123');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// // Export database instance for raw queries if needed
export default db;