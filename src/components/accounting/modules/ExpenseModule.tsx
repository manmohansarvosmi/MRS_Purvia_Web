import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingDown, 
  Camera, 
  Truck, 
  Zap, 
  Wifi, 
  Home, 
  Megaphone,
  Plane,
  Users,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const expenseCategories = [
  { name: 'Salary', icon: Users, color: 'bg-blue-500', amount: 450000 },
  { name: 'Electricity', icon: Zap, color: 'bg-amber-500', amount: 12500 },
  { name: 'Internet', icon: Wifi, color: 'bg-purple-500', amount: 4500 },
  { name: 'Fuel', icon: Truck, color: 'bg-orange-500', amount: 8500 },
  { name: 'Rent', icon: Home, color: 'bg-indigo-500', amount: 85000 },
  { name: 'Marketing', icon: Megaphone, color: 'bg-rose-500', amount: 42000 },
  { name: 'Travel', icon: Plane, color: 'bg-emerald-500', amount: 15200 },
];

const trendData = [
  { name: 'Mon', value: 12000 },
  { name: 'Tue', value: 15000 },
  { name: 'Wed', value: 8000 },
  { name: 'Thu', value: 22000 },
  { name: 'Fri', value: 35000 },
  { name: 'Sat', value: 42000 },
  { name: 'Sun', value: 18000 },
];

const COLORS = ['#3B82F6', '#F59E0B', '#A855F7', '#F97316', '#6366F1', '#F43F5E', '#10B981'];

export const ExpenseModule = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase">Expense Tracker</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Outflow Monitoring & Categorization</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Download className="w-3.5 h-3.5 text-slate-400" />
           </button>
           <button className="px-5 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-2 hover:bg-red-700 transition-all">
             <Plus className="w-3.5 h-3.5" /> Log New
           </button>
        </div>
      </div>

      {/* ── Analytics Bench ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OUTFLOW TRAJECTORY</h3>
               <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-md">
                  <button className="px-3 py-1 bg-white shadow-sm rounded text-[8px] font-bold uppercase">Weekly</button>
                  <button className="px-3 py-1 text-slate-400 text-[8px] font-bold uppercase">Monthly</button>
               </div>
            </div>
            <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                     <defs>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#A0AEC0' }} />
                     <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#A0AEC0' }} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                     <Area type="monotone" dataKey="value" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="relative z-10">
               <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1 italic">Volume Share</h3>
            </div>
            <div className="h-[120px] relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="amount">
                        {expenseCategories.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="relative z-10 space-y-2">
               <div className="flex justify-between items-end border-b border-white/5 pb-1">
                  <span className="text-[8px] font-bold text-white/40 uppercase">Primary</span>
                  <span className="text-[11px] font-bold italic">Salaries</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-[8px] font-bold text-white/40 uppercase">Monthly</span>
                  <span className="text-lg font-black italic text-rose-500">₹6.2L</span>
               </div>
            </div>
         </div>
      </div>

      {/* ── Categories Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
         {expenseCategories.map((cat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary/20 transition-all flex flex-col items-center text-center">
               <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-white shadow-sm", cat.color)}>
                  <cat.icon className="w-4 h-4" />
               </div>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{cat.name}</p>
               <h4 className="text-[12px] font-bold text-slate-900 italic tracking-tighter">₹{cat.amount.toLocaleString()}</h4>
            </div>
         ))}
      </div>

      {/* ── Recent Expenses List ────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Latest Outflows</h3>
            <button className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-300 hover:text-primary transition-all shadow-sm">
               <Filter className="w-3.5 h-3.5" />
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 uppercase text-[8px] font-bold text-slate-400 tracking-widest">
                     <th className="p-4">Date</th>
                     <th className="p-4">Category</th>
                     <th className="p-4">Recipient</th>
                     <th className="p-4">Method</th>
                     <th className="p-4 text-right">Amount (₹)</th>
                     <th className="p-4 text-center">Doc</th>
                  </tr>
               </thead>
               <tbody className="text-[11px] font-bold text-slate-700 uppercase tracking-tight divide-y divide-slate-50">
                  {[1, 2, 3].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                       <td className="p-4 text-slate-400 font-medium">25 May 2026</td>
                       <td className="p-4">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px] font-bold">Utility</span>
                       </td>
                       <td className="p-4 italic truncate max-w-[150px]">Utility Board Payment</td>
                       <td className="p-4 font-bold text-slate-300">Net Banking</td>
                       <td className="p-4 text-right italic text-rose-600">₹8,500.00</td>
                       <td className="p-4 text-center">
                          <button className="w-7 h-7 bg-slate-50 rounded-md flex items-center justify-center text-slate-300 hover:text-primary transition-all mx-auto">
                             <Camera className="w-3.5 h-3.5" />
                          </button>
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
