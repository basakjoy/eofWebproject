import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

// Get all admin users
export const getAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const users = await allAsync(
      'SELECT id, name, email, role, status, createdAt, updatedAt FROM users ORDER BY createdAt DESC'
    );
    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin users',
    });
  }
};

// Get admin user by ID
export const getAdminUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await getAsync('SELECT * FROM admin_users WHERE id = ?', [id]);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin user',
    });
  }
};

// Create admin user
export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const { userId, permissions = [] } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    // Check if user exists
    const user = await getAsync('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already admin
    const existingAdmin = await getAsync('SELECT id FROM admin_users WHERE userId = ?', [userId]);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin',
      });
    }

    const adminId = uuidv4();
    await runAsync(
      `INSERT INTO admin_users (id, userId, permissions) VALUES (?, ?, ?)`,
      [adminId, userId, JSON.stringify(permissions)]
    );

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: { id: adminId, userId, permissions, status: 'active' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create admin user',
    });
  }
};

// Update admin user
export const updateAdminUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissions, status } = req.body;

    const admin = await getAsync('SELECT * FROM admin_users WHERE id = ?', [id]);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    const updates = [];
    const values = [];
    
    if (permissions !== undefined) {
      updates.push('permissions = ?');
      values.push(JSON.stringify(permissions));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    if (updates.length > 1) {
      await runAsync(
        `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({
      success: true,
      message: 'Admin user updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update admin user',
    });
  }
};

// Delete admin user
export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const admin = await getAsync('SELECT * FROM admin_users WHERE id = ?', [id]);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    await runAsync('DELETE FROM admin_users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Admin user deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete admin user',
    });
  }
};

// Log admin action
export const logAdminAction = async (req: Request, res: Response) => {
  try {
    const { adminId, action, targetId, targetType, changes, reason, ipAddress } = req.body;

    if (!adminId || !action) {
      return res.status(400).json({
        success: false,
        message: 'adminId and action are required',
      });
    }

    const logId = uuidv4();
    await runAsync(
      `INSERT INTO admin_actions (id, adminId, action, targetId, targetType, changes, reason, ipAddress, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'success')`,
      [logId, adminId, action, targetId, targetType, JSON.stringify(changes), reason, ipAddress]
    );

    res.status(201).json({
      success: true,
      message: 'Admin action logged successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to log admin action',
    });
  }
};

// Get admin action logs
export const getAdminLogs = async (req: Request, res: Response) => {
  try {
    const { adminId, action, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM admin_actions WHERE 1=1';
    const params: any[] = [];

    if (adminId) {
      query += ' AND adminId = ?';
      params.push(adminId);
    }
    if (action) {
      query += ' AND action = ?';
      params.push(action);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const logs = await allAsync(query, params);
    res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin logs',
    });
  }
};

// Get dashboard stats — uses Prisma for full aggregate data
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../database');

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisMonth,
      totalInvestments,
      activeInvestments,
      investmentAmounts,
      activeSignals,
      totalSignals,
      pendingWithdrawals,
      pendingWithdrawalAmount,
      openTickets,
      totalArticles,
      publishedArticles,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.investment.count(),
      prisma.investment.count({ where: { status: 'active' } }),
      prisma.investment.aggregate({
        _sum: { amount: true, roi: true },
        where: { status: 'active' },
      }),
      prisma.signal.count({ where: { status: 'active' } }),
      prisma.signal.count(),
      prisma.withdrawal.count({ where: { status: 'pending' } }),
      prisma.withdrawal.aggregate({
        _sum: { amount: true },
        where: { status: 'pending' },
      }),
      prisma.supportTicket.count({ where: { status: 'open' } }),
      prisma.faqArticle.count(),
      prisma.faqArticle.count({ where: { published: true } }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newToday: newUsersToday,
          newThisMonth: newUsersThisMonth,
        },
        investments: {
          total: totalInvestments,
          active: activeInvestments,
          totalInvestedAmount: Number(investmentAmounts._sum.amount || 0),
          totalProfitDistributed: Number(investmentAmounts._sum.roi || 0),
        },
        signals: {
          total: totalSignals,
          active: activeSignals,
        },
        withdrawals: {
          pending: pendingWithdrawals,
          pendingAmount: Number(pendingWithdrawalAmount._sum.amount || 0),
        },
        support: {
          openTickets,
        },
        blog: {
          total: totalArticles,
          published: publishedArticles,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard stats',
    });
  }
};
