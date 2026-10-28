# PayShield REST API Specification (api.payshield.com)

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/login`
- **Payload**: `{ "email": "string", "password": "string", "mfaCode": "string" }`
- **Response (200)**: `{ "token": "JWT_STRING", "user": { ... } }`
- **Response (423)**: Account locked out due to failed attempt threshold.

### `POST /auth/register`
- **Payload**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response (201)**: `{ "token": "JWT_STRING", "user": { ... } }`

### `POST /auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**: Invalidates active session token.

---

## 2. Payment Sandbox Endpoints (`/payments`)

### `POST /payments/process`
- **Headers**: `Authorization: Bearer <token>`, `X-Idempotency-Key: string`
- **Payload**: `{ "amount": 1450.00, "currency": "USD", "merchantName": "string", "cardNumber": "string" }`
- **Response (201)**: `{ "message": "Success", "transaction": { ... } }`
- **Response (200)**: Returns cached duplicate response if idempotency key matches prior transaction.

---

## 3. Administrative Endpoints (`/admin`)

### `GET /admin/dashboard`
- **Headers**: `Authorization: Bearer <token>` (Role: `super_admin`, `security_admin`, `support_admin`, `auditor`)
- **Response (200)**: SOC KPI metrics, threat distribution, and hourly traffic curves.

### `PATCH /admin/users/:userId`
- **Headers**: `Authorization: Bearer <token>` (Role: `super_admin`, `support_admin`)
- **Response (200)**: Updates user status or role.
- **Response (403)**: Returns `403 Forbidden` if invoked by `auditor` or `customer`.

---

## 4. Security Testing Lab Endpoints (`/lab`)

### `POST /lab/run-test`
- **Payload**: `{ "testId": "TEST_01_BRUTE_FORCE" | "TEST_03_RBAC_VIOLATION" | ... }`
- **Response (200/400/401/403/423/429)**: Detailed test execution report with HTTP status code, engaged security control, and generated audit log ID.
