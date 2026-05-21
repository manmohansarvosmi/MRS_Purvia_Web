import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Calendar,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const history = [
  { id: 'INV-2026-042', client: 'Sharma Ent.', date: '14 May, 10:30 AM', total: '₹12,400', type: 'Credit', status: 'Paid' },
  { id: 'INV-2026-041', client: 'Kumar Electronics', date: '14 May, 09:15 AM', total: '₹4,500', type: 'Cash', status: 'Paid' },
  { id: 'INV-2026-040', client: 'General Store', date: '13 May, 05:40 PM', total: '₹890', type: 'UPI', status: 'Paid' },
];

export const SalesHistory = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <History className="w-5 h-5 text-primary" />
             </div>
             Sales History & POS Logs
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Track every transaction and payment mode</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Calendar className="w-4 h-4" /> Filter Date
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
             <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales Today</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1 italic">₹1,12,450</h3>
               <div className="mt-3 flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                  <TrendingUp className="w-3 h-3" /> 12% vs Yesterday
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoices Generated</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1 italic">42</h3>
               <div className="mt-3 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  Average ₹2,670 / Bill
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Returns / Credit Notes</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1 italic">₹0</h3>
               <div className="mt-3 flex items-center gap-2 text-rose-500 font-bold text-[10px] uppercase">
                  <TrendingDown className="w-3 h-3" /> 0% No returns today
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Invoice ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client Name</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[200px]">Date & Time</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Payment</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {history.map((h) => (
                        <tr key={h.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-slate-900 text-sm italic">{h.id}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{h.client}</p>
                           </td>
                           <td className="px-8 py-6 text-xs font-bold text-slate-500">{h.date}</td>
                           <td className="px-8 py-6 text-sm font-black text-slate-900 italic">{h.total}</td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                 "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                 h.type === 'Cash' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                 h.type === 'UPI' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-amber-50 text-amber-600 border-amber-100"
                              )}>{h.type}</span>
                           </td>
                           <td className="px-8 py-6 flex items-center gap-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><FileText className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300"><MoreVertical className="w-5 h-5" /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
};
