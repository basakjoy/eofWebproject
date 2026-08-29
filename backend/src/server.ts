
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import helmet from 'helmet';
import hpp from 'hpp';
import { globalLimiter } from './middleware/rateLimiter';
import path from 'path';
import http from 'http';
import { setupSupportWebSocket } from './websocket/supportHandler';
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

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
// Security Middleware
app.use(helmet());
app.use(hpp());

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});



// Start server
const startServer = async () => {
  try {
    console.log('\n Starting server...\n');

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
      console.error('Error:', err.message);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {},
      });
    });

    // Create HTTP server and attach WebSocket
    const server = http.createServer(app);
    setupSupportWebSocket(server);

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
      console.log('    WS     /ws/support (WebSocket support chat)');
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