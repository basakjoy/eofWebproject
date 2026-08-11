import express, { Response } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
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

const ADMIN_ROLES: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

// Rate limiting
// Mutating endpoints (create/update/delete) are the ones worth throttling —
// listing/reading is already permission-gated and low-risk.
const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AuthRequest) => req.user?.userId ?? ipKeyGenerator(req.ip ?? ''),
  message: { success: false, message: 'Too many requests, please try again later' },
});

const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AuthRequest) => req.user?.userId ?? ipKeyGenerator(req.ip ?? ''),
  message: { success: false, message: 'Too many requests, please try again later' },
});

// Validation Schemas
// .strict() rejects unknown keys instead of silently dropping them —
// cheap defense against clients smuggling unexpected fields.

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const updateUserSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).optional(),
    status: z.enum(['active', 'inactive', 'banned']).optional(),
    password: z.string().min(6).optional(),
  })
  .strict();

const createUserSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole).default(UserRole.USER),
    status: z.enum(['active', 'inactive']).default('active'),
  })
  .strict();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
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
  const idCheck = idParamSchema.safeParse(req.params);
  if (!idCheck.success) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const isOwnProfile = req.user!.userId === idCheck.data.id;
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
      where: { id: idCheck.data.id },
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
  mutationLimiter,
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

    if (ADMIN_ROLES.includes(role) && !req.user!.permissions.includes(Permission.CREATE_ADMIN)) {
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
router.put('/:id', verifyToken, mutationLimiter, async (req: AuthRequest, res: Response) => {
  const idCheck = idParamSchema.safeParse(req.params);
  if (!idCheck.success) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }
  const targetId = idCheck.data.id;

  const isOwnProfile = req.user!.userId === targetId;
  const canManageUsers = req.user!.permissions.includes(Permission.MANAGE_USERS);
  const canEditAdmin = req.user!.permissions.includes(Permission.EDIT_ADMIN);
  const canCreateAdmin = req.user!.permissions.includes(Permission.CREATE_ADMIN);

  if (!isOwnProfile && !canManageUsers) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
      requiredPermission: Permission.MANAGE_USERS,
    });
  }

  const wantsRoleOrStatusChange = req.body.role !== undefined || req.body.status !== undefined;

  if (wantsRoleOrStatusChange && !canManageUsers) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to change role or status',
      requiredPermission: Permission.MANAGE_USERS,
    });
  }

  // Self-action block: never let a user change their own role or status,
  // even if they hold MANAGE_USERS — prevents self-escalation and accidental self-lockout.
  if (isOwnProfile && wantsRoleOrStatusChange) {
    return res.status(400).json({
      success: false,
      message: 'You cannot change your own role or status',
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

  // Escalation guard: promoting a target TO an admin role requires CREATE_ADMIN
  // (mirrors the check already applied on POST /). Previously missing here entirely.
  if (updates.role && ADMIN_ROLES.includes(updates.role) && !canCreateAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to grant admin roles',
      requiredPermission: Permission.CREATE_ADMIN,
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: targetId } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Editing a target that is CURRENTLY an admin requires EDIT_ADMIN
    // (isOwnProfile no longer exempts this — self-edits can't touch role/status anyway).
    if (ADMIN_ROLES.includes(user.role as any) && !canEditAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit admin accounts',
        requiredPermission: Permission.EDIT_ADMIN,
      });
    }

    if (updates.email && updates.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: updates.email } });
      if (existing && existing.id !== targetId) {
        return res.status(409).json({ success: false, message: 'Email is already in use' });
      }
    }

    let hashedPassword = user.password;
    if (updates.password) {
      hashedPassword = await bcrypt.hash(updates.password, 10);
    }

    await prisma.user.update({
      where: { id: targetId },
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
  deleteLimiter,
  async (req: AuthRequest, res: Response) => {
    const idCheck = idParamSchema.safeParse(req.params);
    if (!idCheck.success) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const targetId = idCheck.data.id;

    if (req.user!.userId === targetId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: targetId } });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (ADMIN_ROLES.includes(user.role as any) && !req.user!.permissions.includes(Permission.DELETE_ADMIN)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete admin accounts',
          requiredPermission: Permission.DELETE_ADMIN,
        });
      }

      await prisma.user.delete({ where: { id: targetId } });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(500).json({ success: false, message });
    }
  }
);

export default router;