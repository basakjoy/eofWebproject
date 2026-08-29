import { Request, Response } from 'express';
import { prisma } from '../database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Get all admin users
export const getAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
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
    const admin = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
    
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
    const { email, password, name, role = 'user' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and password are required',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email is already registered' });

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 12), role: String(role).toLowerCase() },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
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
    const { name, role, status } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(role !== undefined ? { role: String(role).toLowerCase() } : {}),
        ...(status !== undefined ? { status: String(status).toLowerCase() } : {}),
      },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
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

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    await prisma.user.delete({ where: { id } });

    res.json({
      success: true,
      message: 'User deleted successfully',
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

    const adminUser = await prisma.adminUser.findFirst({
      where: { OR: [{ id: String(adminId) }, { userId: String(adminId) }] },
    });
    if (!adminUser) return res.status(404).json({ success: false, message: 'Admin profile not found' });

    const log = await prisma.adminAction.create({
      data: {
        id: uuidv4(),
        adminId: adminUser.id,
        action: String(action),
        targetId: targetId ? String(targetId) : null,
        targetType: targetType ? String(targetType) : null,
        changes: changes ? JSON.stringify(changes) : null,
        reason: reason ? String(reason) : null,
        ipAddress: ipAddress ? String(ipAddress) : null,
        status: 'success',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Admin action logged successfully',
      data: log,
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
    const where = {
      ...(adminId ? { adminId: String(adminId) } : {}),
      ...(action ? { action: { contains: String(action), mode: 'insensitive' as const } } : {}),
    };
    const [logs, total] = await Promise.all([
      prisma.adminAction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(Number(limit) || 50, 1), 100),
        skip: Math.max(Number(offset) || 0, 0),
        select: { id: true, adminId: true, action: true, targetId: true, targetType: true, reason: true, status: true, createdAt: true, admin: { select: { user: { select: { name: true, email: true } } } } },
      }),
      prisma.adminAction.count({ where }),
    ]);
    res.json({
      success: true,
      data: logs,
      total,
      limit: Number(limit),
      offset: Number(offset),
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
