import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export function PasswordMeter({ password = '' }) {
  const checks = [
    { label: 'At least 12 characters long', valid: password.length >= 12 },
    { label: 'Uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'Number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Special character (!@#$%^&*)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
  ];

  const score = checks.filter(c => c.valid).length;

  const getStrengthLabel = () => {
    if (score <= 2) return { text: 'WEAK', color: 'bg-rose-500 text-rose-400', width: 'w-1/4' };
    if (score === 3 || score === 4) return { text: 'MODERATE', color: 'bg-amber-500 text-amber-400', width: 'w-3/4' };
    return { text: 'ENTERPRISE GRADE', color: 'bg-emerald-500 text-emerald-400', width: 'w-full' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="mt-3 space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Password Entropy Score:</span>
        <span className={`font-bold ${strength.color.split(' ')[1]}`}>
          {strength.text} ({score}/5)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]} ${strength.width}`}></div>
      </div>

      {/* Rule Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
        {checks.map((rule, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-[11px]">
            {rule.valid ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span className={rule.valid ? 'text-slate-200' : 'text-slate-500'}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
