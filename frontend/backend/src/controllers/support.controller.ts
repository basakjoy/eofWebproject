import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest extends Request {
  user?: any;
}

// Create support ticket
export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, description, category, priority = 'medium', attachments } = req.body;
    const userId = req.user?.userId;

    if (!subject || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'subject, description, and category are required',
      });
    }

    const ticketId = uuidv4();
    await runAsync(
      `INSERT INTO support_tickets (id, userId, subject, description, category, priority, attachments)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ticketId, userId, subject, description, category, priority, JSON.stringify(attachments || [])]
    );

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: { id: ticketId, status: 'open' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create support ticket',
    });
  }
};

// Get all tickets
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, priority, category, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM support_tickets WHERE 1=1';
    const params: any[] = [];

    if (status) { query += ' AND status = ?'; params.push(status); }
    if (priority) { query += ' AND priority = ?'; params.push(priority); }
    if (category) { query += ' AND category = ?'; params.push(category); }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const tickets = await allAsync(query, params);
    res.json({ success: true, data: tickets });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tickets',
    });
  }
};

// Get user tickets
export const getUserTickets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM support_tickets WHERE userId = ?';
    const params: any[] = [userId];

    if (status) { query += ' AND status = ?'; params.push(status); }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const tickets = await allAsync(query, params);
    res.json({ success: true, data: tickets });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user tickets',
    });
  }
};

// Get ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await getAsync('SELECT * FROM support_tickets WHERE id = ?', [id]);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch ticket',
    });
  }
};

// Update ticket
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, resolution } = req.body;

    const ticket = await getAsync('SELECT * FROM support_tickets WHERE id = ?', [id]);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const updates = [];
    const values = [];

    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
    if (assignedTo !== undefined) { updates.push('assignedTo = ?'); values.push(assignedTo); }
    if (resolution !== undefined) { updates.push('resolution = ?'); values.push(resolution); }

    if (status === 'resolved' || status === 'closed') {
      updates.push('closedAt = CURRENT_TIMESTAMP');
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    if (updates.length > 1) {
      await runAsync(
        `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({ success: true, message: 'Ticket updated successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update ticket',
    });
  }
};

// Add message to ticket
export const addMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { message, attachments, isInternal = false } = req.body;
    const userId = req.user?.userId;

    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const ticket = await getAsync('SELECT * FROM support_tickets WHERE id = ?', [ticketId]);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const messageId = uuidv4();
    await runAsync(
      `INSERT INTO support_messages (id, ticketId, userId, message, attachments, isInternal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [messageId, ticketId, userId, message, JSON.stringify(attachments || []), isInternal ? 1 : 0]
    );

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add message',
    });
  }
};

// Get ticket messages
export const getTicketMessages = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    const messages = await allAsync(
      'SELECT * FROM support_messages WHERE ticketId = ? ORDER BY createdAt ASC',
      [ticketId]
    );

    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch messages',
    });
  }
};

// Get FAQ articles
export const getFAQArticles = async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM faq_articles WHERE published = 1';
    const params: any[] = [];

    if (category) { query += ' AND category = ?'; params.push(category); }

    query += ' ORDER BY viewCount DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const articles = await allAsync(query, params);
    res.json({ success: true, data: articles });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch FAQ articles',
    });
  }
};

// Get support categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await allAsync(
      'SELECT * FROM support_categories WHERE active = 1 ORDER BY position ASC'
    );
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

// Get support metrics
export const getSupportMetrics = async (req: Request, res: Response) => {
  try {
    const { period = 'monthly' } = req.query;

    const metrics = await getAsync(
      'SELECT * FROM support_metrics WHERE period = ? ORDER BY createdAt DESC LIMIT 1',
      [period]
    );

    res.json({
      success: true,
      data: metrics || { message: 'No metrics available' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch metrics',
    });
  }
};

// Close ticket
export const closeTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await getAsync('SELECT * FROM support_tickets WHERE id = ?', [id]);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    await runAsync(
      'UPDATE support_tickets SET status = ?, closedAt = CURRENT_TIMESTAMP WHERE id = ?',
      ['closed', id]
    );

    res.json({ success: true, message: 'Ticket closed successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to close ticket',
    });
  }
};
