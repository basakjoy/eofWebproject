import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
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

// Roles allowed to act as support staff across the whole ticket system.
// Match this to whatever your RBAC tiers are actually called.
const SUPPORT_ROLES = new Set(['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN', 'SUPPORT_AGENT']);

// ---------- Validation schemas ----------

const createTicketSchema = z.preprocess((value) => {
  if (!value || typeof value !== 'object') return value;
  const body = value as Record<string, unknown>;
  const { title: _title, ...rest } = body;
  return { ...rest, subject: body.subject ?? body.title };
}, z.object({
  subject: z.string().trim().min(3).max(200),
  description: z.string().trim().min(1).max(5000),
  category: z.string().trim().min(1).max(50),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
}).strict());

// Regular users are NOT allowed to hit this schema for status/assignment —
// that's staffUpdateTicketSchema below. This is for the ticket owner editing
// their own still-open ticket content.
const ownerUpdateTicketSchema = z.object({
  subject: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  category: z.string().trim().min(1).max(50).optional(),
}).strict();

// Only support staff can touch status/priority/assignment.
const staffUpdateTicketSchema = z.object({
  status: z.enum(['open', 'pending', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedTo: z.string().cuid().nullable().optional(),
  resolution: z.string().trim().max(5000).nullable().optional(),
  subject: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  category: z.string().trim().min(1).max(50).optional(),
}).strict();

const createMessageSchema = z.preprocess((value) => {
  if (!value || typeof value !== 'object') return value;
  const body = value as Record<string, unknown>;
  const { message: _message, attachmentUrl: _attachmentUrl, ...rest } = body;
  return {
    ...rest,
    content: body.content ?? body.message,
    attachments: body.attachments ?? (body.attachmentUrl ? [body.attachmentUrl] : undefined),
  };
}, z.object({
  content: z.string().trim().min(1).max(5000),
  attachments: z.array(z.string().trim().min(1).max(2048)).max(10).optional().default([]),
  isInternal: z.boolean().optional().default(false),
}).strict());

const ticketQuerySchema = z.object({
  status: z.enum(['open', 'pending', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

const metricsParamsSchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']),
});

// ---------- Middleware ----------

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

const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL parameters',
        } as ErrorResponse);
      }
      next(error);
    }
  };
};

const requireSupportRole = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !SUPPORT_ROLES.has(req.user.role.toUpperCase())) {
    return res.status(403).json({
      success: false,
      message: 'Support staff access required',
    } as ErrorResponse);
  }
  next();
};

const isPlausibleId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const cuidRegex = /^c[a-z0-9]{20,}$/i;
  return uuidRegex.test(id) || cuidRegex.test(id);
};

// Ownership check: ticket owner OR support staff. Fetches the ticket once and
// stashes it on req so downstream handlers don't need a second query.
const requireTicketOwnerOrSupport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ticketId = req.params.id ?? req.params.ticketId;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!ticketId || !isPlausibleId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID format',
      } as ErrorResponse);
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ErrorResponse);
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { messages: true } },
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      } as ErrorResponse);
    }

    const isOwner = ticket.userId === userId;
    const isStaff = !!userRole && SUPPORT_ROLES.has(userRole.toUpperCase());

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      } as ErrorResponse);
    }

    (req as any).ticket = ticket;
    (req as any).isTicketOwner = isOwner;
    (req as any).isSupportStaff = isStaff;
    next();
  } catch (error) {
    logRouteError('Error checking ticket ownership', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify ticket access',
    } as ErrorResponse);
  }
};

// ---------- Rate limiters ----------

const ticketRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AuthRequest) => req.user?.userId ?? ipKeyGenerator(req.ip!),
  message: { success: false, message: 'Too many tickets created. Please wait before submitting another.' },
});

const messageRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AuthRequest) => req.user?.userId ?? ipKeyGenerator(req.ip!),
  message: { success: false, message: 'Too many messages sent. Please slow down.' },
});

// ---------- Helpers ----------

const sanitizeTicket = (ticket: any) => ({
  id: ticket.id,
  subject: ticket.subject,
  description: ticket.description,
  category: ticket.category,
  priority: ticket.priority,
  status: ticket.status,
  userId: ticket.userId,
  assignedTo: ticket.assignedTo ?? null,
  resolution: ticket.resolution ?? null,
  creator: ticket.creator ? {
    id: ticket.creator.id,
    name: ticket.creator.name,
    email: ticket.creator.email,
    role: ticket.creator.role,
  } : undefined,
  assignee: ticket.assignee ? {
    id: ticket.assignee.id,
    name: ticket.assignee.name,
    email: ticket.assignee.email,
    role: ticket.assignee.role,
  } : undefined,
  _count: ticket._count,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
});

const sanitizeMessage = (message: any) => ({
  id: message.id,
  ticketId: message.ticketId,
  userId: message.userId,
  message: message.message,
  attachments: parseAttachments(message.attachments),
  isInternal: message.isInternal,
  user: message.user ? {
    id: message.user.id,
    name: message.user.name,
    email: message.user.email,
    role: message.user.role,
  } : undefined,
  createdAt: message.createdAt,
});

