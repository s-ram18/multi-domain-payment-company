import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function PaymentStatus() {
  const [txnId, setTxnId] = useState('TXN-PAY-892401');
  const [searched, setSearched] = useState(true);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Payment Transaction Verification</h1>
        <p className="text-xs text-slate-400 font-mono">Verify idempotency key status and settlement state.</p>
      </div>

      <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
          placeholder="Enter Transaction ID (e.g. TXN-PAY-892401)..."
          className="bg-transparent border-none outline-none text-xs font-mono text-white w-full"
        />
        <button
          onClick={() => setSearched(true)}
          className="bg-shield-cyan text-navy-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono"
        >
          Verify
        </button>
      </div>

      {searched && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>TRANSACTION VERIFIED & SETTLED</span>
          </div>

          <div className="bg-navy-950 p-4 rounded-xl space-y-2 border border-slate-800 text-slate-300">
            <p><span className="text-slate-400">Transaction ID:</span> <span className="text-cyan-300 font-bold">{txnId}</span></p>
            <p><span className="text-slate-400">Amount:</span> <span className="text-emerald-400 font-bold">$1,450.00 USD</span></p>
            <p><span className="text-slate-400">Merchant:</span> <span className="text-white">CyberCloud Services Inc.</span></p>
            <p><span className="text-slate-400">Method:</span> <span className="text-slate-200">Visa ending in •••• 4242</span></p>
            <p><span className="text-slate-400">Risk Assessment:</span> <span className="text-emerald-400 font-bold">PASS (Score: 12/100)</span></p>
            <p><span className="text-slate-400">TLS Encryption:</span> <span className="text-shield-cyan">TLS_AES_256_GCM_SHA384</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
