import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { ShieldCheck, ShieldAlert, Activity, Users, Lock, AlertTriangle, ArrowUpRight, BarChart3, RefreshCw } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const res = await apiRequest('/admin/dashboard');
      if (res.ok) setStats(res.data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 font-mono text-xs text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
        <p>Connecting to admin.payshield.com SOC Engine...</p>
      </div>
    );
  }

  const kpi = stats?.kpi || {
    totalTransactions: 4,
    successfulPayments: 3,
    failedPayments: 1,
    activeUsers: 5,
    failedLoginAttempts: 14,
    blockedRequests: 32,
    activeSecurityAlerts: 3,
    totalAuditEvents: 48
  };

  const threatData = stats?.threatDistribution || [
    { name: 'Brute Force Attempts', value: 42, color: '#ef4444' },
    { name: 'RBAC Escalations', value: 18, color: '#f59e0b' },
    { name: 'XSS/Injection Payload', value: 24, color: '#ec4899' },
    { name: 'Geographic Anomaly', value: 16, color: '#3b82f6' }
  ];

  const hourlyData = stats?.hourlyTraffic || [
    { hour: '04:00', requests: 120, blocked: 4, latencyMs: 38 },
    { hour: '08:00', requests: 450, blocked: 12, latencyMs: 42 },
    { hour: '12:00', requests: 980, blocked: 28, latencyMs: 45 },
    { hour: '16:00', requests: 840, blocked: 18, latencyMs: 40 },
    { hour: '20:00', requests: 620, blocked: 9, latencyMs: 39 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-400 border border-purple-800 font-bold">
              admin.payshield.com
            </span>
            <span className="text-xs text-slate-400 font-mono">Security Operations Center (SOC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Enterprise Security & Threat Monitoring Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>SOC Real-Time Stream Active</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>Total Transactions</span>
            <BarChart3 className="w-4 h-4 text-shield-cyan" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{kpi.totalTransactions}</p>
          <p className="text-[11px] text-emerald-400 font-mono">✓ {kpi.successfulPayments} Settled Sandbox</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>Failed Logins</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-400">{kpi.failedLoginAttempts}</p>
          <p className="text-[11px] text-slate-400 font-mono">Lockout Engaged x5</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>Blocked Threats</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-rose-400">{kpi.blockedRequests}</p>
          <p className="text-[11px] text-rose-400 font-mono">WAF + Rate Limiter</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>Active Security Alerts</span>
            <AlertTriangle className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-purple-300">{kpi.activeSecurityAlerts}</p>
          <p className="text-[11px] text-slate-400 font-mono">Requires Admin Action</p>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Traffic & Blocked Requests Curve Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <Activity className="w-4 h-4 text-shield-cyan" />
            <span>API Gateway Traffic & WAF Threat Interception Volume</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="requests" stroke="#06b6d4" fillOpacity={1} fill="url(#colorReq)" name="API Requests" />
                <Area type="monotone" dataKey="blocked" stroke="#f43f5e" fillOpacity={1} fill="url(#colorBlock)" name="Blocked Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution Pie Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Security Threat Classification</span>
          </h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                  {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            {threatData.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: t.color }}></span>
                  {t.name}
                </span>
                <span className="font-bold">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
