import React from 'react';
import { SecurityDiagram } from '../../components/SecurityDiagram';
import { ShieldCheck, Lock, Layers, Globe, Server, Database, AlertCircle } from 'lucide-react';

export function SecurityArchitecture() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-cyan-950/70 border border-cyan-800/60 px-3 py-1 rounded-full text-xs font-mono text-cyan-400">
          <ShieldCheck className="w-4 h-4 text-shield-cyan" />
          <span>Cybersecurity Architecture & Design</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Defense-in-Depth Security Framework</h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto font-sans leading-relaxed">
          Comprehensive blueprint explaining PayShield's multi-layered security controls from browser request down to database storage.
        </p>
      </div>

      {/* Interactive Architecture Packet Tracer Component */}
      <SecurityDiagram />

      {/* Domain Isolation Explanation Section */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Logical Domain Separation Rationale</h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          To prevent cross-site request forgery (CSRF), cookie hijacking, and horizontal privilege escalation, PayShield separates distinct business functionalities into dedicated domain concepts:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-shield-cyan font-bold">www.payshield.com</div>
            <p className="text-slate-400 text-[11px]">Public corporate website. Exposes no sensitive customer data or internal API keys.</p>
          </div>

          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-emerald-400 font-bold">customer.payshield.com</div>
            <p className="text-slate-400 text-[11px]">Customer management portal. Scoped strictly to client user tokens and session history.</p>
          </div>

          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-amber-400 font-bold">pay.payshield.com</div>
            <p className="text-slate-400 text-[11px]">Payment checkout sandbox environment. Isolated from admin APIs and user session tokens.</p>
          </div>

          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-purple-400 font-bold">admin.payshield.com</div>
            <p className="text-slate-400 text-[11px]">Admin SOC portal enforcing RBAC middleware checks and mandatory MFA OTP verification.</p>
          </div>
        </div>
      </div>

      {/* Threat Mitigation Matrix Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>Threat Vector & Security Controls Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-navy-950/60">
                <th className="p-3">Threat Vector</th>
                <th className="p-3">Attack Mechanism</th>
                <th className="p-3">PayShield Security Control</th>
                <th className="p-3">HTTP Response / Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3 text-rose-400 font-bold">Brute Force Auth</td>
                <td className="p-3 text-slate-400">Automated dictionary password attempts</td>
                <td className="p-3 text-shield-cyan">Rate Limiting + Account Lockout (5 attempts)</td>
                <td className="p-3 text-amber-400">423 Locked / 429 Too Many Requests</td>
              </tr>
              <tr>
                <td className="p-3 text-rose-400 font-bold">XSS Attack Vector</td>
                <td className="p-3 text-slate-400">Injecting &lt;script&gt; tags in form fields</td>
                <td className="p-3 text-shield-cyan">WAF Input Sanitizer & Content Security Policy</td>
                <td className="p-3 text-amber-400">400 Bad Request (Blocked)</td>
              </tr>
              <tr>
                <td className="p-3 text-rose-400 font-bold">SQL / NoSQL Injection</td>
                <td className="p-3 text-slate-400">Tautology payloads (' OR '1'='1)</td>
                <td className="p-3 text-shield-cyan">Safe Parameterization & Pattern Filter</td>
                <td className="p-3 text-amber-400">400 Bad Request (Blocked)</td>
              </tr>
              <tr>
                <td className="p-3 text-rose-400 font-bold">Unauthorized Escalation</td>
                <td className="p-3 text-slate-400">Lower role calling Admin REST endpoints</td>
                <td className="p-3 text-shield-cyan">Server-Side RBAC Middleware (authorizeRoles)</td>
                <td className="p-3 text-rose-400">403 Forbidden</td>
              </tr>
              <tr>
                <td className="p-3 text-rose-400 font-bold">Duplicate Payment</td>
                <td className="p-3 text-slate-400">Replaying network payment POST request</td>
                <td className="p-3 text-shield-cyan">Mandatory X-Idempotency-Key Check</td>
                <td className="p-3 text-emerald-400">200 OK (Cached / Duplicate Guard)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
