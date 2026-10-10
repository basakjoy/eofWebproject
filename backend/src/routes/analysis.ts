import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = Router();
const idSchema = z.string().min(1).max(100);
const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  content: z.string().max(20_000).optional(),
  pair: z.string().max(30).optional(),
  timeframe: z.string().max(30).optional(),
  sentiment: z.enum(['bullish', 'bearish', 'neutral']).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  technicalLevel: z.number().min(0).max(100).optional(),
}).strict().refine((value) => Boolean(value.description || value.content), 'description or content is required');

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  content: z.string().max(20_000).optional(),
  pair: z.string().max(30).optional(),
  timeframe: z.string().max(30).optional(),
  sentiment: z.enum(['bullish', 'bearish', 'neutral']).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  technicalLevel: z.number().min(0).max(100).optional(),
  publish: z.boolean().optional(),
}).strict();

const commentSchema = z.object({
  comment: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
}).strict();

const isAdmin = (req: AuthRequest) =>
  ['admin', 'super_admin'].includes(req.user?.role || '') || req.user?.adminScope === 'SUPER_ADMIN';

const mapAnalysis = (analysis: any) => {
  let metrics: Record<string, unknown> = {};
  try {
    metrics = analysis.metricsData ? JSON.parse(analysis.metricsData) : {};
  } catch {
    metrics = {};
  }
  return {
    id: analysis.id,
    title: analysis.title,
    description: metrics.description,
    content: analysis.content,
    pair: analysis.symbol,
    timeframe: metrics.timeframe,
    sentiment: metrics.sentiment || analysis.type,
    tags: metrics.tags || [],
    technicalLevel: metrics.technicalLevel,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
    createdBy: analysis.createdBy,
    status: analysis.status,
    viewCount: analysis.viewCount,
  };
};

const canRead = (req: AuthRequest, analysis: { createdBy: string; status: string }) =>
  analysis.createdBy === req.user!.userId || isAdmin(req) || ['published', 'active'].includes(analysis.status);

const sendFailure = (res: Response, message: string) =>
  res.status(500).json({ success: false, message });

router.use(verifyToken);

router.get('/', async (req: AuthRequest, res: Response) => {
  const parsed = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).max(10_000).default(0),
    userId: z.string().max(100).optional(),
    status: z.enum(['draft', 'published', 'active']).optional(),
    type: z.string().max(50).optional(),
  }).strict().safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid analysis filters' });
  const { limit, offset, userId, status, type } = parsed.data;
  if (userId && !isAdmin(req)) return res.status(403).json({ success: false, message: 'Insufficient permissions' });
  const visibility = isAdmin(req)
    ? (userId ? { createdBy: userId } : {})
    : { OR: [{ createdBy: req.user!.userId }, { status: { in: ['published', 'active'] } }] };
  const where = {
    AND: [
      visibility,
      ...(status ? [{ status }] : []),
      ...(type ? [{ type }] : []),
    ],
  };
  try {
    const [rows, total] = await Promise.all([
      prisma.analysis.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
      prisma.analysis.count({ where }),
    ]);
    return res.json({ success: true, message: 'analysis found', data: rows.map(mapAnalysis), total, limit, offset });
  } catch {
    return sendFailure(res, 'Failed to fetch analysis');
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed' });
  try {
    const { title, description, content, pair, timeframe, sentiment = 'neutral', tags = [], technicalLevel } = parsed.data;
    const analysis = await prisma.analysis.create({
      data: {
        title,
        content: content || description!,
        type: sentiment,
        symbol: pair,
        createdBy: req.user!.userId,
        metricsData: JSON.stringify({ description: description || '', timeframe, sentiment, tags, technicalLevel }),
      },
    });
    return res.status(201).json({ success: true, message: 'Analysis created successfully', data: mapAnalysis(analysis) });
  } catch {
    return sendFailure(res, 'Failed to create analysis');
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ success: false, message: 'Invalid analysis id' });
  try {
    const analysis = await prisma.analysis.findUnique({ where: { id: req.params.id } });
    if (!analysis || !canRead(req, analysis)) return res.status(404).json({ success: false, message: 'Analysis not found' });
    await prisma.analysis.update({ where: { id: analysis.id }, data: { viewCount: { increment: 1 } } });
    return res.json({ success: true, data: mapAnalysis({ ...analysis, viewCount: analysis.viewCount + 1 }) });
  } catch {
    return sendFailure(res, 'Failed to fetch analysis');
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ success: false, message: 'Invalid analysis id' });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed' });
  try {
    const current = await prisma.analysis.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ success: false, message: 'Analysis not found' });
    if (current.createdBy !== req.user!.userId && !isAdmin(req)) return res.status(404).json({ success: false, message: 'Analysis not found' });
    const { title, description, content, pair, timeframe, sentiment, tags, technicalLevel, publish } = parsed.data;
    if (publish !== undefined && !isAdmin(req)) return res.status(403).json({ success: false, message: 'Only an admin can publish analysis' });
    let metrics: Record<string, unknown> = {};
    try { metrics = current.metricsData ? JSON.parse(current.metricsData) : {}; } catch { metrics = {}; }
    const updated = await prisma.analysis.update({
      where: { id: current.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : description !== undefined ? { content: description } : {}),
        ...(pair !== undefined ? { symbol: pair } : {}),
        ...(sentiment !== undefined ? { type: sentiment } : {}),
        ...(publish !== undefined ? { status: publish ? 'published' : 'draft' } : {}),
        ...((description !== undefined || timeframe !== undefined || sentiment !== undefined || tags !== undefined || technicalLevel !== undefined)
          ? { metricsData: JSON.stringify({ ...metrics, ...(description !== undefined ? { description } : {}), ...(timeframe !== undefined ? { timeframe } : {}), ...(sentiment !== undefined ? { sentiment } : {}), ...(tags !== undefined ? { tags } : {}), ...(technicalLevel !== undefined ? { technicalLevel } : {}) }) }
          : {}),
      },
    });
    return res.json({ success: true, message: 'Analysis updated', data: mapAnalysis(updated) });
  } catch {
    return sendFailure(res, 'Failed to update analysis');
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ success: false, message: 'Invalid analysis id' });
  try {
    const analysis = await prisma.analysis.findUnique({ where: { id: req.params.id } });
    if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' });
    if (analysis.createdBy !== req.user!.userId && !isAdmin(req)) return res.status(404).json({ success: false, message: 'Analysis not found' });
    await prisma.analysis.delete({ where: { id: analysis.id } });
    return res.json({ success: true, message: 'Analysis deleted' });
  } catch {
    return sendFailure(res, 'Failed to delete analysis');
  }
});