const parseAttachments = (attachments: string | null | undefined): string[] => {
  if (!attachments) return [];
  try {
    const parsed = JSON.parse(attachments);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const logRouteError = (label: string, error: any) => {
  console.error(`[support] ${label}:`, {
    code: error?.code,
    message: error?.message,
    meta: error?.meta,
  });
};

// ================= ROUTES =================

/**
 * Public endpoints — FAQ
 */
router.get('/faq', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.faqArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: articles } as SuccessResponse<any>);
  } catch (error: any) {
    logRouteError('Error fetching FAQ articles', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQ articles' } as ErrorResponse);
  }
});

router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.supportCategory.findMany({ orderBy: { name: 'asc' } });
    return res.json({ success: true, data: categories } as SuccessResponse<any>);
  } catch (error: any) {
    logRouteError('Error fetching categories', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' } as ErrorResponse);
  }
});

/**
 * Support Tickets
 * NOTE: '/tickets/my-tickets' MUST stay above '/tickets/:id', or Express
 * will match it against the ':id' handler with id="my-tickets" first.
 */

// Support staff / admin only — was open to any authenticated user before
router.get(
  '/tickets',
  verifyToken,
  requireSupportRole,
  validateQuery(ticketQuerySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, priority, category, limit, offset } = req.query as any;

      const where: any = {};
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (category) where.category = { contains: category, mode: 'insensitive' };

      const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
          where,
          include: {
            creator: { select: { id: true, name: true, email: true, role: true } },
            assignee: { select: { id: true, name: true, email: true, role: true } },
            _count: { select: { messages: true } },
          },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.supportTicket.count({ where }),
      ]);

      return res.json({
        success: true,
        data: tickets.map(sanitizeTicket),
        total,
        limit,
        offset,
      } as SuccessResponse<any[]>);
    } catch (error: any) {
      logRouteError('Error fetching tickets', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch tickets' } as ErrorResponse);
    }
  }
);

router.get(
  '/tickets/my-tickets',
  verifyToken,
  validateQuery(ticketQuerySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { status, priority, category, limit, offset } = req.query as any;

      const where: any = { userId };
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (category) where.category = { contains: category, mode: 'insensitive' };

      const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.supportTicket.count({ where }),
      ]);

      return res.json({
        success: true,
        data: tickets.map(sanitizeTicket),
        total,
        limit,
        offset,
      } as SuccessResponse<any[]>);
    } catch (error: any) {
      logRouteError('Error fetching user tickets', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch tickets' } as ErrorResponse);
    }
  }
);

// Owner or support staff only — was open to any authenticated user before
router.get(
  '/tickets/:id',
  verifyToken,
  requireTicketOwnerOrSupport,
  async (req: AuthRequest, res: Response) => {
    return res.json({
      success: true,
      data: sanitizeTicket((req as any).ticket),
    } as SuccessResponse<any>);
  }
);

router.post(
  '/tickets',
  verifyToken,
  ticketRateLimiter,
  validateRequest(createTicketSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { subject, description, category, priority } = req.body;

      const validCategory = await prisma.supportCategory.findFirst({ where: { name: category, active: true } });
      if (!validCategory) {
        return res.status(400).json({ success: false, message: 'Invalid or inactive support category' } as ErrorResponse);
      }

      const ticket = await prisma.supportTicket.create({
        data: {
          id: uuidv4(),
          subject,
          description,
          category,
          priority,
          status: 'open',
          userId: req.user!.userId, // never trust a body-supplied userId
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: sanitizeTicket(ticket),
      } as SuccessResponse<any>);
    } catch (error: any) {
      logRouteError('Error creating ticket', error);
      return res.status(500).json({ success: false, message: 'Failed to create ticket' } as ErrorResponse);
    }
  }
);

