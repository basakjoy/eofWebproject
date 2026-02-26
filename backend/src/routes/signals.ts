import express, { Request, Response } from 'express';
import { allAsync, getAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all signals
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const signals = await allAsync('SELECT * FROM signals WHERE status = "active" ORDER BY createdAt DESC');
    res.json({
      success: true,
      data: signals,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch signals',
    });
  }
});

// Create signal
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { pair, type, entryPrice, takeProfit, stopLoss, reliability } = req.body;

    if (!pair || !type || !entryPrice || !takeProfit || !stopLoss) {
      return res.status(400).json({
        success: false,
        message: 'pair, type, entryPrice, takeProfit, and stopLoss are required',
      });
    }

    const signalId = uuidv4();
    await runAsync(
      `INSERT INTO signals (id, pair, type, entryPrice, takeProfit, stopLoss, reliability, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [signalId, pair, type, entryPrice, takeProfit, stopLoss, reliability || 0.85, 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Signal created successfully',
      data: { signalId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create signal',
    });
  }
});

// Get signal by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const signal = await getAsync('SELECT * FROM signals WHERE id = ?', [req.params.id]);

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

// Update signal
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { status, reliability } = req.body;

    const signal = await getAsync('SELECT * FROM signals WHERE id = ?', [req.params.id]);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      });
    }

    await runAsync(
      `UPDATE signals SET status = ?, reliability = ? WHERE id = ?`,
      [status || signal.status, reliability || signal.reliability, req.params.id]
    );

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

export default router;
