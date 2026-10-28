import React from 'react';
import { Shield, Lock, Award, CheckCircle2, FileText, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">About PayShield Technology</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
          PayShield is engineered to demonstrate enterprise cybersecurity architecture and secure application development principles for modern payment processing platforms.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-shield-cyan font-bold font-mono">
            <Shield className="w-5 h-5" />
            <span>Zero-Trust Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our architectural philosophy assumes that no user or system inside or outside the network perimeter is trusted by default. Every transaction request must be authenticated, authorized, and validated prior to database execution.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 font-bold font-mono">
            <Lock className="w-5 h-5" />
            <span>Blast-Radius Reduction</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            By logically partitioning corporate, customer, payment sandbox, administrative, and API services across discrete application domains, PayShield isolates attack surfaces and eliminates single points of failure.
          </p>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Simulated Enterprise Compliance Standards</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-shield-cyan font-mono font-bold text-sm">SOC 2 Type II Compliance</div>
            <p className="text-xs text-slate-400">Security, Availability, Processing Integrity, Confidentiality, and Privacy controls verified.</p>
          </div>

          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-emerald-400 font-mono font-bold text-sm">PCI-DSS v4.0 Alignment</div>
            <p className="text-xs text-slate-400">Strict card tokenization, masked data storage, and mandatory TLS 1.3 encrypted transport.</p>
          </div>

          <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-purple-400 font-mono font-bold text-sm">ISO / IEC 27001</div>
            <p className="text-xs text-slate-400">Information security management system (ISMS) framework and risk assessment controls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
