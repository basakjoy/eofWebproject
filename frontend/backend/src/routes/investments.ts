import express, { Request, Response } from 'express';
import { allAsync, getAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user's portfolio overview
router.get('/portfolio/overview/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Get all investments for user
    const investments = await allAsync(
      `SELECT * FROM investments WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );

    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + (inv.returns || 0), 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;
    const completedInvestments = investments.filter(inv => inv.status === 'completed').length;

    // Get transactions
    const transactions = await allAsync(
      `SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 10`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        totalInvested,
        totalReturns,
        roi: totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : '0.00',
        activeInvestments,
        completedInvestments,
        investments,
        recentTransactions: transactions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch portfolio overview',
    });
  }
});

// Get all investments with pagination & filtering
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, status, plan, limit = 20, offset = 0 } = req.query;
    let query = 'SELECT * FROM investments WHERE 1=1';
    const params: any[] = [];

    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (plan) {
      query += ' AND plan = ?';
      params.push(plan);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const investments = await allAsync(query, params);
    
    // Get count
    const countQuery = 'SELECT COUNT(*) as total FROM investments WHERE 1=1' + 
      (userId ? ' AND userId = ?' : '') + 
      (status ? ' AND status = ?' : '') + 
      (plan ? ' AND plan = ?' : '');
    const countRows = await allAsync(countQuery, params.slice(0, params.length - 2));

    res.json({
      success: true,
      data: investments,
      total: countRows[0]?.total || 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch investments',
    });
  }
});

// Create investment
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, plan, duration, returnRate = 0.5 } = req.body;

    if (!userId || !amount || !plan || !duration) {
      return res.status(400).json({
        success: false,
        message: 'userId, amount, plan, and duration are required',
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum investment amount is $100',
      });
    }

    const investmentId = uuidv4();
    const durationMonths = parseInt(duration);
    const estimatedReturns = amount * returnRate * durationMonths;
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + durationMonths);

    await runAsync(
      `INSERT INTO investments (
        id, userId, amount, plan, duration, status, returnRate, 
        estimatedReturns, startDate, completionDate, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, datetime('now'), datetime('now'))`,
      [
        investmentId,
        userId,
        amount,
        plan,
        durationMonths,
        'active',
        returnRate,
        estimatedReturns,
        completionDate.toISOString(),
      ]
    );

    // Log transaction
    const transactionId = uuidv4();
    await runAsync(
      `INSERT INTO transactions (
        id, userId, type, amount, description, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        transactionId,
        userId,
        'investment',
        amount,
        `Investment in ${plan} plan`,
        'completed',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: {
        id: investmentId,
        userId,
        amount,
        plan,
        duration: durationMonths,
        estimatedReturns: estimatedReturns.toFixed(2),
        status: 'active',
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create investment',
    });
  }
});

// Get investment by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const investment = await getAsync('SELECT * FROM investments WHERE id = ?', [req.params.id]);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    res.json({
      success: true,
      data: investment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch investment',
    });
  }
});

// Update investment status
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { status, returns, notes } = req.body;

    const investment = await getAsync('SELECT * FROM investments WHERE id = ?', [req.params.id]);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (returns !== undefined) {
      updates.push('returns = ?');
      params.push(returns);
    }

    if (notes) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided',
      });
    }

    updates.push('updatedAt = datetime("now")');
    params.push(req.params.id);

    await runAsync(
      `UPDATE investments SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Investment updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update investment',
    });
  }
});

// Get investment stats
router.get('/stats/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const stats = await getAsync(
      `SELECT 
        COUNT(*) as totalInvestments,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeCount,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedCount,
        SUM(amount) as totalAmount,
        SUM(returns) as totalReturns,
        AVG(returnRate) as avgReturnRate
      FROM investments WHERE userId = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: stats || {
        totalInvestments: 0,
        activeCount: 0,
        completedCount: 0,
        totalAmount: 0,
        totalReturns: 0,
        avgReturnRate: 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch investment stats',
    });
  }
});

export default router;