// Owner can edit subject/description/category while still OPEN.
// Status/priority/assignment changes are staff-only (separate branch below).
router.put(
  '/tickets/:id',
  verifyToken,
  requireTicketOwnerOrSupport,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const isStaff = (req as any).isSupportStaff;
    const schema = isStaff ? staffUpdateTicketSchema : ownerUpdateTicketSchema;
    return validateRequest(schema)(req, res, next);
  },
  async (req: AuthRequest, res: Response) => {
    try {
      const ticket = (req as any).ticket;
      const isStaff = (req as any).isSupportStaff;

      if (!isStaff && ticket.status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Ticket can only be edited by its owner while still open',
        } as ErrorResponse);
      }

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields provided for update',
        } as ErrorResponse);
      }

      if (req.body.category !== undefined) {
        const validCategory = await prisma.supportCategory.findFirst({
          where: { name: req.body.category, active: true },
        });
        if (!validCategory) {
          return res.status(400).json({ success: false, message: 'Invalid or inactive support category' } as ErrorResponse);
        }
      }

      if (req.body.assignedTo !== undefined && req.body.assignedTo !== null) {
        const assignee = await prisma.user.findUnique({
          where: { id: req.body.assignedTo },
          select: { status: true, role: true, supportAgent: { select: { status: true } } },
        });
        const assigneeRole = assignee?.role?.toUpperCase();
        const isSupportAssignee = Boolean(assignee?.supportAgent) ||
          Boolean(assigneeRole && SUPPORT_ROLES.has(assigneeRole));
        if (!assignee || assignee.status !== 'active' || !isSupportAssignee) {
          return res.status(400).json({ success: false, message: 'Ticket must be assigned to active support staff' } as ErrorResponse);
        }
      }

      const updated = await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          ...req.body,
          closedAt: req.body.status === 'closed' ? new Date() : undefined,
        },
      });

      return res.json({
        success: true,
        message: 'Ticket updated successfully',
        data: sanitizeTicket(updated),
      } as SuccessResponse<any>);
    } catch (error: any) {
      logRouteError('Error updating ticket', error);
      return res.status(500).json({ success: false, message: 'Failed to update ticket' } as ErrorResponse);
    }
  }
);

// Owner or staff can close — handler only ever sets `status`, ignoring
// anything else that might be in the body.
router.put(
  '/tickets/:id/close',
  verifyToken,
  requireTicketOwnerOrSupport,
  async (req: AuthRequest, res: Response) => {
    try {
      const ticket = (req as any).ticket;

      if (ticket.status === 'closed') {
        return res.status(400).json({ success: false, message: 'Ticket is already closed' } as ErrorResponse);
      }

      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { status: 'closed', closedAt: new Date() },
      });

      return res.json({ success: true, message: 'Ticket closed successfully' } as SuccessResponse<null>);
    } catch (error: any) {
      logRouteError('Error closing ticket', error);
      return res.status(500).json({ success: false, message: 'Failed to close ticket' } as ErrorResponse);
    }
  }
);

/**
 * Ticket Messages
 */
router.get(
  '/tickets/:ticketId/messages',
  verifyToken,
  requireTicketOwnerOrSupport,
  async (req: AuthRequest, res: Response) => {
    try {
      const ticket = (req as any).ticket;
      const messages = await prisma.supportMessage.findMany({
        where: { ticketId: ticket.id, ...(!(req as any).isSupportStaff ? { isInternal: false } : {}) },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      return res.json({ success: true, data: messages.map(sanitizeMessage) } as SuccessResponse<any[]>);
    } catch (error: any) {
      logRouteError('Error fetching ticket messages', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch messages' } as ErrorResponse);
    }
  }
);

router.post(
  '/tickets/:ticketId/messages',
  verifyToken,
  requireTicketOwnerOrSupport,
  messageRateLimiter,
  validateRequest(createMessageSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const ticket = (req as any).ticket;

      if (ticket.status === 'closed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot post messages on a closed ticket',
        } as ErrorResponse);
      }

      const { content, attachments, isInternal } = req.body;
      if (isInternal && !(req as any).isSupportStaff) {
        return res.status(403).json({ success: false, message: 'Only support staff can create internal messages' } as ErrorResponse);
      }

      const message = await prisma.supportMessage.create({
        data: {
          id: uuidv4(),
          ticketId: ticket.id,
          userId: req.user!.userId,
          message: content,
          attachments: attachments.length ? JSON.stringify(attachments) : null,
          isInternal,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Message added successfully',
        data: sanitizeMessage(message),
      } as SuccessResponse<any>);
    } catch (error: any) {
      logRouteError('Error adding message', error);
      return res.status(500).json({ success: false, message: 'Failed to add message' } as ErrorResponse);
    }
  }
);

/**
 * Support Metrics (Admin/Support staff only)
 */
router.get(
  '/metrics/:period',
  verifyToken,
  requireSupportRole,
  validateParams(metricsParamsSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { period } = req.params as any;

      const now = new Date();
      const since = new Date(now);
      if (period === 'daily') since.setDate(now.getDate() - 1);
      if (period === 'weekly') since.setDate(now.getDate() - 7);
      if (period === 'monthly') since.setMonth(now.getMonth() - 1);

      const [open, pending, resolved, closed, total] = await Promise.all([
        prisma.supportTicket.count({ where: { status: 'open', createdAt: { gte: since } } }),
        prisma.supportTicket.count({ where: { status: 'pending', createdAt: { gte: since } } }),
        prisma.supportTicket.count({ where: { status: 'resolved', createdAt: { gte: since } } }),
        prisma.supportTicket.count({ where: { status: 'closed', createdAt: { gte: since } } }),
        prisma.supportTicket.count({ where: { createdAt: { gte: since } } }),
      ]);

      return res.json({
        success: true,
        data: { period, open, pending, resolved, closed, total },
      } as SuccessResponse<any>);
    } catch (error: any) {
      logRouteError('Error fetching support metrics', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch metrics' } as ErrorResponse);
    }
  }
);

export default router;