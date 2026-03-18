import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { validateWithdrawalRequest, requireWithdrawalAdmin } from '../middleware/withdrawals.middleware';
import * as withdrawalsController from '../controllers/withdrawals.controller';

const router = express.Router();

/**
 * Withdrawal Management
 */
router.get('/', verifyToken, withdrawalsController.getAllWithdrawals);
router.get('/:id', verifyToken, withdrawalsController.getWithdrawalById);
router.post('/', verifyToken, validateWithdrawalRequest, withdrawalsController.requestWithdrawal);

/**
 * Admin-only endpoints - approval, rejection
 */
router.put('/:id/approve', verifyToken, requireWithdrawalAdmin, withdrawalsController.approveWithdrawal);
router.put('/:id/reject', verifyToken, requireWithdrawalAdmin, withdrawalsController.rejectWithdrawal);
router.put('/:id/complete', verifyToken, requireWithdrawalAdmin, withdrawalsController.completeWithdrawal);

/**
 * Withdrawal Methods
 */
router.get('/methods/list', withdrawalsController.getWithdrawalMethods);
router.post('/methods', verifyToken, requireWithdrawalAdmin, withdrawalsController.addWithdrawalMethod);

/**
 * User Withdrawal Accounts
 */
router.get('/accounts/my-accounts', verifyToken, withdrawalsController.getUserWithdrawalAccounts);

/**
 * Reports
 */
router.get('/report/:period', withdrawalsController.getWithdrawalReport);

export default router;
