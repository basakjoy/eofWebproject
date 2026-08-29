import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 2_500_000 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));}
    cb(null, true);
  },
});

// ─── Helpers ────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── GET /api/blog — Public: list published articles ────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      limit = '20',
      offset = '0',
      published,
    } = req.query;

    const where: any = {};

    // Admins can pass published=all to see drafts; public only sees published
    if (published === 'all') {
      // no filter – admin view
    } else {
      where.published = true;
    }

    if (category && category !== 'All') {
      where.category = String(category);
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { keywords: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.faqArticle.findMany({
        where,
        take: parseInt(String(limit)),
        skip: parseInt(String(offset)),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          keywords: true,
          imageUrl: true,
          viewCount: true,
          helpfulCount: true,
          author: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          // Return first 200 chars as excerpt
          content: true,
        },
      }),
      prisma.faqArticle.count({ where }),
    ]);

    // Map content → excerpt (first 200 chars)
    const data = articles.map((a: any) => ({
      ...a,
      excerpt: a.content.slice(0, 200).replace(/[#*`>]/g, '').trim() + '...',
      readTime: Math.max(1, Math.ceil(a.content.split(/\s+/).length / 200)) + ' min read',
    }));

    res.json({ success: true, data, total, limit: parseInt(String(limit)), offset: parseInt(String(offset)) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch articles' });
  }
});

// ─── GET /api/blog/categories — Return unique categories ───
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.faqArticle.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
    });
    const categories = ['All', ...articles.map((a: any) => a.category).filter(Boolean)];
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch categories' });
  }
});

// ─── POST /api/blog/upload — Admin: upload cover image ───────
router.post('/upload', verifyToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(201).json({ success: true, message: 'Image uploaded successfully', data: { imageUrl } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to upload image' });
  }
});

// ─── GET /api/blog/:slug — Public: single article ───────────
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const article = await prisma.faqArticle.findUnique({
      where: { slug: req.params.slug },
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment view count
    await prisma.faqArticle.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({
      success: true,
      data: {
        ...article,
        readTime: Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200)) + ' min read',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch article' });
  }
});

// ─── POST /api/blog — Admin: create article ─────────────────
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, category, content, keywords, imageUrl, published = false, authorId } = req.body;

    let resolvedAuthorId = authorId;
    if (!resolvedAuthorId) {
      const fallbackUser = await prisma.user.findFirst({ select: { id: true } });
      resolvedAuthorId = fallbackUser?.id;
    }

    if (!title || !category || !content || !resolvedAuthorId) {
      return res.status(400).json({
        success: false,
        message: 'title, category, content, and authorId are required',
      });
    }

    // Generate unique slug
    let slug = slugify(title);
    const existing = await prisma.faqArticle.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const article = await prisma.faqArticle.create({
      data: {
        id: uuidv4(),
        title,
        slug,
        category,
        content,
        keywords: keywords || '',
        imageUrl: imageUrl || null,
        author: resolvedAuthorId,
        published: Boolean(published),
      },
    });

    res.status(201).json({ success: true, message: 'Article created successfully', data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create article' });
  }
});

// ─── PUT /api/blog/:id — Admin: update article ──────────────
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, category, content, keywords, imageUrl, published } = req.body;

    const existing = await prisma.faqArticle.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const data: any = {};
    if (title !== undefined) {
      data.title = title;
      // Re-generate slug only if title changed
      if (title !== existing.title) {
        let newSlug = slugify(title);
        const conflict = await prisma.faqArticle.findFirst({
          where: { slug: newSlug, id: { not: req.params.id } },
        });
        if (conflict) newSlug = `${newSlug}-${Date.now()}`;
        data.slug = newSlug;
      }
    }
    if (category !== undefined) data.category = category;
    if (content !== undefined) data.content = content;
    if (keywords !== undefined) data.keywords = keywords;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (published !== undefined) data.published = Boolean(published);

    const updated = await prisma.faqArticle.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, message: 'Article updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update article' });
  }
});

// ─── DELETE /api/blog/:id — Admin: delete article ───────────
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.faqArticle.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await prisma.faqArticle.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete article' });
  }
});

// ─── POST /api/blog/:id/helpful — Mark article as helpful ──
router.post('/:id/helpful', async (req: Request, res: Response) => {
  try {
    const { helpful } = req.body; // true = helpful, false = not helpful
    const field = helpful ? 'helpfulCount' : 'unhelpfulCount';
    await prisma.faqArticle.update({
      where: { id: req.params.id },
      data: { [field]: { increment: 1 } },
    });
    res.json({ success: true, message: 'Feedback recorded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to record feedback' });
  }
});

export default router;
