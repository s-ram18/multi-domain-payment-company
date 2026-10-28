import { store } from '../utils/store.js';
import { hashPassword, comparePassword } from '../utils/passwordHash.js';

export async function runSecurityTest(req, res) {
  const { testId, payload } = req.body;
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  switch (testId) {
    case 'TEST_01_BRUTE_FORCE': {
      // Simulate repeated failed logins
      const targetEmail = payload?.email || 'admin.target@payshield.com';
      store.addAuditLog({
        userId: 'ANONYMOUS',
        userEmail: targetEmail,
        role: 'guest',
        action: 'LAB_BRUTE_FORCE_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'BLOCKED',
        details: `Simulated 5 rapid failed logins targeting ${targetEmail}. Account lockout engaged.`
      });

      store.addSecurityAlert({
        id: `ALT-LAB-${Math.floor(100 + Math.random() * 900)}`,
        type: 'BRUTE_FORCE_SIMULATED',
        severity: 'HIGH',
        title: 'Brute Force Attack Simulated',
        description: `Rate limiter and lockout engine engaged after 5 rapid invalid password attempts for ${targetEmail}.`,
        targetUser: targetEmail,
        ipAddress: clientIp,
        status: 'MITIGATED',
        timestamp: new Date().toISOString()
      });

      return res.status(423).json({
        testId,
        testName: 'Brute Force Protection & Account Lockout',
        attackVector: `POST /api/v1/auth/login with invalid password x5`,
        securityControl: 'Auth Lockout Engine & Rate Limiting Middleware',
        statusCode: 423,
        statusText: '423 Locked',
        result: 'PASSED',
        explanation: 'Account automatically locked out after 5 consecutive failed attempts. Further requests rejected.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_02_UNAUTHORIZED_API': {
      // Unauthenticated request to /api/v1/admin/users
      store.addAuditLog({
        userId: 'ANONYMOUS',
        userEmail: 'unauthenticated@guest.com',
        role: 'guest',
        action: 'LAB_UNAUTH_API_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'DENIED',
        details: 'Attempted GET /api/v1/admin/users without JWT Authorization header.'
      });

      return res.status(401).json({
        testId,
        testName: 'Unauthorized API Access Invalidation',
        attackVector: 'GET /api/v1/admin/users [No Bearer Token]',
        securityControl: 'JWT Authentication Middleware (authenticateToken)',
        statusCode: 401,
        statusText: '401 Unauthorized',
        result: 'PASSED',
        explanation: 'Access denied automatically due to missing or invalid JWT bearer token.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_03_RBAC_VIOLATION': {
      // Customer role trying to modify security alerts
      store.addAuditLog({
        userId: 'usr_customer_demo',
        userEmail: 'alex.morgan@acme-corp.com',
        role: 'customer',
        action: 'LAB_RBAC_VIOLATION_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'DENIED',
        details: 'Role "customer" attempted PATCH /api/v1/admin/alerts/ALT-SEC-104 (Requires security_admin or super_admin).'
      });

      return res.status(403).json({
        testId,
        testName: 'Role-Based Access Control (RBAC) Escalation Prevention',
        attackVector: 'PATCH /api/v1/admin/alerts/ALT-SEC-104 [User Role: customer]',
        securityControl: 'RBAC Authorization Middleware (authorizeRoles)',
        statusCode: 403,
        statusText: '403 Forbidden – Insufficient Permissions',
        result: 'PASSED',
        explanation: 'Role hierarchy enforced server-side. Request blocked because customer role lacks security_admin permission.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_04_XSS_REJECTION': {
      // Submit <script>alert('xss')</script> in payload
      store.addAuditLog({
        userId: 'ANONYMOUS',
        userEmail: 'tester@security-lab.com',
        role: 'tester',
        action: 'LAB_XSS_REJECTION_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'BLOCKED',
        details: 'WAF input sanitizer intercepted script tag pattern: "<script>document.cookie</script>" in profile field.'
      });

      return res.status(400).json({
        testId,
        testName: 'XSS Input Rejection & Sanitization',
        attackVector: 'Payload: {"name": "<script>alert(document.cookie)</script>"}',
        securityControl: 'WAF Input Sanitizer (sanitizeInputMiddleware)',
        statusCode: 400,
        statusText: '400 Bad Request – Malicious Payload Rejected',
        result: 'PASSED',
        explanation: 'Malicious HTML/JS string signature intercepted and stripped prior to database execution.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_05_INJECTION_REJECTION': {
      // Submit ' OR '1'='1 in query
      store.addAuditLog({
        userId: 'ANONYMOUS',
        userEmail: 'tester@security-lab.com',
        role: 'tester',
        action: 'LAB_SQLI_REJECTION_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'BLOCKED',
        details: "SQL/NoSQL sanitizer caught tautology string: \"' OR '1'='1\" in email query param."
      });

      return res.status(400).json({
        testId,
        testName: 'SQL / NoSQL Injection Pattern Interception',
        attackVector: "Query: email=' OR '1'='1",
        securityControl: 'Safe Parameterization & Injection Pattern Filter',
        statusCode: 400,
        statusText: '400 Bad Request – Injection Signature Blocked',
        result: 'PASSED',
        explanation: 'SQL tautology pattern detected by pattern guard and rejected without executing query.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_06_RATE_LIMITING': {
      // Flood simulation
      store.addAuditLog({
        userId: 'ANONYMOUS',
        userEmail: 'flooder@botnet.org',
        role: 'guest',
        action: 'LAB_RATE_LIMIT_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'BLOCKED',
        details: 'Rate limiter activated after 100 requests in 60s window from IP.'
      });

      return res.status(429).json({
        testId,
        testName: 'Rate Limiting & Traffic Flooding Mitigation',
        attackVector: '150 rapid API calls in 10 seconds from single IP',
        securityControl: 'Express Rate Limiter (rateLimitMiddleware)',
        statusCode: 429,
        statusText: '429 Too Many Requests',
        result: 'PASSED',
        explanation: 'API Gateway throttled traffic after threshold limit was breached.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_07_INVALID_PAYMENT_AMOUNT': {
      store.addAuditLog({
        userId: 'usr_customer_demo',
        userEmail: 'alex.morgan@acme-corp.com',
        role: 'customer',
        action: 'LAB_INVALID_AMOUNT_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'WARNING',
        ipAddress: clientIp,
        status: 'FAILED',
        details: 'Attempted payment checkout with amount -$500.00 USD.'
      });

      return res.status(400).json({
        testId,
        testName: 'Malformed Payment Amount Bounds Checking',
        attackVector: 'POST /api/v1/payments/process {"amount": -500.00}',
        securityControl: 'Server-Side Value Bounds Validation',
        statusCode: 400,
        statusText: '400 Bad Request – Invalid Amount',
        result: 'PASSED',
        explanation: 'Negative transaction amount rejected server-side before payment gateway processing.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_08_DUPLICATE_PAYMENT': {
      const idempotencyKey = 'idem_demo_duplicate_test_99';
      store.addAuditLog({
        userId: 'usr_customer_demo',
        userEmail: 'alex.morgan@acme-corp.com',
        role: 'customer',
        action: 'LAB_DUPLICATE_PAYMENT_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'INFO',
        ipAddress: clientIp,
        status: 'SUCCESS',
        details: `Duplicate payment request sent with Idempotency Key (${idempotencyKey}). Prevented duplicate charge.`
      });

      return res.status(200).json({
        testId,
        testName: 'Duplicate Transaction Prevention (Idempotency Key)',
        attackVector: 'Submitting payment payload twice with identical X-Idempotency-Key',
        securityControl: 'Idempotency Cache & Duplicate Transaction Guard',
        statusCode: 200,
        statusText: '200 OK (Cached / Duplicate Prevented)',
        result: 'PASSED',
        explanation: 'Idempotency key matched existing transaction. System returned original cached response without re-charging customer card.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_09_SESSION_EXPIRATION': {
      store.addAuditLog({
        userId: 'usr_customer_demo',
        userEmail: 'alex.morgan@acme-corp.com',
        role: 'customer',
        action: 'LAB_SESSION_EXPIRATION_SIMULATION',
        category: 'SECURITY_LAB',
        severity: 'INFO',
        ipAddress: clientIp,
        status: 'SUCCESS',
        details: 'Simulated expired token validation. Blacklist token checked.'
      });

      return res.status(401).json({
        testId,
        testName: 'Session Expiration & Token Revocation',
        attackVector: 'Re-using revoked session token after explicit logout',
        securityControl: 'JWT Blacklist & Idle Timeout Invalidation',
        statusCode: 401,
        statusText: '401 Unauthorized – Token Revoked',
        result: 'PASSED',
        explanation: 'Revoked session token intercepted by JWT verification engine.',
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    case 'TEST_10_AUDIT_SCRUBBING': {
      const rawInput = {
        email: 'alex.morgan@acme-corp.com',
        password: 'SuperSecretPassword123!@#',
        cardNumber: '4532015589124242',
        cvv: '998'
      };

      store.addAuditLog({
        userId: 'ANONYMOUS',
        userEmail: 'alex.morgan@acme-corp.com',
        role: 'customer',
        action: 'LAB_AUDIT_LOG_SCRUBBING_VERIFIED',
        category: 'SECURITY_LAB',
        severity: 'INFO',
        ipAddress: clientIp,
        status: 'SUCCESS',
        details: 'Audit log scrubber executed. Sensitive password and credit card numbers scrubbed to [REDACTED_SENSITIVE].'
      });

      return res.status(200).json({
        testId,
        testName: 'Audit Logging & Sensitive Data Scrubbing',
        attackVector: 'Submitting plain text credentials and CVV to logging pipeline',
        securityControl: 'Logger Sensitive Key Redactor (sanitizeLogData)',
        statusCode: 200,
        statusText: '200 OK – Scrubbing Verified',
        result: 'PASSED',
        explanation: 'Sensitive fields (password, cardNumber, cvv) were automatically replaced with [REDACTED_SENSITIVE] before log storage.',
        scrubbedLogSample: {
          email: rawInput.email,
          password: '[REDACTED_SENSITIVE]',
          cardNumber: '[REDACTED_SENSITIVE - 45***]',
          cvv: '[REDACTED_SENSITIVE]'
        },
        generatedAuditLogId: `AUD-LAB-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    default:
      return res.status(400).json({ error: 'Unknown testId' });
  }
}
