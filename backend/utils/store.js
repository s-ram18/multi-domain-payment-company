import { hashPassword } from './passwordHash.js';
import {
  INITIAL_USERS,
  INITIAL_TRANSACTIONS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SESSIONS
} from './mockData.js';

class DataStore {
  constructor() {
    this.users = [];
    this.transactions = [];
    this.securityAlerts = [];
    this.auditLogs = [];
    this.sessions = [];
    this.idempotencyKeys = new Map(); // key -> transaction
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    // Seed users with bcrypt hashed passwords
    const demoPasswordHashes = {
      "super.admin@payshield.com": await hashPassword("SuperShield123!@#"),
      "security.admin@payshield.com": await hashPassword("SecAdmin123!@#"),
      "support.admin@payshield.com": await hashPassword("SuppAdmin123!@#"),
      "auditor@payshield.com": await hashPassword("Auditor123!@#"),
      "alex.morgan@acme-corp.com": await hashPassword("Customer123!@#")
    };

    this.users = INITIAL_USERS.map(u => ({
      ...u,
      passwordHash: demoPasswordHashes[u.email] || demoPasswordHashes["alex.morgan@acme-corp.com"]
    }));

    this.transactions = [...INITIAL_TRANSACTIONS];
    this.securityAlerts = [...INITIAL_SECURITY_ALERTS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.sessions = [...INITIAL_SESSIONS];

    this.isInitialized = true;
  }

  // --- Users ---
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  addUser(user) {
    this.users.push(user);
    return user;
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      return this.users[idx];
    }
    return null;
  }

  getAllUsers() {
    return this.users.map(({ passwordHash, mfaSecret, ...u }) => u);
  }

  // --- Transactions ---
  getAllTransactions() {
    return [...this.transactions];
  }

  addTransaction(txn) {
    this.transactions.unshift(txn);
    if (txn.idempotencyKey) {
      this.idempotencyKeys.set(txn.idempotencyKey, txn);
    }
    return txn;
  }

  getIdempotentTransaction(key) {
    return this.idempotencyKeys.get(key) || null;
  }

  // --- Security Alerts ---
  getSecurityAlerts() {
    return [...this.securityAlerts];
  }

  addSecurityAlert(alert) {
    this.securityAlerts.unshift(alert);
    return alert;
  }

  updateAlertStatus(id, status) {
    const alert = this.securityAlerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
    }
    return alert;
  }

  // --- Audit Logs ---
  getAuditLogs(filter = {}) {
    let logs = [...this.auditLogs];
    if (filter.category) {
      logs = logs.filter(l => l.category === filter.category);
    }
    if (filter.severity) {
      logs = logs.filter(l => l.severity === filter.severity);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      logs = logs.filter(l => 
        l.action.toLowerCase().includes(q) ||
        l.userEmail.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return logs;
  }

  addAuditLog(log) {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // --- Sessions ---
  getUserSessions(userId) {
    return this.sessions.filter(s => s.userId === userId);
  }

  addSession(session) {
    this.sessions.unshift(session);
    return session;
  }

  revokeSession(sessionId) {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
  }

  revokeAllUserSessions(userId) {
    this.sessions = this.sessions.filter(s => s.userId !== userId);
  }
}

export const store = new DataStore();
