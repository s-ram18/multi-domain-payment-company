import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Eye, Search, Filter, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    async function loadLogs() {
      const q = new URLSearchParams();
      if (category) q.append('category', category);
      if (search) q.append('search', search);

      const res = await apiRequest(`/audit?${q.toString()}`);
      if (res.ok) setLogs(res.data.logs || []);
    }
    loadLogs();
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Central Audit Log Explorer</h1>
          <p className="text-xs text-slate-400 font-mono">Sensitive credentials automatically scrubbed by logger middleware.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, email, or details..."
            className="bg-transparent border-none outline-none text-xs font-mono text-white w-full"
          />
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-navy-950 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs"
          >
            <option value="">All Categories</option>
            <option value="AUTH">AUTH</option>
            <option value="SECURITY">SECURITY</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SECURITY_LAB">SECURITY_LAB</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-navy-950/60">
              <th className="p-3.5">Log ID</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">User Email</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Severity</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="p-3.5 font-bold text-cyan-300">{l.id}</td>
                <td className="p-3.5 text-slate-400 text-[11px]">{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td className="p-3.5 font-bold text-white">{l.userEmail}</td>
                <td className="p-3.5 text-purple-300 uppercase">{l.role}</td>
                <td className="p-3.5 font-bold text-slate-200">{l.action}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    l.severity === 'ERROR' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    l.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {l.severity}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-slate-400">{l.status}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => setSelectedLog(l)}
                    className="bg-navy-800 hover:bg-navy-700 text-shield-cyan px-2.5 py-1 rounded border border-slate-700 text-[11px]"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JSON Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 max-w-2xl w-full space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-shield-cyan" />
                <span>Raw Audit Log Payload ({selectedLog.id})</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <pre className="bg-navy-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 max-h-96">
              <code>{JSON.stringify(selectedLog, null, 2)}</code>
            </pre>

            <div className="text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-shield-cyan text-navy-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
