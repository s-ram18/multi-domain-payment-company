import express from 'express';
import { processPayment, getTransactions } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/process', processPayment);
router.get('/transactions', getTransactions);

export default router;
