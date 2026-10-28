import React from 'react';
import { FileText, Shield, Key, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">PayShield Technical Documentation</h1>
        <p className="text-slate-400 text-xs font-mono">Architecture, Security Protocols, and Threat Controls Manual</p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-shield-cyan flex items-center space-x-2 font-mono">
            <Shield className="w-5 h-5" />
            <span>1. Authentication & Session Invalidation</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            All user authentications require bcrypt password verification (10 salt rounds). Accounts are rate limited to 5 attempts per 15 minutes. Upon 5 consecutive failures, the lockout engine locks the account for 15 minutes and generates a high-severity security alert.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-purple-400 flex items-center space-x-2 font-mono">
            <Key className="w-5 h-5" />
            <span>2. Role-Based Access Control (RBAC) Hierarchy</span>
          </h2>
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <p><span className="text-purple-300 font-bold">super_admin:</span> Unrestricted access across all user management, audit logs, and security alerts.</p>
            <p><span className="text-cyan-300 font-bold">security_admin:</span> Can view security logs and mitigate/resolve security alerts.</p>
            <p><span className="text-emerald-300 font-bold">support_admin:</span> Can manage customer profiles and view non-security logs.</p>
            <p><span className="text-amber-300 font-bold">auditor:</span> Read-only access to audit logs and system health telemetry.</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center space-x-2 font-mono">
            <Lock className="w-5 h-5" />
            <span>3. Payment Sandbox Security & Idempotency</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The payment sandbox application validates input transaction amounts (0.01 - 50,000 USD). It enforces mandatory X-Idempotency-Key headers to catch and return cached transactions on duplicate request replays.
          </p>
        </div>
      </div>
    </div>
  );
}
