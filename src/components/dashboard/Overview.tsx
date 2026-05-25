import React from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Package,
  IndianRupee,
  Activity,
  Layers,
  ArrowRight,
  Filter,
  Download,
  AlertCircle,
  Plus,
  Wallet,
  Building2,
  Banknote,
  Repeat,
  FileText,
  CreditCard,
  Zap,
  MoreVertical,
  CheckCircle2,
  ArrowRightLeft,
  ArrowDownCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

// ── Mock Data ─────────────────────────────────────────────────────────
const financialFlowData = [
  { name: '1 May', income: 45000, expense: 32000, profit: 13000 },
  { name: '5 May', income: 52000, expense: 38000, profit: 14000 },
  { name: '10 May', income: 48000, expense: 35000, profit: 13000 },
  { name: '15 May', income: 61000, expense: 42000, profit: 19000 },
  { name: '20 May', income: 55000, expense: 40000, profit: 15000 },
  { name: '25 May', income: 67000, expense: 45000, profit: 22000 },
];

const transactionData = [
  { id: '1', party: 'Global Tech Solutions', date: '25 May', amount: 85200, type: 'Income', status: 'Completed', method: 'Bank Transfer' },
  { id: '2', party: 'Amazon Web Services', date: '24 May', amount: -12500, type: 'Expense', status: 'Completed', method: 'Credit Card' },
  { id: '3', party: 'HDFC Bank Internal', date: '24 May', amount: 150000, type: 'Transfer', status: 'Completed', method: 'Internal' },
  { id: '4', party: 'Vertex Agencies', date: '23 May', amount: 42000, type: 'Income', status: 'Pending', method: 'Cheque' },
];

export const Overview = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar bg-[#F8FAFC]">
      
      {/* ── Compact Header ────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-primary" />
           </div>
           <div>
              <h1 className="text-lg font-bold text-slate-900 uppercase">Dashboard</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time Financial Telemetry</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-white border border-slate-200 p-1 rounded-lg flex items-center gap-1">
              <button className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-widest">Live</button>
              <button className="px-4 py-1.5 text-slate-400 hover:text-slate-600 text-[9px] font-bold uppercase tracking-widest">Reports</button>
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm">
             <Plus className="w-4 h-4" /> Entry
           </button>
        </div>
      </header>

      {/* ── KPI Grid (Compact) ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Balance', value: '₹24,80,200', trend: '+12%', icon: Wallet, color: 'primary' },
          { label: 'Cash in Hand', value: '₹1,52,000', trend: 'Verified', icon: Banknote, color: 'emerald' },
          { label: 'Bank Balance', value: '₹18,28,000', trend: '4 Accounts', icon: Building2, color: 'blue' },
          { label: 'Profit / Loss', value: '₹4,25,000', trend: 'Net 18%', icon: TrendingUp, color: 'emerald' },
        ].map((stat, i) => (
          <div key={ stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-primary/20 transition-all flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
               <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shadow-sm", 
                 stat.color === 'primary' ? "bg-primary text-white" : 
                 stat.color === 'emerald' ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
               )}>
                  <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-[8px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md uppercase">{stat.trend}</span>
            </div>
            <div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
               <h3 className="text-lg font-black text-slate-900 italic tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         <div className="xl:col-span-2 space-y-6">
            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
               <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
                  <div>
                     <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CASH FLOW TRAJECTORY</CardTitle>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-primary" />
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Income</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-slate-200" />
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Expense</span>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-6 pt-6">
                  <div className="h-[250px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financialFlowData}>
                           <defs>
                              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#CB0C1F" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#CB0C1F" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#94A3B8' }} />
                           <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight="700" tick={{ fill: '#94A3B8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                           <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                           <Area type="monotone" dataKey="income" stroke="#CB0C1F" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                           <Area type="monotone" dataKey="expense" stroke="#E2E8F0" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: 'Voucher', icon: Repeat },
                 { id: 'billing', label: 'GST Invoice', icon: FileText },
                 { id: 'expenses', label: 'Expense', icon: ArrowDownCircle },
                 { label: 'Transfer', icon: ArrowRightLeft },
               ].map((act, i) => (
                 <button key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary/20 hover:bg-slate-50 transition-all flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <act.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">{act.label}</span>
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
               <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Recent Activity</h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               </div>
               <div className="divide-y divide-slate-50">
                  {transactionData.map(tx => (
                    <div key={tx.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between gap-3">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", 
                             tx.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                             {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                             <h5 className="text-[10px] font-bold text-slate-800 uppercase line-clamp-1">{tx.party}</h5>
                             <p className="text-[8px] font-medium text-slate-400 uppercase mt-0.5">{tx.date}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={cn("text-xs font-black italic", tx.amount > 0 ? "text-emerald-600" : "text-rose-600")}>
                             {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-3 text-slate-400 text-[8px] font-bold uppercase tracking-widest border-t border-slate-50 hover:bg-slate-50 transition-all">Full Journal</button>
            </Card>

            <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden group shadow-lg">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                     <Activity className="w-4 h-4 text-primary" />
                     <h4 className="text-[9px] font-bold uppercase tracking-widest">Efficiency</h4>
                  </div>
                  <div className="flex items-end justify-between">
                     <span className="text-4xl font-black italic tracking-tighter">9.8</span>
                     <span className="text-emerald-400 text-[8px] font-black uppercase mb-1">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full">
                     <div className="h-full bg-emerald-500" style={{ width: '98%' }} />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};