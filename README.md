# PayShield - Next-Gen Cyber-Secure Payment Architecture Prototype

PayShield is a modern, enterprise-grade, functional cybersecurity prototype for a fictional secure payment technology company. The objective of this project is to demonstrate **cybersecurity architecture, defense-in-depth engineering, and secure application development**, not to process real monetary transactions.

---

## 1. Project Overview
PayShield simulates a payment technology firm operating across multiple logically separated domain applications. It demonstrates how cybersecurity controls are enforced across every tier—from the user browser and TLS transport down to the WAF, API gateway, RBAC middleware, payment sandbox, and database storage.

---

## 2. Problem Statement
Modern payment platforms face severe threats including brute-force credential stuffing, cross-site scripting (XSS), SQL/NoSQL injection, privilege escalation via broken access control (BAC), session hijacking, request replay duplicate charges, and credential exposure in log pipelines. PayShield provides a comprehensive reference implementation mitigating each threat vector.

---

## 3. Architecture Overview
PayShield utilizes a defense-in-depth model:
`User Browser (HTTPS/TLS)` → `WAF Engine` → `API Gateway & Rate Limiter` → `Authentication & RBAC Middleware` → `Backend Microservices` → `Database Store`.

---

## 4. Applications / Domains Breakdown
The unified system logically separates 5 core domains:

1. **Main Corporate Website (`www.payshield.com`)**
   - Public-facing information, interactive Security Architecture visualizer, products suite, developer API documentation, and compliance standards callouts.
2. **Customer Portal (`customer.payshield.com`)**
   - Secure authentication, Account Security Health Score, linked masked payment cards (`•••• •••• •••• 4242`), transaction history, sandbox transfer initiation, MFA management, and session device revocation.
3. **Payment Application (`pay.payshield.com`)**
   - Isolated merchant sandbox checkout widget enforcing `X-Idempotency-Key` deduplication, card masking, amount bounds checks, and instant transaction verification.
4. **Admin Portal (`admin.payshield.com`)**
   - Security Operations Center (SOC) dashboard featuring Recharts analytics, user management, security alerts console, audit log explorer with raw JSON inspector, and system health telemetry.
5. **Backend REST API (`api.payshield.com`)**
   - Node.js + Express backend service enforcing Helmet security headers, CORS restrictions, rate limiting, input sanitization, JWT verification, and RBAC authorization.

---

## 5. Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router.
- **Backend**: Node.js, Express.js, REST APIs.
- **Security**: JWT (jsonwebtoken), bcryptjs, Helmet, CORS, express-rate-limit, WAF Sanitizer.
- **Database Engine**: Dual-Mode (MongoDB driver + automated pre-seeded in-memory fallback store).

---

## 6. Authentication
- Password verification using `bcrypt` (10 salt rounds).
- Rate-limited login endpoints (5 attempts per 15 mins).
- Automated account lockout after 5 consecutive failed attempts.
- Multi-Factor Authentication (MFA / 6-digit TOTP simulator).

---

## 7. Authorization & Access Control (RBAC)
Server-side RBAC middleware (`authorizeRoles`) checks user role against route permission matrices:
- `super_admin`: Full administrative and system access.
- `security_admin`: SOC security alert management and incident response.
- `support_admin`: Customer user account management.
- `auditor`: Read-only access to audit logs and telemetry.
- `customer`: Isolated client portal access.

Violations trigger `403 Forbidden - Insufficient Permissions` and create a `SecurityEvent`.

---

## 8. Password Security
- Real-time password strength meter evaluating length (>= 12), uppercase, lowercase, number, and special character rules.
- Single-use password reset token generator with 15-minute expiration.
- Zero plaintext password storage.

---

## 9. Secure Communication
- Assumes HTTPS / TLS 1.3 encrypted transport with HSTS (`max-age=31536000`).
- HTTP-Only secure cookie flags (`SameSite=Strict`).

---

## 10. Input Validation
- WAF Input Sanitizer middleware strips `<script>` XSS tags and SQL/NoSQL injection signatures (`' OR '1'='1`, `$gt`).
- Payment amount bounds checking (rejects negative, zero, or amounts > $50,000.00).

---

## 11. Session Management
- Central session store tracking device user-agent, IP address, and location.
- Instant single-session revocation and "Logout From All Devices" invalidation.

---

## 12. Logging & Monitoring
- Central Audit Log Explorer with category and severity filters.
- Sensitive data scrubbing pipeline automatically redacts `password`, `cvv`, `cardNumber`, and authorization tokens to `[REDACTED_SENSITIVE]`.

---

## 13. Payment Security
- Mandatory `X-Idempotency-Key` headers prevent duplicate transaction execution on network replays.
- Prominent "SANDBOX/DEMO ENVIRONMENT" disclaimers displayed on all checkout workflows.

---

## 14. Threat Model & 15. Security Controls Matrix

| Threat | Security Control |
| --- | --- |
| Brute Force | Rate Limiting + Account Lockout |
| XSS | Input Validation + Output Encoding |
| Injection | Validation + Safe Queries |
| Session Hijacking | Secure Cookies + Expiration |
| Unauthorized Access | RBAC |
| API Abuse | Rate Limiting |
| Data Exposure | Encryption + Masking |
| Duplicate Payment | Idempotency |
| Privilege Escalation | Server-Side Authorization |

---

## 16. How to Run the Project

### Prerequisites
- Node.js (v18+) & npm

### Setup & Launch Instructions

1. **Start Backend API Server**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   *Backend will start on `http://localhost:5000`*

2. **Start Frontend Client Application**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend will start on `http://localhost:5173`*

3. **Open Browser**:
   Navigate to `http://localhost:5173` to test all 5 domains and the Security Testing Lab.

---

## 17. Pre-Seeded Demo Credentials

| Role | Email | Password | OTP Code |
| --- | --- | --- | --- |
| Super Admin | `super.admin@payshield.com` | `SuperShield123!@#` | `123456` |
| Security Admin | `security.admin@payshield.com` | `SecAdmin123!@#` | `123456` |
| Support Admin | `support.admin@payshield.com` | `SuppAdmin123!@#` | `123456` |
| Auditor | `auditor@payshield.com` | `Auditor123!@#` | `123456` |
| Customer | `alex.morgan@acme-corp.com` | `Customer123!@#` | `123456` |

---

## 18. System Limitations
- **Sandbox Environment**: All financial data, transactions, credit card numbers, and banking operations are 100% simulated for demonstration and academic evaluation purposes.