router.get('/:id/comments', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ success: false, message: 'Invalid analysis id' });
  try {
    const analysis = await prisma.analysis.findUnique({ where: { id: req.params.id } });
    if (!analysis || !canRead(req, analysis)) return res.status(404).json({ success: false, message: 'Analysis not found' });
    const comments = await prisma.analysisComment.findMany({
      where: { analysisId: analysis.id },
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.json({ success: true, data: comments });
  } catch {
    return sendFailure(res, 'Failed to fetch comments');
  }
});

router.post('/:id/comments', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ success: false, message: 'Invalid analysis id' });
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid comment' });
  try {
    const analysis = await prisma.analysis.findUnique({ where: { id: req.params.id } });
    if (!analysis || !canRead(req, analysis)) return res.status(404).json({ success: false, message: 'Analysis not found' });
    const comment = await prisma.analysisComment.create({ data: { ...parsed.data, analysisId: analysis.id, userId: req.user!.userId } });
    return res.status(201).json({ success: true, message: 'Comment added', data: comment });
  } catch {
    return sendFailure(res, 'Failed to add comment');
  }
});

router.put('/:id/comments/:commentId', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success || !idSchema.safeParse(req.params.commentId).success) {
    return res.status(400).json({ success: false, message: 'Invalid comment id' });
  }
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid comment' });
  try {
    const result = await prisma.analysisComment.updateMany({
      where: { id: req.params.commentId, analysisId: req.params.id, userId: req.user!.userId },
      data: parsed.data,
    });
    if (!result.count) return res.status(404).json({ success: false, message: 'Comment not found' });
    return res.json({ success: true, message: 'Comment updated' });
  } catch {
    return sendFailure(res, 'Failed to update comment');
  }
});

router.delete('/:id/comments/:commentId', async (req: AuthRequest, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success || !idSchema.safeParse(req.params.commentId).success) {
    return res.status(400).json({ success: false, message: 'Invalid comment id' });
  }
  try {
    const result = await prisma.analysisComment.deleteMany({
      where: { id: req.params.commentId, analysisId: req.params.id, userId: req.user!.userId },
    });
    if (!result.count) return res.status(404).json({ success: false, message: 'Comment not found' });
    return res.json({ success: true, message: 'Comment deleted' });
  } catch {
    return sendFailure(res, 'Failed to delete comment');
  }
});

export default router;