import React from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download,
  Package,
  ArrowRight,
  RefreshCw,
  Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

const movements = [
  { id: '1', type: 'IN', item: 'Solar Panel 450W', qty: 50, from: 'Vendor: Tata Solar', to: 'Main Hub', time: '2 mins ago', status: 'Completed' },
  { id: '2', type: 'OUT', item: 'Hybrid Inverter 5kVA', qty: 2, from: 'Main Hub', to: 'Customer: Sharma Ent.', time: '15 mins ago', status: 'Completed' },
  { id: '3', type: 'TRANSFER', item: 'Lithium Battery 100Ah', qty: 10, from: 'Main Hub', to: 'Delhi Depot', time: '1 hour ago', status: 'In Transit' },
  { id: '4', type: 'IN', item: 'DC Wire 4sqmm', qty: 100, from: 'Vendor: Havells', to: 'Secondary', time: '3 hours ago', status: 'Completed' },
];

export const InventoryLogs = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <History className="w-5 h-5 text-primary" />
             </div>
             Inventory Logs
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Real-time Stock Movement & Audit Trails</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
             <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Filter by SKU, Batch, or Location..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:border-primary/20 transition-all"
                  />
               </div>
               <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
                  <Filter className="w-5 h-5" />
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[200px]">Time & Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Item & Transaction</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Quantity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Route Flow</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {movements.map((m) => (
                        <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="space-y-1">
                                 <p className="text-xs font-black text-slate-900">{m.time}</p>
                                 <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                    m.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                 )}>{m.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                    m.type === 'IN' ? "bg-emerald-50 text-emerald-600" : m.type === 'OUT' ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                                 )}>
                                    {m.type === 'IN' ? <ArrowDownRight className="w-5 h-5" /> : m.type === 'OUT' ? <ArrowUpRight className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{m.item}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type: {m.type}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <Box className="w-3.5 h-3.5 text-slate-400" />
                                 <span className="text-sm font-black text-slate-900">{m.qty} Units</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                                 <span className="truncate max-w-[150px]">{m.from}</span>
                                 <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                                 <span className="truncate max-w-[150px]">{m.to}</span>
                              </div>
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
