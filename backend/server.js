import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { store } from './utils/store.js';
import { SECURITY_CONFIG } from './config/security.config.js';
import { globalRateLimiter } from './middleware/rateLimitMiddleware.js';
import { sanitizeInputMiddleware } from './middleware/sanitizeMiddleware.js';
import { autoAuditLogMiddleware } from './middleware/auditMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import labRoutes from './routes/labRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize dual-mode in-memory store
await store.init();

// Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://127.0.0.1:5000"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, lab) or matching allowed origins
    if (!origin || SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation - origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key', 'X-Requested-With']
}));

// JSON Payload Size Limit (Prevents Denial of Service via huge payloads)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Global Rate Limiting & Input Sanitization
app.use(globalRateLimiter);
app.use(sanitizeInputMiddleware);
app.use(autoAuditLogMiddleware);

// API Health Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'PayShield Security API Engine',
    securityMode: 'STRICT_ENFORCEMENT',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/lab', labRoutes);

// Generic 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: '404 Not Found - Requested endpoint does not exist on PayShield API Gateway.',
    code: 'ENDPOINT_NOT_FOUND'
  });
});

// Generic Global Error Handler (No internal stack trace exposure)
app.use((err, req, res, next) => {
  console.error('[UNHANDLED_ERROR]', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: 'An unexpected internal error occurred. Request ID logged to Security Operations Center.',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🛡️  PayShield Backend Security Engine Running`);
  console.log(`🌐 Server Port: http://localhost:${PORT}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'production-demo'}`);
  console.log(`==================================================\n`);
});
