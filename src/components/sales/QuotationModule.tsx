import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ArrowRight,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quotations = [
  { id: 'QUO-2026-001', client: 'Kumar Electronics', items: 12, value: '₹1,45,000', expiry: '24 May', status: 'Pending' },
  { id: 'QUO-2026-002', client: 'Global Solutions', items: 5, value: '₹42,000', expiry: '20 May', status: 'Converted' },
  { id: 'QUO-2026-003', client: 'Singh & Sons', items: 8, value: '₹89,000', expiry: 'Today', status: 'Expired' },
];

export const QuotationModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <FileText className="w-5 h-5 text-primary" />
             </div>
             Quotations & Estimates
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Manage pending proposals & client estimates</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> Create Estimate
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input type="text" placeholder="Search by Quotation ID or Client..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" />
               </div>
               <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><Filter className="w-5 h-5" /></button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Quotation ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client / Customer</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Items</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Total Value</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Valid Until</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Status</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {quotations.map((q) => (
                        <tr key={q.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-slate-900 text-sm italic">{q.id}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{q.client}</p>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-slate-600">{q.items} SKU</td>
                           <td className="px-8 py-6 text-sm font-black text-slate-900 italic">{q.value}</td>
                           <td className="px-8 py-6 text-xs font-bold text-slate-500">{q.expiry}</td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                 "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                 q.status === 'Converted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                 q.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                              )}>{q.status}</span>
                           </td>
                           <td className="px-8 py-6"><button className="text-slate-300"><MoreVertical className="w-5 h-5" /></button></td>
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
