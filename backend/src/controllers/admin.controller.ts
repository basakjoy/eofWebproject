import { Request, Response } from 'express';
import { prisma } from '../database';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const dashboardPeriods = [
  { key: 'today', label: 'Today', start: (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate()), end: (now: Date) => now },
  { key: 'yesterday', label: 'Yesterday', start: (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), end: (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
  { key: 'thisWeek', label: 'This Week', start: (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)), end: (now: Date) => now },
  { key: 'lastWeek', label: 'Last Week', start: (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) - 7), end: (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)) },
  { key: 'thisMonth', label: 'This Month', start: (now: Date) => new Date(now.getFullYear(), now.getMonth(), 1), end: (now: Date) => now },
  { key: 'lastMonth', label: 'Last Month', start: (now: Date) => new Date(now.getFullYear(), now.getMonth() - 1, 1), end: (now: Date) => new Date(now.getFullYear(), now.getMonth(), 1) },
];

const inPeriod = (date: Date, period: typeof dashboardPeriods[number], now: Date) => date >= period.start(now) && date < period.end(now);

// Get all admin users
export const getAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
      }),
      prisma.user.count(),
    ]);
    res.json({
      success: true,
      data: users,
      total,
      limit,
      offset,
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
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodValues = Prisma.join(dashboardPeriods.map(period => Prisma.sql`(${period.label}, ${period.start(now)}, ${period.end(now)})`));

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
      transactionRows,
      withdrawalRows,
      userRows,
      firstDepositRows,
      pendingDeposits,
      pendingDepositAmount,
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
      prisma.$queryRaw<Array<{ period: string; type: string; count: number; amount: number }>>(Prisma.sql`
        WITH periods(label, starts_at, ends_at) AS (VALUES ${periodValues})
        SELECT p.label AS period, t.type, COUNT(t.id)::int AS count,
          COALESCE(SUM(t.amount), 0)::float8 AS amount
        FROM periods p
        LEFT JOIN transactions t ON t."createdAt" >= p.starts_at AND t."createdAt" < p.ends_at AND t.status = 'completed'
        GROUP BY p.label, t.type
      `),
      prisma.$queryRaw<Array<{ period: string; count: number; amount: number }>>(Prisma.sql`
        WITH periods(label, starts_at, ends_at) AS (VALUES ${periodValues})
        SELECT p.label AS period, COUNT(w.id)::int AS count,
          COALESCE(SUM(w.amount), 0)::float8 AS amount
        FROM periods p
        LEFT JOIN withdrawals w ON w."createdAt" >= p.starts_at AND w."createdAt" < p.ends_at
        GROUP BY p.label
      `),
      prisma.$queryRaw<Array<{ period: string; count: number }>>(Prisma.sql`
        WITH periods(label, starts_at, ends_at) AS (VALUES ${periodValues})
        SELECT p.label AS period, COUNT(u.id)::int AS count
        FROM periods p
        LEFT JOIN users u ON u."createdAt" >= p.starts_at AND u."createdAt" < p.ends_at
        GROUP BY p.label
      `),
      prisma.$queryRaw<Array<{ period: string; count: number; amount: number }>>(Prisma.sql`
        WITH periods(label, starts_at, ends_at) AS (VALUES ${periodValues}),
        first_deposits AS (
          SELECT DISTINCT ON ("userId") "userId", amount, "createdAt"
          FROM transactions
          WHERE type = 'deposit' AND status = 'completed'
          ORDER BY "userId", "createdAt" ASC
        )
        SELECT p.label AS period, COUNT(fd."userId")::int AS count,
          COALESCE(SUM(fd.amount), 0)::float8 AS amount
        FROM periods p
        LEFT JOIN first_deposits fd ON fd."createdAt" >= p.starts_at AND fd."createdAt" < p.ends_at
        GROUP BY p.label
      `),
      prisma.transaction.count({ where: { type: 'deposit', status: 'pending' } }),
      prisma.transaction.aggregate({ where: { type: 'deposit', status: 'pending' }, _sum: { amount: true } }),
    ]);

    const periodTransactions = (type: string) => dashboardPeriods.map(period => {
      const row = transactionRows.find(item => item.period === period.label && item.type === type);
      return { period: period.label, count: Number(row?.count || 0), amount: Number(row?.amount || 0) };
    });
    const periodWithdrawals = dashboardPeriods.map(period => {
      const row = withdrawalRows.find(item => item.period === period.label);
      return { period: period.label, count: Number(row?.count || 0), amount: Number(row?.amount || 0) };
    });
    const periodUsers = dashboardPeriods.map(period => ({
      period: period.label,
      count: Number(userRows.find(item => item.period === period.label)?.count || 0),
    }));
    const periodFirstDeposits = dashboardPeriods.map(period => {
      const row = firstDepositRows.find(item => item.period === period.label);
      return { period: period.label, count: Number(row?.count || 0), amount: Number(row?.amount || 0) };
    });
    const profitRows = periodTransactions('profit');
    const turnoverRows = dashboardPeriods.map(period => {
      const rows = transactionRows.filter(item => item.period === period.label);
      return { period: period.label, count: rows.reduce((sum, item) => sum + Number(item.count), 0), amount: rows.reduce((sum, item) => sum + Number(item.amount), 0) };
    });
    const marginRows = profitRows.map((row, index) => ({
      period: row.period,
      count: row.count,
      margin: turnoverRows[index].amount ? `${((row.amount / turnoverRows[index].amount) * 100).toFixed(2)}%` : '0%',
    }));

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
        activity: {
          deposits: { pending: pendingDeposits, pendingAmount: Number(pendingDepositAmount._sum.amount || 0), rows: periodTransactions('deposit') },
          withdrawals: { rows: periodWithdrawals },
          registeredUsers: periodUsers,
          firstDeposits: periodFirstDeposits,
          bonuses: periodTransactions('bonus'),
          winLoss: profitRows,
          turnover: turnoverRows,
          grossMargin: marginRows,
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
