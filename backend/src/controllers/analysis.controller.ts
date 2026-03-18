import { Request, Response } from 'express';
import { getAsync, allAsync, runAsync } from '../database';
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest extends Request {
  user?: any;
}

// Get all analysis
export const getAllAnalysis = async (req: Request, res: Response) => {
  try {
    const { type, status, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM analysis WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const analysis = await allAsync(query, params);
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analysis',
    });
  }
};

// Get analysis by ID
export const getAnalysisById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const analysis = await getAsync('SELECT * FROM analysis WHERE id = ?', [id]);
    
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Increment view count
    await runAsync('UPDATE analysis SET viewCount = viewCount + 1 WHERE id = ?', [id]);

    res.json({ success: true, data: analysis });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analysis',
    });
  }
};

// Create analysis
export const createAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, content, symbol, metrics } = req.body;
    const createdBy = req.user?.userId;

    if (!title || !type || !content) {
      return res.status(400).json({
        success: false,
        message: 'title, type, and content are required',
      });
    }

    const analysisId = uuidv4();
    await runAsync(
      `INSERT INTO analysis (id, title, type, content, symbol, metrics, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [analysisId, title, type, content, symbol, JSON.stringify(metrics || {}), createdBy]
    );

    res.status(201).json({
      success: true,
      message: 'Analysis created successfully',
      data: { id: analysisId, title, type, content, symbol, metrics },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create analysis',
    });
  }
};

// Update analysis
export const updateAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, status, metrics } = req.body;

    const analysis = await getAsync('SELECT * FROM analysis WHERE id = ?', [id]);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (metrics !== undefined) { updates.push('metrics = ?'); values.push(JSON.stringify(metrics)); }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    if (updates.length > 1) {
      await runAsync(
        `UPDATE analysis SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({ success: true, message: 'Analysis updated successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update analysis',
    });
  }
};

// Delete analysis
export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const analysis = await getAsync('SELECT * FROM analysis WHERE id = ?', [id]);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    await runAsync('DELETE FROM analysis WHERE id = ?', [id]);
    res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete analysis',
    });
  }
};

// Add comment to analysis
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user?.userId;

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const analysis = await getAsync('SELECT * FROM analysis WHERE id = ?', [id]);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const commentId = uuidv4();
    await runAsync(
      `INSERT INTO analysis_comments (id, analysisId, userId, comment, rating)
       VALUES (?, ?, ?, ?, ?)`,
      [commentId, id, userId, comment, rating || null]
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add comment',
    });
  }
};

// Get analysis comments
export const getAnalysisComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comments = await allAsync(
      'SELECT * FROM analysis_comments WHERE analysisId = ? ORDER BY createdAt DESC',
      [id]
    );

    res.json({ success: true, data: comments });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch comments',
    });
  }
};

// Get analysis report
export const getAnalysisReport = async (req: Request, res: Response) => {
  try {
    const { period = 'monthly' } = req.query;

    const report = await getAsync(
      'SELECT * FROM analysis_reports WHERE period = ? ORDER BY createdAt DESC LIMIT 1',
      [period]
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch report',
    });
  }
};
