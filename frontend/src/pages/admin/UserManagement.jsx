import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Lock, ShieldCheck, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const res = await apiRequest('/admin/users');
      if (res.ok) setUsers(res.data.users || []);
    }
    loadUsers();
  }, []);

  const handleUpdateStatus = async (userId, newStatus) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await apiRequest(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) {
      setErrorMsg(res.message || 'Action failed (RBAC Restriction)');
    } else {
      setSuccessMsg(`User status updated to '${newStatus}' successfully.`);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Account & Role Management</h1>
          <p className="text-xs text-slate-400 font-mono">
            Requires 'super_admin' or 'support_admin' role to modify. Auditor role will trigger RBAC 403 Forbidden.
          </p>
        </div>
        <div className="px-3 py-1 bg-purple-950/60 border border-purple-800 rounded-lg text-xs font-mono text-purple-300">
          Your Role: <span className="font-bold text-white uppercase">{currentUser ? currentUser.role : 'Guest'}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl flex items-center space-x-2 font-mono text-xs shadow-glow-rose">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold block">RBAC Permission Denied</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl flex items-center space-x-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-navy-950/60">
              <th className="p-3.5">User</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">MFA</th>
              <th className="p-3.5">Security Score</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">RBAC Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3.5 font-bold text-white">{u.name}</td>
                <td className="p-3.5 text-cyan-300">{u.email}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                    {u.role}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-400">
                  {u.mfaEnabled ? '✓ Active' : '✕ Off'}
                </td>
                <td className="p-3.5 font-bold text-emerald-400">{u.securityScore}/100</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    u.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  {u.status === 'active' ? (
                    <button
                      onClick={() => handleUpdateStatus(u.id, 'locked')}
                      className="bg-navy-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 px-2.5 py-1 rounded border border-slate-700 text-[11px]"
                    >
                      Lock Account
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(u.id, 'active')}
                      className="bg-navy-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-300 px-2.5 py-1 rounded border border-slate-700 text-[11px]"
                    >
                      Unlock Account
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
