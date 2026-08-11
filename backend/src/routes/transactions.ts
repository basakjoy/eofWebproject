import express, { Request, Response } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { verifyToken } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

const handleError = (res: Response, error: any, fallbackMessage: string) => {
  console.error(fallbackMessage, error);
  res.status(500).json({ success: false, message: fallbackMessage });
};

const isSelfOrAdmin = (req: AuthRequest, targetUserId: string) => {
  const role = req.user?.role;
  return req.user?.userId === targetUserId || role === 'SUPER_ADMIN' || role === 'SIGNAL_ADMIN';
};

const createTransactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many transaction requests, try again later' },
});


// All routes require authentication
router.use(verifyToken);

// ─── Get a specific user's transactions ────────────────────────────────
router.get('/user/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these transactions' });
    }

    const { type, status } = req.query;
    const limit = Math.min(parseInt(String(req.query.limit)) || 50, 100);
    const offset = Math.max(parseInt(String(req.query.offset)) || 0, 0);

    const where: any = { userId };
    if (type) where.type = String(type);
    if (status) where.status = String(status);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
      prisma.transaction.count({ where }),
    ]);

    res.json({ success: true, data: transactions, total, limit, offset });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch transactions');
  }
});

// ─── Get all transactions — admin only ─────────────────────────────────
router.get('/', requireRole(['SUPER_ADMIN', 'SIGNAL_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, status } = req.query;
    const limit = Math.min(parseInt(String(req.query.limit)) || 50, 100);
    const offset = Math.max(parseInt(String(req.query.offset)) || 0, 0);

    const where: any = {};
    if (userId) where.userId = String(userId);
    if (type) where.type = String(type);
    if (status) where.status = String(status);

    const transactions = await prisma.transaction.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({ success: true, data: transactions, limit, offset });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch transactions');
  }
});

// ─── Create transaction ─────────────────────────────────────────────────
// Regular users may only request deposits/withdrawals, always in 'pending'
// status — real confirmation must happen via your payment webhook / admin
// action, never directly from client input.
const createTransactionSchema = z.object({
  type: z.enum(['deposit', 'withdrawal']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().max(500).optional(),
  metadata: z.record(z.any()).optional(),
}).strict();

router.post('/', createTransactionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Invalid transaction data',
      });
    }

    const { type, amount, description, metadata } = parsed.data;
    const userId = req.user.userId; // never trust body userId
    const transactionId = uuidv4();

    const transaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        userId,
        type,
        amount,
        description: description || '',
        status: 'pending', // always pending on creation — confirmed via a separate admin/webhook flow
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    res.status(201).json({ success: true, message: 'Transaction created successfully', data: transaction });
  } catch (error: any) {
    handleError(res, error, 'Failed to create transaction');
  }
});

// ─── Get transaction by ID ───────────────────────────────────────────────
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id: req.params.id } });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (!isSelfOrAdmin(req, transaction.userId)) {
      return res.status(404).json({ success: false, message: 'Transaction not found' }); // 404 not 403 — don't confirm existence
    }

    res.json({ success: true, data: transaction });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch transaction');
  }
});

// ─── Update transaction status — admin only ──────────────────────────────
// Status changes (pending -> completed/failed) represent real money moving.
// This must never be user-controllable.
const updateTransactionSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
  notes: z.string().max(1000).optional(),
}).strict();

router.put('/:id', requireRole(['SUPER_ADMIN', 'SIGNAL_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Invalid update data',
      });
    }

    const transaction = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const { status, notes } = parsed.data;
    const data: any = {};
    if (status) data.status = status;
    if (notes) data.metadata = JSON.stringify({ notes });

    await prisma.transaction.update({ where: { id: req.params.id }, data });

    // Audit log for financial state changes
    console.log(`[AUDIT] Transaction ${req.params.id} updated by admin ${req.user.userId}: status -> ${status}`);

    res.json({ success: true, message: 'Transaction updated successfully' });
  } catch (error: any) {
    handleError(res, error, 'Failed to update transaction');
  }
});

// ─── Transaction stats ────────────────────────────────────────────────────
router.get('/stats/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these stats' });
    }

    const transactions = await prisma.transaction.findMany({ where: { userId } });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalInvested = 0;
    let totalProfit = 0;
    let pendingAmount = 0;

    for (const t of transactions) {
      const amt = Number(t.amount);
      if (t.type === 'deposit') totalDeposits += amt;
      else if (t.type === 'withdrawal') totalWithdrawals += amt;
      else if (t.type === 'investment') totalInvested += amt;
      else if (t.type === 'profit') totalProfit += amt;
      if (t.status === 'pending') pendingAmount += amt;
    }

    res.json({
      success: true,
      data: {
        totalTransactions: transactions.length,
        totalDeposits,
        totalWithdrawals,
        totalInvested,
        totalProfit,
        pendingAmount,
      },
    });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch transaction stats');
  }
});

export default router;