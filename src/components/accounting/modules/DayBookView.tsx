import React, { useState, useEffect } from 'react';
import { 
  History, Search, Calendar, FileText, ArrowUpRight, ArrowDownRight,
  MoreVertical, Zap, Repeat, ShoppingCart, CreditCard, Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { accountsApi } from '@/src/lib/api';
import { format } from 'date-fns';

export const DayBookView = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    accountsApi.getAllTransactions()
      .then(res => { if (res.status === 1) setTransactions(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getTypeStyles = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'RECEIPT': return { icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: 'emerald' };
      case 'PAYMENT': return { icon: <ArrowDownRight className="w-3.5 h-3.5" />, color: 'rose' };
      case 'CONTRA': case 'TRANSFER': return { icon: <Repeat className="w-3.5 h-3.5" />, color: 'blue' };
      case 'SALES': return { icon: <ShoppingCart className="w-3.5 h-3.5" />, color: 'primary' };
      case 'PURCHASE': return { icon: <CreditCard className="w-3.5 h-3.5" />, color: 'amber' };
      default: return { icon: <FileText className="w-3.5 h-3.5" />, color: 'slate' };
    }
  };

  const colorClass = (color: string, base: string) => {
    const map: Record<string, Record<string, string>> = {
      bg: { emerald: 'bg-emerald-500', rose: 'bg-rose-500', blue: 'bg-blue-500', primary: 'bg-primary', amber: 'bg-amber-500', slate: 'bg-slate-500' },
      text: { emerald: 'text-emerald-600', rose: 'text-rose-600', blue: 'text-blue-600', primary: 'text-primary', amber: 'text-amber-600', slate: 'text-slate-600' },
      badge: { emerald: 'bg-emerald-50 text-emerald-600', rose: 'bg-rose-50 text-rose-600', blue: 'bg-blue-50 text-blue-600', primary: 'bg-red-50 text-primary', amber: 'bg-amber-50 text-amber-600', slate: 'bg-slate-50 text-slate-600' },
    };
    return map[base]?.[color] || '';
  };

  const filtered = transactions.filter(e =>
    (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.transactionNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase">Day Book</h2>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">All Transactions Timeline</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
          <input type="text" placeholder="Filter..." value={search} onChange={e => setSearch(e.target.value)}
            className="h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-primary w-40" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3 opacity-30">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-[9px] uppercase tracking-widest">Loading Day Book...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-[9px] text-slate-400 uppercase tracking-widest italic">
          No transactions found. Post your first voucher entry.
        </div>
      ) : (
        <div className="relative space-y-3">
          {filtered.map((entry) => {
            const style = getTypeStyles(entry.referenceType);
            return (
              <div key={entry.id} className="relative group">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between gap-4 overflow-hidden">
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1", colorClass(style.color, 'bg'))} />
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      {React.cloneElement(style.icon as React.ReactElement, { className: cn("w-4 h-4", colorClass(style.color, 'text')) })}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {entry.transactionDate ? format(new Date(entry.transactionDate), 'dd MMM, hh:mm a') : 'N/A'}
                        </span>
                        <span className={cn("text-[8px] font-bold uppercase px-1.5 py-0.5 rounded", colorClass(style.color, 'badge'))}>
                          {entry.referenceType || 'JOURNAL'}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-800 uppercase truncate pr-4">
                        {entry.description || `${entry.debitLedger?.name} → ${entry.creditLedger?.name}`}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">{entry.transactionNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-base font-black italic text-slate-900 tracking-tight">₹{Number(entry.amount || 0).toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">
                        Dr: {entry.debitLedger?.name || '—'}
                      </p>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
