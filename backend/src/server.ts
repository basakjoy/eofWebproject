
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeTables, seedInitialData, runAsync } from './database';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investments';
import transactionsRoutes from './routes/transactions';
import signalsRoutes from './routes/signals';
import adminRoutes from './routes/admin';
import analysisRoutes from './routes/analysis';
import brokersRoutes from './routes/brokers';
import withdrawalsRoutes from './routes/withdrawals';
import notificationsRoutes from './routes/notifications';
import supportRoutes from './routes/support';
import { initAdminTables } from './models/admin.model';
import { initAnalysisTables } from './models/analysis.model';
import { initBrokersTables } from './models/brokers.model';
import { initWithdrawalsTables } from './models/withdrawals.model';
import { initNotificationsTables } from './models/notifications.model';
import { initSupportTables } from './models/support.model';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('\n Starting server...\n');
    
    // Initialize tables first
    await initializeTables();
    console.log('');
    
    // Initialize new module tables
    console.log('Initializing new module tables...');
    await initAdminTables(runAsync);
    console.log('✓ Admin tables ready');
    
    await initAnalysisTables(runAsync);
    console.log('✓ Analysis tables ready');
    
    await initBrokersTables(runAsync);
    console.log('✓ Brokers tables ready');
    
    await initWithdrawalsTables(runAsync);
    console.log('✓ Withdrawals tables ready');
    
    await initNotificationsTables(runAsync);
    console.log('✓ Notifications tables ready');
    
    await initSupportTables(runAsync);
    console.log('✓ Support tables ready');
    console.log('');
    
    // Seed initial data
    await seedInitialData();
    console.log('');

    // Register routes
    app.use('/api/auth', authRoutes);
    app.use('/api/investments', investmentRoutes);
    app.use('/api/transactions', transactionsRoutes);
    app.use('/api/signals', signalsRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/analysis', analysisRoutes);
    app.use('/api/brokers', brokersRoutes);
    app.use('/api/withdrawals', withdrawalsRoutes);
    app.use('/api/notifications', notificationsRoutes);
    app.use('/api/support', supportRoutes);

    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
      });
    });

    app.listen(PORT, () => {
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
      console.log('    GET    /api/support/categories\n');
    });
  } catch (error: any) {
    console.error('\n ❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
};

startServer();

export default app;