import React, { useState } from 'react';
import { apiRequest } from '../../services/api';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export function CheckoutSandbox() {
  const [form, setForm] = useState({
    merchantName: 'Acme Cloud Hosting Inc.',
    amount: '129.99',
    currency: 'USD',
    cardNumber: '4532015589124242',
    expiry: '12/28',
    cvv: '998',
    idempotencyKey: `idem_${Math.random().toString(36).substring(2, 10)}`
  });

  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const securitySteps = [
    'Validating Amount & Request Bounds',
    'Checking Idempotency Deduplication Key',
    'WAF Payload & Script Sanitization',
    'Tokenizing Card PAN & CVV (Scrubbing)',
    'Generating Cryptographic Transaction Signature'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg(null);
    setResponse(null);
    setCurrentStep(0);

    for (let i = 0; i < securitySteps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 250));
    }

    const res = await apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(form)
    });

    setProcessing(false);

    if (!res.ok) {
      setErrorMsg(res.message || 'Payment processing failed');
    } else {
      setResponse(res.data);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Domain Badge & Sandbox Warning Banner */}
      <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-2xl flex items-center space-x-3 text-amber-300 font-mono text-xs shadow-glow-amber">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <div>
          <div className="font-bold text-amber-400">DOMAIN CONCEPT: pay.payshield.com (SANDBOX APP)</div>
          <p className="text-[11px] text-slate-300">Sandbox/Demo Environment – No real payments or banking credentials are processed.</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2.5">
            <CreditCard className="w-6 h-6 text-shield-cyan" />
            <div>
              <h2 className="text-xl font-bold text-white font-sans">ShieldPay Merchant Checkout Sandbox</h2>
              <p className="text-xs text-slate-400 font-mono">Merchant: {form.merchantName}</p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">Total Charge:</span>
            <span className="text-2xl font-extrabold text-shield-cyan">${parseFloat(form.amount || 0).toFixed(2)} USD</span>
          </div>
        </div>

        {response ? (
          <div className="text-center py-6 space-y-4 font-mono">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Payment Transaction Approved</h3>
            <p className="text-xs text-emerald-400">Status: {response.transaction?.status}</p>

            <div className="bg-navy-950 p-4 rounded-xl text-xs space-y-2 text-left border border-slate-800">
              <p><span className="text-slate-400">Transaction ID:</span> <span className="text-cyan-300 font-bold">{response.transaction?.id}</span></p>
              <p><span className="text-slate-400">Masked Method:</span> <span className="text-slate-200">{response.transaction?.paymentMethod}</span></p>
              <p><span className="text-slate-400">Risk Score:</span> <span className="text-emerald-400 font-bold">{response.transaction?.riskScore}/100</span></p>
              <p><span className="text-slate-400">Idempotency Key:</span> <span className="text-purple-300">{response.transaction?.idempotencyKey}</span></p>
              {response.duplicateProcessed && (
                <p className="text-amber-400 font-bold">⚠️ DUPLICATE CAUGHT: Returned cached response via Idempotency Key!</p>
              )}
            </div>

            <button
              onClick={() => {
                setResponse(null);
                setForm({ ...form, idempotencyKey: `idem_${Math.random().toString(36).substring(2, 10)}` });
              }}
              className="bg-shield-cyan text-navy-950 hover:bg-cyan-300 font-bold px-6 py-2.5 rounded-xl text-xs shadow-glow-cyan"
            >
              Simulate New Transaction
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl flex items-center space-x-2 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {processing && (
              <div className="p-4 bg-navy-950 border border-cyan-800/60 rounded-xl space-y-2 font-mono">
                <div className="flex items-center space-x-2 text-shield-cyan font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-shield-cyan" />
                  <span>Security Middleware Pipeline Executing...</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Step {currentStep + 1} of 5: <span className="text-amber-300">{securitySteps[currentStep]}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Merchant Name</label>
                <input
                  type="text"
                  required
                  value={form.merchantName}
                  onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Demo Card PAN (Never stored in raw text)</label>
              <input
                type="text"
                required
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-cyan-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Expiration Date</label>
                <input
                  type="text"
                  required
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Demo CVV (Scrubbed)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-400 font-mono">X-Idempotency-Key (Replay Protection)</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, idempotencyKey: `idem_${Math.random().toString(36).substring(2, 10)}` })}
                  className="text-[10px] font-mono text-shield-cyan hover:underline"
                >
                  Generate New Key
                </button>
              </div>
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
              disabled={processing}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold py-3.5 rounded-xl transition-all shadow-glow-cyan text-xs font-mono flex items-center justify-center space-x-2 mt-4"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Running Security Checks...' : 'Submit Secure Demo Payment'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
