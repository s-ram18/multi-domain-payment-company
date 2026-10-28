import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { PasswordMeter } from '../../components/PasswordMeter';
import { ShieldCheck, Key, Lock, LogOut, Laptop, Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';

export function SecuritySettings() {
  const { user, logoutUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mfaActive, setMfaActive] = useState(user?.mfaEnabled ?? true);
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function loadSessions() {
      const res = await apiRequest('/users/sessions');
      if (res.ok) setSessions(res.data.sessions || []);
    }
    loadSessions();
  }, []);

  const handleToggleMfa = async () => {
    const res = await apiRequest('/users/mfa/toggle', { method: 'POST' });
    if (res.ok) {
      setMfaActive(res.data.user.mfaEnabled);
      setMsg(res.data.message);
    }
  };

  const handleRevokeSession = async (sessId) => {
    const res = await apiRequest(`/users/sessions/${sessId}`, { method: 'DELETE' });
    if (res.ok) {
      setSessions(sessions.filter(s => s.id !== sessId));
      setMsg('Session revoked successfully.');
    }
  };

  const handleLogoutAll = async () => {
    const res = await apiRequest('/auth/logout-all', { method: 'POST' });
    if (res.ok) {
      logoutUser();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Security Settings</h1>
        <p className="text-xs text-slate-400 font-mono">Manage MFA, Password Complexity, and Active Web Sessions.</p>
      </div>

      {msg && (
        <div className="p-3 bg-cyan-950/80 border border-cyan-800 text-cyan-300 rounded-xl flex items-center space-x-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* MFA Security Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Key className="w-6 h-6 text-shield-cyan" />
            <div>
              <h3 className="text-base font-bold text-white">Multi-Factor Authentication (MFA / TOTP)</h3>
              <p className="text-xs text-slate-400 font-mono">Requires 6-digit OTP verification code on login.</p>
            </div>
          </div>
          <button
            onClick={handleToggleMfa}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              mfaActive
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                : 'bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900'
            }`}
          >
            {mfaActive ? '✓ MFA ENABLED' : 'ENABLE MFA NOW'}
          </button>
        </div>

        {mfaActive && (
          <div className="bg-navy-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-400 text-center rounded">
              QR CODE
            </div>
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <p className="font-bold text-white">TOTP Secret Key: JBSWY3DPEHPK3PXP</p>
              <p className="text-slate-400">Compatible with Google Authenticator, Authy, or 1Password.</p>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <Lock className="w-6 h-6 text-purple-400" />
          <h3 className="text-base font-bold text-white">Password Strength Evaluation</h3>
        </div>

        <div>
          <label className="block text-slate-400 font-mono text-xs mb-1">New Password Sandbox Input</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type new password to evaluate strength..."
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
          />
          <PasswordMeter password={password} />
        </div>
      </div>

      {/* Active Device Sessions List */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Active Device Sessions</h3>
            <p className="text-xs text-slate-400 font-mono">Revoke suspicious device sessions immediately.</p>
          </div>
          <button
            onClick={handleLogoutAll}
            className="bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all"
          >
            Logout From All Devices
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {sessions.map((s) => (
            <div key={s.id} className="bg-navy-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Laptop className="w-5 h-5 text-shield-cyan" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{s.device}</span>
                    {s.isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800">
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px]">IP: {s.ipAddress} | Location: {s.location}</p>
                </div>
              </div>

              {!s.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(s.id)}
                  className="bg-navy-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 text-xs"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
