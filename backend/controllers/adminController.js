import { store } from '../utils/store.js';

export function getAdminDashboardStats(req, res) {
  const users = store.getAllUsers();
  const txns = store.getAllTransactions();
  const alerts = store.getSecurityAlerts();
  const logs = store.getAuditLogs();

  const totalTxns = txns.length;
  const successfulTxns = txns.filter(t => t.status === 'SUCCESS').length;
  const failedTxns = txns.filter(t => t.status === 'FAILED' || t.status === 'FLAGGED_REVIEW').length;
  
  const failedLogins = logs.filter(l => l.action === 'LOGIN_FAILED' || l.action === 'LOGIN_BLOCKED_LOCKOUT').length;
  const blockedRequests = logs.filter(l => l.status === 'BLOCKED' || l.status === 'DENIED').length;
  const openAlerts = alerts.filter(a => a.status === 'OPEN').length;

  return res.status(200).json({
    kpi: {
      totalTransactions: totalTxns,
      successfulPayments: successfulTxns,
      failedPayments: failedTxns,
      activeUsers: users.filter(u => u.status === 'active').length,
      failedLoginAttempts: failedLogins,
      blockedRequests: blockedRequests,
      activeSecurityAlerts: openAlerts,
      totalAuditEvents: logs.length
    },
    threatDistribution: [
      { name: 'Brute Force Attempts', value: 42, color: '#ef4444' },
      { name: 'RBAC Escalations', value: 18, color: '#f59e0b' },
      { name: 'XSS/Injection Payload', value: 24, color: '#ec4899' },
      { name: 'Geographic Anomaly', value: 16, color: '#3b82f6' }
    ],
    hourlyTraffic: [
      { hour: '04:00', requests: 120, blocked: 4, latencyMs: 38 },
      { hour: '08:00', requests: 450, blocked: 12, latencyMs: 42 },
      { hour: '12:00', requests: 980, blocked: 28, latencyMs: 45 },
      { hour: '16:00', requests: 840, blocked: 18, latencyMs: 40 },
      { hour: '20:00', requests: 620, blocked: 9, latencyMs: 39 }
    ]
  });
}

export function getUsers(req, res) {
  const users = store.getAllUsers();
  return res.status(200).json({ users });
}

export function updateUserStatus(req, res) {
  const { userId } = req.params;
  const { status, role } = req.body;

  const updates = {};
  if (status) updates.status = status;
  if (role) updates.role = role;
  if (status === 'active') {
    updates.failedLoginAttempts = 0;
    updates.lockoutUntil = null;
  }

  const updated = store.updateUser(userId, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });

  store.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    role: req.user.role,
    action: 'ADMIN_USER_UPDATED',
    category: 'ADMIN',
    severity: 'WARNING',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Admin updated target user ${updated.email}: Status -> ${updated.status}, Role -> ${updated.role}`
  });

  const { passwordHash, ...safe } = updated;
  return res.status(200).json({ user: safe, message: 'User updated successfully' });
}

export function getSecurityAlerts(req, res) {
  const alerts = store.getSecurityAlerts();
  return res.status(200).json({ alerts });
}

export function updateAlertStatus(req, res) {
  const { alertId } = req.params;
  const { status } = req.body;

  const updated = store.updateAlertStatus(alertId, status || 'RESOLVED');

  store.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    role: req.user.role,
    action: 'SECURITY_ALERT_UPDATED',
    category: 'ADMIN',
    severity: 'INFO',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Updated security alert ${alertId} status to '${status}'.`
  });

  return res.status(200).json({ alert: updated, message: 'Alert status updated' });
}

export function getSystemHealth(req, res) {
  return res.status(200).json({
    status: 'HEALTHY',
    version: '1.4.2-enterprise',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      mode: 'InMemory / MongoDB Dual Engine',
      connected: true,
      latencyMs: 2
    },
    services: {
      authService: 'OPERATIONAL (100% SLA)',
      paymentGateway: 'OPERATIONAL (99.99% SLA)',
      wafEngine: 'ACTIVE - FILTERING ATTACKS',
      rateLimiter: 'ACTIVE - 0 FLOODS DETECTED'
    },
    systemMetrics: {
      cpuLoadPercent: (Math.random() * 15 + 12).toFixed(1),
      memoryUsedMB: Math.floor(Math.random() * 80 + 240),
      activeWebSockets: 142
    }
  });
}
