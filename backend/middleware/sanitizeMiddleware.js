import { store } from '../utils/store.js';
import { logger } from '../utils/logger.js';

const XSS_PATTERNS = [
  /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /onclick\s*=/gi,
  /<iframe/gi,
  /<img[^>]+src[^\>]*>/gi
];

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION)\b)/gi,
  /('|"|;)\s*OR\s*('|"|1=1|true)/gi,
  /--/g,
  /\/\*/g
];

function containsMaliciousInput(val) {
  if (typeof val !== 'string') return false;
  
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(val)) return 'XSS_ATTEMPT';
  }
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(val)) return 'SQL_INJECTION_ATTEMPT';
  }
  return false;
}

function checkDeepInput(obj) {
  if (!obj) return false;
  if (typeof obj === 'string') return containsMaliciousInput(obj);
  if (typeof obj === 'object') {
    // Check for NoSQL injection keys starting with $
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) return 'NOSQL_INJECTION_ATTEMPT';
      const result = checkDeepInput(obj[key]);
      if (result) return result;
    }
  }
  return false;
}

export function sanitizeInputMiddleware(req, res, next) {
  const threatInBody = checkDeepInput(req.body);
  const threatInQuery = checkDeepInput(req.query);
  const threatInParams = checkDeepInput(req.params);

  const threatType = threatInBody || threatInQuery || threatInParams;

  if (threatType) {
    const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    logger.warn(`SECURITY_INPUT_REJECTION (${threatType})`, {
      path: req.originalUrl,
      ip: clientIp
    });

    store.addAuditLog({
      userId: req.user ? req.user.id : 'ANONYMOUS',
      userEmail: req.user ? req.user.email : 'guest@payshield.com',
      role: req.user ? req.user.role : 'guest',
      action: 'MALICIOUS_INPUT_BLOCKED',
      category: 'SECURITY',
      severity: 'WARNING',
      ipAddress: clientIp,
      status: 'BLOCKED',
      details: `Input sanitizer intercepted and blocked threat vector (${threatType}) on ${req.method} ${req.originalUrl}.`
    });

    return res.status(400).json({
      error: 'Bad Request',
      message: '400 Bad Request - Input validation failed. Potential malicious payload signature detected and blocked.',
      code: threatType
    });
  }

  next();
}
