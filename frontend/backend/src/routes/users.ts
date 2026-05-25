import express, { Response } from 'express';
import { allAsync, getAsync, runAsync } from '../database';
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
// Requires: MANAGE_USERS permission
// Access: super_admin, admin


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

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push('(u.name LIKE ? OR u.email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      conditions.push('u.role = ?');
      params.push(role);
    }
    if (status) {
      conditions.push('u.status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    try {
      const [users, countRow] = await Promise.all([
        allAsync(
          `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at
           FROM users u
           ${whereClause}
           ORDER BY u.created_at DESC
           LIMIT ? OFFSET ?`,
          [...params, limit, offset]
        ),
        getAsync(
          `SELECT COUNT(*) as total FROM users u ${whereClause}`,
          params
        ),
      ]);

      const total = (countRow as any).total;

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
// Requires: valid token only (any role)


router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getAsync(
      `SELECT id, name, email, role, status, created_at FROM users WHERE id = ?`,
      [req.user!.userId]
    );

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
// Requires: MANAGE_USERS permission OR own profile
// Access: super_admin, admin, or self


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
    const user = await getAsync(
      `SELECT id, name, email, role, status, created_at FROM users WHERE id = ?`,
      [req.params.id]
    );

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
// Requires: MANAGE_USERS permission
// Creating admin roles additionally requires CREATE_ADMIN
// Access: super_admin, admin


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

    // Creating an admin/super_admin requires CREATE_ADMIN permission
    const adminRoles: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
    if (adminRoles.includes(role) && !req.user!.permissions.includes(Permission.CREATE_ADMIN)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create admin accounts',
        requiredPermission: Permission.CREATE_ADMIN,
      });
    }

    try {
      const existing = await getAsync('SELECT id FROM users WHERE email = ?', [email]);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      await runAsync(
        `INSERT INTO users (id, name, email, password, role, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [id, name, email, hashedPassword, role, status]
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { id, name, email, role, status },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      res.status(500).json({ success: false, message });
    }
  }
);


// PUT /users/:id — Update user
// Requires: MANAGE_USERS OR own profile
// Editing an admin account requires EDIT_ADMIN
// Changing role requires MANAGE_USERS
// Access: super_admin, admin, or self (limited)


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

  // Only MANAGE_USERS can change role or status
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
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [req.params.id]) as any;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Editing an admin/super_admin account requires EDIT_ADMIN permission
    const adminRoles: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
    if (adminRoles.includes(user.role) && !canEditAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit admin accounts',
        requiredPermission: Permission.EDIT_ADMIN,
      });
    }

    // Check email uniqueness
    if (updates.email && updates.email !== user.email) {
      const existing = await getAsync(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [updates.email, req.params.id]
      );
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already in use' });
      }
    }

    // Hash new password if provided
    let hashedPassword = user.password;
    if (updates.password) {
      hashedPassword = await bcrypt.hash(updates.password, 10);
    }

    await runAsync(
      `UPDATE users
       SET name = ?, email = ?, role = ?, status = ?, password = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        updates.name ?? user.name,
        updates.email ?? user.email,
        updates.role ?? user.role,
        updates.status ?? user.status,
        hashedPassword,
        req.params.id,
      ]
    );

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    res.status(500).json({ success: false, message });
  }
});


// DELETE /users/:id — Delete user
// Requires: MANAGE_USERS permission
// Deleting an admin requires DELETE_ADMIN permission
// Cannot delete own account
// Access: super_admin, admin


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
      const user = await getAsync('SELECT * FROM users WHERE id = ?', [req.params.id]) as any;

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Deleting an admin/super_admin requires DELETE_ADMIN permission
      const adminRoles: string[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
      if (adminRoles.includes(user.role) && !req.user!.permissions.includes(Permission.DELETE_ADMIN)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete admin accounts',
          requiredPermission: Permission.DELETE_ADMIN,
        });
      }

      await runAsync('DELETE FROM users WHERE id = ?', [req.params.id]);

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(500).json({ success: false, message });
    }
  }
);

export default router;