import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { ShieldCheck, ShieldAlert, Lock, CreditCard, Activity, ArrowUpRight, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const txRes = await apiRequest('/payments/transactions');
      if (txRes.ok) setTransactions(txRes.data.transactions || []);

      const sessRes = await apiRequest('/users/sessions');
      if (sessRes.ok) setSessions(sessRes.data.sessions || []);

      setLoading(false);
    }
    fetchData();
  }, []);

  const securityScore = user ? (user.mfaEnabled ? 92 : 68) : 85;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome & Domain Concept Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
              customer.payshield.com
            </span>
            <span className="text-xs text-slate-400 font-mono">Client Enterprise Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user ? user.name : 'Alex Morgan'}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Department: {user ? user.department : 'Enterprise Client Services'} | Account ID: {user ? user.id : 'usr_customer_demo'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/customer/transfer"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-glow-emerald font-mono"
          >
            <span>Initiate Transfer</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Security Health Score & Key Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Security Score Widget */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Account Security Score</span>
            <ShieldCheck className={`w-5 h-5 ${securityScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold font-mono text-white">{securityScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${securityScore > 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${securityScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {user?.mfaEnabled ? '✓ MFA Protection Active' : '⚠️ Enable MFA to reach 95+ score'}
          </p>
        </div>

        {/* MFA Status Indicator */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">MFA Status</span>
            <Key className="w-5 h-5 text-shield-cyan" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {user?.mfaEnabled ? 'ENABLED (TOTP)' : 'DISABLED'}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            2-Factor OTP verification active on logins
          </p>
        </div>

        {/* Active Sessions Counter */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Active Sessions</span>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {sessions.length || 2} Devices
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Last Login IP: {user?.lastLoginIp || '203.0.113.42'}
          </p>
        </div>

        {/* Suspicious Warning Indicator */}
        <div className="glass-card p-6 rounded-2xl border border-amber-800/40 bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">Security Warning</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
            Geographic anomaly detected on log-in attempt 45m ago from IP 198.51.100.99.
          </p>
          <Link to="/customer/security" className="text-[11px] text-amber-400 font-mono underline block">
            Review Security Settings →
          </Link>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-shield-cyan" />
            <h2 className="text-lg font-bold text-white">Recent Customer Transactions (Masked Data)</h2>
          </div>
          <Link to="/customer/transactions" className="text-xs font-mono text-shield-cyan hover:underline">
            View All History →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-navy-950/60">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Merchant</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {transactions.slice(0, 4).map((tx) => (
                <tr key={tx.id}>
                  <td className="p-3 font-bold text-cyan-300">{tx.id}</td>
                  <td className="p-3 text-slate-200">{tx.merchantName}</td>
                  <td className="p-3 font-bold text-white">${tx.amount.toFixed(2)} {tx.currency}</td>
                  <td className="p-3 text-slate-400">{tx.paymentMethod}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.riskScore > 50 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      Risk {tx.riskScore}/100
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
