import React from 'react';
import { 
  ArrowUpRight, ArrowDownRight, ArrowRight, Users, Package, Wallet, CreditCard, 
  TrendingUp, Clock, CheckCircle2, AlertCircle, Plus, FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { cn } from "@/src/lib/utils";

const data = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

export const Overview = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#F8FAFC' }}>
      
      {/* ── Dashboard Header ── */}
      <div className="page-header sticky top-0 bg-white z-20 shrink-0">
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Business Intelligence</h2>
          <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>Real-time Enterprise Performance Scorecard</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary"><FileSpreadsheet size={12} /> export analytics</button>
          <button className="btn-primary"><Plus size={13} /> Quick Entry</button>
        </div>
      </div>

      {/* ── Statistics Matrix (Compact) ── */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Net Asset Value', value: '₹24,80,200', change: '+12.5%', icon: Wallet, color: '#C8102E' },
          { label: 'Available Cash', value: '₹1,52,000', change: 'Verified', icon: CreditCard, color: '#10B981' },
          { label: 'Bank Liquidity', value: '₹18,28,000', change: '4 Nodes', icon: TrendingUp, color: '#8B5CF6' },
          { label: 'P&L Variance', value: '₹4,25,000', change: 'Net 18%', icon: Package, color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} className="stat-card shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <span className="label" style={{ fontSize: 9 }}>{stat.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: stat.color }}>{stat.change}</span>
            </div>
            <p className="value" style={{ fontSize: 16, marginTop: 4 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Visual Analytics & Registry ── */}
      <div className="flex-1 overflow-auto p-4 flex flex-col lg:flex-row gap-4 custom-scrollbar">
        
        {/* Trajectory Plot */}
        <div className="flex-1 bg-white border border-slate-200 rounded p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>FINANCIAL TRAJECTORY</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-600" /><span style={{ fontSize: 9, fontWeight: 600 }}>INCOME</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /><span style={{ fontSize: 9, fontWeight: 600 }}>EXPENSE</span></div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8102E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#C8102E" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#E2E8F0" fill="#F8FAFC" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Node Logs */}
        <div className="w-full lg:w-80 bg-white border border-slate-200 rounded flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100"><h3 style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>RECENT TRANSACTIONS</h3></div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {[
              { title: 'GLOBAL TECH SOLUTIONS', sub: '25 May • RECEIPT', amt: '+₹85,200', type: 'in' },
              { title: 'AMAZON WEB SERVICES', sub: '24 May • PAYMENT', amt: '₹12,500', type: 'out' },
              { title: 'HDFC BANK INTERNAL', sub: '24 May • RECEIPT', amt: '+₹1,50,000', type: 'in' },
              { title: 'BLUE STAR LOGISTICS', sub: '23 May • FREIGHT', amt: '₹4,800', type: 'out' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn("w-7 h-7 rounded flex items-center justify-center shrink-0", tx.type === 'in' ? "bg-emerald-600" : "bg-red-600")}>
                  {tx.type === 'in' ? <ArrowUpRight size={14} className="text-white" /> : <ArrowRight size={14} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#1E293B' }} className="truncate">{tx.title}</p>
                  <p style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 600 }}>{tx.sub}</p>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: tx.type === 'in' ? '#059669' : '#1E293B' }}>{tx.amt}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
