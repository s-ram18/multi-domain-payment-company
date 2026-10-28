import rateLimit from 'express-rate-limit';
import { SECURITY_CONFIG } from '../config/security.config.js';

export const globalRateLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: '429 Too Many Requests - Rate limit exceeded. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 failed/attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: '429 Too Many Requests - Excessive login attempts detected. Rate limit engaged for brute-force protection.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});
