import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

const reportGroups = [
  { id: 'financial', label: 'Financial', items: ['Balance Sheet', 'Profit & Loss', 'Trial Balance', 'Cash Flow'] },
  { id: 'tax', label: 'Taxation', items: ['GSTR-1', 'GSTR-3B', 'TDS Report', 'PT Report'] },
  { id: 'inventory', label: 'Inventory', items: ['Stock Ledger', 'Low Stock', 'Purchase Reg', 'Sales Reg'] },
  { id: 'audit', label: 'Audit', items: ['Voucher Audit', 'Price Var', 'Activity Logs', 'Profit Analysis'] },
];

export const ReportsModule = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase">Intelligence Reports</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Auditing & Performance Metrics</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm flex items-center gap-2">
             <Calendar className="w-3.5 h-3.5 text-slate-300" /> FY 2026-27
           </button>
           <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-2">
             <Download className="w-3.5 h-3.5" /> Export All
           </button>
        </div>
      </div>

      {/* ── Report Directory ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {reportGroups.map((group, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-primary/20 transition-all">
               <div className="px-4 py-2 bg-slate-900 text-white">
                  <h3 className="text-[9px] font-bold uppercase tracking-widest italic">{group.label}</h3>
               </div>
               <div className="p-3 space-y-1 flex-1">
                  {group.items.map((item, j) => (
                     <button key={j} className="w-full flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tight hover:text-primary transition-colors py-1 px-1 rounded-md hover:bg-slate-50">
                        <span>{item}</span>
                        <FileText className="w-3 h-3 text-slate-300" />
                     </button>
                  ))}
               </div>
            </div>
         ))}
      </div>

      {/* ── Dynamic Highlights ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">YTD REVENUE CURVE</h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Apr', current: 400000, last: 350000 },
                    { name: 'May', current: 650000, last: 420000 },
                    { name: 'Jun', current: 580000, last: 480000 },
                    { name: 'Jul', current: 820000, last: 600000 },
                  ]}>
                     <defs>
                        <linearGradient id="colorCur" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#C81D25" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#C81D25" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#A0AEC0' }} />
                     <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#A0AEC0' }} tickFormatter={(val) => `${val/1000}k`} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'none', fontSize: '10px' }} />
                     <Area type="monotone" dataKey="current" stroke="#C81D25" strokeWidth={3} fillOpacity={1} fill="url(#colorCur)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div>
               <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1 italic">Solvency</h3>
            </div>
            <div className="space-y-4 my-6">
               <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-bold uppercase text-white/40">
                     <span>Assets</span>
                     <span>65%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-bold uppercase text-white/40">
                     <span>Liabilities</span>
                     <span>35%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-rose-500" style={{ width: '35%' }} />
                  </div>
               </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
               <p className="text-[9px] font-bold text-emerald-400 uppercase flex items-center justify-center gap-1.5 mb-1.5 italic">
                  <ShieldAlert className="w-3.5 h-3.5" /> PRIME STATUS
               </p>
               <h4 className="text-xl font-black italic">Ratio 1.83</h4>
            </div>
         </div>
      </div>
    </div>
  );
};
