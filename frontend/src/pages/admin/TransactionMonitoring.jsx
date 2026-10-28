import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { CreditCard, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function TransactionMonitoring() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadTxns() {
      const res = await apiRequest('/payments/transactions');
      if (res.ok) setTransactions(res.data.transactions || []);
    }
    loadTxns();
  }, []);

  const filtered = transactions.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.merchantName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Transaction Monitoring</h1>
        <p className="text-xs text-slate-400 font-mono">SOC real-time transaction ledger & risk scoring engine.</p>
      </div>

      <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Transaction ID, Customer, or Merchant..."
          className="bg-transparent border-none outline-none text-xs font-mono text-white w-full"
        />
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-navy-950/60">
              <th className="p-3.5">Txn ID</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Merchant</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Risk Score</th>
              <th className="p-3.5">IP Address</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td className="p-3.5 font-bold text-cyan-300">{tx.id}</td>
                <td className="p-3.5 text-white font-bold">{tx.customerName}</td>
                <td className="p-3.5 text-slate-200">{tx.merchantName}</td>
                <td className="p-3.5 font-bold text-white">${tx.amount.toFixed(2)} {tx.currency}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tx.riskScore > 50 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    Risk {tx.riskScore}/100
                  </span>
                </td>
                <td className="p-3.5 text-slate-400">{tx.ipAddress}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tx.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
