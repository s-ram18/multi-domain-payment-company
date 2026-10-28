import React, { useState } from 'react';
import { Code, Terminal, Copy, Check, Lock, Server, Key } from 'lucide-react';

export function Developers() {
  const [copied, setCopied] = useState(false);

  const curlExample = `curl -X POST https://api.payshield.com/api/v1/payments/process \\
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
  -H "X-Idempotency-Key: idem_984210491820" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 250.00,
    "currency": "USD",
    "merchantName": "Acme SaaS Gateway",
    "cardNumber": "4532015589124242",
    "expiry": "12/28"
  }'`;

  const copyCode = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-950/70 border border-blue-800/60 px-3 py-1 rounded-full text-xs font-mono text-blue-400">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>api.payshield.com Developer Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">REST API Services & Integration</h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto font-mono">
          Secure API reference with mandatory JWT authentication headers and Idempotency key safeguards.
        </p>
      </div>

      {/* Code Snippet Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs text-shield-cyan">
            <Code className="w-4 h-4" />
            <span>POST /api/v1/payments/process</span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center space-x-1 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-slate-700 px-3 py-1 rounded-md text-xs font-mono transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>

        <pre className="bg-navy-950 p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800">
          <code>{curlExample}</code>
        </pre>
      </div>

      {/* API Endpoint Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">POST</span>
          <span className="text-slate-200 font-bold ml-2">/api/v1/auth/login</span>
          <p className="text-slate-400 text-[11px] font-sans">Authenticates credentials, evaluates lockout status, returns JWT access token.</p>
        </div>

        <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold border border-blue-800">GET</span>
          <span className="text-slate-200 font-bold ml-2">/api/v1/admin/dashboard</span>
          <p className="text-slate-400 text-[11px] font-sans">Requires RBAC role (super_admin, security_admin, support_admin, auditor).</p>
        </div>

        <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-bold border border-purple-800">POST</span>
          <span className="text-slate-200 font-bold ml-2">/api/v1/lab/run-test</span>
          <p className="text-slate-400 text-[11px] font-sans">Security testing workbench API for live security control simulation.</p>
        </div>

        <div className="bg-navy-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800">GET</span>
          <span className="text-slate-200 font-bold ml-2">/api/v1/audit</span>
          <p className="text-slate-400 text-[11px] font-sans">Retrieves scrubbed audit logs with severity and action filtering.</p>
        </div>
      </div>
    </div>
  );
}
