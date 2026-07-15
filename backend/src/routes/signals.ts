import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { verifyToken, AuthRequest as AuthMiddlewareRequest } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends AuthMiddlewareRequest {}

interface ErrorResponse {
  success: false;
  message: string;
  details?: string;
}

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
}

// ---------- Validation schemas ----------
const baseSignalSchema = z.object({
  pair: z.string().trim().min(3).max(20).optional(),
  type: z.enum(['BUY', 'SELL']).optional(),
  direction: z.enum(['BUY', 'SELL']).optional(),
  entryPrice: z.coerce.number().positive('Entry price must be positive').optional(),
  stopLoss: z.coerce.number().positive('Stop loss must be positive').optional(),
  stoploss: z.coerce.number().positive('Stop loss must be positive').optional(),
  takeProfit: z.coerce.number().positive('Take profit must be positive').optional(),
  takeProfit1: z.coerce.number().positive().optional(),
  takeProfit2: z.coerce.number().positive().optional(),
  takeProfit3: z.coerce.number().positive().optional(),
  takeProfits: z.array(z.coerce.number().positive()).max(3).optional(),
  accuracy: z.coerce.number().min(0).max(100).optional(),
  reliability: z.coerce.number().min(0).max(1).optional(),
  timeframe: z.string().max(10).optional().default('4H'),
  status: z.enum(['active', 'closed', 'pending']).optional().default('active'),
}).passthrough();

const createSignalSchema = baseSignalSchema.extend({
  pair: z.string().trim().min(3).max(20),
  entryPrice: z.coerce.number().positive('Entry price must be positive'),
}).superRefine((data, ctx) => {
  if (!data.type && !data.direction) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Direction is required',
      path: ['direction'],
    });
  }

  if (!data.stopLoss && !data.stoploss) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Stop loss is required',
      path: ['stopLoss'],
    });
  }
});

const updateSignalSchema = baseSignalSchema.partial();

const querySchema = z.object({
  status: z.string().optional(),
  pair: z.string().optional(),
  type: z.enum(['BUY', 'SELL']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

// ---------- Middleware ----------

// Validate request body against schema
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          details: messages.join(', '),
        } as ErrorResponse);
      }
      next(error);
    }
  };
};

// Validate query parameters against schema
const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          details: messages.join(', '),
        } as ErrorResponse);
      }
      next(error);
    }
  };
};

// Require admin/superadmin role (verifyToken must run first)
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    } as ErrorResponse);
  }
  next();
};

// Loosely validate an ID param. Prisma's default is cuid(), but the create
// route below issues uuidv4() explicitly. Accept either shape here instead
// of hard-failing with 400 on a well-formed id that just isn't a v4 UUID —
// let findUnique's null result produce a clean 404 instead.
const isPlausibleId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const cuidRegex = /^c[a-z0-9]{20,}$/i;
  return uuidRegex.test(id) || cuidRegex.test(id);
};

const coerceNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getSignalDirection = (body: any): string | undefined => {
  const rawDirection = body?.type ?? body?.direction;
  if (typeof rawDirection === 'string' && rawDirection.trim()) {
    return rawDirection.trim().toUpperCase();
  }
  return undefined;
};

const getSignalStopLoss = (body: any): number | undefined => {
  return coerceNumber(body?.stopLoss ?? body?.stoploss);
};

const getSignalTakeProfits = (body: any): Array<number> => {
  const values = Array.isArray(body?.takeProfits)
    ? body.takeProfits
    : [body?.takeProfit1, body?.takeProfit2, body?.takeProfit3, body?.takeProfit];

  return (values as Array<unknown>)
    .map((value: unknown) => coerceNumber(value))
    .filter((value: number | undefined): value is number => value !== undefined);
};

