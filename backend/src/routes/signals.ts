import express, { Request, Response } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all signals with filtering
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, pair, type, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (status) where.status = String(status);
    if (pair) where.pair = { contains: String(pair), mode: 'insensitive' };
    if (type) where.type = String(type);

    const [signals, total] = await Promise.all([
      prisma.signal.findMany({
        where,
        take: parseInt(String(limit)),
        skip: parseInt(String(offset)),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.signal.count({ where }),
    ]);

    res.json({
      success: true,
      data: signals,
      total,
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch signals',
    });
  }
});

// Get signal by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const signal = await prisma.signal.findUnique({
      where: { id: req.params.id },
    });

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      });
    }

    res.json({
      success: true,
      data: signal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch signal',
    });
  }
});

// Create signal
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { 
      pair, 
      type, 
      direction,
      entryPrice, 
      stopLoss,
      takeProfit,
      takeProfits,
      accuracy,
      reliability,
      timeframe,
      status = 'active'
    } = req.body;

    if (!pair || !type || !entryPrice || (!takeProfit && !takeProfits) || !stopLoss) {
      return res.status(400).json({
        success: false,
        message: 'pair, type, entryPrice, takeProfit/takeProfits, and stopLoss are required',
      });
    }

    const signalId = uuidv4();
    
    // Handle multiple take profits if provided
    let tp1 = takeProfit || null;
    let tp2 = null;
    let tp3 = null;
    
    if (Array.isArray(takeProfits)) {
      tp1 = takeProfits[0] || tp1;
      tp2 = takeProfits[1] || null;
      tp3 = takeProfits[2] || null;
    }
    
    const signal = await prisma.signal.create({
      data: {
        id: signalId,
        pair,
        type,
        direction: direction || 'BUY',
        entryPrice: String(entryPrice),
        stopLoss: String(stopLoss),
        takeProfit: tp1 ? String(tp1) : null,
        takeProfit1: tp1 ? String(tp1) : null,
        takeProfit2: tp2 ? String(tp2) : null,
        takeProfit3: tp3 ? String(tp3) : null,
        accuracy: String(accuracy || 0),
        reliability: String(reliability || 0.85),
        timeframe: String(timeframe || '4H'),
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Signal created successfully',
      data: signal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create signal',
    });
  }
});

// Update signal
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { 
      status, reliability, accuracy, direction, 
      pair, type, entryPrice, stopLoss, takeProfit, takeProfits, timeframe 
    } = req.body;

    const signal = await prisma.signal.findUnique({
      where: { id: req.params.id },
    });

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      });
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (reliability !== undefined) data.reliability = String(reliability);
    if (accuracy !== undefined) data.accuracy = String(accuracy);
    if (direction !== undefined) data.direction = direction;
    if (pair !== undefined) data.pair = pair;
    if (type !== undefined) data.type = type;
    if (entryPrice !== undefined) data.entryPrice = String(entryPrice);
    if (stopLoss !== undefined) data.stopLoss = String(stopLoss);
    if (timeframe !== undefined) data.timeframe = String(timeframe);
    
    // Handle multiple take profits if provided
    if (takeProfits !== undefined && Array.isArray(takeProfits)) {
      if (takeProfits[0]) {
        data.takeProfit = String(takeProfits[0]);
        data.takeProfit1 = String(takeProfits[0]);
      }
      if (takeProfits[1]) data.takeProfit2 = String(takeProfits[1]);
      if (takeProfits[2]) data.takeProfit3 = String(takeProfits[2]);
    } else if (takeProfit !== undefined) {
      data.takeProfit = String(takeProfit);
      data.takeProfit1 = String(takeProfit);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    await prisma.signal.update({
      where: { id: req.params.id },
      data,
    });

    res.json({
      success: true,
      message: 'Signal updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update signal',
    });
  }
});

// Delete signal
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const signal = await prisma.signal.findUnique({
      where: { id: req.params.id },
    });

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      });
    }

    await prisma.signal.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Signal deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete signal',
    });
  }
});

export default router;
