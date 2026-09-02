import { Request, Response } from 'express';
import prisma from '../lib/prisma';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    role: string;
  };
}

// Create support ticket
export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, description, category, priority = 'medium', attachments } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!subject || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'subject, description, and category are required',
      });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        description,
        category,
        priority,
        attachments: attachments ? JSON.stringify(attachments) : null,
        status: 'open',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: { id: ticket.id, status: ticket.status },
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create support ticket',
    });
  }
};

// Get all tickets (admin / staff)
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, priority, category, limit = 20, offset = 0 } = req.query;

    const where: any = {};
    if (status) where.status = String(status);
    if (priority) where.priority = String(priority);
    if (category) where.category = String(category);

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { id: true, name: true, email: true, role: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tickets',
    });
  }
};

// Get user's tickets
export const getUserTickets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { status, limit = 20, offset = 0 } = req.query;

    const where: any = { userId };
    if (status) where.status = String(status);

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error: any) {
    console.error('Error fetching user tickets:', error);
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

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
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

    const existing = await prisma.supportTicket.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const data: any = {};
    if (status !== undefined) {
      data.status = status;
      if (status === 'resolved' || status === 'closed') {
        data.closedAt = new Date();
      }
    }
    if (priority !== undefined) data.priority = priority;
    if (assignedTo !== undefined) data.assignedTo = assignedTo;
    if (resolution !== undefined) data.resolution = resolution;

    const updated = await prisma.supportTicket.update({
      where: { id },
      data,
    });

    res.json({ success: true, message: 'Ticket updated successfully', data: updated });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
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

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const savedMessage = await prisma.supportMessage.create({
      data: {
        ticketId,
        userId,
        message: message.trim(),
        attachments: attachments ? JSON.stringify(attachments) : null,
        isInternal: Boolean(isInternal),
      },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Update ticket updatedAt timestamp
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    // WebSocket support chat is disabled for now.
    // The message is persisted to the database and returned via the standard API response.

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: savedMessage,
    });
  } catch (error: any) {
    console.error('Error adding message:', error);
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

    const messages = await prisma.supportMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    res.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
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

    const where: any = { published: true };
    if (category) where.category = String(category);

    const articles = await prisma.faqArticle.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { viewCount: 'desc' },
    });

    res.json({ success: true, data: articles });
  } catch (error: any) {
    console.error('Error fetching FAQ articles:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch FAQ articles',
    });
  }
};

// Get support categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.supportCategory.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
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

    const [totalTickets, openTickets, resolvedTickets] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: 'open' } }),
      prisma.supportTicket.count({ where: { status: { in: ['resolved', 'closed'] } } }),
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalTickets,
        openTickets,
        resolvedTickets,
        resolutionRate: totalTickets > 0 ? `${Math.round((resolvedTickets / totalTickets) * 100)}%` : '100%',
        avgFirstResponseTime: '5m',
      },
    });
  } catch (error: any) {
    console.error('Error fetching metrics:', error);
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

    const existing = await prisma.supportTicket.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: 'closed',
        closedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'Ticket closed successfully', data: updated });
  } catch (error: any) {
    console.error('Error closing ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to close ticket',
    });
  }
};
