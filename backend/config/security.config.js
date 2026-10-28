// Security configuration parameters for PayShield

export const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'payshield_super_secret_jwt_key_2026_production_grade',
  JWT_EXPIRES_IN: '1h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // max 100 requests per window per IP
  AUTH_RATE_LIMIT_MAX: 5, // max 5 auth attempts per 15 min per IP

  // Account Lockout
  MAX_FAILED_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes

  // Password Security Policy
  PASSWORD_POLICY: {
    MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },

  // Sensitive Field Scrubbing for Logs
  SENSITIVE_KEYS: [
    'password',
    'confirmPassword',
    'newPassword',
    'oldPassword',
    'cvv',
    'cardNumber',
    'card_number',
    'secret',
    'token',
    'authorization'
  ],

  // Allowed Domains for CORS
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://www.payshield.com',
    'https://customer.payshield.com',
    'https://pay.payshield.com',
    'https://admin.payshield.com',
    'https://api.payshield.com'
  ]
};
