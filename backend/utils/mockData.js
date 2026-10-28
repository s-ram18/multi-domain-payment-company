// Initial mock database state pre-seeded for PayShield prototype

export const INITIAL_USERS = [
  {
    id: "usr_super_admin",
    email: "super.admin@payshield.com",
    name: "Elena Rostova",
    role: "super_admin",
    department: "Executive Security Operations",
    mfaEnabled: true,
    mfaSecret: "JBSWY3DPEHPK3PXP",
    status: "active",
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    lastLoginIp: "192.168.1.105",
    securityScore: 98,
    createdAt: "2025-01-10T08:00:00.000Z"
  },
  {
    id: "usr_security_admin",
    email: "security.admin@payshield.com",
    name: "Marcus Vance",
    role: "security_admin",
    department: "Cybersecurity SOC Team",
    mfaEnabled: true,
    mfaSecret: "KRSXG5CTMVRXEZLU",
    status: "active",
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lastLoginIp: "192.168.1.112",
    securityScore: 95,
    createdAt: "2025-01-12T09:30:00.000Z"
  },
  {
    id: "usr_support_admin",
    email: "support.admin@payshield.com",
    name: "Sarah Jenkins",
    role: "support_admin",
    department: "Customer Operations",
    mfaEnabled: true,
    mfaSecret: "OBQXG43XN5ZGI2L2",
    status: "active",
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    lastLoginIp: "192.168.1.140",
    securityScore: 88,
    createdAt: "2025-02-01T10:15:00.000Z"
  },
  {
    id: "usr_auditor",
    email: "auditor@payshield.com",
    name: "David Chen",
    role: "auditor",
    department: "Compliance & Risk Audit",
    mfaEnabled: true,
    mfaSecret: "N5WHA5DFOIXXXXXX",
    status: "active",
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    lastLoginIp: "192.168.1.200",
    securityScore: 92,
    createdAt: "2025-02-10T11:00:00.000Z"
  },
  {
    id: "usr_customer_demo",
    email: "alex.morgan@acme-corp.com",
    name: "Alex Morgan",
    role: "customer",
    department: "Client Enterprise Account",
    mfaEnabled: true,
    mfaSecret: "MZXW6YTBOIXXXXXX",
    status: "active",
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastLoginIp: "203.0.113.42",
    securityScore: 89,
    createdAt: "2025-03-01T14:20:00.000Z"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-PAY-892401",
    customerId: "usr_customer_demo",
    customerName: "Alex Morgan",
    merchantName: "CyberCloud Services Inc.",
    amount: 1450.00,
    currency: "USD",
    paymentMethod: "Visa ending in •••• 4242",
    status: "SUCCESS",
    riskScore: 12,
    idempotencyKey: "idem_892401_abc",
    ipAddress: "203.0.113.42",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: "TXN-PAY-892400",
    customerId: "usr_customer_demo",
    customerName: "Alex Morgan",
    merchantName: "SecureSaaS Platform",
    amount: 299.99,
    currency: "USD",
    paymentMethod: "Mastercard ending in •••• 8812",
    status: "SUCCESS",
    riskScore: 8,
    idempotencyKey: "idem_892400_xyz",
    ipAddress: "203.0.113.42",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: "TXN-PAY-892399",
    customerId: "usr_customer_demo",
    customerName: "Alex Morgan",
    merchantName: "Global FinTech API",
    amount: 12500.00,
    currency: "USD",
    paymentMethod: "Visa ending in •••• 4242",
    status: "FLAGGED_REVIEW",
    riskScore: 78,
    idempotencyKey: "idem_892399_chk",
    ipAddress: "198.51.100.99",
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString()
  },
  {
    id: "TXN-PAY-892398",
    customerId: "usr_customer_demo",
    customerName: "Alex Morgan",
    merchantName: "Edge CDN Billing",
    amount: 45.00,
    currency: "USD",
    paymentMethod: "Amex ending in •••• 1004",
    status: "SUCCESS",
    riskScore: 5,
    idempotencyKey: "idem_892398_edge",
    ipAddress: "203.0.113.42",
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString()
  }
];

