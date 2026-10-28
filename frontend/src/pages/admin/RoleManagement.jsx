import React from 'react';
import { ShieldCheck, Key, Lock, Check, X } from 'lucide-react';

export function RoleManagement() {
  const roles = [
    { role: 'super_admin', name: 'Super Admin', desc: 'Full system & administrative control', permissions: { users: true, alerts: true, audit: true, config: true } },
    { role: 'security_admin', name: 'Security Admin', desc: 'SOC alert management & security incident response', permissions: { users: false, alerts: true, audit: true, config: true } },
    { role: 'support_admin', name: 'Support Admin', desc: 'Customer profile management & transaction review', permissions: { users: true, alerts: false, audit: true, config: false } },
    { role: 'auditor', name: 'Read-Only Auditor', desc: 'Compliance audit log inspection', permissions: { users: false, alerts: false, audit: true, config: false } },
    { role: 'customer', name: 'Customer User', desc: 'Personal account & payment sandbox access', permissions: { users: false, alerts: false, audit: false, config: false } }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">RBAC Role & Permission Matrix</h1>
        <p className="text-xs text-slate-400 font-mono">Server-side authorization hierarchy enforced on every REST API request.</p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-navy-950/60">
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">User Management</th>
              <th className="p-3.5">Security Alerts</th>
              <th className="p-3.5">Audit Logs</th>
              <th className="p-3.5">Security Config</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {roles.map((r) => (
              <tr key={r.role}>
                <td className="p-3.5 font-bold text-purple-300 uppercase">{r.name}</td>
                <td className="p-3.5 text-slate-400 font-sans">{r.desc}</td>
                <td className="p-3.5">{r.permissions.users ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                <td className="p-3.5">{r.permissions.alerts ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                <td className="p-3.5">{r.permissions.audit ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                <td className="p-3.5">{r.permissions.config ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
