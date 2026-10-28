import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { PasswordMeter } from '../../components/PasswordMeter';
import { Lock, User, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export function Register() {
  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await registerUser(name, email, password);

    if (!res.ok) {
      setErrorMsg(res.message || 'Registration failed');
    } else {
      navigate('/customer');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Create PayShield Enterprise Account</h1>
        <p className="text-xs text-slate-400 font-mono">Password Complexity Verification Enforced</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl flex items-center space-x-2 font-mono text-xs shadow-glow-rose">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Vance"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Corporate Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan.vance@company.com"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Set Account Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 12 chars with upper, lower, number & special"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
            />
            <PasswordMeter password={password} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow-cyan text-xs font-mono flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'Creating Account...' : 'Register Secure Account'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>

      <div className="text-center text-xs font-mono text-slate-400">
        Already have an account? <Link to="/login" className="text-shield-cyan hover:underline">Log In Here</Link>
      </div>
    </div>
  );
}
