import React from 'react';
import { useDomain } from '../context/DomainContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Globe, Layers, UserCheck, Activity } from 'lucide-react';

export function DomainHeader() {
  const { activeDomain, switchDomain, DOMAINS } = useDomain();
  const { user, setDemoRole } = useAuth();

  return (
    <div className="bg-navy-900/90 backdrop-blur-md border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Domain Simulation Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-shield-cyan bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-full font-mono">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-shield-cyan animate-pulse" />
            <span className="text-slate-300 font-semibold mr-1.5">HTTPS://</span>
            <span className="text-shield-cyan font-bold tracking-wide">{activeDomain.name}</span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${activeDomain.color}`}>
            {activeDomain.badge}
          </span>
        </div>

        {/* Quick Domain Switcher Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          <span className="text-slate-400 font-mono text-[11px] mr-1 hidden sm:inline flex items-center">
            <Globe className="w-3 h-3 mr-1" /> Domain Switcher:
          </span>
          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => switchDomain(d.id)}
              className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium font-mono flex items-center space-x-1 ${
                activeDomain.id === d.id
                  ? 'bg-shield-cyan/20 text-shield-cyan border border-shield-cyan/40 shadow-glow-cyan'
                  : 'bg-navy-800/80 text-slate-400 hover:text-slate-200 hover:bg-navy-700 border border-transparent'
              }`}
            >
              <span>{d.id === 'www' ? 'www' : d.id}</span>
            </button>
          ))}
        </div>

        {/* User Role & Quick RBAC Switcher */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1 bg-navy-950/80 border border-slate-800 px-2 py-1 rounded">
            <UserCheck className="w-3.5 h-3.5 text-purple-400 mr-1" />
            <span className="text-slate-400">Role:</span>
            <span className="font-mono font-semibold text-purple-300 uppercase">
              {user ? user.role : 'Guest'}
            </span>
          </div>

          {/* Quick RBAC Switcher for Jury Testing */}
          <div className="flex items-center space-x-1 bg-purple-950/40 border border-purple-800/50 px-2 py-0.5 rounded">
            <span className="text-purple-300 font-semibold text-[10px] uppercase tracking-wider">Test RBAC:</span>
            <select
              value={user ? user.role : 'guest'}
              onChange={(e) => setDemoRole(e.target.value)}
              className="bg-navy-900 text-purple-200 font-mono text-[11px] rounded px-1.5 py-0.5 border border-purple-700/60 focus:outline-none cursor-pointer"
            >
              <option value="super_admin">Super Admin</option>
              <option value="security_admin">Security Admin</option>
              <option value="support_admin">Support Admin</option>
              <option value="auditor">Auditor</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
