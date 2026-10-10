import express, { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { verifyToken } from '../middleware/auth';
import { requireRole } from '../middleware/auth'; // adjust import path to match your project
import rateLimit from 'express-rate-limit';
import { createSharedRateLimitStore } from '../middleware/rateLimiter';

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
  store: createSharedRateLimitStore('rl:profit-distribution:'),
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

    const [investments, totals, counts, transactions] = await Promise.all([
      prisma.investment.findMany({ where: { userId }, take: 100, orderBy: { createdAt: 'desc' } }),
      prisma.investment.aggregate({ where: { userId }, _sum: { amount: true, roi: true } }),
      prisma.investment.groupBy({ by: ['status'], where: { userId }, _count: { _all: true } }),
      prisma.transaction.findMany({ where: { userId }, take: 10, orderBy: { createdAt: 'desc' } }),
    ]);

    const totalInvested = Number(totals._sum.amount || 0);
    const totalReturns = Number(totals._sum.roi || 0);
    const activeInvestments = counts.find((item) => item.status === 'active')?._count._all || 0;
    const completedInvestments = counts.find((item) => item.status === 'completed')?._count._all || 0;

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
    const offset = Math.min(Math.max(parseInt(String(req.query.offset)) || 0, 0), 10_000);

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
  amount: z.coerce.number().finite().min(100, 'Minimum investment amount is $100').max(10_000_000),
  plan: z.string().trim().min(1).max(100),
  duration: z.coerce.number().int().positive().max(1200),
  returnRate: z.coerce.number().min(0).max(5).optional(),
}).strict();