// Sanitize signal data for response
const sanitizeSignal = (signal: any) => {
  const direction = signal?.type || signal?.direction || null;
  const stopLossValue = signal?.stopLoss ? parseFloat(signal.stopLoss) : null;
  const takeProfitValues = [
    signal?.takeProfit1 ?? signal?.takeProfit ?? null,
    signal?.takeProfit2 ?? null,
    signal?.takeProfit3 ?? null,
  ]
    .map((value) => (value !== null && value !== undefined ? parseFloat(value) : null))
    .filter((value): value is number => value !== null);

  return {
    id: signal.id,
    pair: signal.pair,
    direction,
    type: direction,
    entryPrice: signal.entryPrice ? parseFloat(signal.entryPrice) : null,
    stopLoss: stopLossValue,
    stoploss: stopLossValue,
    takeProfit: signal.takeProfit ? parseFloat(signal.takeProfit) : null,
    takeProfit1: signal.takeProfit1 ? parseFloat(signal.takeProfit1) : null,
    takeProfit2: signal.takeProfit2 ? parseFloat(signal.takeProfit2) : null,
    takeProfit3: signal.takeProfit3 ? parseFloat(signal.takeProfit3) : null,
    takeProfits: takeProfitValues,
    accuracy: signal.accuracy ? parseFloat(signal.accuracy) : null,
    reliability: signal.reliability ? parseFloat(signal.reliability) : null,
    timeframe: signal.timeframe,
    status: signal.status,
    createdAt: signal.createdAt,
    updatedAt: signal.updatedAt,
  };
};

// Log Prisma/unexpected errors with enough detail to actually diagnose them
const logRouteError = (label: string, error: any) => {
  console.error(`[signals] ${label}:`, {
    code: error?.code,
    message: error?.message,
    meta: error?.meta,
  });
};

// ================= ROUTES =================
// NOTE: '/stats' MUST be registered before '/:id', or Express will match
// GET /signals/stats against the '/:id' handler with id="stats" first.

