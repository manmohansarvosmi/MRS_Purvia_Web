import React from 'react';
import { 
  FileText, Download, Calendar, ShieldAlert, BarChart, 
  TrendingUp, Activity, ArrowRight, ShieldCheck, PieChart, RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';

const reportGroups = [
  { id: 'financial', label: 'Financial Core', items: ['Balance Sheet', 'Profit & Loss', 'Trial Balance', 'Cash Flow Log'] },
  { id: 'tax', label: 'Regulatory Tax', items: ['GSTR-1 Matrix', 'GSTR-3B Sync', 'TDS Liability', 'PT Compliance'] },
  { id: 'inventory', label: 'Stock Logistics', items: ['Stock Ledger', 'Low Inventory', 'Purchase Reg', 'Sales Register'] },
  { id: 'audit', label: 'Operational Audit', items: ['Voucher Audit', 'Price Variance', 'Activity Hub', 'Profit analysis'] },
];

export const ReportsModule = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white h-full">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-[5px] w-8 h-8">
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Intelligence Reporting Matrix</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Auditing, Performance Metrics & Data Extraction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
            <Calendar size={11} /> FY 2026-27
          </button>
          <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            <Download size={13} /> Export Consolidated Dossier
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Fiscal Health Score</p>
          <p className="text-[14px] font-black text-emerald-600 italic leading-none">98.4 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Optimal</span></p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Audit Coverage</p>
          <p className="text-[14px] font-black text-slate-900 italic">100%</p>
        </div>
        <div className="ml-auto">
           <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none italic">Intelligence Sync: 100ms</span>
           </div>
        </div>
      </div>

      {/* ── Content Directory ── */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-8 bg-slate-50/20">
        
        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           {reportGroups.map((group, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[5px] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-primary/30 transition-all hover:shadow-md"
              >
                 <div className="px-4 py-2 border-b border-slate-100 bg-slate-900 flex items-center justify-between">
                    <h3 className="text-[9px] font-black text-white uppercase tracking-widest italic">{group.label}</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                 </div>
                 <div className="p-3 space-y-1.5 flex-1 bg-white">
                    {group.items.map((item, j) => (
                       <button key={j} className="w-full flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-tight hover:text-primary transition-all py-1.5 px-2 rounded-[3px] hover:bg-slate-50 group">
                          <span className="text-left leading-tight">{item}</span>
                          <ArrowRight size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                       </button>
                    ))}
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-10">
           <div className="xl:col-span-2 bg-white rounded-[5px] border border-slate-200 shadow-sm p-5 relative overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-2">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">YTD Revenue Flux Curve</h3>
                 <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[8.5px] font-black text-emerald-600 uppercase italic">
                       <Activity size={10} /> +14.2% Growth
                    </span>
                 </div>
              </div>
              <div className="h-[240px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Apr', current: 400000, last: 350000 },
                      { name: 'May', current: 650000, last: 420000 },
                      { name: 'Jun', current: 580000, last: 480000 },
                      { name: 'Jul', current: 820000, last: 600000 },
                    ]}>
                       <defs>
                          <linearGradient id="colorCurReports" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#C81D25" stopOpacity={0.08}/>
                             <stop offset="95%" stopColor="#C81D25" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="900" tick={{ fill: '#94A3B8' }} />
                       <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight="900" tick={{ fill: '#94A3B8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                       <Tooltip 
                         contentStyle={{ background: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0', padding: '10px' }}
                         itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                       />
                       <Area type="monotone" dataKey="current" stroke="#C81D25" strokeWidth={3} fillOpacity={1} fill="url(#colorCurReports)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-rows-2 gap-6">
              <div className="bg-slate-900 rounded-[5px] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                 <div className="relative z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] italic mb-1 text-white/60">Solvency Status</h3>
                    <h4 className="text-2xl font-black italic tracking-tighter">Coefficient 1.83</h4>
                 </div>
                 <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                       <div className="flex justify-between text-[8px] font-black uppercase text-white/40 tracking-widest">
                          <span>Verified Assets</span><span>65%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-emerald-500" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-[8px] font-black uppercase text-white/40 tracking-widest">
                          <span>Current Liabilities</span><span>35%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} className="h-full bg-primary" />
                       </div>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />
              </div>

              <div className="bg-white rounded-[5px] border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Security Audit</p>
                    <ShieldCheck size={16} className="text-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight mb-2">LAST VERIFICATION: TODAY 10:42 AM</p>
                    <div className="text-[20px] font-black text-slate-900 italic tracking-tighter">PRIME RATING</div>
                 </div>
                 <button className="btn-secondary w-full h-8 px-4 text-[9px] font-black uppercase rounded-[5px] flex items-center justify-center gap-2">
                    <RefreshCw size={10} /> Rescan Engine
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* ── Fixed Footer ── */}
      <div className="h-[38px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">
          Data Logic Hub — Reporting Node: ONLINE
        </p>
        <div className="flex items-center gap-2 opacity-50">
           <Activity size={12} className="text-primary" />
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Helixion Analytics v2.4.0</span>
        </div>
      </div>
    </div>
  );
};
