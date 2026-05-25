import React, { useState } from 'react';
import { 
  Plus, 
  ArrowRightLeft, 
  Search, 
  MoreVertical,
  Building2,
  Banknote,
  Smartphone,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FinancialAccount {
  id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Wallet' | 'Other';
  balance: number;
  lastTransaction: string;
  bankName?: string;
  status: 'active' | 'frozen';
}

const mockAccounts: FinancialAccount[] = [
  { id: '1', name: 'Cash in Hand', type: 'Cash', balance: 45000, lastTransaction: '14 May', status: 'active' },
  { id: '2', name: 'Petty Cash', type: 'Cash', balance: 5000, lastTransaction: '12 May', status: 'active' },
  { id: '3', name: 'HDFC Bank', type: 'Bank', balance: 1250200, bankName: 'Main Corporate', lastTransaction: '15 May', status: 'active' },
  { id: '4', name: 'SBI Bank', type: 'Bank', balance: 85000, bankName: 'Secondary Account', lastTransaction: '10 May', status: 'active' },
  { id: '5', name: 'UPI Wallet', type: 'Wallet', balance: 12500, lastTransaction: '15 May', status: 'active' },
  { id: '6', name: 'Business Account', type: 'Bank', balance: 450000, bankName: 'Axis Bank', lastTransaction: '13 May', status: 'active' },
];

export const AccountManager = () => {
  const [search, setSearch] = useState('');
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Bank': return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Cash': return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Wallet': return <Smartphone className="w-3.5 h-3.5 text-purple-600" />;
      default: return <Wallet className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Action Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase">Account Master</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Asset & Balance Management</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-primary transition-all w-48 shadow-sm"
            />
          </div>
          <button onClick={() => setIsTransferOpen(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-primary" /> Transfer
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-red-700 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>
      </div>

      {/* ── Account Table (Consolidated) ──────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[8px] font-bold tracking-[0.2em]">
                     <th className="p-4 border-r border-slate-800">Account Particulars</th>
                     <th className="p-4 border-r border-slate-800">Type / Institution</th>
                     <th className="p-4 border-r border-slate-800 text-right">Balance (₹)</th>
                     <th className="p-4 border-r border-slate-800">Last Status</th>
                     <th className="p-4 border-r border-slate-800">Timestamp</th>
                     <th className="p-4 text-center">...</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-bold text-slate-700 uppercase tracking-tight divide-y divide-slate-100 italic-tabular">
                  {mockAccounts.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).map((acc, idx) => (
                    <tr key={acc.id} className={cn("hover:bg-slate-50/50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-slate-50/10")}>
                       <td className="p-4 border-r border-slate-100">
                          <div className="flex items-center gap-3">
                             <div className={cn("w-2 h-2 rounded-full", acc.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-rose-500")} />
                             <span className="text-slate-900 group-hover:text-primary transition-colors">{acc.name}</span>
                          </div>
                       </td>
                       <td className="p-4 border-r border-slate-100">
                          <div className="flex items-center gap-2.5">
                             <div className="w-7 h-7 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                {getIcon(acc.type)}
                             </div>
                             <div>
                                <p className="text-[10px] leading-none mb-0.5">{acc.type}</p>
                                <p className="text-[8px] text-slate-400 font-medium tracking-widest">{acc.bankName || 'General Account'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-4 border-r border-slate-100 text-right">
                          <p className="text-base font-black italic tracking-tighter text-slate-900">
                             ₹{acc.balance.toLocaleString()}
                          </p>
                       </td>
                       <td className="p-4 border-r border-slate-100">
                          <div className="flex items-center gap-1.5 text-emerald-600">
                             <ArrowUpRight className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-widest italic">Stable</span>
                          </div>
                       </td>
                       <td className="p-4 border-r border-slate-100 text-[10px] text-slate-400 font-medium">
                          {acc.lastTransaction}
                       </td>
                       <td className="p-4 text-center">
                          <button className="p-1 px-2.5 text-slate-300 hover:text-primary hover:bg-red-50 rounded-md transition-all">
                             <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
               <tfoot className="bg-slate-900 text-white border-t border-slate-800">
                  <tr className="text-[10px] font-black uppercase italic tracking-widest">
                     <td colSpan={2} className="p-4 text-right border-r border-slate-800 text-slate-400">Total Pooled Liquidity :</td>
                     <td className="p-4 text-right text-emerald-400 text-lg">₹14,92,700</td>
                     <td colSpan={3} className="p-4 text-[8px] text-slate-500 not-italic tracking-[0.3em]">Statements Verified By Helixion Engine</td>
                  </tr>
               </tfoot>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {isTransferOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ y: 20, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 20, opacity: 0 }}
               className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
             >
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-bold text-slate-900 uppercase italic">Fund Transfer</h3>
                   <button onClick={() => setIsTransferOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <Plus className="w-5 h-5 rotate-45" />
                   </button>
                </div>
                
                <div className="space-y-4 mb-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">From</label>
                         <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                           {mockAccounts.map(a => <option key={a.id}>{a.name}</option>)}
                         </select>
                      </div>
                      <div>
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">To</label>
                         <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                           {mockAccounts.map(a => <option key={a.id}>{a.name}</option>)}
                         </select>
                      </div>
                   </div>
                   <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Amount (₹)</label>
                      <input type="number" placeholder="0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xl font-black italic text-slate-900 outline-none focus:border-primary" />
                   </div>
                </div>

                <div className="flex gap-2">
                   <button onClick={() => setIsTransferOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                   <button className="flex-[2] py-2.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-red-700 transition-all">Confirm</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
