import { store } from '../utils/store.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware generator to enforce Role-Based Access Control (RBAC)
 * @param {string[]} allowedRoles - Roles permitted to access the endpoint
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required prior to authorization check.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

      // Log Security Violation
      logger.security('RBAC_VIOLATION_ATTEMPT', {
        user: req.user.email,
        role: req.user.role,
        allowedRoles,
        endpoint: req.originalUrl,
        method: req.method,
        ip: clientIp
      });

      // Record Audit Log
      store.addAuditLog({
        userId: req.user.id,
        userEmail: req.user.email,
        role: req.user.role,
        action: 'RBAC_ACCESS_DENIED',
        category: 'SECURITY',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'DENIED',
        details: `Role '${req.user.role}' attempted unauthorized ${req.method} on ${req.originalUrl}. Required: [${allowedRoles.join(', ')}].`
      });

      // Add Security Alert if severity warrants
      store.addSecurityAlert({
        id: `ALT-SEC-${Math.floor(100 + Math.random() * 900)}`,
        type: 'RBAC_VIOLATION_ATTEMPT',
        severity: 'MEDIUM',
        title: 'Unauthorized RBAC Escalation Attempt',
        description: `User ${req.user.email} (Role: ${req.user.role}) attempted ${req.method} ${req.originalUrl} without authorization.`,
        targetUser: req.user.email,
        ipAddress: clientIp,
        status: 'OPEN',
        timestamp: new Date().toISOString()
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: '403 Forbidden – Insufficient Permissions for requested operation.',
        code: 'INSUFFICIENT_PERMISSIONS',
        userRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }

    next();
  };
}
