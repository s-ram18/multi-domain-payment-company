import React, { useState } from 'react';
import { apiRequest } from '../../services/api';
import { CreditCard, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InitiatePayment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    merchantName: 'CyberCloud Global Services',
    amount: '450.00',
    currency: 'USD',
    cardNumber: '4532015589124242',
    idempotencyKey: `idem_${Math.random().toString(36).substring(2, 12)}`
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    const res = await apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(form)
    });

    setLoading(false);

    if (!res.ok) {
      setErrorMsg(res.message || 'Payment failed');
    } else {
      setResult(res.data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Initiate Sandbox Transfer / Payment</h1>
        <p className="text-xs text-slate-400 font-mono">Simulated Sandbox Environment - No Real Money Processed</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        {result ? (
          <div className="text-center py-6 space-y-4 font-mono">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Sandbox Settlement Confirmed</h3>
            <div className="bg-navy-950 p-4 rounded-xl text-xs space-y-1.5 text-left border border-slate-800">
              <p><span className="text-slate-400">Transaction ID:</span> <span className="text-cyan-300 font-bold">{result.transaction?.id}</span></p>
              <p><span className="text-slate-400">Amount:</span> <span className="text-emerald-400 font-bold">${result.transaction?.amount?.toFixed(2)} USD</span></p>
              <p><span className="text-slate-400">Masked Method:</span> <span className="text-slate-200">{result.transaction?.paymentMethod}</span></p>
              <p><span className="text-slate-400">Idempotency Key:</span> <span className="text-purple-300">{result.transaction?.idempotencyKey}</span></p>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setForm({ ...form, idempotencyKey: `idem_${Math.random().toString(36).substring(2, 12)}` });
              }}
              className="bg-navy-800 hover:bg-navy-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-mono border border-slate-700"
            >
              Process Another Sandbox Payment
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcess} className="space-y-4 font-sans text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl flex items-center space-x-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-mono mb-1">Recipient Merchant Name</label>
              <input
                type="text"
                required
                value={form.merchantName}
                onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Transfer Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Demo Card Number (Masked Server-side)</label>
              <input
                type="text"
                required
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Idempotency Key (Deduplication)</label>
              <input
                type="text"
                required
                value={form.idempotencyKey}
                onChange={(e) => setForm({ ...form, idempotencyKey: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-purple-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow-emerald text-xs font-mono flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Processing Encrypted Payload...' : 'Process Sandbox Payment'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
