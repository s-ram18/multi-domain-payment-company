import React from 'react';
import { Shield, Lock, CreditCard, Cpu, Database, Eye, CheckCircle2 } from 'lucide-react';

export function Products() {
  const products = [
    {
      title: 'ShieldPay Gateway',
      subtitle: 'Zero-Trust Sandbox Payment Processing',
      description: 'Ultra-low latency sandbox payment engine supporting idempotency key deduplication, tokenized card references, and real-time risk scoring.',
      features: ['Idempotency key enforcement', 'Masked card payload handler', 'Real-time risk scoring engine', 'Instant settlement confirmation'],
      icon: CreditCard,
      color: 'text-cyan-400 bg-cyan-950 border-cyan-800'
    },
    {
      title: 'ShieldVault Tokenization',
      subtitle: 'PCI-DSS Compliant Secret Vault',
      description: 'Replaces sensitive credit card numbers and bank credentials with cryptographically generated surrogate tokens before database persistence.',
      features: ['Zero plaintext card storage', 'Format-preserving encryption', 'HMAC integrity verification', 'Automated token rotation'],
      icon: Lock,
      color: 'text-purple-400 bg-purple-950 border-purple-800'
    },
    {
      title: 'ShieldFraud AI',
      subtitle: 'Behavioral Anomaly & Risk Monitoring',
      description: 'Analyses IP geolocation signatures, device fingerprints, velocity limits, and transaction patterns to flag suspicious payment attempts.',
      features: ['Geographic IP anomaly detection', 'Automated velocity throttling', 'Custom risk thresholds', 'Instant SOC alert triggers'],
      icon: Cpu,
      color: 'text-emerald-400 bg-emerald-950 border-emerald-800'
    },
    {
      title: 'ShieldAudit SOC Engine',
      subtitle: 'Immutable Security & Audit Trail',
      description: 'Captures tamper-evident audit logs across all API microservices while automatically redacting sensitive credentials and passwords.',
      features: ['Automatic credential scrubbing', 'Categorized severity indexing', 'JSON payload inspection', 'Compliance audit export'],
      icon: Eye,
      color: 'text-amber-400 bg-amber-950 border-amber-800'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">PayShield Security Product Suite</h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto font-mono">
          Enterprise cyber-defense microservices designed to secure financial operations end-to-end.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((prod, idx) => {
          const Icon = prod.icon;
          return (
            <div key={idx} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${prod.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{prod.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">{prod.subtitle}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{prod.description}</p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Key Features:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {prod.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-1.5 text-[11px] text-slate-300 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-shield-cyan shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
