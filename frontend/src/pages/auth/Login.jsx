import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export function Login() {
  const { loginUser, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.morgan@acme-corp.com');
  const [password, setPassword] = useState('Customer123!@#');
  const [mfaCode, setMfaCode] = useState('123456');
  const [showMfa, setShowMfa] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await loginUser(email, password, showMfa ? mfaCode : null);

    if (!res.ok) {
      setErrorMsg(res.message || 'Authentication failed');
    } else if (res.data?.mfaRequired) {
      setShowMfa(true);
    } else {
      // Redirect based on role
      const role = res.data?.user?.role;
      if (role === 'customer') navigate('/customer');
      else navigate('/admin');
    }
  };

  const quickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setShowMfa(false);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 mx-auto shadow-glow-cyan">
          <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
            <Lock className="w-6 h-6 text-shield-cyan" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">PayShield Secure Gateway</h1>
        <p className="text-xs text-slate-400 font-mono">Zero-Trust Authentication Portal</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl flex items-center space-x-2 font-mono text-xs shadow-glow-rose">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!showMfa ? (
            <>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 bg-navy-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold">
                <Key className="w-4 h-4" />
                <span>Multi-Factor Authentication Code</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Enter 6-digit TOTP code from your authenticator app (Demo: 123456).</p>
              <input
                type="text"
                maxLength={6}
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono text-center tracking-widest text-white"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow-cyan text-xs font-mono flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'Authenticating...' : showMfa ? 'Verify OTP & Login' : 'Authenticate Credentials'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Quick Demo Credentials Assistant Box */}
        <div className="border-t border-slate-800/80 pt-4 space-y-2 font-mono text-[11px]">
          <p className="text-slate-400 font-bold uppercase text-[10px]">Quick Fill Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => quickFill('super.admin@payshield.com', 'SuperShield123!@#')}
              className="p-1.5 rounded bg-navy-950 hover:bg-navy-900 border border-slate-800 text-purple-300 text-[10px] text-left truncate"
            >
              Super Admin
            </button>
            <button
              onClick={() => quickFill('security.admin@payshield.com', 'SecAdmin123!@#')}
              className="p-1.5 rounded bg-navy-950 hover:bg-navy-900 border border-slate-800 text-cyan-300 text-[10px] text-left truncate"
            >
              Security Admin
            </button>
            <button
              onClick={() => quickFill('auditor@payshield.com', 'Auditor123!@#')}
              className="p-1.5 rounded bg-navy-950 hover:bg-navy-900 border border-slate-800 text-amber-300 text-[10px] text-left truncate"
            >
              Auditor
            </button>
            <button
              onClick={() => quickFill('alex.morgan@acme-corp.com', 'Customer123!@#')}
              className="p-1.5 rounded bg-navy-950 hover:bg-navy-900 border border-slate-800 text-emerald-300 text-[10px] text-left truncate"
            >
              Customer
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <Link to="/forgot-password" className="hover:text-shield-cyan">Forgot Password?</Link>
        <Link to="/register" className="hover:text-shield-cyan">Register Account →</Link>
      </div>
    </div>
  );
}
