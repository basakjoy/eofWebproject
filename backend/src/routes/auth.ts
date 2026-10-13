import express, { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { prisma } from '../database';
import { authLimiter } from '../middleware/rateLimiter';
import { createAccessToken, createSessionTokens, hashRefreshToken, verifyAccessToken } from '../lib/tokens';
import { getBearerToken } from '../middleware/auth';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registrationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(72),
  phone: z.string().max(30).optional(),
  userType: z.enum(['user', 'investor']).optional(),
}).strict();
const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
}).strict();
const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
}).strict();
const resetPasswordSchema = z.object({
  token: z.string().length(64).regex(/^[a-f0-9]+$/),
  password: z.string().min(6).max(72),
}).strict();
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const PASSWORD_RESET_RESPONSE = 'If an eligible account exists for that email, a password reset link has been sent.';

interface AuthRequest extends Request {
  user?: any;
}

// Register endpoint
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid registration details' });
    const { name, email, password, phone, userType = 'user' } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone ? String(phone).replace(/(?!^\+)\D/g, '') : null;

    if (normalizedPhone && !/^\+[1-9]\d{6,14}$/.test(normalizedPhone)) {
      return res.status(400).json({ success: false, message: 'Phone must include a valid country code' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: normalizedPhone,
        role: userType,
        status: 'active',
      },
    });

    // Create JWT token
    const tokens = await createSessionTokens(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ...tokens,
      },
    });
  } catch (error: any) {
    console.error('Registration failed');
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;

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
    const tokens = await createSessionTokens(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminScope: user.adminScope,
        phone: user.phone,
        ...tokens,
      },
    });
  } catch (error: any) {
    console.error('Login failed');
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

router.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address' });
  }

  try {
    await prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: { id: true, email: true, status: true },
    });

    if (user && ['active', 'inactive'].includes(user.status)) {
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await prisma.$transaction([
        prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
        prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
          },
        }),
      ]);

      try {
        const smtpHost = process.env.SMTP_HOST?.trim();
        const smtpUser = process.env.SMTP_USER?.trim();
        const smtpPassword = process.env.SMTP_PASSWORD;
        const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser;
        const frontendUrl = process.env.FRONTEND_URL?.trim() ||
          (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
        if (!smtpHost || !smtpUser || !smtpPassword || !smtpFrom || !frontendUrl) {
          throw new Error('Password reset email is not configured');
        }

        const port = Number(process.env.SMTP_PORT) || 587;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port,
          secure: port === 465,
          auth: { user: smtpUser, pass: smtpPassword },
        });
        const resetUrl = new URL('/forgot-password', frontendUrl);
        resetUrl.searchParams.set('token', token);
        await transporter.sendMail({
          from: smtpFrom,
          to: user.email,
          subject: 'Reset your Empire of Forex password',
          text: `Use this link to reset your password: ${resetUrl.toString()}\nThis link expires in 30 minutes. If you did not request a reset, you can ignore this email.`,
          html: `<p>We received a request to reset your Empire of Forex password.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request a reset, you can ignore this email.</p>`,
        });
      } catch (emailError) {
        await prisma.passwordResetToken.deleteMany({ where: { tokenHash } });
        console.error('Password reset email delivery failed');
      }
    }

    return res.json({ success: true, message: PASSWORD_RESET_RESPONSE });
  } catch (error) {
    console.error('Password reset request failed');
    return res.status(500).json({ success: false, message: 'Unable to process the password reset request' });
  }
});

router.post('/reset-password', authLimiter, async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid password reset request' });
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!resetToken || resetToken.expiresAt <= new Date()) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    const resetSucceeded = await prisma.$transaction(async (transaction) => {
      const consumed = await transaction.passwordResetToken.deleteMany({
        where: { id: resetToken.id, expiresAt: { gt: new Date() } },
      });
      if (consumed.count !== 1) return false;

      const updated = await transaction.user.updateMany({
        where: { id: resetToken.userId, status: { in: ['active', 'inactive'] } },
        data: {
          password: hashedPassword,
          status: 'active',
          tokenVersion: { increment: 1 },
        },
      });
      if (updated.count !== 1) return false;

      await transaction.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await transaction.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } });
      return true;
    });

    if (!resetSucceeded) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired' });
    }
    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset failed');
    return res.status(500).json({ success: false, message: 'Unable to reset the password' });
  }
});

