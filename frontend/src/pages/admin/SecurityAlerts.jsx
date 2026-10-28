import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

export function SecurityAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function loadAlerts() {
      const res = await apiRequest('/admin/alerts');
      if (res.ok) setAlerts(res.data.alerts || []);
    }
    loadAlerts();
  }, []);

  const handleResolveAlert = async (alertId, newStatus) => {
    const res = await apiRequest(`/admin/alerts/${alertId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) {
      setMsg(res.message || 'Action prohibited for your role');
    } else {
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
      setMsg(`Alert ${alertId} updated to ${newStatus}.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SOC Security Incident & Alert Console</h1>
          <p className="text-xs text-slate-400 font-mono">Requires 'security_admin' or 'super_admin' role to mitigate.</p>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-cyan-950/80 border border-cyan-800 text-cyan-300 rounded-xl flex items-center space-x-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{msg}</span>
        </div>
      )}

      <div className="space-y-4 font-mono text-xs">
        {alerts.map((a) => (
          <div key={a.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  a.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  a.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {a.severity}
                </span>
                <span className="font-bold text-white text-sm">{a.title}</span>
                <span className="text-slate-500">({a.id})</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  a.status === 'OPEN' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {a.status}
                </span>
              </div>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">{a.description}</p>

            <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <span>Target: <strong className="text-cyan-300">{a.targetUser}</strong> | IP: {a.ipAddress}</span>
              {a.status === 'OPEN' && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleResolveAlert(a.id, 'RESOLVED')}
                    className="bg-navy-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-200 px-3 py-1 rounded border border-slate-700"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleResolveAlert(a.id, 'MITIGATED')}
                    className="bg-rose-950 text-rose-300 hover:bg-rose-900 px-3 py-1 rounded border border-rose-800"
                  >
                    Block IP & Mitigate
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