router.post('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const idempotencyKey = req.get('Idempotency-Key');
  if (idempotencyKey && !/^[\x21-\x7E]{8,128}$/.test(idempotencyKey)) {
    return res.status(400).json({ success: false, message: 'Invalid Idempotency-Key' });
  }

  try {
    const parsed = createInvestmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Invalid investment data',
      });
    }

    const { amount, plan, duration, returnRate = 0.5 } = parsed.data;

    if (idempotencyKey) {
      const previous = await prisma.transaction.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey } },
      });
      if (previous) {
        let previousMetadata: { investmentId?: string; plan?: string } = {};
        try { previousMetadata = JSON.parse(previous.metadata || '{}'); } catch { /* ignore malformed legacy data */ }
        if (previous.type !== 'investment' || Number(previous.amount) !== amount || previousMetadata.plan !== plan) {
          return res.status(409).json({ success: false, message: 'Idempotency key was already used for a different request' });
        }
        const previousInvestment = previousMetadata.investmentId
          ? await prisma.investment.findUnique({ where: { id: previousMetadata.investmentId } })
          : null;
        if (!previousInvestment) return res.status(409).json({ success: false, message: 'Original investment is unavailable' });
        return res.json({ success: true, message: 'Investment already created', data: previousInvestment });
      }
    }

    const investmentId = randomUUID();
    const estimatedReturns = amount * returnRate * duration;

    const investment = await prisma.$transaction(async (tx) => {
      const createdInvestment = await tx.investment.create({
        data: { id: investmentId, userId, amount, plan, status: 'active', roi: estimatedReturns },
      });
      await tx.transaction.create({
        data: {
          id: randomUUID(),
          userId,
          idempotencyKey,
          type: 'investment',
          amount,
          description: `Investment created for ${plan}`,
          status: 'completed',
          metadata: JSON.stringify({ investmentId: createdInvestment.id, plan, duration, returnRate, roi: estimatedReturns }),
        },
      });
      return createdInvestment;
    });

    res.status(201).json({ success: true, message: 'Investment created successfully', data: investment });
  } catch (error: any) {
    if (idempotencyKey && error?.code === 'P2002') {
      const previous = await prisma.transaction.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey } },
      });
      if (previous?.type === 'investment' && Number(previous.amount) === Number(req.body?.amount)) {
        let metadata: { investmentId?: string } = {};
        try { metadata = JSON.parse(previous.metadata || '{}'); } catch { /* ignore malformed legacy data */ }
        const existingInvestment = metadata.investmentId
          ? await prisma.investment.findUnique({ where: { id: metadata.investmentId } })
          : null;
        if (existingInvestment) return res.json({ success: true, message: 'Investment already created', data: existingInvestment });
      }
    }
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
  profitPercent: z.number().min(0).max(100).optional(),
  profitAmount: z.number().min(0).optional(),
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

    const { status, returns, profitPercent, profitAmount } = parsed.data;
    const data: any = {};
    if (status) data.status = status;
    if (returns !== undefined) data.roi = returns;
    if (profitPercent !== undefined) {
      data.roi = Number(existing.amount) * (profitPercent / 100);
    }
    if (profitAmount !== undefined) {
      data.roi = profitAmount;
    }

    const updatedInvestment = await prisma.investment.update({ where: { id: req.params.id }, data });

    res.json({
      success: true,
      message: 'Investment updated successfully',
      data: updatedInvestment,
    });
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

    const investmentGroups = await prisma.investment.groupBy({
      by: ['status'],
      where: { userId },
      _sum: { amount: true, roi: true },
      _count: { _all: true },
    });
    const totalInvestments = investmentGroups.reduce((sum, group) => sum + group._count._all, 0);
    const activeCount = investmentGroups.find((group) => group.status === 'active')?._count._all || 0;
    const completedCount = investmentGroups.find((group) => group.status === 'completed')?._count._all || 0;
    const totalAmount = investmentGroups.reduce((sum, group) => sum + Number(group._sum.amount || 0), 0);
    const totalReturns = investmentGroups.reduce((sum, group) => sum + Number(group._sum.roi || 0), 0);

    res.json({
      success: true,
      data: {
        totalInvestments,
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
  profitPercent: z.number().finite().min(1).max(100).optional().default(50),
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
      const adminId = req.user.userId;
      const period = new Date().toISOString().slice(0, 7);
      const month = new Date(`${period}-01T00:00:00.000Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

      const recordedDistribution = await prisma.profitDistribution.findUnique({ where: { period } });
      if (recordedDistribution) {
        return res.status(409).json({ success: false, message: `Profit has already been distributed for ${month}` });
      }

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
        select: { id: true, userId: true, amount: true },
      });

      if (activeInvestments.length === 0) {
        return res.json({
          success: true,
          message: 'No active investments to distribute profit to',
          data: { distributed: 0 },
        });
      }

      const distributions = activeInvestments.map((inv) => ({
        userId: inv.userId,
        investmentId: inv.id,
        amount: Math.round(Number(inv.amount) * (pct / 100) * 100) / 100,
      }));
      const totalDistributed = distributions.reduce((s, d) => s + d.amount, 0);

      await prisma.$transaction(async (tx) => {
        await tx.profitDistribution.create({
          data: {
            period,
            initiatedBy: adminId,
            profitPercent: pct,
            investmentCount: distributions.length,
            totalAmount: totalDistributed,
          },
        });

        for (let offset = 0; offset < distributions.length; offset += 5000) {
          const batch = distributions.slice(offset, offset + 5000);
          const roiCases = Prisma.join(batch.map((item) => Prisma.sql`WHEN ${item.investmentId} THEN ${item.amount}`), ' ');
          const ids = Prisma.join(batch.map((item) => Prisma.sql`${item.investmentId}`));
          await tx.$executeRaw(Prisma.sql`
            UPDATE "investments"
            SET "roi" = "roi" + CASE "id" ${roiCases} ELSE 0 END
            WHERE "id" IN (${ids})
          `);
          await tx.transaction.createMany({
            data: batch.map((item) => ({
              id: randomUUID(),
              userId: item.userId,
              type: 'profit',
              amount: item.amount,
              description: `${pct}% monthly profit share for ${month}${note ? ` - ${note}` : ''}`,
              status: 'completed',
            })),
          });
        }
        await tx.log.create({ data: { userId: adminId, action: `PROFIT_DISTRIBUTION: ${period}`, status: 'success' } });
      }, { maxWait: 5000, timeout: 10_000 });

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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Profit has already been distributed for this month' });
      }
      handleError(res, error, 'Failed to distribute profit');
    }
  }
);

export default router;
