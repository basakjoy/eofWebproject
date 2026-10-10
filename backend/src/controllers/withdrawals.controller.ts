import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { prisma } from '../database';
import { AuthRequest } from '../middleware/auth';
import { Permission } from '../types/roles';

const fail = (res: Response, message: string) =>
  res.status(500).json({ success: false, message });

const isWithdrawalAdmin = (req: AuthRequest) =>
  ['admin', 'super_admin'].includes(req.user?.role || '') ||
  req.user?.adminScope === 'SUPER_ADMIN' ||
  req.user?.permissions.includes(Permission.PROCESS_WITHDRAWALS) === true;

const idempotencyKeySchema = z.string().regex(/^[\x21-\x7E]{8,128}$/);

export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const parsed = z.object({
      status: z.enum(['pending', 'approved', 'rejected', 'completed']).optional(),
      userId: z.string().max(100).optional(),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      offset: z.coerce.number().int().min(0).max(10_000).default(0),
    }).strict().safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid withdrawal filters' });
    const { status, userId, limit, offset } = parsed.data;
    const data = await prisma.withdrawal.findMany({
      where: { ...(status ? { status } : {}), ...(userId ? { userId } : {}) },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data });
  } catch {
    return fail(res, 'Failed to fetch withdrawals');
  }
};

export const getWithdrawalById = async (req: AuthRequest, res: Response) => {
  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: req.params.id } });
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    if (withdrawal.userId !== req.user!.userId && !isWithdrawalAdmin(req)) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }
    return res.json({ success: true, data: withdrawal });
  } catch {
    return fail(res, 'Failed to fetch withdrawal');
  }
};

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
  const input = z.object({
    amount: z.coerce.number().finite().positive().max(10_000_000),
    currency: z.string().trim().min(3).max(10).default('USD'),
    method: z.string().trim().min(1).max(50),
    accountId: z.string().max(100).optional(),
    reason: z.string().max(500).optional(),
  }).strict().safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, message: 'Invalid withdrawal request' });

  const userId = req.user!.userId;
  const idempotencyKey = req.get('Idempotency-Key');
  if (idempotencyKey && !idempotencyKeySchema.safeParse(idempotencyKey).success) {
    return res.status(400).json({ success: false, message: 'Invalid Idempotency-Key' });
  }
  const { amount, currency, method, accountId, reason } = input.data;

  try {
    if (idempotencyKey) {
      const previous = await prisma.withdrawal.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey } },
      });
      if (previous) {
        if (Number(previous.amount) !== amount || previous.method !== method || previous.currency !== currency ||
            previous.destinationDetails !== (accountId || null)) {
          return res.status(409).json({ success: false, message: 'Idempotency key was already used for a different request' });
        }
        return res.json({ success: true, message: 'Withdrawal request already created', data: { id: previous.id, status: previous.status } });
      }
    }

    const methodRecord = await prisma.withdrawalMethod.findFirst({ where: { code: method, available: true } });
    if (!methodRecord) return res.status(400).json({ success: false, message: 'Invalid or unavailable withdrawal method' });
    if ((methodRecord.minAmount && amount < Number(methodRecord.minAmount)) ||
        (methodRecord.maxAmount && amount > Number(methodRecord.maxAmount))) {
      return res.status(400).json({ success: false, message: 'Amount is outside the allowed range for this method' });
    }
    if (accountId) {
      const account = await prisma.userWithdrawalAccount.findFirst({ where: { id: accountId, userId, methodId: methodRecord.id } });
      if (!account) return res.status(403).json({ success: false, message: 'Withdrawal account not found or not owned by you' });
    }

    const withdrawal = await prisma.$transaction(async (tx) => {
      const limit = await tx.withdrawalLimit.findUnique({ where: { userId } });
      if (limit && (limit.remainingDaily !== null || limit.remainingMonthly !== null)) {
        const where: Prisma.WithdrawalLimitWhereInput = {
          id: limit.id,
          ...(limit.remainingDaily !== null ? { remainingDaily: { gte: amount } } : {}),
          ...(limit.remainingMonthly !== null ? { remainingMonthly: { gte: amount } } : {}),
        };
        const data: Prisma.WithdrawalLimitUpdateManyMutationInput = {
          ...(limit.remainingDaily !== null ? { remainingDaily: { decrement: amount } } : {}),
          ...(limit.remainingMonthly !== null ? { remainingMonthly: { decrement: amount } } : {}),
        };
        const reserved = await tx.withdrawalLimit.updateMany({ where, data });
        if (reserved.count !== 1) throw new Error('WITHDRAWAL_LIMIT_EXCEEDED');
      }

      return tx.withdrawal.create({
        data: {
          id: randomUUID(),
          userId,
          idempotencyKey,
          amount,
          currency: currency.toUpperCase(),
          method,
          destinationDetails: accountId || null,
          reason: reason || null,
          status: 'pending',
        },
      });
    });
    return res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: { id: withdrawal.id, status: withdrawal.status },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'WITHDRAWAL_LIMIT_EXCEEDED') {
      return res.status(400).json({ success: false, message: 'Withdrawal exceeds your limit' });
    }
    if (idempotencyKey && error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const previous = await prisma.withdrawal.findUnique({ where: { userId_idempotencyKey: { userId, idempotencyKey } } });
      if (previous && Number(previous.amount) === amount && previous.method === method) {
        return res.json({ success: true, message: 'Withdrawal request already created', data: { id: previous.id, status: previous.status } });
      }
      if (previous) return res.status(409).json({ success: false, message: 'Idempotency key was already used for a different request' });
    }
    return fail(res, 'Failed to request withdrawal');
  }
};

