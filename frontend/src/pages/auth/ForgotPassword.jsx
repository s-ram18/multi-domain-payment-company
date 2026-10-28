import React, { useState } from 'react';
import { apiRequest } from '../../services/api';
import { Mail, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      setSubmitted(true);
      setResetToken(res.data.demoResetToken);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Reset Account Password</h1>
        <p className="text-xs text-slate-400 font-mono">Single-Use Token Generation Engine</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        {submitted ? (
          <div className="text-center py-4 space-y-3 font-mono text-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Password Reset Token Issued</h3>
            <div className="bg-navy-950 p-3.5 rounded-xl border border-slate-800 text-left space-y-1 text-slate-300">
              <p><span className="text-slate-400">Target Email:</span> <span className="text-cyan-300 font-bold">{email}</span></p>
              <p><span className="text-slate-400">Single-Use Reset Token:</span> <span className="text-purple-300 font-bold">{resetToken}</span></p>
              <p className="text-[10px] text-amber-400 pt-1">Token valid for 15 minutes. Single-use enforcement active.</p>
            </div>
            <Link to="/login" className="inline-block bg-shield-cyan text-navy-950 font-bold px-4 py-2 rounded-xl text-xs">
              Return to Login Portal
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Registered Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@payshield.com"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow-cyan text-xs font-mono flex items-center justify-center space-x-1"
            >
              <span>Dispatch Reset Link</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-xs font-mono text-slate-400">
        <Link to="/login" className="hover:text-shield-cyan">← Back to Login</Link>
      </div>
    </div>
  );
}
