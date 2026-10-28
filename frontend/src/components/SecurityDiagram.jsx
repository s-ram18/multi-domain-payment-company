import React, { useState } from 'react';
import { ShieldCheck, Lock, Globe, Cpu, Database, Server, Key, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export function SecurityDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  const layers = [
    {
      id: 'client',
      title: '1. User Browser (Client)',
      icon: Globe,
      color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
      description: 'End-user browser communicating strictly over TLS 1.3 encrypted tunnel with HSTS enforced.',
      controls: ['HTTPS / TLS 1.3', 'HSTS Header', 'HTTP-Only Secure Cookies', 'SameSite Strict']
    },
    {
      id: 'waf',
      title: '2. Web Application Firewall (WAF)',
      icon: ShieldCheck,
      color: 'text-rose-400 border-rose-500/50 bg-rose-950/30',
      description: 'Filters incoming malicious payloads, blocking XSS script tags, SQLi signatures, and bad IP ranges.',
      controls: ['XSS Filtering', 'SQLi / NoSQLi Interception', 'IP Reputation Filtering', 'DDoS Protection']
    },
    {
      id: 'gateway',
      title: '3. API Gateway & Rate Limiter',
      icon: Server,
      color: 'text-purple-400 border-purple-500/50 bg-purple-950/30',
      description: 'Central API entry point enforcing express-rate-limit throttling, CORS origin verification, and request sizing.',
      controls: ['Rate Limiting (100 req/15m)', 'CORS Restriction', 'Payload Limit (100kb)', 'API Versioning (/api/v1)']
    },
    {
      id: 'auth',
      title: '4. Authentication & RBAC Engine',
      icon: Key,
      color: 'text-amber-400 border-amber-500/50 bg-amber-950/30',
      description: 'Validates JWT signature, checks account lockout status, and enforces Role-Based Access Control matrix.',
      controls: ['JWT Token Validation', 'Bcrypt Hash Match', 'Account Lockout (5 attempts)', 'RBAC (Super, Security, Support, Auditor)']
    },
    {
      id: 'service',
      title: '5. Business Logic Microservice',
      icon: Cpu,
      color: 'text-blue-400 border-blue-500/50 bg-blue-950/30',
      description: 'Executes transaction validation, verifies idempotency keys, and scrubs sensitive keys prior to logging.',
      controls: ['Idempotency Guard', 'Card Tokenization / Masking', 'Audit Event Scrubbing', 'Amount Bounds Check']
    },
    {
      id: 'database',
      title: '6. Database Layer',
      icon: Database,
      color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30',
      description: 'Least-privilege database store. Stores salted bcrypt password hashes and tokenized references.',
      controls: ['Salted Bcrypt Hashes', 'Least Privilege Connection', 'No Plaintext Passwords/CVV', 'Audit Log Retention']
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 my-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-shield-cyan" />
            <h3 className="text-xl font-bold text-white">PayShield Defense-in-Depth Security Architecture</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Interactive Packet Flow: Browser → TLS → WAF → API Gateway → Auth/RBAC → Microservices → Database
          </p>
        </div>

        {/* Step Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % layers.length)}
            className="flex items-center space-x-1.5 bg-shield-cyan text-navy-950 font-bold px-3.5 py-1.5 rounded-lg text-xs hover:bg-cyan-300 transition-all shadow-glow-cyan"
          >
            <span>Trace Packet Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Layer Step Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? `${layer.color} shadow-lg ring-1 ring-shield-cyan/50 scale-[1.02]`
                  : 'bg-navy-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-mono text-[10px] font-bold opacity-60">0{idx + 1}</span>
              </div>
              <p className="text-xs font-semibold line-clamp-1">{layer.title.split('.')[1]}</p>
            </button>
          );
        })}
      </div>

      {/* Active Layer Detailed Inspector Panel */}
      <div className={`p-5 rounded-xl border ${layers[activeStep].color} transition-all`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            {React.createElement(layers[activeStep].icon, { className: "w-6 h-6 text-white" })}
            <h4 className="text-lg font-bold text-white">{layers[activeStep].title}</h4>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-navy-950/80 border border-slate-700 text-shield-cyan">
            Layer Active Inspection
          </span>
        </div>

        <p className="text-sm text-slate-300 mb-4 font-sans leading-relaxed">
          {layers[activeStep].description}
        </p>

        <div>
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Implemented Security Controls at Layer:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {layers[activeStep].controls.map((ctrl, i) => (
              <div key={i} className="flex items-center space-x-2 bg-navy-950/80 border border-slate-800/80 px-3 py-2 rounded-lg text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-mono text-[11px]">{ctrl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
