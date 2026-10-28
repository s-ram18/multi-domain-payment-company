import { SECURITY_CONFIG } from '../config/security.config.js';

/**
 * Sanitize data object before logging to prevent sensitive credential exposure
 * @param {object} obj 
 * @returns {object} Deep clone with sanitized values
 */
export function sanitizeLogData(data) {
  if (!data) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    const isSensitive = SECURITY_CONFIG.SENSITIVE_KEYS.some(
      sk => key.toLowerCase().includes(sk)
    );

    if (isSensitive) {
      if (typeof value === 'string' && value.length > 4) {
        cleaned[key] = `[REDACTED_SENSITIVE - ${value.substring(0, 2)}***]`;
      } else {
        cleaned[key] = '[REDACTED_SENSITIVE]';
      }
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = sanitizeLogData(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Console log wrapper for security audit
 */
export const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, sanitizeLogData(meta));
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, sanitizeLogData(meta));
  },
  error: (msg, meta = {}) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, sanitizeLogData(meta));
  },
  security: (msg, meta = {}) => {
    console.log(`[SECURITY_ALERT] [${new Date().toISOString()}] ${msg}`, sanitizeLogData(meta));
  }
};
