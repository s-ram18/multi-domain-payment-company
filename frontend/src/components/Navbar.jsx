import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { useAuth } from '../context/AuthContext';
import { Shield, ShieldAlert, CreditCard, Lock, Server, LogOut, User, FlaskConical } from 'lucide-react';

export function Navbar() {
  const { activeDomain } = useDomain();
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const getNavLinks = () => {
    switch (activeDomain.id) {
      case 'www':
        return [
          { label: 'Home', path: '/' },
          { label: 'About', path: '/about' },
          { label: 'Products', path: '/products' },
          { label: 'Security Architecture', path: '/security' },
          { label: 'Developers API', path: '/developers' },
          { label: 'Documentation', path: '/documentation' },
          { label: 'Contact', path: '/contact' }
        ];
      case 'customer':
        return [
          { label: 'Dashboard', path: '/customer' },
          { label: 'Payment Methods', path: '/customer/methods' },
          { label: 'Transaction History', path: '/customer/transactions' },
          { label: 'Initiate Transfer', path: '/customer/transfer' },
          { label: 'Security Settings', path: '/customer/security' }
        ];
      case 'pay':
        return [
          { label: 'Checkout Sandbox', path: '/pay' },
          { label: 'Transaction Verification', path: '/pay/status' }
        ];
      case 'admin':
        return [
          { label: 'SOC Dashboard', path: '/admin' },
          { label: 'User Management', path: '/admin/users' },
          { label: 'Transaction Monitor', path: '/admin/transactions' },
          { label: 'Security Alerts', path: '/admin/alerts' },
          { label: 'Audit Logs', path: '/admin/audit' },
          { label: 'System Health', path: '/admin/health' }
        ];
      case 'lab':
        return [
          { label: 'Security Lab Workbench', path: '/security-lab' }
        ];
      default:
        return [{ label: 'Home', path: '/' }];
    }
  };

  const links = getNavLinks();

  return (
    <nav className="bg-navy-900/80 backdrop-blur-lg border-b border-slate-800/80 py-3.5 px-4 sticky top-10 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-shield-cyan group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">Pay<span className="text-shield-cyan">Shield</span></span>
              <span className="text-[10px] bg-slate-800 text-cyan-400 font-mono px-1.5 py-0.5 rounded border border-slate-700">CYBERSEC</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Zero-Trust Payment Gateway</p>
          </div>
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-shield-cyan/15 text-shield-cyan border border-shield-cyan/30 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth / Action Button */}
        <div className="flex items-center space-x-3">
          <Link
            to="/security-lab"
            className="hidden sm:flex items-center space-x-1.5 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5 text-rose-400" />
            <span>Security Lab</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-300 font-mono hidden lg:inline">
                {user.name}
              </span>
              <button
                onClick={logoutUser}
                className="flex items-center space-x-1 bg-navy-800 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-all shadow-glow-cyan"
            >
              <Lock className="w-3.5 h-3.5 mr-1" />
              <span>Portal Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
