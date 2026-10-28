import express from 'express';
import {
  getAdminDashboardStats,
  getUsers,
  updateUserStatus,
  getSecurityAlerts,
  updateAlertStatus,
  getSystemHealth
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// All admin routes require at least one admin/auditor role
const ALL_ADMIN_ROLES = ['super_admin', 'security_admin', 'support_admin', 'auditor'];

router.get('/dashboard', authorizeRoles(...ALL_ADMIN_ROLES), getAdminDashboardStats);
router.get('/health', authorizeRoles(...ALL_ADMIN_ROLES), getSystemHealth);

// Users Management
router.get('/users', authorizeRoles(...ALL_ADMIN_ROLES), getUsers);
router.patch('/users/:userId', authorizeRoles('super_admin', 'support_admin'), updateUserStatus);

// Security Alerts Management
router.get('/alerts', authorizeRoles(...ALL_ADMIN_ROLES), getSecurityAlerts);
router.patch('/alerts/:alertId', authorizeRoles('super_admin', 'security_admin'), updateAlertStatus);

export default router;