export const approveWithdrawal = async (req: AuthRequest, res: Response) => {
  const transactionId = z.string().max(100).optional().safeParse(req.body?.transactionId);
  if (!transactionId.success) return res.status(400).json({ success: false, message: 'Invalid transaction id' });
  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: req.params.id } });
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    if (withdrawal.userId === req.user!.userId) return res.status(403).json({ success: false, message: 'You cannot approve your own withdrawal request' });
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.withdrawal.updateMany({
        where: { id: withdrawal.id, status: 'pending' },
        data: { status: 'approved', transactionId: transactionId.data || null, approvedBy: req.user!.userId, approvedAt: new Date() },
      });
      if (result.count !== 1) return false;
      await tx.log.create({ data: { userId: req.user!.userId, action: `APPROVE_WITHDRAWAL: ${withdrawal.id}`, status: 'success' } });
      return true;
    });
    if (!updated) return res.status(409).json({ success: false, message: 'Withdrawal is no longer pending' });
    return res.json({ success: true, message: 'Withdrawal approved successfully' });
  } catch {
    return fail(res, 'Failed to approve withdrawal');
  }
};

export const rejectWithdrawal = async (req: AuthRequest, res: Response) => {
  const rejectionReason = z.string().trim().min(1).max(500).safeParse(req.body?.rejectionReason);
  if (!rejectionReason.success) return res.status(400).json({ success: false, message: 'rejectionReason is required' });
  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: req.params.id } });
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    if (withdrawal.userId === req.user!.userId) return res.status(403).json({ success: false, message: 'You cannot reject your own withdrawal request' });
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.withdrawal.updateMany({
        where: { id: withdrawal.id, status: 'pending' },
        data: { status: 'rejected', rejectionReason: rejectionReason.data, approvedBy: req.user!.userId },
      });
      if (result.count !== 1) return false;
      await tx.log.create({ data: { userId: req.user!.userId, action: `REJECT_WITHDRAWAL: ${withdrawal.id}`, status: 'success' } });
      return true;
    });
    if (!updated) return res.status(409).json({ success: false, message: 'Withdrawal is no longer pending' });
    return res.json({ success: true, message: 'Withdrawal rejected successfully' });
  } catch {
    return fail(res, 'Failed to reject withdrawal');
  }
};

export const completeWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: req.params.id } });
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    if (withdrawal.userId === req.user!.userId) return res.status(403).json({ success: false, message: 'You cannot complete your own withdrawal request' });
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.withdrawal.updateMany({
        where: { id: withdrawal.id, status: 'approved' },
        data: { status: 'completed', completedAt: new Date() },
      });
      if (result.count !== 1) return false;
      await tx.log.create({ data: { userId: req.user!.userId, action: `COMPLETE_WITHDRAWAL: ${withdrawal.id}`, status: 'success' } });
      return true;
    });
    if (!updated) return res.status(409).json({ success: false, message: 'Withdrawal is not approved' });
    return res.json({ success: true, message: 'Withdrawal completed successfully' });
  } catch {
    return fail(res, 'Failed to complete withdrawal');
  }
};

export const addWithdrawalMethod = async (req: Request, res: Response) => {
  const parsed = z.object({
    name: z.string().trim().min(1).max(100),
    code: z.string().trim().min(1).max(50),
    minAmount: z.coerce.number().finite().nonnegative().optional(),
    maxAmount: z.coerce.number().finite().nonnegative().optional(),
    fee: z.coerce.number().finite().nonnegative().max(100).optional(),
    processingTime: z.string().max(100).optional(),
  }).strict().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid withdrawal method' });
  if (parsed.data.minAmount !== undefined && parsed.data.maxAmount !== undefined && parsed.data.minAmount > parsed.data.maxAmount) {
    return res.status(400).json({ success: false, message: 'minAmount cannot exceed maxAmount' });
  }
  try {
    await prisma.withdrawalMethod.create({
      data: {
        id: randomUUID(),
        ...parsed.data,
        fee: parsed.data.fee ?? 0,
      },
    });
    return res.status(201).json({ success: true, message: 'Withdrawal method added successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A withdrawal method with this name or code already exists' });
    }
    return fail(res, 'Failed to add withdrawal method');
  }
};

export const getWithdrawalMethods = async (_req: Request, res: Response) => {
  try {
    const methods = await prisma.withdrawalMethod.findMany({ where: { available: true }, orderBy: { name: 'asc' } });
    return res.json({ success: true, data: methods });
  } catch {
    return fail(res, 'Failed to fetch withdrawal methods');
  }
};

export const getUserWithdrawalAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await prisma.userWithdrawalAccount.findMany({
      where: { userId: req.user!.userId },
      select: {
        id: true,
        userId: true,
        methodId: true,
        accountName: true,
        accountDetails: true,
        isDefault: true,
        verified: true,
        createdAt: true,
        method: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: accounts });
  } catch {
    return fail(res, 'Failed to fetch withdrawal accounts');
  }
};

export const getWithdrawalReport = async (req: Request, res: Response) => {
  try {
    const report = await prisma.withdrawalReport.findFirst({
      where: { period: String(req.params.period) },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: report || { message: 'No report available for this period' } });
  } catch {
    return fail(res, 'Failed to fetch withdrawal report');
  }
};