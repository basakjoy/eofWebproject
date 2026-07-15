import express, { Request, Response } from 'express';
import { prisma } from '../database';
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
    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    // Since Prisma Decimal types might not have `returns`, assuming `roi` or similar. Let's look at schema.
    // The schema has `roi` Decimal @default(0)
    // The previous code had `returns`. We'll assume ROI is meant or we adapt. Let's use `roi` as returns representation.
    const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.roi || 0), 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;
    const completedInvestments = investments.filter(inv => inv.status === 'completed').length;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

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
    const { userId, status, plan, limit = '20', offset = '0' } = req.query;
    
    const where: any = {};
    if (userId) where.userId = String(userId);
    if (status) where.status = String(status);
    if (plan) where.plan = String(plan);

    const [investments, total] = await Promise.all([
      prisma.investment.findMany({
        where,
        take: parseInt(String(limit)),
        skip: parseInt(String(offset)),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.investment.count({ where }),
    ]);

    res.json({
      success: true,
      data: investments,
      total,
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
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

    const investment = await prisma.investment.create({
      data: {
        id: investmentId,
        userId,
        amount,
        plan,
        status: 'active',
        roi: estimatedReturns, // We map estimatedReturns to roi
      },
    });

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: investment,
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
    const investment = await prisma.investment.findUnique({
      where: { id: req.params.id },
    });

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

    const existing = await prisma.investment.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    const data: any = {};
    if (status) data.status = status;
    if (returns !== undefined) data.roi = returns;

    await prisma.investment.update({
      where: { id: req.params.id },
      data,
    });

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

    const investments = await prisma.investment.findMany({
      where: { userId },
    });

    const activeCount = investments.filter(i => i.status === 'active').length;
    const completedCount = investments.filter(i => i.status === 'completed').length;
    const totalAmount = investments.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalReturns = investments.reduce((sum, i) => sum + Number(i.roi || 0), 0);
    
    const stats = {
      totalInvestments: investments.length,
      activeCount,
      completedCount,
      totalAmount,
      totalReturns,
      avgReturnRate: totalAmount > 0 ? (totalReturns / totalAmount) : 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch investment stats',
    });
  }
});

// ─── Distribute monthly profit (Admin action) ────────────────────────────────
// POST /api/investments/distribute-profit
// Body: { profitPercent: number (default 50), adminId: string, note?: string }
router.post('/distribute-profit', async (req: AuthRequest, res: Response) => {
  try {
    const { profitPercent = 50, adminId, note } = req.body;

    if (!adminId) {
      return res.status(400).json({ success: false, message: 'adminId is required' });
    }

    const pct = Number(profitPercent);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      return res.status(400).json({ success: false, message: 'profitPercent must be between 1 and 100' });
    }

    // Fetch all active investments
    const activeInvestments = await prisma.investment.findMany({
      where: { status: 'active' },
      include: { user: true },
    });

    if (activeInvestments.length === 0) {
      return res.json({ success: true, message: 'No active investments to distribute profit to', data: { distributed: 0 } });
    }

    const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const distributions: { userId: string; investmentId: string; amount: number }[] = [];

    // Process each investment in a transaction
    await prisma.$transaction(async (tx) => {
      for (const inv of activeInvestments) {
        const profitAmount = Number(inv.amount) * (pct / 100);

        // Update investment roi
        await tx.investment.update({
          where: { id: inv.id },
          data: { roi: { increment: profitAmount } },
        });

        // Create a profit transaction record
        await tx.transaction.create({
          data: {
            id: uuidv4(),
            userId: inv.userId,
            type: 'profit',
            amount: profitAmount,
            description: `${pct}% monthly profit share for ${month}${note ? ` — ${note}` : ''}`,
            status: 'completed',
          },
        });

        distributions.push({ userId: inv.userId, investmentId: inv.id, amount: profitAmount });
      }
    });

    const totalDistributed = distributions.reduce((s, d) => s + d.amount, 0);

    res.json({
      success: true,
      message: `Profit distributed successfully to ${distributions.length} investors`,
      data: {
        distributed: distributions.length,
        totalAmount: totalDistributed,
        profitPercent: pct,
        month,
        distributions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to distribute profit' });
  }
});

export default router;
