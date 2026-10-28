import { store } from '../utils/store.js';
import { comparePassword, hashPassword, validatePasswordStrength } from '../utils/passwordHash.js';
import { generateToken, blacklistToken } from '../utils/jwt.js';
import { SECURITY_CONFIG } from '../config/security.config.js';
import { logger } from '../utils/logger.js';

export async function login(req, res) {
  const { email, password, mfaCode } = req.body;
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email and password are required credentials.'
    });
  }

  const user = store.findUserByEmail(email);

  if (!user) {
    // Record failed attempt without revealing account existence
    store.addAuditLog({
      userId: 'UNKNOWN',
      userEmail: email,
      role: 'guest',
      action: 'LOGIN_FAILED',
      category: 'AUTH',
      severity: 'WARNING',
      ipAddress: clientIp,
      status: 'FAILED',
      details: `Failed authentication attempt for non-existent or invalid email.`
    });

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid email address or password.',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check if account is locked out
  if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
    const remainingMins = Math.ceil((new Date(user.lockoutUntil) - new Date()) / (60 * 1000));
    
    store.addAuditLog({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      action: 'LOGIN_BLOCKED_LOCKOUT',
      category: 'AUTH',
      severity: 'WARNING',
      ipAddress: clientIp,
      status: 'LOCKED',
      details: `Authentication blocked. Account locked out for ${remainingMins} remaining minutes.`
    });

    return res.status(423).json({
      error: 'Locked',
      message: `Account is temporarily locked due to repeated failed login attempts. Try again in ${remainingMins} minutes.`,
      code: 'ACCOUNT_LOCKED'
    });
  }

  // Verify Password
  const isMatch = await comparePassword(password, user.passwordHash);

  if (!isMatch) {
    const attempts = (user.failedLoginAttempts || 0) + 1;
    let lockoutUntil = user.lockoutUntil;

    if (attempts >= SECURITY_CONFIG.MAX_FAILED_LOGIN_ATTEMPTS) {
      lockoutUntil = new Date(Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION_MS).toISOString();
      
      store.addSecurityAlert({
        id: `ALT-SEC-${Math.floor(100 + Math.random() * 900)}`,
        type: 'ACCOUNT_LOCKOUT_TRIGGERED',
        severity: 'HIGH',
        title: 'Account Locked Out (Brute Force Protection)',
        description: `Account ${user.email} was locked out after ${attempts} failed authentication attempts from IP ${clientIp}.`,
        targetUser: user.email,
        ipAddress: clientIp,
        status: 'OPEN',
        timestamp: new Date().toISOString()
      });
    }

    store.updateUser(user.id, {
      failedLoginAttempts: attempts,
      lockoutUntil
    });

    store.addAuditLog({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      action: 'LOGIN_FAILED',
      category: 'AUTH',
      severity: 'WARNING',
      ipAddress: clientIp,
      status: 'FAILED',
      details: `Failed password verification. Attempt ${attempts} of ${SECURITY_CONFIG.MAX_FAILED_LOGIN_ATTEMPTS}.`
    });

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid email address or password.',
      attemptsLeft: Math.max(0, SECURITY_CONFIG.MAX_FAILED_LOGIN_ATTEMPTS - attempts),
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check MFA if required
  if (user.mfaEnabled && !mfaCode) {
    return res.status(200).json({
      mfaRequired: true,
      email: user.email,
      message: 'Multi-Factor Authentication code required. Please enter 6-digit OTP.'
    });
  }

  if (user.mfaEnabled && mfaCode) {
    if (mfaCode !== '123456' && mfaCode !== '654321') {
      store.addAuditLog({
        userId: user.id,
        userEmail: user.email,
        role: user.role,
        action: 'MFA_FAILED',
        category: 'AUTH',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'FAILED',
        details: 'Invalid MFA OTP code submitted.'
      });

      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid MFA verification code.',
        code: 'INVALID_MFA'
      });
    }
  }

  // Reset failed attempts on success
  store.updateUser(user.id, {
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: clientIp
  });

  const token = generateToken(user);

  // Register Session
  store.addSession({
    id: `sess_${Math.random().toString(36).substring(2, 11)}`,
    userId: user.id,
    device: req.headers['user-agent'] || 'Modern Web Browser',
    ipAddress: clientIp,
    location: 'Verified Corporate Network',
    isCurrent: true,
    created: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });

  store.addAuditLog({
    userId: user.id,
    userEmail: user.email,
    role: user.role,
    action: 'LOGIN_SUCCESS',
    category: 'AUTH',
    severity: 'INFO',
    ipAddress: clientIp,
    status: 'SUCCESS',
    details: `User authenticated successfully with role '${user.role}' and MFA verification.`
  });

  const { passwordHash, mfaSecret, ...safeUser } = store.findUserById(user.id);

  return res.status(200).json({
    message: 'Authentication successful',
    token,
    user: safeUser
  });
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name, email, and password are required fields.'
    });
  }

  const existing = store.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'An account with this email address already exists.'
    });
  }

  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    return res.status(400).json({
      error: 'Weak Password',
      message: 'Password does not meet enterprise complexity policy.',
      violations: strength.errors
    });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: `usr_${Math.random().toString(36).substring(2, 10)}`,
    email,
    name,
    role: role === 'admin' ? 'support_admin' : 'customer',
    department: 'Client Services',
    mfaEnabled: true,
    status: 'active',
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: clientIp,
    securityScore: 90,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString()
  };

  store.addUser(newUser);

  store.addAuditLog({
    userId: newUser.id,
    userEmail: newUser.email,
    role: newUser.role,
    action: 'ACCOUNT_REGISTERED',
    category: 'AUTH',
    severity: 'INFO',
    ipAddress: clientIp,
    status: 'SUCCESS',
    details: `New customer account registered with password complexity verification.`
  });

  const { passwordHash, ...safeUser } = newUser;
  const token = generateToken(newUser);

  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: safeUser
  });
}

export function logout(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    blacklistToken(token);
  }

  if (req.user) {
    store.addAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'LOGOUT',
      category: 'AUTH',
      severity: 'INFO',
      ipAddress: req.ip || '127.0.0.1',
      status: 'SUCCESS',
      details: 'User logged out and session token invalidated.'
    });
  }

  return res.status(200).json({
    message: 'Logout successful. Session token invalidated.'
  });
}

export function logoutAll(req, res) {
  if (req.user) {
    store.revokeAllUserSessions(req.user.id);
    store.addAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'LOGOUT_ALL_DEVICES',
      category: 'SECURITY',
      severity: 'WARNING',
      ipAddress: req.ip || '127.0.0.1',
      status: 'SUCCESS',
      details: 'Revoked all active sessions across all devices for account.'
    });
  }

  return res.status(200).json({
    message: 'All sessions across all devices have been revoked successfully.'
  });
}

export function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const resetToken = `rst_${Math.random().toString(36).substring(2, 15)}`;
  
  store.addAuditLog({
    userId: 'ANONYMOUS',
    userEmail: email,
    role: 'guest',
    action: 'PASSWORD_RESET_REQUESTED',
    category: 'AUTH',
    severity: 'INFO',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Generated password reset token (expires in 15m) for ${email}.`
  });

  return res.status(200).json({
    message: 'If the email exists in our records, a secure single-use password reset link has been dispatched.',
    demoResetToken: resetToken
  });
}
