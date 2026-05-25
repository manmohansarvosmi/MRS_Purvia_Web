import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Zap,
  Repeat,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayBookEntry {
  id: string;
  time: string;
  type: 'Payment' | 'Receipt' | 'Journal' | 'Contra' | 'Sales' | 'Purchase';
  particulars: string;
  amount: number;
  user: string;
  status: 'Completed' | 'Pending' | 'Flagged';
}

const mockDayEntries: DayBookEntry[] = [
  { id: '1', time: '10:15 AM', type: 'Receipt', particulars: 'Cash Sales Counter A', amount: 12500, user: 'Admin', status: 'Completed' },
  { id: '2', time: '11:30 AM', type: 'Payment', particulars: 'Vendor - Tata Solar Systems', amount: 50000, user: 'Accountant', status: 'Completed' },
  { id: '3', time: '01:45 PM', type: 'Contra', particulars: 'Cash Deposited to HDFC Bank', amount: 75000, user: 'Admin', status: 'Completed' },
  { id: '4', time: '02:20 PM', type: 'Sales', particulars: 'Invoice #INV-2026-001', amount: 152000, user: 'Billing', status: 'Pending' },
  { id: '5', time: '04:10 PM', type: 'Journal', particulars: 'Inventory Correction Adjustment', amount: 12000, user: 'Inventory Mgr', status: 'Completed' },
  { id: '6', time: '05:30 PM', type: 'Purchase', particulars: 'Office Stationery - Amazon', amount: 4500, user: 'Admin', status: 'Completed' },
];

export const DayBookView = () => {
  const [search, setSearch] = useState('');

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Receipt': return { icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: 'emerald' };
      case 'Payment': return { icon: <ArrowDownRight className="w-3.5 h-3.5" />, color: 'rose' };
      case 'Contra': return { icon: <Repeat className="w-3.5 h-3.5" />, color: 'blue' };
      case 'Sales': return { icon: <ShoppingCart className="w-3.5 h-3.5" />, color: 'primary' };
      case 'Purchase': return { icon: <CreditCard className="w-3.5 h-3.5" />, color: 'amber' };
      case 'Journal': return { icon: <FileText className="w-3.5 h-3.5" />, color: 'slate' };
      default: return { icon: <Zap className="w-3.5 h-3.5" />, color: 'primary' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
              <History className="w-5 h-5 text-white" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase">Day Book</h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Today's Transactions Timeline</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input type="text" placeholder="Filter..." value={search} onChange={e => setSearch(e.target.value)} className="h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-primary w-40" />
           </div>
           <button className="h-10 px-4 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-all font-bold uppercase text-[10px] tracking-widest leading-none">
              <Calendar className="w-3.5 h-3.5 text-slate-300" /> Date
           </button>
        </div>
      </div>

      {/* ── Timeline Section ────────────────────────────────────────── */}
      <div className="relative space-y-3">
         {mockDayEntries.filter(e => e.particulars.toLowerCase().includes(search.toLowerCase())).map((entry, idx) => {
            const style = getTypeStyles(entry.type);
            return (
               <div key={entry.id} className="relative group">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between gap-4 overflow-hidden">
                     {/* Accent */}
                     <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                       style.color === 'emerald' ? "bg-emerald-500" :
                       style.color === 'rose' ? "bg-rose-500" :
                       style.color === 'blue' ? "bg-blue-500" :
                       style.color === 'primary' ? "bg-primary" :
                       style.color === 'amber' ? "bg-amber-500" : "bg-slate-500"
                     )} />
                     
                     <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                           {React.cloneElement(style.icon as React.ReactElement, { className: cn("w-4 h-4", 
                             style.color === 'emerald' ? "text-emerald-600" :
                             style.color === 'rose' ? "text-rose-600" :
                             style.color === 'blue' ? "text-blue-600" :
                             style.color === 'primary' ? "text-primary" :
                             style.color === 'amber' ? "text-amber-600" : "text-slate-600"
                           )})}
                        </div>

                        <div className="min-w-0">
                           <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.time}</span>
                              <span className={cn("text-[8px] font-bold uppercase px-1.5 py-0.5 rounded", 
                                style.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                style.color === 'rose' ? "bg-rose-50 text-rose-600" :
                                style.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                style.color === 'primary' ? "bg-red-50 text-primary" :
                                style.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600"
                              )}>{entry.type}</span>
                           </div>
                           <h4 className="text-[11px] font-bold text-slate-800 uppercase truncate pr-4">{entry.particulars}</h4>
                        </div>
                     </div>

                     <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                           <p className="text-base font-black italic text-slate-900 tracking-tight">₹{entry.amount.toLocaleString()}</p>
                           <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">{entry.user}</p>
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
    </div>
  );
};
