import { verifyToken } from '../utils/jwt.js';
import { store } from '../utils/store.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is missing or invalid.',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = store.findUserById(decoded.id);

    if (!user || user.status === 'locked') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account is locked or user no longer exists.',
        code: 'USER_LOCKED_OR_INVALID'
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired session token.',
      code: 'TOKEN_EXPIRED_OR_INVALID'
    });
  }
}
