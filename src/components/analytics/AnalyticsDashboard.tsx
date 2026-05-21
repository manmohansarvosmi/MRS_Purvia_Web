import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Package,
  Users,
  ArrowUpRight,
  Activity,
  Calendar,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/src/lib/utils';

const monthlyRevenue = [
  { month: 'Jan', revenue: 320000, expenses: 180000, profit: 140000 },
  { month: 'Feb', revenue: 410000, expenses: 210000, profit: 200000 },
  { month: 'Mar', revenue: 380000, expenses: 195000, profit: 185000 },
  { month: 'Apr', revenue: 520000, expenses: 260000, profit: 260000 },
  { month: 'May', revenue: 490000, expenses: 240000, profit: 250000 },
  { month: 'Jun', revenue: 610000, expenses: 290000, profit: 320000 },
  { month: 'Jul', revenue: 580000, expenses: 275000, profit: 305000 },
  { month: 'Aug', revenue: 720000, expenses: 330000, profit: 390000 },
  { month: 'Sep', revenue: 680000, expenses: 310000, profit: 370000 },
  { month: 'Oct', revenue: 842000, expenses: 380000, profit: 462000 },
];

const categoryPerf = [
  { name: 'Solar Panels', sales: 420, revenue: 6300000 },
  { name: 'Inverters', sales: 185, revenue: 7770000 },
  { name: 'Batteries', sales: 310, revenue: 4185000 },
  { name: 'Cables', sales: 890, revenue: 1068000 },
  { name: 'Controllers', sales: 140, revenue: 812000 },
];

const pieData = [
  { name: 'Solar Panels', value: 35, fill: '#B2001A' },
  { name: 'Inverters', value: 30, fill: '#DC143C' },
  { name: 'Batteries', value: 20, fill: '#FF6B8A' },
  { name: 'Others', value: 15, fill: '#FFB3C1' },
];

const RANGES = ['7D', '30D', '3M', '6M', '1Y'] as const;

const kpis = [
  { label: 'Total Revenue YTD', value: '₹54.5L', change: '+18.4%', up: true, icon: IndianRupee, color: 'text-primary bg-primary/10' },
  { label: 'Units Sold', value: '1,945', change: '+12.1%', up: true, icon: Package, color: 'text-indigo-600 bg-indigo-50' },
  { label: 'Active Customers', value: '342', change: '+6.8%', up: true, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Avg. Order Value', value: '₹28,000', change: '-2.3%', up: false, icon: Target, color: 'text-orange-600 bg-orange-50' },
];

export const AnalyticsDashboard = () => {
  const [range, setRange] = useState<typeof RANGES[number]>('1Y');

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 custom-scrollbar bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Analytics
          </h2>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Revenue Intelligence & Growth Matrix</p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                range === r
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-700"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group hover:-translate-y-0.5 bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2 rounded-lg", kpi.color)}>
                    <kpi.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border",
                    kpi.up ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-500 bg-red-50 border-red-100"
                  )}>
                    {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Revenue vs Profit Trajectory
              </CardTitle>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">10-Month Financial Flow</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: 'Revenue', color: '#B2001A' },
                { label: 'Expenses', color: '#E2E8F0' },
                { label: 'Profit', color: '#10B981' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B2001A" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#B2001A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" tick={{ fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" tick={{ fill: '#94A3B8' }} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B2001A" strokeWidth={3} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#CBD5E1" strokeWidth={2} fill="transparent" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Performance Bar */}
        <Card className="lg:col-span-8 border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Category Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerf} barSize={24} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="600" tick={{ fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight="600" tick={{ fill: '#94A3B8' }} tickFormatter={v => `₹${v / 100000}L`} />
                  <Tooltip
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: '600' }}
                    formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#B2001A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Distribution */}
        <Card className="lg:col-span-4 border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Revenue Share</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center gap-6">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(v: number) => [`${v}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{d.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 italic">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Table */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Product Category Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {categoryPerf.map((cat, i) => {
              const maxRev = Math.max(...categoryPerf.map(c => c.revenue));
              const pct = Math.round((cat.revenue / maxRev) * 100);
              return (
                <div key={cat.name} className="flex items-center gap-6 px-8 py-5 hover:bg-slate-50/50 transition-colors group">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[11px] font-black italic text-slate-400 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-black italic text-slate-900 uppercase tracking-tight">{cat.name}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{cat.sales} units</span>
                        <span className="text-sm font-black text-slate-900 italic">₹{(cat.revenue / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