export const INITIAL_SECURITY_ALERTS = [
  {
    id: "ALT-SEC-104",
    type: "SUSPICIOUS_LOGIN_IP",
    severity: "HIGH",
    title: "Geographic Anomaly Detected",
    description: "Account alex.morgan@acme-corp.com logged in from unexpected IP (198.51.100.99 - Frankfurt, DE). Usual range: US-East.",
    targetUser: "alex.morgan@acme-corp.com",
    ipAddress: "198.51.100.99",
    status: "OPEN",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: "ALT-SEC-103",
    type: "BRUTE_FORCE_PREVENTED",
    severity: "CRITICAL",
    title: "Repeated Failed Auth Attempts",
    description: "Rate limiter blocked 14 automated login attempts targeting endpoint /api/v1/auth/login within 60 seconds.",
    targetUser: "admin@payshield.com",
    ipAddress: "45.33.32.156",
    status: "MITIGATED",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "ALT-SEC-102",
    type: "RBAC_VIOLATION_ATTEMPT",
    severity: "MEDIUM",
    title: "Unauthorized Admin API Access",
    description: "Token with role 'auditor' attempted POST action on /api/v1/admin/users/unlock. Access DENIED (403 Forbidden).",
    targetUser: "auditor@payshield.com",
    ipAddress: "192.168.1.200",
    status: "RESOLVED",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-9901",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    userId: "usr_customer_demo",
    userEmail: "alex.morgan@acme-corp.com",
    role: "customer",
    action: "PAYMENT_INITIATED",
    category: "PAYMENT",
    severity: "INFO",
    ipAddress: "203.0.113.42",
    status: "SUCCESS",
    details: "Initiated sandbox payment TXN-PAY-892401 for $1,450.00 with Idempotency verification."
  },
  {
    id: "AUD-9900",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    userId: "usr_super_admin",
    userEmail: "super.admin@payshield.com",
    role: "super_admin",
    action: "USER_ROLE_VERIFIED",
    category: "AUTH",
    severity: "INFO",
    ipAddress: "192.168.1.105",
    status: "SUCCESS",
    details: "Super Admin authenticated successfully with MFA code."
  },
  {
    id: "AUD-9899",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    userId: "SYSTEM_WAF",
    userEmail: "waf-engine@payshield.internal",
    role: "system",
    action: "XSS_PAYLOAD_BLOCKED",
    category: "SECURITY",
    severity: "WARNING",
    ipAddress: "185.220.101.5",
    status: "BLOCKED",
    details: "WAF Input Sanitizer rejected payload containing '<script>alert(1)</script>' in query parameter."
  },
  {
    id: "AUD-9898",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    userId: "usr_security_admin",
    userEmail: "security.admin@payshield.com",
    role: "security_admin",
    action: "SECURITY_ALERT_UPDATE",
    category: "ADMIN",
    severity: "INFO",
    ipAddress: "192.168.1.112",
    status: "SUCCESS",
    details: "Updated alert ALT-SEC-103 status to MITIGATED."
  }
];

export const INITIAL_SESSIONS = [
  {
    id: "sess_curr_01",
    userId: "usr_customer_demo",
    device: "Chrome 122 on Windows 11",
    ipAddress: "203.0.113.42",
    location: "New York, USA",
    isCurrent: true,
    created: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  },
  {
    id: "sess_curr_02",
    userId: "usr_customer_demo",
    device: "Safari on iOS 17 (iPhone 15)",
    ipAddress: "203.0.113.88",
    location: "New York, USA",
    isCurrent: false,
    created: new Date(Date.now() - 1000 * 3600 * 14).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 3600 * 2).toISOString()
  }
];
