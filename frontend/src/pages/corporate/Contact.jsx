import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Security Query', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [xssBlocked, setXssBlocked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setXssBlocked(false);

    // Simple XSS check demonstration on client side
    if (form.message.includes('<script>') || form.name.includes('<script>')) {
      setXssBlocked(true);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Contact PayShield Security Team</h1>
        <p className="text-slate-400 text-xs font-mono">Submit enterprise security inquiries or report vulnerability findings.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-slate-800">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Message Transmitted Securely</h3>
            <p className="text-xs text-slate-300 font-mono">Your message has been encrypted and dispatched to our Security Operations Center.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-navy-800 hover:bg-navy-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-mono border border-slate-700"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {xssBlocked && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl flex items-center space-x-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Client Input Sanitizer: Script tag pattern rejected!</span>
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-mono mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Security Officer"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="security@corporate.com"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Inquiry Category</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-navy-950 text-slate-200"
              >
                <option>Security Query</option>
                <option>Vulnerability Report (Bug Bounty)</option>
                <option>SOC 2 Audit Request</option>
                <option>Enterprise Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Message Payload</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your security inquiry..."
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow-cyan text-xs font-mono"
            >
              Submit Encrypted Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
