import express from 'express';
import { getProfile, getUserSessions, revokeSession, toggleMfa } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', getProfile);
router.get('/sessions', getUserSessions);
router.delete('/sessions/:sessionId', revokeSession);
router.post('/mfa/toggle', toggleMfa);

export default router;
