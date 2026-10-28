import { store } from '../utils/store.js';

export function getProfile(req, res) {
  const user = store.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash, mfaSecret, ...safeUser } = user;
  return res.status(200).json({ user: safeUser });
}

export function getUserSessions(req, res) {
  const sessions = store.getUserSessions(req.user.id);
  return res.status(200).json({ sessions });
}

export function revokeSession(req, res) {
  const { sessionId } = req.params;
  store.revokeSession(sessionId);

  store.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    role: req.user.role,
    action: 'SESSION_REVOKED',
    category: 'SECURITY',
    severity: 'INFO',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Revoked session ID: ${sessionId}`
  });

  return res.status(200).json({ message: 'Session revoked successfully' });
}

export function toggleMfa(req, res) {
  const user = store.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updated = store.updateUser(user.id, {
    mfaEnabled: !user.mfaEnabled,
    securityScore: !user.mfaEnabled ? Math.min(100, user.securityScore + 15) : Math.max(50, user.securityScore - 15)
  });

  store.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    role: req.user.role,
    action: 'MFA_SETTINGS_UPDATED',
    category: 'SECURITY',
    severity: 'INFO',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `MFA status toggled to: ${updated.mfaEnabled ? 'ENABLED' : 'DISABLED'}`
  });

  const { passwordHash, ...safe } = updated;
  return res.status(200).json({ user: safe, message: `MFA is now ${updated.mfaEnabled ? 'enabled' : 'disabled'}` });
}
