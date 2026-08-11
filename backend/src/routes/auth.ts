import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../database';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Register endpoint
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, password, userType = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Validate userType
    if (!['user', 'investor'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be "user" or "investor"',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role: userType,
        status: 'active',
      },
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Your account is not active',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
});

// Get current user endpoint
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
});

// Google OAuth endpoint
router.post('/google', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, name, googleId } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for Google login',
      });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create one
    if (!user) {
      const hashedPassword = await bcrypt.hash(googleId || 'google-auth', 10);
      
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: name || email.split('@')[0],
          email,
          password: hashedPassword,
          role: 'user',
          status: 'active',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Google OAuth login failed',
    });
  }
});

export default router;
