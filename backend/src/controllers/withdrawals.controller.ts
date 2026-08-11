import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest extends Request {
  user?: any;
}

// TODO: align this with however your JWT payload actually signals admin
// access (e.g. req.user.role === 'SUPER_ADMIN', or a permissions array like
// req.user.permissions.includes('MANAGE_WITHDRAWALS')). This mirrors the
// pattern requireWithdrawalAdmin presumably already checks at the route
// level — duplicating a lightweight version here so the controller can also
// tell "is this person allowed to see/act on someone else's withdrawal".
function isWithdrawalAdmin(req: AuthRequest): boolean {
  return (
    req.user?.role === 'SUPER_ADMIN' ||
    req.user?.role === 'ADMIN' ||
    (Array.isArray(req.user?.permissions) &&
      req.user.permissions.includes('MANAGE_WITHDRAWALS'))
  );
}

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'completed'];

// Get all withdrawals (admin-only at the router level)
export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const { status, userId, limit = 20, offset = 0 } = req.query;

    const parsedLimit = Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 100);
    const parsedOffset = Math.max(parseInt(String(offset), 10) || 0, 0);

    if (status && !VALID_STATUSES.includes(String(status))) {
      return res.status(400).json({ success: false, message: 'Invalid status filter' });
    }

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
    params.push(parsedLimit, parsedOffset);

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
export const getWithdrawalById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    // Ownership check: a user may only view their own withdrawal unless they're an admin.
    const isOwner = withdrawal.userId === req.user?.userId;
    if (!isOwner && !isWithdrawalAdmin(req)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
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

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!amount || !method) {
      return res.status(400).json({
        success: false,
        message: 'amount and method are required',
      });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'amount must be a positive number',
      });
    }

    // Verify the withdrawal method exists and is currently available —
    // previously any string was accepted with no check against real methods.
    const methodRecord = await getAsync(
      'SELECT * FROM withdrawal_methods WHERE code = ? AND available = 1',
      [method]
    );
    if (!methodRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or unavailable withdrawal method' });
    }
    if (
      (methodRecord.minAmount != null && numericAmount < methodRecord.minAmount) ||
      (methodRecord.maxAmount != null && numericAmount > methodRecord.maxAmount)
    ) {
      return res.status(400).json({
        success: false,
        message: `Amount must be between ${methodRecord.minAmount} and ${methodRecord.maxAmount} for this method`,
      });
    }

    // IDOR fix: verify the destination account actually belongs to the
    // requesting user — previously accountId was trusted straight from the
    // request body, letting a user withdraw to someone else's payout account.
    if (accountId) {
      const account = await getAsync(
        'SELECT * FROM user_withdrawal_accounts WHERE id = ? AND userId = ?',
        [accountId, userId]
      );
      if (!account) {
        return res.status(403).json({ success: false, message: 'Withdrawal account not found or not owned by you' });
      }
    }

    // Check withdrawal limit
    const limit = await getAsync(
      'SELECT * FROM withdrawal_limits WHERE userId = ?',
      [userId]
    );

    if (limit && (limit.remainingDaily < numericAmount || limit.remainingMonthly < numericAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal exceeds your limit',
      });
    }

    const withdrawalId = uuidv4();
    await runAsync(
      `INSERT INTO withdrawals (id, userId, amount, currency, method, destinationDetails, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [withdrawalId, userId, numericAmount, currency, method, accountId, reason]
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

    // Conflict of interest: an admin may not approve their own withdrawal request.
    if (withdrawal.userId === adminId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot approve your own withdrawal request',
      });
    }

    // State machine: only a pending withdrawal can be approved.
    if (withdrawal.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Cannot approve a withdrawal with status '${withdrawal.status}'`,
      });
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

    if (!rejectionReason || !String(rejectionReason).trim()) {
      return res.status(400).json({ success: false, message: 'rejectionReason is required' });
    }

    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    // State machine: only a pending withdrawal can be rejected.
    if (withdrawal.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Cannot reject a withdrawal with status '${withdrawal.status}'`,
      });
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
export const completeWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const withdrawal = await getAsync('SELECT * FROM withdrawals WHERE id = ?', [id]);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    // State machine: a withdrawal must be approved before it can be completed.
    // Previously any withdrawal — pending, rejected, whatever — could be marked
    // completed directly, skipping the approval step entirely.
    if (withdrawal.status !== 'approved') {
      return res.status(409).json({
        success: false,
        message: `Cannot complete a withdrawal with status '${withdrawal.status}'`,
      });
    }

    await runAsync(
      `UPDATE withdrawals SET status = 'completed', completedAt = CURRENT_TIMESTAMP, completedBy = ?
       WHERE id = ?`,
      [req.user?.userId ?? null, id]
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

    const numMin = minAmount != null ? Number(minAmount) : null;
    const numMax = maxAmount != null ? Number(maxAmount) : null;
    const numFee = fee != null ? Number(fee) : null;

    if (numMin != null && (!Number.isFinite(numMin) || numMin < 0)) {
      return res.status(400).json({ success: false, message: 'minAmount must be a non-negative number' });
    }
    if (numMax != null && (!Number.isFinite(numMax) || numMax < 0)) {
      return res.status(400).json({ success: false, message: 'maxAmount must be a non-negative number' });
    }
    if (numMin != null && numMax != null && numMin > numMax) {
      return res.status(400).json({ success: false, message: 'minAmount cannot exceed maxAmount' });
    }
    if (numFee != null && (!Number.isFinite(numFee) || numFee < 0)) {
      return res.status(400).json({ success: false, message: 'fee must be a non-negative number' });
    }

    const existing = await getAsync('SELECT id FROM withdrawal_methods WHERE code = ?', [code]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A withdrawal method with this code already exists' });
    }

    const methodId = uuidv4();
    await runAsync(
      `INSERT INTO withdrawal_methods (id, name, code, minAmount, maxAmount, fee, processingTime)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [methodId, name, code, numMin, numMax, numFee, processingTime]
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