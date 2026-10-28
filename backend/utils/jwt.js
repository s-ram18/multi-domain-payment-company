import jwt from 'jsonwebtoken';
import { SECURITY_CONFIG } from '../config/security.config.js';

const blacklistedTokens = new Set();

/**
 * Generate JWT access token for a user
 * @param {object} payload - User object payload (id, email, role)
 * @returns {string} Signed JWT token
 */
export function generateToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      department: payload.department
    },
    SECURITY_CONFIG.JWT_SECRET,
    { expiresIn: SECURITY_CONFIG.JWT_EXPIRES_IN }
  );
}

/**
 * Verify JWT token
 * @param {string} token 
 * @returns {object|null} Decoded payload or null
 */
export function verifyToken(token) {
  if (blacklistedTokens.has(token)) {
    throw new Error('Token has been revoked/logout');
  }
  return jwt.verify(token, SECURITY_CONFIG.JWT_SECRET);
}

/**
 * Blacklist token on logout
 * @param {string} token 
 */
export function blacklistToken(token) {
  if (token) {
    blacklistedTokens.add(token);
  }
}
