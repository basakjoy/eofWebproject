import { Request, Response } from 'express';
import { prisma } from '../database';

interface AuthRequest extends Request {
  user?: any;
}

// Whitelisted sortable fields — never trust req.query.sortBy directly
const ALLOWED_SORT_FIELDS = new Set(['rating', 'createdAt', 'name', 'minimumDeposit']);

const handleError = (res: Response, error: any, fallbackMessage: string) => {
  console.error(fallbackMessage, error); // log full detail server-side only
  res.status(500).json({
    success: false,
    message: fallbackMessage, // generic message to client, no error.message leak
  });
};

// Get all brokers
export const getAllBrokers = async (req: Request, res: Response) => {
  try {
    const status = (req.query.status as string) || 'active';
    const sortByRaw = (req.query.sortBy as string) || 'rating';
    const sortBy = ALLOWED_SORT_FIELDS.has(sortByRaw) ? sortByRaw : 'rating';
    const limit = Math.min(Number(req.query.limit) || 20, 100); // cap to prevent huge pulls
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const brokers = await prisma.broker.findMany({
      where: status ? { status } : undefined,
      orderBy: { [sortBy]: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json({ success: true, data: brokers });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch brokers');
  }
};

// Get broker by ID
export const getBrokerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const broker = await prisma.broker.findUnique({ where: { id } });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    res.json({ success: true, data: broker });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch broker');
  }
};

// Create broker — req.body is already validated/sanitized by validateBroker (Zod .strict())
export const createBroker = async (req: Request, res: Response) => {
  try {
    const { name, code, website, logo, email, phone, country, status, rating, minimumDeposit, leverage, spreads, features } = req.body;

    // Prevent duplicate broker codes
    const existing = await prisma.broker.findUnique({ where: { code } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A broker with this code already exists' });
    }

    const broker = await prisma.broker.create({
      data: {
        name,
        code,
        website,
        logo,
        email,
        phone,
        country,
        status: status || 'active',
        rating: rating ? Number(rating) : 0,
        minimumDeposit: minimumDeposit ? Number(minimumDeposit) : null,
        leverage,
        spreads,
        features: features ? JSON.stringify(features) : null,
      },
    });

    res.status(201).json({ success: true, message: 'Broker created successfully', data: broker });
  } catch (error: any) {
    handleError(res, error, 'Failed to create broker');
  }
};

// Update broker — req.body is validated/sanitized by validateBroker; no raw spread
export const updateBroker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, website, logo, email, phone, country, status, rating, minimumDeposit, leverage, spreads, features } = req.body;

    const existing = await prisma.broker.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    await prisma.broker.update({
      where: { id },
      data: {
        name,
        code,
        website,
        logo,
        email,
        phone,
        country,
        status,
        rating: rating !== undefined ? Number(rating) : undefined,
        minimumDeposit: minimumDeposit !== undefined ? Number(minimumDeposit) : undefined,
        leverage,
        spreads,
        features: features ? JSON.stringify(features) : undefined,
      },
    });

    res.json({ success: true, message: 'Broker updated successfully' });
  } catch (error: any) {
    handleError(res, error, 'Failed to update broker');
  }
};

// Delete broker
export const deleteBroker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.broker.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    await prisma.broker.delete({ where: { id } });
    res.json({ success: true, message: 'Broker deleted successfully' });
  } catch (error: any) {
    // If reviews/accounts have FK constraints without onDelete: Cascade, this
    // will throw a foreign key error — consider soft-delete (status: 'archived')
    // instead of hard delete if brokers have existing reviews/accounts.
    handleError(res, error, 'Failed to delete broker');
  }
};

// Add broker review — one review per user per broker
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body; // already validated by validateBrokerReview
    const userId = req.user?.userId;

    const broker = await prisma.broker.findUnique({ where: { id } });
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    const existingReview = await prisma.brokerReview.findFirst({
      where: { brokerId: id, userId },
    });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this broker. Update your existing review instead.',
      });
    }

    await prisma.brokerReview.create({
      data: {
        brokerId: id,
        userId,
        rating: Number(rating),
        comment: comment || null,
      },
    });

    // Recalculate and persist broker's average rating
    const agg = await prisma.brokerReview.aggregate({
      where: { brokerId: id },
      _avg: { rating: true },
    });
    await prisma.broker.update({
      where: { id },
      data: { rating: agg._avg.rating || 0 },
    });

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error: any) {
    handleError(res, error, 'Failed to add review');
  }
};

// Get broker reviews
export const getBrokerReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const reviews = await prisma.brokerReview.findMany({
      where: { brokerId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ success: true, data: reviews });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch reviews');
  }
};

// Connect broker account — validated + ownership enforced via req.user
export const connectBrokerAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { brokerId, accountNumber, accountType, balance, currency = 'USD' } = req.body;
    const userId = req.user?.userId;

    const broker = await prisma.broker.findUnique({ where: { id: brokerId } });
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found' });
    }

    // Prevent the same account number being linked twice by the same user
    const existingAccount = await prisma.brokerAccount.findFirst({
      where: { userId, brokerId, accountNumber },
    });
    if (existingAccount) {
      return res.status(409).json({ success: false, message: 'This account is already connected' });
    }

    await prisma.brokerAccount.create({
      data: {
        userId,
        brokerId,
        accountNumber,
        accountType,
        balance: balance ? Number(balance) : 0,
        currency,
      },
    });

    res.status(201).json({ success: true, message: 'Broker account connected successfully' });
  } catch (error: any) {
    handleError(res, error, 'Failed to connect broker account');
  }
};

// Get user broker accounts — scoped strictly to req.user.userId, no IDOR
export const getUserBrokerAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const accounts = await prisma.brokerAccount.findMany({
      where: { userId },
      include: { broker: { select: { name: true } } },
    });

    const formattedAccounts = accounts.map((acc: any) => ({
      ...acc,
      brokerName: acc.broker?.name,
    }));

    res.json({ success: true, data: formattedAccounts });
  } catch (error: any) {
    handleError(res, error, 'Failed to fetch broker accounts');
  }
};