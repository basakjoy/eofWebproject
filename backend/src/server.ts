
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeTables, seedInitialData } from './database';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investments';

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
    
    // Seed initial data
    await seedInitialData();
    console.log('');

    // Register routes
    app.use('/api/auth', authRoutes);
    app.use('/api/investments', investmentRoutes);

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
      console.log('  POST   /api/auth/register');
      console.log('  POST   /api/auth/login');
      console.log('  GET    /api/auth/verify');
      console.log('  GET    /api/auth/me');
      console.log('  GET    /api/investments');
      console.log('  POST   /api/investments');
      console.log('  GET    /api/investments/:id');
      console.log('  PUT    /api/investments/:id');
      console.log('  DELETE /api/investments/:id\n');
    });
  } catch (error: any) {
    console.error('\n ❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
};

startServer();

export default app;