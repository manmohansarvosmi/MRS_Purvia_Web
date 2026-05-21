import React from 'react';
import { 
  Package, 
  Plus, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  MoreVertical,
  Search,
  Filter,
  Activity,
  History
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const assets = [
  { id: '1', name: 'Delivery Van - MH04', type: 'Vehicle', val: '₹8.5L', status: 'In Use', lastService: '12 May' },
  { id: '2', name: 'CNC Milling Machine', type: 'Machinery', val: '₹45L', status: 'Idle', lastService: '01 May' },
  { id: '3', name: 'Server Rack #42', type: 'IT Hardware', val: '₹4.2L', status: 'Maintenance', lastService: 'Today' },
];

export const AssetModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Package className="w-5 h-5 text-primary" />
             </div>
             Asset Management
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Fixed Asset Tracking & Depreciation Control</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <ShieldCheck className="w-4 h-4" /> Insurance
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> Register Asset
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input type="text" placeholder="Search by asset tag or serial number..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" />
               </div>
               <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><Filter className="w-5 h-5" /></button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset Detail</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Value</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Service Due</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {assets.map((a) => (
                        <tr key={a.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                    <Package className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{a.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tag: HEL-AST-{a.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-slate-600">{a.type}</td>
                           <td className="px-8 py-6 text-sm font-black text-slate-900">{a.val}</td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                 "text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border",
                                 a.status === 'In Use' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                 a.status === 'Idle' ? "bg-slate-50 text-slate-600 border-slate-100" : "bg-rose-50 text-rose-600 border-rose-100"
                              )}>{a.status}</span>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-slate-500">{a.lastService}</td>
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
