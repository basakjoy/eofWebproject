
import './config/env';
import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import { randomUUID } from 'crypto';
import helmet from 'helmet';
import hpp from 'hpp';
import { closeRateLimitStore, connectRateLimitStore, globalLimiter } from './middleware/rateLimiter';
import path from 'path';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investments';
import transactionsRoutes from './routes/transactions';
import signalsRoutes from './routes/signals';
import adminRoutes from './routes/admin';
import adminManagementRoutes from './routes/admin-management';
import analysisRoutes from './routes/analysis';
import brokersRoutes from './routes/brokers';
import withdrawalsRoutes from './routes/withdrawals';
import notificationsRoutes from './routes/notifications';
import supportRoutes from './routes/support';
import usersRoutes from './routes/users';
import blogRoutes from './routes/blog';
import { setupSupportWebSocket } from './websocket/supportHandler';
import { prisma } from './database';
import { resolveJwtSecret } from './lib/tokens';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 1);
if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0) throw new Error('TRUST_PROXY_HOPS must be a non-negative integer');
app.set('trust proxy', trustProxyHops);

// Middleware
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
// Security Middleware
app.use(helmet());
app.use(hpp());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  (req as Request & { requestId?: string }).requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  console.info(JSON.stringify({ level: 'info', event: 'http_request', requestId, method: req.method, path: req.path }));
  next();
});

// Rate Limiting (apply to all /api routes)
app.use('/api', globalLimiter);

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) 
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true'
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb', parameterLimit: 100 }));
app.use('/uploads', express.static(uploadsPath));

// Handle OPTIONS preflight requests for CORS
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true'
}));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});



// Start server
const startServer = async () => {
  try {
    console.log('\n Starting server...\n');
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 32) {
        throw new Error('JWT_SECRET must be configured with at least 32 characters');
      }
    } else {
      resolveJwtSecret();
    }
    if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN?.trim()) {
      throw new Error('CORS_ORIGIN must be configured in production');
    }
    if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
      throw new Error('REDIS_URL must be configured in production for distributed rate limiting');
    }
    await connectRateLimitStore();

    // Register routes
    app.use('/api/auth', authRoutes);
    app.use('/api/investments', investmentRoutes);
    app.use('/api/transactions', transactionsRoutes);
    app.use('/api/signals', signalsRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/admin/management', adminManagementRoutes);
    app.use('/api/analysis', analysisRoutes);
    app.use('/api/brokers', brokersRoutes);
    app.use('/api/withdrawals', withdrawalsRoutes);
    app.use('/api/notifications', notificationsRoutes);
    app.use('/api/support', supportRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api/blog', blogRoutes);

    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
      });
    });

    // Error handling middleware (must be after routes)
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) return next(err);
      const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500 ? err.status : 500;
      console.error(JSON.stringify({
        level: 'error',
        event: 'http_error',
        requestId: (req as Request & { requestId?: string }).requestId,
        status,
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      }));
      res.status(status).json({
        success: false,
        message: status === 500 ? 'Internal Server Error' : err.message || 'Request failed',
      });
    });

    const server = http.createServer(app);
    server.requestTimeout = 30_000;
    server.headersTimeout = 15_000;
    server.keepAliveTimeout = 5_000;
    const supportWss = setupSupportWebSocket(server);

    const shutdown = (signal: string) => {
      console.info(JSON.stringify({ level: 'info', event: 'shutdown_started', signal }));
      server.close(() => {
        supportWss.clients.forEach((client) => client.terminate());
        supportWss.close(() => {
          void Promise.all([prisma.$disconnect(), closeRateLimitStore()]).finally(() => process.exit(0));
        });
      });
      const forceExit = setTimeout(() => process.exit(1), 10_000);
      forceExit.unref();
    };
    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('SIGINT', () => shutdown('SIGINT'));

    server.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}\n`);
      console.log('Available endpoints:');
      console.log('\n   Auth:');
      console.log('    POST   /api/auth/register');
      console.log('    POST   /api/auth/login');
      console.log('    GET    /api/auth/verify');
      console.log('    GET    /api/auth/me');
      console.log('\n   Investments:');
      console.log('    GET    /api/investments');
      console.log('    POST   /api/investments');
      console.log('    GET    /api/investments/:id');
      console.log('    PUT    /api/investments/:id');
      console.log('    DELETE /api/investments/:id');
      console.log('\n   Admin:');
      console.log('    GET    /api/admin/users');
      console.log('    POST   /api/admin/users');
      console.log('    PUT    /api/admin/users/:id');
      console.log('    DELETE /api/admin/users/:id');
      console.log('    POST   /api/admin/logs');
      console.log('    GET    /api/admin/dashboard/stats');
      console.log('\n   Analysis:');
      console.log('    GET    /api/analysis');
      console.log('    POST   /api/analysis');
      console.log('    GET    /api/analysis/:id');
      console.log('    PUT    /api/analysis/:id');
      console.log('    DELETE /api/analysis/:id');
      console.log('    POST   /api/analysis/:id/comments');
      console.log('\n   Brokers:');
      console.log('    GET    /api/brokers');
      console.log('    POST   /api/brokers');
      console.log('    GET    /api/brokers/:id');
      console.log('    PUT    /api/brokers/:id');
      console.log('    POST   /api/brokers/:id/reviews');
      console.log('    POST   /api/brokers/accounts/connect');
      console.log('\n   Withdrawals:');
      console.log('    GET    /api/withdrawals');
      console.log('    POST   /api/withdrawals');
      console.log('    PUT    /api/withdrawals/:id/approve');
      console.log('    PUT    /api/withdrawals/:id/reject');
      console.log('    GET    /api/withdrawals/methods/list');
      console.log('\n   Notifications:');
      console.log('    GET    /api/notifications');
      console.log('    PUT    /api/notifications/:id/read');
      console.log('    GET    /api/notifications/preferences/get');
      console.log('    PUT    /api/notifications/preferences/update');
      console.log('\n    Support:');
      console.log('    GET    /api/support/tickets');
      console.log('    POST   /api/support/tickets');
      console.log('    GET    /api/support/tickets/:id');
      console.log('    POST   /api/support/tickets/:ticketId/messages');
      console.log('    GET    /api/support/faq');
      console.log('    GET    /api/support/categories');
      console.log('\n   Blog:');
      console.log('    GET    /api/blog');
      console.log('    GET    /api/blog/categories');
      console.log('    GET    /api/blog/:slug');
      console.log('    POST   /api/blog/upload');
      console.log('    POST   /api/blog');
      console.log('    PUT    /api/blog/:id');
      console.log('    DELETE /api/blog/:id\n');
    });
  } catch (error: any) {
    console.error('\n ❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
};

startServer();

export default app;