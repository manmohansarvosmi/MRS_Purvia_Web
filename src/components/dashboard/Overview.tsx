import React from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Package,
  IndianRupee,
  Activity,
  PieChart as PieChartIcon,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Download,
  AlertCircle
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
  Pie,
  BarChart,
  Bar
} from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const revenueData = [
  { name: 'Jan', revenue: 450000, expenses: 320000, profit: 130000 },
  { name: 'Feb', revenue: 520000, expenses: 380000, profit: 140000 },
  { name: 'Mar', revenue: 480000, expenses: 350000, profit: 130000 },
  { name: 'Apr', revenue: 610000, expenses: 420000, profit: 190000 },
  { name: 'May', revenue: 550000, expenses: 400000, profit: 150000 },
  { name: 'Jun', revenue: 670000, expenses: 450000, profit: 220000 },
];

const inventoryPieData = [
  { name: 'Electronics', value: 40, fill: '#6366F1' },
  { name: 'Hardware', value: 30, fill: '#10B981' },
  { name: 'FMCG', value: 20, fill: '#F59E0B' },
  { name: 'Others', value: 10, fill: '#F43F5E' },
];

const branchPerformance = [
  { branch: 'Mumbai HQ', sales: 85, growth: 12 },
  { branch: 'Delhi North', sales: 72, growth: 8 },
  { branch: 'Bangalore IT', sales: 94, growth: 15 },
  { branch: 'Kolkata East', sales: 68, growth: -3 },
];

export const Overview = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar bg-[#F8FAFC]">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Overview</h1>
            <div className="px-2 py-0.5 bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold rounded-full border border-brand-indigo/20 uppercase tracking-wider">v2.4.0</div>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <p className="text-xs font-medium flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              May 14, 2026
            </p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Last sync: 2 mins ago
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-premium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="btn-premium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-premium btn-primary bg-slate-900 text-white">
            <PlusIcon className="w-4 h-4" /> New Transaction
          </button>
        </div>
      </header>

      {/* AI Smart Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-3xl overflow-hidden glass-morphism border border-slate-200 shadow-xl shadow-slate-200/50"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-indigo/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-indigo text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-indigo/20">
              <Sparkles className="w-3.5 h-3.5" /> AI Business Assistant
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
              Good Morning, Admin! <br />
              <span className="text-slate-500 font-medium text-lg lg:text-xl">
                You have <span className="text-brand-rose font-bold">12 low-stock alerts</span> and 
                <span className="text-brand-emerald font-bold"> ₹4.2L pending receivables</span> today.
              </span>
            </h2>
            <div className="flex items-center gap-4">
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:shadow-lg transition-all">Take Action</button>
              <button className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1 group">
                View detailed insights <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Market Sentiment', value: 'BULLISH', color: 'emerald' },
              { label: 'Risk Index', value: 'LOW', color: 'indigo' }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white/50 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm text-center min-w-[140px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className={`text-xl font-bold text-brand-${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Net Revenue', value: '₹24.8L', trend: '+12.4%', icon: IndianRupee, gradient: 'indigo' },
          { label: 'Total Purchase', value: '₹18.2L', trend: '+8.2%', icon: Layers, gradient: 'emerald' },
          { label: 'GST Payable', value: '₹1.2L', trend: 'Pending', icon: Activity, gradient: 'amber' },
          { label: 'Active Leads', value: '1,248', trend: '+24%', icon: Users, gradient: 'rose' }
        ].map((kpi, i) => (
          <Card key={i} className="premium-card group">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl text-white stats-gradient-${kpi.gradient} shadow-lg shadow-${kpi.gradient}-500/20`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all",
                  kpi.gradient === 'indigo' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                )}>
                  {kpi.trend}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-indigo transition-colors">{kpi.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 premium-card">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest">Financial Performance</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Monthly revenue vs expenses analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
                <span className="text-[10px] font-bold text-slate-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-600">Expenses</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    fontWeight="600"
                    tick={{ fill: '#94A3B8' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    fontWeight="600"
                    tick={{ fill: '#94A3B8' }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: '700' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#E2E8F0" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Matrix */}
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100 p-6">
            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest">Stock Composition</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Inventory distribution by category</p>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {inventoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {inventoryPieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branch Performance */}
        <Card className="premium-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Multi-Branch Analytics</h3>
            <button className="text-[10px] font-bold text-brand-indigo hover:underline">View All Branches</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table-compact">
              <thead>
                <tr>
                  <th>Branch Location</th>
                  <th>Monthly Sales</th>
                  <th>Efficiency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {branchPerformance.map((branch, i) => (
                  <tr key={i}>
                    <td className="font-bold text-slate-700">{branch.branch}</td>
                    <td className="font-bold text-slate-900">₹{branch.sales}L</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                          <div className="h-full bg-brand-indigo" style={{ width: `${branch.sales}%` }} />
                        </div>
                        <span className="text-[10px] font-bold">{branch.sales}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase",
                        branch.growth > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {branch.growth > 0 ? `↑ ${branch.growth}%` : `↓ ${Math.abs(branch.growth)}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="premium-card">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-rose" /> Critical Inventory
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-rose/10 text-brand-rose rounded-full">12 ALERTS</span>
          </div>
          <div className="p-0">
            {[
              { item: 'Solar Panels 450W', sku: 'INV-450-PAN', stock: 12, min: 50 },
              { item: 'Lithium Battery 100Ah', sku: 'BATT-100-LI', stock: 5, min: 20 },
              { item: 'Hybrid Inverter 5kVA', sku: 'INV-HYB-5K', stock: 2, min: 10 },
              { item: 'DC Wires 4sqmm', sku: 'WIRE-DC-4', stock: 15, min: 100 },
            ].map((alert, i) => (
              <div key={i} className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs">
                    {alert.item[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{alert.item}</h4>
                    <p className="text-[10px] font-medium text-slate-400 uppercase">{alert.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-rose">{alert.stock} units left</p>
                  <p className="text-[10px] font-medium text-slate-400">Min. req: {alert.min}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4">
            <button className="w-full py-2 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded-xl hover:bg-slate-100 transition-colors">Generate Purchase Orders</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);