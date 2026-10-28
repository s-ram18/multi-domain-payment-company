import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain password using bcrypt
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plain password against a bcrypt hash
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
}

/**
 * Validate password strength against policy
 * @param {string} password 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePasswordStrength(password) {
  const errors = [];
  if (!password || password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
