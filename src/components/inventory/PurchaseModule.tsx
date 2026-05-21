import React from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ArrowRight,
  PackageCheck,
  Clock,
  Building2,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const purchaseOrders = [
  { id: 'PO-2026-0042', vendor: 'Tata Solar Systems', items: 15, value: '₹14.2L', date: 'Today', status: 'Sent' },
  { id: 'PO-2026-0041', vendor: 'Havells India', items: 120, value: '₹2.4L', date: 'Yesterday', status: 'Received' },
  { id: 'PO-2026-0040', vendor: 'Microtek Power', items: 8, value: '₹8.9L', date: '12 May', status: 'Partial' },
];

export const PurchaseModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <ShoppingCart className="w-5 h-5 text-primary" />
             </div>
             Purchase Orders (PO)
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Procurement Management & Vendor Fulfillment</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Building2 className="w-4 h-4" /> Vendors
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> New Purchase Order
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input type="text" placeholder="Search by PO Number or Vendor..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:border-primary/20" />
               </div>
               <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><Filter className="w-5 h-5" /></button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">PO Number</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vendor Detail</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Items</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Order Value</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Order Date</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Status</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {purchaseOrders.map((po) => (
                        <tr key={po.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-slate-900 text-sm italic">{po.id}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{po.vendor}</p>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-slate-600">{po.items} Units</td>
                           <td className="px-8 py-6 text-sm font-black text-slate-900 italic">{po.value}</td>
                           <td className="px-8 py-6 text-xs font-bold text-slate-500">{po.date}</td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                 "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit",
                                 po.status === 'Received' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                 po.status === 'Partial' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                              )}>
                                 <div className={cn("w-1 h-1 rounded-full", po.status === 'Received' ? "bg-emerald-500" : "bg-amber-500")} />
                                 {po.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 flex items-center gap-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Download className="w-4 h-4" /></button>
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
