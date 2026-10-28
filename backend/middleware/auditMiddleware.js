import { store } from '../utils/store.js';

export function autoAuditLogMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    // Only log non-GET state-modifying requests or high importance GET endpoints automatically
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) || res.statusCode >= 400) {
      store.addAuditLog({
        userId: req.user ? req.user.id : 'ANONYMOUS',
        userEmail: req.user ? req.user.email : 'guest@payshield.com',
        role: req.user ? req.user.role : 'guest',
        action: `API_${req.method}_${res.statusCode}`,
        category: res.statusCode >= 400 ? 'API_ERROR' : 'API_REQUEST',
        severity: res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARNING' : 'INFO',
        ipAddress: clientIp,
        status: res.statusCode < 400 ? 'SUCCESS' : 'FAILED',
        details: `${req.method} ${req.originalUrl} responded with HTTP ${res.statusCode} (${duration}ms).`
      });
    }
  });

  next();
}
