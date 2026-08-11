import express, { Request, Response, NextFunction } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { z } from "zod";
import { verifyToken, AuthRequest } from "../middleware/auth";
import { validateWithdrawalRequest, requireWithdrawalAdmin } from "../middleware/withdrawals.middleware";
import * as withdrawalsController from '../controllers/withdrawals.controller';

const router = express.Router();

const createWithdrawalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: AuthRequest) => req.user?.userId ?? ipKeyGenerator(req.ip ?? ''),
    message: { success: false, message: 'Too many withdrawal requests, please try again later' },
});

const adminActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: AuthRequest) => req.user?.userId ?? ipKeyGenerator(req.ip ?? ''),
    message: { success: false, message: 'Too many admin actions, please try again later' },
});

const idParamSchema = z.object({ id: z.string().uuid() });

const periodParamSchema = z.object({
    period: z.string().min(1).max(20).regex(/^[a-zA-Z0-9_]+$/),
});

function validateParams(schema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.params);

        if (!parsed.success) {
            return res.status(400).json({ success: false, message: 'Invalid request parameters' });
        }
        next();
    };
}

router.get('/', verifyToken, requireWithdrawalAdmin, withdrawalsController.getAllWithdrawals);

router.get('/:id', verifyToken, validateParams(idParamSchema), withdrawalsController.getWithdrawalById);

router.post('/', verifyToken, createWithdrawalLimiter, validateWithdrawalRequest, withdrawalsController.requestWithdrawal);

router.put('/:id/approve', verifyToken, requireWithdrawalAdmin, adminActionLimiter, validateParams(idParamSchema), withdrawalsController.approveWithdrawal);

router.put('/:id/reject', verifyToken, requireWithdrawalAdmin, adminActionLimiter, validateParams(idParamSchema), withdrawalsController.rejectWithdrawal);

router.put('/:id/complete', verifyToken, requireWithdrawalAdmin, adminActionLimiter, validateParams(idParamSchema), withdrawalsController.completeWithdrawal);

router.get('/methods/list', verifyToken, withdrawalsController.getWithdrawalMethods);

router.post('/method', verifyToken, requireWithdrawalAdmin, withdrawalsController.addWithdrawalMethod);

router.get('/accounts/my-accounts', verifyToken, withdrawalsController.getUserWithdrawalAccounts);

router.get('/report/:period', verifyToken, requireWithdrawalAdmin, validateParams(periodParamSchema), withdrawalsController.getWithdrawalReport);

export default router;