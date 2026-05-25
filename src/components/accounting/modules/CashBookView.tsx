import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Search, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CashEntry {
  id: string;
  date: string;
  particulars: string;
  voucherNo: string;
  type: 'Receipt' | 'Payment';
  amount: number;
  balance: number;
}

const mockEntries: CashEntry[] = [
  { id: '1', date: '25 May 2026', particulars: 'Opening Balance', voucherNo: '-', type: 'Receipt', amount: 0, balance: 145000 },
  { id: '2', date: '25 May 2026', particulars: 'Cash Sales (Gala)', voucherNo: 'SL-552', type: 'Receipt', amount: 12500, balance: 157500 },
  { id: '3', date: '25 May 2026', particulars: 'Office Electricity Bill', voucherNo: 'EX-901', type: 'Payment', amount: 4500, balance: 153000 },
  { id: '4', date: '25 May 2026', particulars: 'Sharma Agencies Payment', voucherNo: 'PY-223', type: 'Payment', amount: 15000, balance: 138000 },
  { id: '5', date: '25 May 2026', particulars: 'Misc Cash Received', voucherNo: 'RC-112', type: 'Receipt', amount: 2500, balance: 140500 },
];

export const CashBookView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase">Cash Book</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Real-time recording of daily cash flow</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
             <button className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-widest leading-none">Excel</button>
             <button className="px-3 py-1.5 text-slate-400 hover:text-slate-600 text-[9px] font-bold uppercase tracking-widest transition-all leading-none">PDF</button>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-red-700 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>
      </div>

      {/* ── Balance Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Opening Bal.', value: '1,45,000', color: 'slate' },
           { label: 'Receipts (+)', value: '15,000', color: 'emerald' },
           { label: 'Payments (-)', value: '19,500', color: 'rose' },
           { label: 'Closing Bal.', value: '1,40,500', color: 'primary' },
         ].map((box, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{box.label}</p>
               <h4 className={cn("text-base font-black italic", 
                 box.color === 'emerald' ? "text-emerald-600" :
                 box.color === 'rose' ? "text-rose-600" :
                 box.color === 'primary' ? "text-primary" : "text-slate-900"
               )}>₹{box.value}</h4>
            </div>
         ))}
      </div>

      {/* ── Cash Book Ledger Table ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
               <button className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
               </button>
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">25 May 2026</span>
               </div>
               <button className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
               </button>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                  <input type="text" placeholder="Particulars..." className="h-9 pl-8 pr-4 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:border-primary w-40" />
               </div>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[8px] font-bold tracking-widest">
                     <th className="p-4 border-r border-slate-800">Date</th>
                     <th className="p-4 border-r border-slate-800">Particulars</th>
                     <th className="p-4 border-r border-slate-800">Voucher</th>
                     <th className="p-4 border-r border-slate-800 text-right">Receipt (Dr)</th>
                     <th className="p-4 border-r border-slate-800 text-right">Payment (Cr)</th>
                     <th className="p-4 text-right">Balance</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-bold text-slate-700 uppercase tracking-tight divide-y divide-slate-100">
                  {mockEntries.map((entry, idx) => (
                    <tr key={idx} className={cn("hover:bg-slate-50/50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-slate-50/20")}>
                       <td className="p-4 border-r border-slate-100 text-slate-400 font-medium">{entry.date}</td>
                       <td className="p-4 border-r border-slate-100">
                          <div className="flex items-center gap-2">
                             <div className={cn("w-1.5 h-1.5 rounded-full", entry.type === 'Receipt' ? "bg-emerald-500" : "bg-rose-500")} />
                             {entry.particulars}
                          </div>
                       </td>
                       <td className="p-4 border-r border-slate-100 text-[9px] text-slate-400 font-mono tracking-widest">{entry.voucherNo}</td>
                       <td className="p-4 border-r border-slate-100 text-right text-emerald-600 italic">
                          {entry.type === 'Receipt' && entry.amount > 0 ? `₹${entry.amount.toLocaleString()}` : '-'}
                       </td>
                       <td className="p-4 border-r border-slate-100 text-right text-rose-600 italic">
                          {entry.type === 'Payment' ? `₹${entry.amount.toLocaleString()}` : '-'}
                       </td>
                       <td className="p-4 text-right font-black italic">
                          ₹{entry.balance.toLocaleString()}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-5 bg-slate-900 flex justify-between items-center text-white border-t border-slate-800">
            <div className="flex items-center gap-8">
               <div>
                  <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">Daily Receipts</p>
                  <p className="text-lg font-black text-emerald-400">₹15,000</p>
               </div>
               <div className="w-px h-6 bg-slate-800" />
               <div>
                  <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">Daily Payments</p>
                  <p className="text-lg font-black text-rose-400">₹19,500</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-bold text-primary uppercase italic">Statement Verified</p>
            </div>
         </div>
      </div>
    </div>
  );
};
