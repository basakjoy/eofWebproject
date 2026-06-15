 import express, { Request, Response } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user transactions
router.get('/user/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { type, status, limit = '50', offset = '0' } = req.query;

    const where: any = { userId };
    if (type) where.type = String(type);
    if (status) where.status = String(status);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        take: parseInt(String(limit)),
        skip: parseInt(String(offset)),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: transactions,
      total,
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
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
    const { userId, type, status, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (userId) where.userId = String(userId);
    if (type) where.type = String(type);
    if (status) where.status = String(status);

    const transactions = await prisma.transaction.findMany({
      where,
      take: parseInt(String(limit)),
      skip: parseInt(String(offset)),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    res.json({
      success: true,
      data: transactions,
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
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

    const transaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        userId,
        type,
        amount,
        description: description || '',
        status,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
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
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });

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

    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const data: any = {};
    if (status) data.status = status;
    if (notes) data.metadata = JSON.stringify({ notes }); // Hack: update metadata with notes if it doesn't exist natively.

    await prisma.transaction.update({
      where: { id: req.params.id },
      data,
    });

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

    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const totalTransactions = transactions.length;
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
        totalTransactions,
        totalDeposits,
        totalWithdrawals,
        totalInvested,
        totalProfit,
        pendingAmount,
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
