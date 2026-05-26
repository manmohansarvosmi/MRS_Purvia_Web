import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  Target, 
  ShoppingCart, 
  Wrench, 
  Zap, 
  Repeat,
  Download,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const incomeSources = [
  { name: 'Product Sales', icon: ShoppingCart, color: 'bg-emerald-500', amount: 1520000, trend: '+15%' },
  { name: 'Service Revenue', icon: Wrench, color: 'bg-blue-500', amount: 450000, trend: '+8%' },
  { name: 'Maintenance Contracts', icon: Repeat, color: 'bg-purple-500', amount: 125000, trend: '+22%' },
  { name: 'Other Income', icon: Zap, color: 'bg-amber-500', amount: 25000, trend: '-2%' },
];

const growthData = [
  { name: 'Jan', revenue: 850000 },
  { name: 'Feb', revenue: 920000 },
  { name: 'Mar', revenue: 1050000 },
  { name: 'Apr', revenue: 1250000 },
  { name: 'May', revenue: 1520000 },
];

export const IncomeModule = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase">Income Master</h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Revenue Streams & Growth Tracking</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Download className="w-3.5 h-3.5" />
           </button>
           <button className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-2 hover:bg-emerald-700 transition-all">
             <Plus className="w-3.5 h-3.5" /> Add Inflow
           </button>
        </div>
      </div>

      {/* ── KPI Bench (Compact) ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {incomeSources.map((source, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-600/20 transition-all flex items-center gap-4">
               <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm", source.color)}>
                  <source.icon className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{source.name}</p>
                  <h4 className="text-lg font-black text-slate-900 italic tracking-tighter leading-none">₹{source.amount.toLocaleString()}</h4>
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">REVENUE TRAJECTORY</h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#A0AEC0' }} />
                     <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#A0AEC0' }} tickFormatter={(val) => `₹${val/1000}k`} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'none', padding: '10px', fontSize: '10px' }} />
                     <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg flex flex-col justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 italic">Income Power</h3>
            <div className="space-y-6">
               <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Target className="w-3.5 h-3.5" /> Quarter Goal
                  </p>
                  <h4 className="text-xl font-black italic">₹75.0L <span className="text-[9px] font-bold text-white/30 uppercase not-italic">/ 100L</span></h4>
               </div>
               <div className="space-y-3">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="space-y-1">
                       <div className="flex justify-between text-[8px] font-bold uppercase text-white/40">
                         <span>Stream {i+1}</span>
                         <span>85%</span>
                       </div>
                       <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Live Revenue</h3>
            <button className="text-[9px] font-bold text-emerald-600 uppercase underline">Ledger</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 uppercase text-[8px] font-bold text-slate-400 tracking-widest">
                     <th className="p-4">Time</th>
                     <th className="p-4">Stream</th>
                     <th className="p-4">Customer</th>
                     <th className="p-4 text-right">Amount (₹)</th>
                     <th className="p-4 text-center">...</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-bold text-slate-700 uppercase tracking-tight divide-y divide-slate-100">
                  {[1, 2].map((_, i) => (
                    <tr key={i} className="hover:bg-emerald-50/10 transition-colors">
                       <td className="p-4 text-slate-400 font-medium">11:45 AM</td>
                       <td className="p-4">Product Sales</td>
                       <td className="p-4 italic truncate">Global Tech Solutions</td>
                       <td className="p-4 text-right italic text-emerald-600 font-black">₹4.25L</td>
                       <td className="p-4 text-center">
                          <button className="text-slate-300 hover:text-emerald-600"><ArrowRight className="w-4 h-4" /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
