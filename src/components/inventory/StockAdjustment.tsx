import React from 'react';
import { 
  Settings2, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adjustments = [
  { id: 'ADJ-992', item: 'Solar Panel 450W', qty: -2, reason: 'Damaged in transit', date: 'Today', type: 'Deduction' },
  { id: 'ADJ-991', item: 'MC4 Connector', qty: 100, reason: 'Physical audit correction', date: 'Yesterday', type: 'Addition' },
  { id: 'ADJ-990', item: 'Hybrid Inverter', qty: -1, reason: 'Customer Return (RMA)', date: '12 May', type: 'Deduction' },
];

import { NewAdjustmentForm } from './NewAdjustmentForm';

export const StockAdjustment = () => {
  const [isAdding, setIsAdding] = React.useState(false);

  if (isAdding) {
    return <NewAdjustmentForm onCancel={() => setIsAdding(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Settings2 className="w-5 h-5 text-primary" />
             </div>
             Stock Adjustments
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Manual corrections and physical audit reconciliation</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
             <Plus className="w-4 h-4" /> New Adjustment
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input type="text" placeholder="Filter by Adjustment ID or SKU..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" />
               </div>
               <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><Filter className="w-5 h-5" /></button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Ref ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product Detail</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Quantity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Adjustment Reason</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Date</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {adjustments.map((adj) => (
                        <tr key={adj.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-slate-900 text-sm italic">{adj.id}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{adj.item}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <div className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center",
                                    adj.type === 'Addition' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                 )}>
                                    {adj.type === 'Addition' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                 </div>
                                 <span className={cn(
                                    "text-sm font-black italic",
                                    adj.type === 'Addition' ? "text-emerald-600" : "text-rose-600"
                                 )}>{adj.qty > 0 ? `+${adj.qty}` : adj.qty}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{adj.reason}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-xs font-bold text-slate-400">{adj.date}</td>
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
