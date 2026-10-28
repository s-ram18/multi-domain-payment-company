import React from 'react';
import { Link } from 'react-router-dom';
import { SecurityDiagram } from '../../components/SecurityDiagram';
import { ShieldCheck, Lock, Cpu, Server, KeyRound, Activity, ArrowRight, Award, CheckCircle } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-cyan-950/70 border border-cyan-800/60 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-400">
          <ShieldCheck className="w-4 h-4 text-shield-cyan animate-pulse" />
          <span>Zero-Trust Enterprise Payment Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Next-Generation <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Cyber-Secure</span> Payment Architecture
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          PayShield isolates high-risk payment microservices behind end-to-end TLS encryption, Web Application Firewalls (WAF), strict RBAC authorization, and automated security monitoring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/security"
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-glow-cyan"
          >
            <span>Explore Security Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/security-lab"
            className="flex items-center space-x-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <span>Launch Security Lab</span>
          </Link>
        </div>
      </div>

      {/* Trust Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-card rounded-2xl border border-slate-800 text-center">
        <div>
          <p className="text-3xl font-extrabold text-white font-mono">100%</p>
          <p className="text-xs text-slate-400 font-mono mt-1">TLS 1.3 Strict Encrypted</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-shield-cyan font-mono">0 Plaintext</p>
          <p className="text-xs text-slate-400 font-mono mt-1">Credentials Stored</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">&lt; 15ms</p>
          <p className="text-xs text-slate-400 font-mono mt-1">Gateway Auth Latency</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-purple-400 font-mono">5 Domains</p>
          <p className="text-xs text-slate-400 font-mono mt-1">Logical Attack Surface Isolation</p>
        </div>
      </div>

      {/* Security Architecture Visualizer */}
      <SecurityDiagram />

      {/* Key Security Pillars */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Defense-in-Depth Security Pillars</h2>
          <p className="text-xs text-slate-400 font-mono">Multilayered protection safeguards sensitive transaction workflows at every tier.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center">
              <Lock className="w-5 h-5 text-shield-cyan" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Authentication & MFA</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enforces bcrypt salted password hashing, 6-digit TOTP MFA, rate-limited login endpoints, and account lockout after 5 failed authentication attempts.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Granular permission matrix separating Super Admin, Security Admin, Support Admin, Auditor, and Customer roles to prevent unauthorized privilege escalation.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center">
              <Activity className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Audit & SOC Monitoring</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every API call, RBAC check, payment processing attempt, and security anomaly is scrubbed of credentials and logged to the Security Operations Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
