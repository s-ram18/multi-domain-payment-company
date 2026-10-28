# PayShield Security Architecture Policy & Guidelines

This document outlines the defense-in-depth security model implemented across all PayShield microservices and applications.

---

## Security Architecture Layers

1. **Transport Layer (TLS 1.3 & HSTS)**
   - Strict HTTP Strict Transport Security (`max-age=31536000; includeSubDomains; preload`).
   - Secure cookie attributes (`HttpOnly`, `Secure`, `SameSite=Strict`).

2. **Perimeter Defense (WAF & Rate Limiting)**
   - WAF pattern matching filters XSS script signatures (`<script>`, `onerror=`) and SQL injection patterns (`UNION`, `' OR '1'='1`).
   - Rate limiting throttles authentication endpoints to 5 requests per 15-minute window and general API routes to 100 requests per window.

3. **Authentication & Session Management**
   - Salted `bcrypt` password hashing (10 rounds).
   - Automated account lockout after 5 consecutive failed login attempts.
   - Multi-Factor Authentication (MFA / TOTP 6-digit OTP verification).
   - Instant single-device and all-device session token revocation.

4. **Authorization (RBAC Matrix)**
   - Role Hierarchy: `super_admin` > `security_admin` > `support_admin` > `auditor` > `customer`.
   - Server-side middleware checks (`authorizeRoles`) prevent horizontal and vertical privilege escalation.
   - Unauthorized requests return `403 Forbidden - Insufficient Permissions` and trigger a `SecurityEvent`.

5. **Data Protection & Payment Sandbox Guard**
   - Zero raw PAN or CVV storage. Credit cards are masked on client input (`•••• •••• •••• 4242`).
   - Mandatory `X-Idempotency-Key` headers prevent duplicate payment execution on network replays.

6. **Audit & Log Redaction**
   - Audit logger interceptor scrubs sensitive keys (`password`, `cvv`, `cardNumber`, `secret`, `authorization`) before log storage.
