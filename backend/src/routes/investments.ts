import express, { Request, Response } from 'express';
import { allAsync, getAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all investments
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.query.userId as string;
    let query = 'SELECT * FROM investments';
    const params: any[] = [];

    if (userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }

    const investments = await allAsync(query, params);
    res.json({
      success: true,
      data: investments,
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
    const { userId, amount, plan } = req.body;

    if (!userId || !amount || !plan) {
      return res.status(400).json({
        success: false,
        message: 'userId, amount, and plan are required',
      });
    }

    const investmentId = uuidv4();
    await runAsync(
      `INSERT INTO investments (id, userId, amount, plan, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [investmentId, userId, amount, plan, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: { investmentId },
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
    const investment = await getAsync('SELECT * FROM investments WHERE id = ?', [req.params.id]);

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

// Update investment
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { status, roi } = req.body;

    const investment = await getAsync('SELECT * FROM investments WHERE id = ?', [req.params.id]);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    await runAsync(
      `UPDATE investments SET status = ?, roi = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [status || investment.status, roi || investment.roi, req.params.id]
    );

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

export default router;
