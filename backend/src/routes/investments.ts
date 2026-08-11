import express, { Request, Response } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { verifyToken } from '../middleware/auth';
import { requireRole } from '../middleware/auth'; // adjust import path to match your project
import rateLimit from 'express-rate-limit';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

const handleError = (res: Response, error: any, fallbackMessage: string) => {
  console.error(fallbackMessage, error);
  res.status(500).json({ success: false, message: fallbackMessage });
};

// Only admins should ever bulk-view or manage other users' investments
const isSelfOrAdmin = (req: AuthRequest, targetUserId: string) => {
  const role = req.user?.role;
  return req.user?.userId === targetUserId || role === 'SUPER_ADMIN' || role === 'SIGNAL_ADMIN';
};

const distributeProfitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3, // this is a destructive/costly financial action — keep it tight
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many distribution attempts, try again later' },
});

// All routes below require authentication
router.use(verifyToken);

// ─── Portfolio overview ──────────────────────────────────────────────
router.get('/portfolio/overview/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this portfolio' });
    }

    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.roi || 0), 0);
    const activeInvestments = investments.filter((inv) => inv.status === 'active').length;
    const completedInvestments = investments.filter((inv) => inv.status === 'completed').length;

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
    handleError(res, error, 'Failed to fetch portfolio overview');
  }
});


router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, plan } = req.query;
    const limit = Math.min(parseInt(String(req.query.limit)) || 20, 100);
    const offset = Math.max(parseInt(String(req.query.offset)) || 0, 0);

    const role = req.user?.role;
    const isAdmin = role === 'SUPER_ADMIN' || role === 'SIGNAL_ADMIN';

    const where: any = {};
    if (isAdmin && req.query.userId) {
      where.userId = String(req.query.userId);
    } else {
      
      where.userId = req.user.userId;
    }
    if (status) where.status = String(status);
    if (plan) where.plan = String(plan);

    const [investments, total] = await Promise.all([
      prisma.investment.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.investment.count({ where }),
    ]);

    res.json({ success: true, data: investments, total, limit, offset });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch investments');
  }
});

// Create investment
const createInvestmentSchema = z.object({
  amount: z.number().min(100, 'Minimum investment amount is $100'),
  plan: z.string().trim().min(1),
  duration: z.number().int().positive(),
  returnRate: z.number().min(0).max(5).optional(), // cap return rate to a sane range you define
}).strict();

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createInvestmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Invalid investment data',
      });
    }

    const { amount, plan, duration, returnRate = 0.5 } = parsed.data;
    
    const userId = req.user.userId;

    const investmentId = uuidv4();
    const estimatedReturns = amount * returnRate * duration;

    const investment = await prisma.investment.create({
      data: {
        id: investmentId,
        userId,
        amount,
        plan,
        status: 'active',
        roi: estimatedReturns,
      },
    });

    res.status(201).json({ success: true, message: 'Investment created successfully', data: investment });
  } catch (error: any) {
    handleError(res, error, 'Failed to create investment');
  }
});

// Get investment by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const investment = await prisma.investment.findUnique({ where: { id: req.params.id } });

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    if (!isSelfOrAdmin(req, investment.userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this investment' });
    }

    res.json({ success: true, data: investment });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch investment');
  }
});

//  Update investment status — admin only 

const updateInvestmentSchema = z.object({
  status: z.enum(['active', 'completed', 'cancelled', 'paused']).optional(),
  returns: z.number().optional(),
  notes: z.string().max(500).optional(),
}).strict();

router.put('/:id', requireRole(['SUPER_ADMIN', 'SIGNAL_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateInvestmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Invalid update data',
      });
    }

    const existing = await prisma.investment.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    const { status, returns } = parsed.data;
    const data: any = {};
    if (status) data.status = status;
    if (returns !== undefined) data.roi = returns;

    await prisma.investment.update({ where: { id: req.params.id }, data });

    res.json({ success: true, message: 'Investment updated successfully' });
  } catch (error: any) {
    handleError(res, error, 'Failed to update investment');
  }
});

//  Investment stats
router.get('/stats/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these stats' });
    }

    const investments = await prisma.investment.findMany({ where: { userId } });

    const activeCount = investments.filter((i) => i.status === 'active').length;
    const completedCount = investments.filter((i) => i.status === 'completed').length;
    const totalAmount = investments.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalReturns = investments.reduce((sum, i) => sum + Number(i.roi || 0), 0);

    res.json({
      success: true,
      data: {
        totalInvestments: investments.length,
        activeCount,
        completedCount,
        totalAmount,
        totalReturns,
        avgReturnRate: totalAmount > 0 ? totalReturns / totalAmount : 0,
      },
    });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch investment stats');
  }
});

// ─── Distribute monthly profit — SUPER_ADMIN only, rate-limited, idempotent ──
const distributeProfitSchema = z.object({
  profitPercent: z.number().min(1).max(100).optional().default(50),
  note: z.string().max(200).optional(),
}).strict();

router.post(
  '/distribute-profit',
  requireRole(['SUPER_ADMIN']),
  distributeProfitLimiter,
  async (req: AuthRequest, res: Response) => {
    try {
      const parsed = distributeProfitSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid distribution data',
        });
      }

      const { profitPercent: pct, note } = parsed.data;
      const adminId = req.user.userId; // trust the token, never the body

      const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

      // Idempotency guard: refuse to run twice for the same month
      const alreadyDistributed = await prisma.transaction.findFirst({
        where: {
          type: 'profit',
          description: { contains: `for ${month}` },
        },
      });
      if (alreadyDistributed) {
        return res.status(409).json({
          success: false,
          message: `Profit has already been distributed for ${month}`,
        });
      }

      const activeInvestments = await prisma.investment.findMany({
        where: { status: 'active' },
        include: { user: true },
      });

      if (activeInvestments.length === 0) {
        return res.json({
          success: true,
          message: 'No active investments to distribute profit to',
          data: { distributed: 0 },
        });
      }

      const distributions: { userId: string; investmentId: string; amount: number }[] = [];

      await prisma.$transaction(async (tx) => {
        for (const inv of activeInvestments) {
          const profitAmount = Number(inv.amount) * (pct / 100);

          await tx.investment.update({
            where: { id: inv.id },
            data: { roi: { increment: profitAmount } },
          });

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

      // Audit log — critical for a financial action like this
      console.log(`[AUDIT] Profit distribution executed by admin ${adminId}: ${pct}% to ${distributions.length} investors, total $${totalDistributed}, month: ${month}`);

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
      handleError(res, error, 'Failed to distribute profit');
    }
  }
);

export default router;
