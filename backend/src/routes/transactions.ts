import express, { Request, Response } from 'express';
import { allAsync, getAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user transactions
router.get('/user/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { type, status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM transactions WHERE userId = ?';
    const params: any[] = [userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const transactions = await allAsync(query, params);

    // Get count
    const countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE userId = ?' +
      (type ? ' AND type = ?' : '') +
      (status ? ' AND status = ?' : '');
    const countParams = [userId];
    if (type) countParams.push(type as string);
    if (status) countParams.push(status as string);

    const countResult = await getAsync(countQuery, countParams);

    res.json({
      success: true,
      data: transactions,
      total: countResult?.total || 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transactions',
    });
  }
});

// Get all transactions (admin)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];

    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const transactions = await allAsync(query, params);

    res.json({
      success: true,
      data: transactions,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transactions',
    });
  }
});

// Create transaction
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, amount, description, status = 'pending', metadata } = req.body;

    if (!userId || !type || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId, type, and amount are required',
      });
    }

    const transactionId = uuidv4();

    await runAsync(
      `INSERT INTO transactions (
        id, userId, type, amount, description, status, metadata, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        transactionId,
        userId,
        type,
        amount,
        description || '',
        status,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        id: transactionId,
        userId,
        type,
        amount,
        status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create transaction',
    });
  }
});

// Get transaction by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await getAsync('SELECT * FROM transactions WHERE id = ?', [req.params.id]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transaction',
    });
  }
});

// Update transaction status
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;

    const transaction = await getAsync('SELECT * FROM transactions WHERE id = ?', [req.params.id]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
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
      `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Transaction updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update transaction',
    });
  }
});

// Get transaction stats
router.get('/stats/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const stats = await getAsync(
      `SELECT 
        COUNT(*) as totalTransactions,
        SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as totalDeposits,
        SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END) as totalWithdrawals,
        SUM(CASE WHEN type = 'investment' THEN amount ELSE 0 END) as totalInvested,
        SUM(CASE WHEN type = 'profit' THEN amount ELSE 0 END) as totalProfit,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pendingAmount
      FROM transactions WHERE userId = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: stats || {
        totalTransactions: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInvested: 0,
        totalProfit: 0,
        pendingAmount: 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transaction stats',
    });
  }
});

export default router;
