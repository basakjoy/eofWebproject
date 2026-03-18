import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest extends Request {
  user?: any;
}

// Get all withdrawals
export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const { status, userId, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM withdrawals WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const withdrawals = await allAsync(query, params);
    res.json({
      success: true,
      data: withdrawals,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawals',
    });
  }
};

// Get withdrawal by ID
export const getWithdrawalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);
    
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    res.json({ success: true, data: withdrawal });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal',
    });
  }
};

// Request withdrawal
export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency = 'USD', method, accountId, reason } = req.body;
    const userId = req.user?.userId;

    if (!amount || !method) {
      return res.status(400).json({
        success: false,
        message: 'amount and method are required',
      });
    }

    // Check withdrawal limit
    const limit = await getAsync(
      'SELECT * FROM withdrawal_limits WHERE userId = ?',
      [userId]
    );

    if (limit && (limit.remainingDaily < amount || limit.remainingMonthly < amount)) {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal exceeds your limit',
      });
    }

    const withdrawalId = uuidv4();
    await runAsync(
      `INSERT INTO withdrawals (id, userId, amount, currency, method, destinationDetails, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [withdrawalId, userId, amount, currency, method, accountId, reason]
    );

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: { id: withdrawalId, status: 'pending' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to request withdrawal',
    });
  }
};

// Approve withdrawal
export const approveWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;
    const adminId = req.user?.userId;

    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    await runAsync(
      `UPDATE withdrawals SET status = 'approved', transactionId = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [transactionId || null, adminId, id]
    );

    res.json({ success: true, message: 'Withdrawal approved successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve withdrawal',
    });
  }
};

// Reject withdrawal
export const rejectWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user?.userId;

    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    await runAsync(
      `UPDATE withdrawals SET status = 'rejected', rejectionReason = ?, approvedBy = ?
       WHERE id = ?`,
      [rejectionReason, adminId, id]
    );

    res.json({ success: true, message: 'Withdrawal rejected successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject withdrawal',
    });
  }
};

// Complete withdrawal
export const completeWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    await runAsync(
      `UPDATE withdrawals SET status = 'completed', completedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    res.json({ success: true, message: 'Withdrawal completed successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete withdrawal',
    });
  }
};

// Add withdrawal method
export const addWithdrawalMethod = async (req: Request, res: Response) => {
  try {
    const { name, code, minAmount, maxAmount, fee, processingTime } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'name and code are required',
      });
    }

    const methodId = uuidv4();
    await runAsync(
      `INSERT INTO withdrawal_methods (id, name, code, minAmount, maxAmount, fee, processingTime)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [methodId, name, code, minAmount, maxAmount, fee, processingTime]
    );

    res.status(201).json({
      success: true,
      message: 'Withdrawal method added successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add withdrawal method',
    });
  }
};

// Get withdrawal methods
export const getWithdrawalMethods = async (req: Request, res: Response) => {
  try {
    const methods = await allAsync('SELECT * FROM withdrawal_methods WHERE available = 1');
    res.json({ success: true, data: methods });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal methods',
    });
  }
};

// Get user withdrawal accounts
export const getUserWithdrawalAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const accounts = await allAsync(
      'SELECT * FROM user_withdrawal_accounts WHERE userId = ?',
      [userId]
    );

    res.json({ success: true, data: accounts });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal accounts',
    });
  }
};

// Get withdrawal report
export const getWithdrawalReport = async (req: Request, res: Response) => {
  try {
    const { period = 'monthly' } = req.query;

    const report = await getAsync(
      'SELECT * FROM withdrawal_reports WHERE period = ? ORDER BY createdAt DESC LIMIT 1',
      [period]
    );

    res.json({
      success: true,
      data: report || { message: 'No report available for this period' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal report',
    });
  }
};
