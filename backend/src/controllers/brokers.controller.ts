import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest extends Request {
  user?: any;
}

// Get all brokers
export const getAllBrokers = async (req: Request, res: Response) => {
  try {
    const { status = 'active', sortBy = 'rating', limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM brokers WHERE status = ?';
    const params: any[] = [status];

    query += ` ORDER BY ${sortBy} DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const brokers = await allAsync(query, params);
    res.json({
      success: true,
      data: brokers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch brokers',
    });
  }
};

// Get broker by ID
export const getBrokerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const broker = await getAsync('SELECT * FROM brokers WHERE id = ?', [id]);
    
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    res.json({ success: true, data: broker });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch broker',
    });
  }
};

// Create broker
export const createBroker = async (req: Request, res: Response) => {
  try {
    const { name, code, website, email, phone, country, minimumDeposit, leverage, spreads, features } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'name and code are required',
      });
    }

    const brokerId = uuidv4();
    await runAsync(
      `INSERT INTO brokers (id, name, code, website, email, phone, country, minimumDeposit, leverage, spreads, features)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brokerId, name, code, website, email, phone, country, minimumDeposit, leverage, spreads, JSON.stringify(features || [])]
    );

    res.status(201).json({
      success: true,
      message: 'Broker created successfully',
      data: { id: brokerId, name, code },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create broker',
    });
  }
};

// Update broker
export const updateBroker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const broker = await getAsync('SELECT * FROM brokers WHERE id = ?', [id]);
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    const updateFields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id') {
        updateFields.push(`${key} = ?`);
        values.push(typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    if (updateFields.length > 0) {
      updateFields.push('updatedAt = CURRENT_TIMESTAMP');
      values.push(id);

      await runAsync(
        `UPDATE brokers SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({ success: true, message: 'Broker updated successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update broker',
    });
  }
};

// Delete broker
export const deleteBroker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const broker = await getAsync('SELECT * FROM brokers WHERE id = ?', [id]);
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    await runAsync('DELETE FROM brokers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Broker deleted successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete broker',
    });
  }
};

// Add broker review
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'rating must be between 1 and 5',
      });
    }

    const broker = await getAsync('SELECT * FROM brokers WHERE id = ?', [id]);
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    const reviewId = uuidv4();
    await runAsync(
      `INSERT INTO broker_reviews (id, brokerId, userId, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [reviewId, id, userId, rating, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review',
    });
  }
};

// Get broker reviews
export const getBrokerReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reviews = await allAsync(
      'SELECT * FROM broker_reviews WHERE brokerId = ? ORDER BY createdAt DESC',
      [id]
    );

    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews',
    });
  }
};

// Connect broker account
export const connectBrokerAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { brokerId, accountNumber, accountType, balance, currency = 'USD' } = req.body;
    const userId = req.user?.userId;

    if (!brokerId || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'brokerId and accountNumber are required',
      });
    }

    const accountId = uuidv4();
    await runAsync(
      `INSERT INTO broker_accounts (id, userId, brokerId, accountNumber, accountType, balance, currency)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [accountId, userId, brokerId, accountNumber, accountType, balance, currency]
    );

    res.status(201).json({
      success: true,
      message: 'Broker account connected successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect broker account',
    });
  }
};

// Get user broker accounts
export const getUserBrokerAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const accounts = await allAsync(
      'SELECT ba.*, b.name as brokerName FROM broker_accounts ba JOIN brokers b ON ba.brokerId = b.id WHERE ba.userId = ?',
      [userId]
    );

    res.json({ success: true, data: accounts });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch broker accounts',
    });
  }
};
