import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth';
import { validateTicket, validateMessage, requireSupportRole } from '../middleware/support.middleware';
import * as supportController from '../controllers/support.controller';

const router = express.Router();

/**
 * Public endpoints - FAQ
 */
router.get('/faq', supportController.getFAQArticles);
router.get('/categories', supportController.getCategories);

/**
 * Protected endpoints - require authentication
 */

/**
 * Support Tickets
 */
router.get('/tickets', verifyToken, supportController.getAllTickets);
router.get('/tickets/my-tickets', verifyToken, supportController.getUserTickets);
router.get('/tickets/:id', verifyToken, supportController.getTicketById);
router.post('/tickets', verifyToken, validateTicket, supportController.createTicket);
router.put('/tickets/:id', verifyToken, supportController.updateTicket);
router.put('/tickets/:id/close', verifyToken, supportController.closeTicket);

/**
 * Ticket Messages
 */
router.get('/tickets/:ticketId/messages', verifyToken, supportController.getTicketMessages);
router.post('/tickets/:ticketId/messages', verifyToken, validateMessage, supportController.addMessage);

/**
 * Support Metrics (Admin/Support staff only)
 */
router.get('/metrics/:period', verifyToken, supportController.getSupportMetrics);

export default router;
