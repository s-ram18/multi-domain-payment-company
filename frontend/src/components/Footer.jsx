import React from 'react';
import { Shield, Lock, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 py-10 px-4 mt-20 text-xs font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Purpose */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-shield-cyan" />
            <span className="text-lg font-bold text-white font-mono">PayShield</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Demonstration cybersecurity architecture prototype for secure multi-domain payment processing, RBAC authorization, and threat mitigation.
          </p>
          <div className="flex items-center space-x-2 pt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              SOC 2 TYPE II
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
              PCI-DSS v4.0
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-400 border border-purple-800">
              ISO 27001
            </span>
          </div>
        </div>

        {/* Logical Domains */}
        <div>
          <h4 className="font-mono text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Simulated Domains</h4>
          <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
            <li><Link to="/" className="hover:text-shield-cyan transition-colors">www.payshield.com (Corporate)</Link></li>
            <li><Link to="/customer" className="hover:text-shield-cyan transition-colors">customer.payshield.com (Client)</Link></li>
            <li><Link to="/pay" className="hover:text-shield-cyan transition-colors">pay.payshield.com (Sandbox)</Link></li>
            <li><Link to="/admin" className="hover:text-shield-cyan transition-colors">admin.payshield.com (SOC Portal)</Link></li>
            <li><Link to="/developers" className="hover:text-shield-cyan transition-colors">api.payshield.com (REST API)</Link></li>
          </ul>
        </div>

        {/* Security Documentation Links */}
        <div>
          <h4 className="font-mono text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Security Architecture</h4>
          <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
            <li><Link to="/security" className="hover:text-shield-cyan transition-colors">Defense-in-Depth Model</Link></li>
            <li><Link to="/documentation" className="hover:text-shield-cyan transition-colors">Threat Matrix & Controls</Link></li>
            <li><Link to="/security-lab" className="hover:text-rose-400 transition-colors flex items-center">Security Lab Workbench <ExternalLink className="w-3 h-3 ml-1" /></Link></li>
            <li><Link to="/developers" className="hover:text-shield-cyan transition-colors">JWT & Auth Headers</Link></li>
          </ul>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Sandbox Disclaimer</span>
          </div>
          <p className="text-slate-300 text-[10px] leading-relaxed">
            PayShield is a simulated cybersecurity showcase system designed for academic and demonstration purposes only. No real money, payment credentials, or financial transactions are processed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/60 pt-6 flex flex-wrap items-center justify-between text-slate-500 font-mono text-[11px]">
        <p>© 2026 PayShield Secure Technology Corp. All Rights Reserved.</p>
        <p>Built for Cybersecurity Architecture & Secure Software Engineering.</p>
      </div>
    </footer>
  );
}
