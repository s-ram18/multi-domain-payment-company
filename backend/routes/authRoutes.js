import express from 'express';
import { login, register, logout, logoutAll, forgotPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/login', authRateLimiter, login);
router.post('/register', authRateLimiter, register);
router.post('/forgot-password', authRateLimiter, forgotPassword);

router.post('/logout', authenticateToken, logout);
router.post('/logout-all', authenticateToken, logoutAll);

export default router;