router.post('/refresh', authLimiter, async (req: Request, res: Response) => {
  const parsed = z.object({ refreshToken: z.string().min(40).max(200) }).strict().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid refresh token request' });
  }

  const now = new Date();
  const tokenHash = hashRefreshToken(parsed.data.refreshToken);
  try {
    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { select: { id: true, email: true, role: true, status: true, tokenVersion: true } } },
    });
    if (!stored) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    if (stored.consumedAt) {
      await prisma.$transaction(async (tx) => {
        await tx.refreshToken.updateMany({ where: { familyId: stored.familyId, revokedAt: null }, data: { revokedAt: now } });
        await tx.refreshToken.updateMany({ where: { userId: stored.userId, revokedAt: null }, data: { revokedAt: now } });
        await tx.user.update({ where: { id: stored.userId }, data: { tokenVersion: { increment: 1 } } });
      });
      return res.status(401).json({ success: false, message: 'Refresh token reuse detected' });
    }

    if (stored.revokedAt || stored.expiresAt <= now || stored.user.status !== 'active' ||
        stored.tokenVersion !== stored.user.tokenVersion) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const nextRefreshToken = crypto.randomBytes(48).toString('base64url');
    const nextTokenHash = hashRefreshToken(nextRefreshToken);
    const rotated = await prisma.$transaction(async (tx) => {
      const consumed = await tx.refreshToken.updateMany({
        where: { id: stored.id, consumedAt: null, revokedAt: null, expiresAt: { gt: now } },
        data: { consumedAt: now },
      });
      if (consumed.count !== 1) return false;
      await tx.refreshToken.create({
        data: {
          id: randomUUID(),
          userId: stored.userId,
          tokenHash: nextTokenHash,
          familyId: stored.familyId,
          tokenVersion: stored.user.tokenVersion,
          expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      return true;
    });

    if (!rotated) {
      await prisma.$transaction(async (tx) => {
        await tx.refreshToken.updateMany({ where: { userId: stored.userId, revokedAt: null }, data: { revokedAt: now } });
        await tx.user.update({ where: { id: stored.userId }, data: { tokenVersion: { increment: 1 } } });
      });
      return res.status(401).json({ success: false, message: 'Refresh token reuse detected' });
    }

    return res.json({
      success: true,
      data: {
        token: createAccessToken(stored.user),
        refreshToken: nextRefreshToken,
      },
    });
  } catch (error) {
    console.error('Refresh token processing failed');
    return res.status(500).json({ success: false, message: 'Unable to refresh session' });
  }
});

// Verify token endpoint
router.get('/verify', async (req: AuthRequest, res: Response) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, adminScope: true, status: true, tokenVersion: true },
    });

    if (!user || user.status !== 'active' || user.tokenVersion !== decoded.authVersion) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const { status: _status, tokenVersion: _tokenVersion, ...publicUser } = user;

    res.json({
      success: true,
      data: publicUser,
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
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, status: true, adminScope: true, tokenVersion: true },
    });

    if (!user || user.status !== 'active' || user.tokenVersion !== decoded.authVersion) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const { tokenVersion: _tokenVersion, ...publicUser } = user;

    res.json({
      success: true,
      data: publicUser,
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
    const parsed = z.object({ idToken: z.string().min(20).max(8192) }).strict().safeParse(req.body);
    if (!parsed.success || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(parsed.success ? 503 : 400).json({
        success: false,
        message: parsed.success ? 'Google login is not configured' : 'A valid Google ID token is required',
      });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({ idToken: parsed.data.idToken, audience: process.env.GOOGLE_CLIENT_ID });
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid Google ID token' });
    }
    const payload = ticket.getPayload();
    if (!payload?.email || payload.email_verified !== true) {
      return res.status(401).json({ success: false, message: 'Google account email is not verified' });
    }
    const email = payload.email.trim().toLowerCase();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create one
    if (!user) {
      const hashedPassword = await bcrypt.hash(randomUUID(), 12);
      
      user = await prisma.user.create({
        data: {
          id: randomUUID(),
          name: payload.name?.slice(0, 100) || email.split('@')[0],
          email,
          password: hashedPassword,
          role: 'user',
          status: 'active',
        },
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Your account is not active' });
    }

    // Generate JWT token
    const tokens = await createSessionTokens(user);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...tokens,
      },
    });
  } catch {
    console.error('Google OAuth verification failed');
    res.status(500).json({
      success: false,
      message: 'Google OAuth login failed',
    });
  }
});

export default router;
