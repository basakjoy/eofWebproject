
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

console.log('✓ Prisma Client initialized');

// Initialize database tables via Prisma
export const initializeTables = async () => {
  try {
    console.log('Initializing Prisma database schema...');
    // With Prisma, tables are created via migrations
    // This function serves as a connection test
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection verified');
    console.log('✓ All database tables ready (managed by Prisma migrations)');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✓ Prisma connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

// Seed initial data
export const seedInitialData = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword || adminPassword.length < 16) {
      throw new Error('ADMIN_EMAIL and a 16-character ADMIN_PASSWORD are required to seed the initial administrator');
    }

    // Check if super admin exists
    const superAdminExists = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!superAdminExists) {
      console.log('Seeding initial data...');

      // Create roles
      const superAdminRole = await prisma.role.create({
        data: {
          id: randomUUID(),
          name: 'super_admin',
          description: 'Super Administrator with all permissions',
        },
      });

      const adminRole = await prisma.role.create({
        data: {
          id: randomUUID(),
          name: 'admin',
          description: 'Administrator with most permissions',
        },
      });

      const marketingAdminRole = await prisma.role.create({
        data: {
          id: randomUUID(),
          name: 'marketing_admin',
          description: 'Marketing Admin with limited permissions',
        },
      });

      const analystRole = await prisma.role.create({
        data: {
          id: randomUUID(),
          name: 'analyst',
          description: 'Analyst with read-only access',
        },
      });

      const userRole = await prisma.role.create({
        data: {
          id: randomUUID(),
          name: 'user',
          description: 'Regular user with basic access',
        },
      });

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

      const createdPermissions = await Promise.all(
        permissions.map((perm) =>
          prisma.permission.create({
            data: {
              id: randomUUID(),
              name: perm.name,
              description: perm.description,
              resource: perm.resource,
              action: perm.action,
            },
          })
        )
      );

      console.log('✓ Permissions created');

      // Map permissions to roles
      const rolePermissionMap: Record<string, string[]> = {
        [superAdminRole.id]: createdPermissions.map((p) => p.id),
        [adminRole.id]: createdPermissions
          .filter((p) => [
            'create_admin', 'delete_admin', 'edit_admin',
            'create_signal', 'view_signals', 'edit_signal', 'delete_signal',
            'create_campaign', 'view_campaigns', 'edit_campaign', 'delete_campaign',
            'view_analytics', 'view_reports', 'view_logs',
          ].includes(p.name))
          .map((p) => p.id),
        [marketingAdminRole.id]: createdPermissions
          .filter((p) => [
            'view_signals',
            'create_campaign', 'view_campaigns', 'edit_campaign',
            'view_analytics',
          ].includes(p.name))
          .map((p) => p.id),
        [analystRole.id]: createdPermissions
          .filter((p) => [
            'view_signals', 'view_campaigns', 'view_analytics', 'view_reports',
          ].includes(p.name))
          .map((p) => p.id),
        [userRole.id]: createdPermissions
          .filter((p) => p.name === 'view_analytics')
          .map((p) => p.id),
      };

      for (const [roleId, permIds] of Object.entries(rolePermissionMap)) {
        await Promise.all(
          permIds.map((permId) =>
            prisma.rolePermission.create({
              data: {
                id: randomUUID(),
                roleId,
                permissionId: permId,
              },
            })
          )
        );
      }

      console.log('✓ Role-Permission mappings created');

      // Create super admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await prisma.user.create({
        data: {
          id: randomUUID(),
          name: 'Super Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'super_admin',
          roleId: superAdminRole.id,
          status: 'active',
        },
      });

      console.log('✓ Super admin created');
      console.log(`  Email: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Export prisma client for direct use in models and controllers
export { prisma };

