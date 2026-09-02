import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { validateBroker, validateBrokerReview, validateConnectAccount } from '../middleware/brokers.middleware';
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
router.use(verifyToken);

/**
 * Broker Management (Admin only) - requires 'admin' or 'super_admin' role, or SUPER_ADMIN scope
 */
router.post('/', requireRole(['super_admin', 'admin']), validateBroker, brokersController.createBroker);
router.put('/:id', requireRole(['super_admin', 'admin']), validateBroker, brokersController.updateBroker);
router.delete('/:id', requireRole(['super_admin', 'admin']), brokersController.deleteBroker);

/**
 * Reviews
 */
router.post('/:id/reviews', validateBrokerReview, reviewLimiter, brokersController.addReview);

/**
 * User Broker Accounts
 */
router.post('/accounts/connect', apiLimiter, validateConnectAccount, brokersController.connectBrokerAccount);
router.get('/accounts/my-accounts', brokersController.getUserBrokerAccounts);

export default router;
