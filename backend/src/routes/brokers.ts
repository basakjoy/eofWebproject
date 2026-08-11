import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { validateBroker, validateBrokerReview } from '../middleware/brokers.middleware';
import * as brokersController from '../controllers/brokers.controller';
import { apiLimiter, reviewLimiter } from '../middleware/rateLimiter';


const router = express.Router();



/**
 * Public endpoints - broker listings
 */
router.get('/', brokersController.getAllBrokers);
router.get('/:id', brokersController.getBrokerById);
router.get('/:id/reviews', brokersController.getBrokerReviews);

/**
 * Protected endpoints - require authentication
 */

/**
 * Broker Management (Admin only - could add requireAdmin middleware)
 */
router.post('/', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN    ']), validateBroker, brokersController.createBroker);
router.put('/:id', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN']), validateBroker, brokersController.updateBroker);
router.delete('/:id', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN']), brokersController.deleteBroker);

/**
 * Reviews
 */
router.post('/:id/reviews', verifyToken, validateBrokerReview, reviewLimiter, brokersController.addReview);

/**
 * User Broker Accounts
 */
router.post('/accounts/connect', verifyToken, apiLimiter, brokersController.connectBrokerAccount);
router.get('/accounts/my-accounts', verifyToken, brokersController.getUserBrokerAccounts);

export default router;
