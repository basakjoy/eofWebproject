import express, { Response } from 'express';
import { prisma } from '../database';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  verifyToken,
  requirePermission,
  requireAnyPermission,
  AuthRequest,
} from '../middleware/auth';
import { Permission, UserRole } from '../types/roles';

const router = express.Router();

// Validation Schemas

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.enum(['active', 'inactive', 'banned']).optional(),
  password: z.string().min(6).optional(),
});

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  status: z.enum(['active', 'inactive']).default('active'),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.enum(['active', 'inactive', 'banned']).optional(),
});

// GET /users — List all users (paginated + filterable)
router.get(
  '/',
  verifyToken,
  requirePermission(Permission.MANAGE_USERS),
  async (req: AuthRequest, res: Response) => {
    const parsed = paginationSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: parsed.error.flatten(),
      });
    }

    const { page, limit, search, role, status } = parsed.data;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      res.status(500).json({ success: false, message });
    }
  }
);

// GET /users/me — Get own profile
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        ...user,
        permissions: req.user!.permissions,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    res.status(500).json({ success: false, message });
  }
});

// GET /users/:id — Get user by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  const isOwnProfile = req.user!.userId === req.params.id;
  const canManageUsers = req.user!.permissions.includes(Permission.MANAGE_USERS);

  if (!isOwnProfile && !canManageUsers) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
      requiredPermission: Permission.MANAGE_USERS,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    res.status(500).json({ success: false, message });
  }
});

// POST /users — Create new user
router.post(
  '/',
  verifyToken,
  requirePermission(Permission.MANAGE_USERS),
  async (req: AuthRequest, res: Response) => {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const { name, email, password, role, status } = parsed.data;

    const adminRoles: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
    if (adminRoles.includes(role) && !req.user!.permissions.includes(Permission.CREATE_ADMIN)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create admin accounts',
        requiredPermission: Permission.CREATE_ADMIN,
      });
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      const newUser = await prisma.user.create({
        data: {
          id,
          name,
          email,
          password: hashedPassword,
          role,
          status,
        },
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      res.status(500).json({ success: false, message });
    }
  }
);

// PUT /users/:id — Update user
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  const isOwnProfile = req.user!.userId === req.params.id;
  const canManageUsers = req.user!.permissions.includes(Permission.MANAGE_USERS);
  const canEditAdmin = req.user!.permissions.includes(Permission.EDIT_ADMIN);

  if (!isOwnProfile && !canManageUsers) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
      requiredPermission: Permission.MANAGE_USERS,
    });
  }

  if ((req.body.role || req.body.status) && !canManageUsers) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to change role or status',
      requiredPermission: Permission.MANAGE_USERS,
    });
  }

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten(),
    });
  }

  const updates = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const adminRoles: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
    if (adminRoles.includes(user.role as any) && !canEditAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit admin accounts',
        requiredPermission: Permission.EDIT_ADMIN,
      });
    }

    if (updates.email && updates.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: updates.email } });
      if (existing && existing.id !== req.params.id) {
        return res.status(409).json({ success: false, message: 'Email is already in use' });
      }
    }

    let hashedPassword = user.password;
    if (updates.password) {
      hashedPassword = await bcrypt.hash(updates.password, 10);
    }

    await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: updates.name ?? user.name,
        email: updates.email ?? user.email,
        role: updates.role ?? user.role,
        status: updates.status ?? user.status,
        password: hashedPassword,
      },
    });

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    res.status(500).json({ success: false, message });
  }
});

// DELETE /users/:id — Delete user
router.delete(
  '/:id',
  verifyToken,
  requirePermission(Permission.MANAGE_USERS),
  async (req: AuthRequest, res: Response) => {
    if (req.user!.userId === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: req.params.id } });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const adminRoles: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
      if (adminRoles.includes(user.role as any) && !req.user!.permissions.includes(Permission.DELETE_ADMIN)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete admin accounts',
          requiredPermission: Permission.DELETE_ADMIN,
        });
      }

      await prisma.user.delete({ where: { id: req.params.id } });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(500).json({ success: false, message });
    }
  }
);

export default router;