import express, { Request, Response } from 'express';
import { allAsync, getAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all signals with filtering
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, pair, type, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM signals WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (pair) {
      query += ' AND pair LIKE ?';
      params.push(`%${pair}%`);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const signals = await allAsync(query, params);
    const countResult = await getAsync('SELECT COUNT(*) as total FROM signals WHERE 1=1' + (status ? ' AND status = ?' : '') + (pair ? ' AND pair LIKE ?' : '') + (type ? ' AND type = ?' : ''), params.slice(0, params.length - 2));

    res.json({
      success: true,
      data: signals,
      total: countResult?.total || 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
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
    const takeProfitValue = takeProfit || (Array.isArray(takeProfits) ? takeProfits[0] : takeProfits);
    
    await runAsync(
      `INSERT INTO signals (
        id, pair, type, direction, entryPrice, stopLoss, takeProfit, 
        accuracy, reliability, timeframe, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        signalId,
        pair,
        type,
        direction || 'BUY',
        entryPrice,
        stopLoss,
        takeProfitValue,
        accuracy || 0,
        reliability || 0.85,
        timeframe || '4H',
        status
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Signal created successfully',
      data: {
        id: signalId,
        pair,
        type,
        direction: direction || 'BUY',
        entryPrice,
        stopLoss,
        takeProfit: takeProfitValue,
        reliability: reliability || 0.85,
        status
      },
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
    const { status, reliability, accuracy, direction } = req.body;

    const signal = await getAsync('SELECT * FROM signals WHERE id = ?', [req.params.id]);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      });
    }

    const updateFields = [];
    const updateParams: any[] = [];

    if (status !== undefined) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }

    if (reliability !== undefined) {
      updateFields.push('reliability = ?');
      updateParams.push(reliability);
    }

    if (accuracy !== undefined) {
      updateFields.push('accuracy = ?');
      updateParams.push(accuracy);
    }

    if (direction !== undefined) {
      updateFields.push('direction = ?');
      updateParams.push(direction);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    updateFields.push('updatedAt = datetime("now")');
    updateParams.push(req.params.id);

    await runAsync(
      `UPDATE signals SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
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

// Delete signal
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const signal = await getAsync('SELECT * FROM signals WHERE id = ?', [req.params.id]);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      });
    }

    await runAsync('DELETE FROM signals WHERE id = ?', [req.params.id]);

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
