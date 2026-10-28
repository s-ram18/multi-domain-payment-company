import React from 'react';
import { CreditCard, ShieldCheck, Lock, Plus } from 'lucide-react';

export function PaymentMethods() {
  const cards = [
    { id: 'card_1', type: 'Visa Enterprise', masked: '•••• •••H •••• 4242', expiry: '12/28', isDefault: true },
    { id: 'card_2', type: 'Mastercard Corporate', masked: '•••• •••• •••• 8812', expiry: '09/27', isDefault: false },
    { id: 'card_3', type: 'American Express Security', masked: '•••• •••••• •1004', expiry: '04/29', isDefault: false }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Linked Payment Methods</h1>
          <p className="text-xs text-slate-400 font-mono">Masked sandbox payment references. Sensitive CVV/pan are tokenized.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <CreditCard className="w-8 h-8 text-shield-cyan" />
              {card.isDefault && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  DEFAULT
                </span>
              )}
            </div>

            <div>
              <p className="text-xs text-slate-400 font-mono">{card.type}</p>
              <p className="text-lg font-mono font-bold text-white tracking-widest mt-1">{card.masked}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>EXP: {card.expiry}</span>
              <span className="text-emerald-400 flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Tokenized</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