// GET /signals/stats — signal statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [activeCount, closedCount, pendingCount, buyCount, sellCount] = await Promise.all([
      prisma.signal.count({ where: { status: 'active' } }),
      prisma.signal.count({ where: { status: 'closed' } }),
      prisma.signal.count({ where: { status: 'pending' } }),
      prisma.signal.count({ where: { type: 'BUY' } }),
      prisma.signal.count({ where: { type: 'SELL' } }),
    ]);

    const totalSignals = activeCount + closedCount + pendingCount;

    const stats = {
      activeSignals: activeCount,
      closedSignals: closedCount,
      pendingSignals: pendingCount,
      buySignals: buyCount,
      sellSignals: sellCount,
      totalSignals,
      winRate:
        activeCount + closedCount > 0
          ? ((activeCount / (activeCount + closedCount)) * 100).toFixed(2)
          : '0.00',
    };

    return res.json({
      success: true,
      data: stats,
    } as SuccessResponse<any>);
  } catch (error: any) {
    logRouteError('Error fetching signal stats', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch signal statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

// GET /signals — list with filters + pagination
router.get('/', validateQuery(querySchema), async (req: AuthRequest, res: Response) => {
  try {
    const { status, pair, type, limit, offset } = req.query as any;

    const where: any = {};
    if (status) where.status = status;
    if (pair) where.pair = { contains: pair, mode: 'insensitive' };
    if (type) where.type = type;

    const [signals, total] = await Promise.all([
      prisma.signal.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          pair: true,
          type: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit: true,
          takeProfit1: true,
          takeProfit2: true,
          takeProfit3: true,
          accuracy: true,
          reliability: true,
          timeframe: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.signal.count({ where }),
    ]);

    const sanitized = signals.map(sanitizeSignal);

    return res.json({
      success: true,
      data: sanitized,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    } as SuccessResponse<any[]> & { hasMore: boolean });
  } catch (error: any) {
    logRouteError('Error fetching signals', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch signals',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

// GET /signals/:id — fetch one
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isPlausibleId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signal ID format',
      } as ErrorResponse);
    }

    const signal = await prisma.signal.findUnique({
      where: { id },
      select: {
        id: true,
        pair: true,
        type: true,
        entryPrice: true,
        stopLoss: true,
        takeProfit: true,
        takeProfit1: true,
        takeProfit2: true,
        takeProfit3: true,
        accuracy: true,
        reliability: true,
        timeframe: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      } as ErrorResponse);
    }

    return res.json({
      success: true,
      data: sanitizeSignal(signal),
    } as SuccessResponse<any>);
  } catch (error: any) {
    logRouteError('Error fetching signal', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch signal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

// POST /signals — create
router.post(
  '/',
  verifyToken,
  requireAdmin,
  validateRequest(createSignalSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const body = req.body as Record<string, unknown>;
      const normalizedType = getSignalDirection(body);
      const normalizedPair = typeof body.pair === 'string' ? body.pair.toUpperCase() : '';
      const normalizedStatus = typeof body.status === 'string' ? body.status.toLowerCase() : 'active';
      const entryPrice = coerceNumber(body.entryPrice);
      const stopLossValue = getSignalStopLoss(body);
      const takeProfitValue = coerceNumber(body.takeProfit ?? body.takeProfit1);
      const takeProfitsValue = getSignalTakeProfits(body);
      const reliability = coerceNumber(body.reliability);
      const timeframe = typeof body.timeframe === 'string' ? body.timeframe : '4H';

      if (!normalizedType) {
        return res.status(400).json({
          success: false,
          message: 'Direction is required',
        } as ErrorResponse);
      }

      if (!normalizedPair) {
        return res.status(400).json({
          success: false,
          message: 'Pair is required',
        } as ErrorResponse);
      }

      if (entryPrice === undefined || stopLossValue === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Entry price and stop loss are required',
        } as ErrorResponse);
      }

      // Type-aware logic validation.
      // BUY: stop loss below entry, take profit above entry.
      // SELL: stop loss above entry, take profit below entry.
      if (normalizedType === 'BUY') {
        if (entryPrice <= stopLossValue) {
          return res.status(400).json({
            success: false,
            message: 'For BUY signals, entry price must be greater than stop loss',
          } as ErrorResponse);
        }
        if (takeProfitValue && takeProfitValue <= entryPrice) {
          return res.status(400).json({
            success: false,
            message: 'For BUY signals, take profit must be greater than entry price',
          } as ErrorResponse);
        }
      } else {
        if (entryPrice >= stopLossValue) {
          return res.status(400).json({
            success: false,
            message: 'For SELL signals, entry price must be less than stop loss',
          } as ErrorResponse);
        }
        if (takeProfitValue && takeProfitValue >= entryPrice) {
          return res.status(400).json({
            success: false,
            message: 'For SELL signals, take profit must be less than entry price',
          } as ErrorResponse);
        }
      }

      let tp1 = takeProfitValue ?? null;
      let tp2 = null;
      let tp3 = null;

      if (takeProfitsValue.length > 0) {
        tp1 = takeProfitsValue[0] ?? tp1;
        tp2 = takeProfitsValue[1] ?? null;
        tp3 = takeProfitsValue[2] ?? null;
      }

      const signalId = uuidv4();

      const signal = await prisma.signal.create({
        data: {
          id: signalId,
          pair: normalizedPair,
          type: normalizedType,
          entryPrice: String(entryPrice),
          stopLoss: String(stopLossValue),
          takeProfit: tp1 ? String(tp1) : null,
          takeProfit1: tp1 ? String(tp1) : null,
          takeProfit2: tp2 ? String(tp2) : null,
          takeProfit3: tp3 ? String(tp3) : null,
          accuracy: String(reliability ? reliability * 100 : 85),
          reliability: String(reliability ?? 0.85),
          timeframe,
          status: normalizedStatus,
        },
        select: {
          id: true,
          pair: true,
          type: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit: true,
          takeProfit1: true,
          takeProfit2: true,
          takeProfit3: true,
          accuracy: true,
          reliability: true,
          timeframe: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Signal created successfully',
        data: sanitizeSignal(signal),
      } as SuccessResponse<any>);
    } catch (error: any) {
      logRouteError('Error creating signal', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Signal with this ID already exists',
        } as ErrorResponse);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create signal',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      } as ErrorResponse);
    }
  }
);

// PUT /signals/:id — update (full-object PUT strategy, not PATCH)
router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  validateRequest(updateSignalSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      if (!isPlausibleId(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signal ID format',
        } as ErrorResponse);
      }

      const body = req.body as Record<string, unknown>;
      const {
        status,
        reliability,
        accuracy,
        pair,
        type,
        direction,
        entryPrice,
        stopLoss,
        stoploss,
        takeProfit,
        takeProfit1,
        takeProfit2,
        takeProfit3,
        takeProfits,
        timeframe,
      } = body;

      const normalizedType = getSignalDirection(body);
      const normalizedPair = pair ? String(pair).toUpperCase() : undefined;
      const normalizedStatus = status ? String(status).toLowerCase() : undefined;
      const entryPriceValue = coerceNumber(entryPrice);
      const stopLossValue = getSignalStopLoss(body);
      const takeProfitValue = coerceNumber(takeProfit ?? takeProfit1);
      const takeProfitsValue = getSignalTakeProfits(body);

      const signal = await prisma.signal.findUnique({ where: { id } });

      if (!signal) {
        return res.status(404).json({
          success: false,
          message: 'Signal not found',
        } as ErrorResponse);
      }

      // Prevent updating closed signals (unless explicitly re-confirming closed)
      if (signal.status === 'closed' && normalizedStatus !== 'closed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update a closed signal',
        } as ErrorResponse);
      }

      const updateData: any = {};
      if (normalizedStatus !== undefined) updateData.status = normalizedStatus;
      if (reliability !== undefined) updateData.reliability = String(reliability);
      if (accuracy !== undefined) updateData.accuracy = String(accuracy);
      if (normalizedPair !== undefined) updateData.pair = normalizedPair;
      if (normalizedType !== undefined) updateData.type = normalizedType;
      if (entryPriceValue !== undefined) updateData.entryPrice = String(entryPriceValue);
      if (stopLossValue !== undefined) updateData.stopLoss = String(stopLossValue);
      if (timeframe !== undefined) updateData.timeframe = timeframe;

      if (takeProfitsValue.length > 0) {
        updateData.takeProfit = String(takeProfitsValue[0]);
        updateData.takeProfit1 = String(takeProfitsValue[0]);
        if (takeProfitsValue[1] !== undefined) updateData.takeProfit2 = String(takeProfitsValue[1]);
        if (takeProfitsValue[2] !== undefined) updateData.takeProfit3 = String(takeProfitsValue[2]);
      } else if (takeProfitValue !== undefined) {
        updateData.takeProfit = String(takeProfitValue);
        updateData.takeProfit1 = String(takeProfitValue);
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields provided for update',
        } as ErrorResponse);
      }

      const updated = await prisma.signal.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          pair: true,
          type: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit: true,
          takeProfit1: true,
          takeProfit2: true,
          takeProfit3: true,
          accuracy: true,
          reliability: true,
          timeframe: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.json({
        success: true,
        message: 'Signal updated successfully',
        data: sanitizeSignal(updated),
      } as SuccessResponse<any>);
    } catch (error: any) {
      logRouteError('Error updating signal', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update signal',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      } as ErrorResponse);
    }
  }
);

// PUT /signals/:id/close — mark closed
router.put('/:id/close', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isPlausibleId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signal ID format',
      } as ErrorResponse);
    }

    const signal = await prisma.signal.findUnique({ where: { id } });

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      } as ErrorResponse);
    }

    await prisma.signal.update({
      where: { id },
      data: { status: 'closed' },
    });

    return res.json({
      success: true,
      message: 'Signal closed successfully',
    } as SuccessResponse<null>);
  } catch (error: any) {
    logRouteError('Error closing signal', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to close signal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

// DELETE /signals/:id
router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isPlausibleId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signal ID format',
      } as ErrorResponse);
    }

    const signal = await prisma.signal.findUnique({ where: { id } });

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      } as ErrorResponse);
    }

    await prisma.signal.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Signal deleted successfully',
    } as SuccessResponse<null>);
  } catch (error: any) {
    logRouteError('Error deleting signal', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete signal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

export default router;
