import React from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Package,
  IndianRupee,
  Activity,
  PieChart as PieChartIcon,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const revenueData = [
  { name: 'Mon', revenue: 45000, expenses: 32000 },
  { name: 'Tue', revenue: 52000, expenses: 38000 },
  { name: 'Wed', revenue: 48000, expenses: 35000 },
  { name: 'Thu', revenue: 61000, expenses: 42000 },
  { name: 'Fri', revenue: 55000, expenses: 40000 },
  { name: 'Sat', revenue: 67000, expenses: 45000 },
  { name: 'Sun', revenue: 42000, expenses: 30000 },
];

const inventoryPieData = [
  { name: 'Panels', value: 400, fill: '#B2001A' },
  { name: 'Inverters', value: 300, fill: '#E11D2E' },
  { name: 'Batteries', value: 200, fill: '#FCA5A5' },
  { name: 'Wires', value: 278, fill: '#FECACA' },
];

const employeePerformance = [
  { name: 'Sales', val: 85 },
  { name: 'Installs', val: 92 },
  { name: 'Support', val: 78 },
  { name: 'Logistics', val: 88 },
];

const recentActivity = [
  { date: 'Oct 23', time: '08:55 AM', status: 'ON TIME', color: 'emerald' },
  { date: 'Oct 22', time: '09:12 AM', status: 'LATE', color: 'orange' },
  { date: 'Oct 21', time: '08:58 AM', status: 'ON TIME', color: 'emerald' },
];

export const Overview = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">
      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            DASHBOARD <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Oct 24, 2023 • Tuesday • Noida Sector 62 HQ</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl shadow-md text-[10px] font-black uppercase tracking-widest hover:bg-[#900015] transition-colors">
            Generate Invoices
          </button>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white overflow-hidden relative custom-card-red-edge enterprise-card">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/5 rounded-lg text-primary">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" /> +12%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue MTD</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mt-1">₹8,42,000</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative enterprise-card">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <TrendingDown className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                <Activity className="w-3 h-3" /> 24% Exp
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Expenses</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mt-1">₹3,12,000</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative enterprise-card">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Active 42
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mt-1">42 <span className="text-xs text-slate-400">Units</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative enterprise-card">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                8 Alerts
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics / Inventory</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mt-1">1,248 <span className="text-xs text-slate-400">SKUs</span></h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Revenue Trend - Wide */}
        <Card className="lg:col-span-12 border-none shadow-sm bg-white overflow-hidden enterprise-card">
          <CardHeader className="p-6 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Revenue vs Expenses Index
                </CardTitle>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Real-time financial flow analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold uppercase">Expenses</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B2001A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#B2001A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    fontWeight="bold"
                    tick={{ fill: '#94A3B8' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    fontWeight="bold"
                    tick={{ fill: '#94A3B8' }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#B2001A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" stroke="#E2E8F0" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Distribution - Wide */}
        <Card className="lg:col-span-12 border-none shadow-sm bg-white flex flex-col enterprise-card">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Asset Matrix Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col md:flex-row items-center gap-12">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {inventoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {inventoryPieData.map((entry) => (
                <div key={entry.name} className="flex flex-col gap-2 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{entry.name}</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{entry.value} <span className="text-[10px] not-italic text-slate-400 uppercase">Units</span></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid for Secondary Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        {/* Performance Metrics */}
        <Card className="md:col-span-2 lg:col-span-4 border-none shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Core Performance Units</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {employeePerformance.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase italic tracking-widest">
                  <span className="text-slate-600">{item.name} Efficiency</span>
                  <span className="text-primary">{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-md overflow-hidden relative border border-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Operations */}
        <Card className="md:col-span-1 lg:col-span-5 border-none shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
             <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Operational Log</CardTitle>
              <button className="text-[10px] font-black text-primary hover:underline uppercase italic">Full Audit</button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {recentActivity.map((act, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      act.color === 'emerald' ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100"
                    )}>
                      <CalendarIcon className={cn(
                        "w-4 h-4",
                        act.color === 'emerald' ? "text-emerald-600" : "text-orange-600"
                      )} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{act.date}</p>
                      <p className="text-[10px] font-bold text-slate-400">{act.time} Distribution</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase italic border",
                      act.color === 'emerald' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"
                    )}>
                      {act.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Duty Control */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-slate-900 text-white flex flex-col justify-center items-center p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/40">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Time Matrix Active</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">SHIFT: NOON-01 PROTOCOL</p>
            </div>
            <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors active:scale-95">
              Sync Attendance
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};