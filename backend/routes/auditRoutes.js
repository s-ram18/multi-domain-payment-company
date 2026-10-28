import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', authorizeRoles('super_admin', 'security_admin', 'support_admin', 'auditor'), getAuditLogs);

export default router;
