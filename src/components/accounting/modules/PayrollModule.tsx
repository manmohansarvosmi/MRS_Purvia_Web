import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  Briefcase, 
  Clock, 
  CreditCard, 
  FileText,
  Download,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const payrollStats = [
  { label: 'Total Employees', value: '42', icon: Users, color: 'blue' },
  { label: 'Monthly Payout', value: '₹12.4L', icon: CreditCard, color: 'emerald' },
  { label: 'Pending Approvals', value: '3', icon: Clock, color: 'amber' },
  { label: 'Tax Deductions', value: '₹1.8L', icon: ShieldCheck, color: 'purple' },
];

const staffList = [
  { id: '1', name: 'Arjun Sharma', role: 'Sr. Engineer', dept: 'Tech', salary: 85000, status: 'Paid', date: '25 May' },
  { id: '2', name: 'Neha Gupta', role: 'Marketing Lead', dept: 'Sales', salary: 62000, status: 'Processing', date: '25 May' },
  { id: '3', name: 'Rahul Verma', role: 'Operations Mgr', dept: 'Ops', salary: 55000, status: 'Paid', date: '25 May' },
];

export const PayrollModule = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Payroll Hub</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Automated Salary disbursement & Compliance logs</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <FileText className="w-4 h-4 text-primary" /> Generate Slips
           </button>
           <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-black transition-all">
             <Plus className="w-4 h-4" /> Run Payroll
           </button>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {payrollStats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
               <div className="flex justify-between items-start mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", 
                    stat.color === 'blue' ? "bg-blue-600 text-white" : 
                    stat.color === 'emerald' ? "bg-emerald-600 text-white" : 
                    stat.color === 'amber' ? "bg-amber-500 text-white" : "bg-purple-600 text-white"
                  )}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <MoreVertical className="w-4 h-4 text-slate-200 group-hover:text-slate-400 cursor-pointer" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</h3>
            </div>
         ))}
      </div>

      {/* ── Personnel List ────────────────────────────────────────── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic tracking-tight">Active Employee Roll</h3>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" placeholder="Search staff..." className="pl-10 pr-4 py-2 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary w-64 bg-slate-50/50" />
               </div>
               <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 uppercase text-[9px] font-black text-slate-400 tracking-[0.2em]">
                     <th className="p-8">Identity</th>
                     <th className="p-8">Department</th>
                     <th className="p-8">Monthly CTC (₹)</th>
                     <th className="p-8">Disbursed Date</th>
                     <th className="p-8">Status</th>
                     <th className="p-8 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="text-[12px] font-black text-slate-800 uppercase tracking-tight divide-y divide-slate-50">
                  {staffList.map((staff, i) => (
                    <tr key={staff.id} className="hover:bg-slate-50 transition-colors group">
                       <td className="p-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                                {staff.name.charAt(0)}
                             </div>
                             <div>
                                <p className="text-slate-900">{staff.name}</p>
                                <p className="text-[9px] text-slate-400 uppercase italic font-bold tracking-widest">{staff.role}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-8">
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-[9px] font-black">{staff.dept}</span>
                       </td>
                       <td className="p-8 italic font-black">₹{staff.salary.toLocaleString()}</td>
                       <td className="p-8 font-bold text-slate-400">{staff.date}</td>
                       <td className="p-8">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                            staff.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                          )}>
                             {staff.status}
                          </span>
                       </td>
                       <td className="p-8 text-right">
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                             <ArrowRight className="w-4 h-4" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-center">
            <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-all">Load Full Roster (42 Staff)</button>
         </div>
      </div>

      {/* ── Compliance Bench ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Deduction Index</h3>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">EPF / PT / TDS Distribution</p>
               </div>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
               </div>
            </div>
            <div className="space-y-6 relative z-10">
               {[
                 { label: 'Provident Fund (EPF)', value: '₹42,500', pct: 12 },
                 { label: 'Prof. Tax (PT)', value: '₹8,400', pct: 2 },
                 { label: 'TDS (Income Tax)', value: '₹1,28,000', pct: 86 },
               ].map((d, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-white/60">{d.label}</span>
                        <span>{d.value}</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${d.pct}%` }} />
                     </div>
                  </div>
               ))}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px]" />
         </div>
         <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Compliance Status</h3>
               <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Verified</span>
            </div>
            <div className="my-10 space-y-4">
               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-emerald-500/30 group">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <div>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">EPF Submission (May)</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 italic">Acknowledgement Recv.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-emerald-500/30 group">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <div>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Form 24Q Filing</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 italic">Quarterly Compliance OK</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
                  <Ban className="w-5 h-5 text-slate-300" />
                  <div>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">ESIC Contribution</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 italic">Awaiting Payment Link</p>
                  </div>
               </div>
            </div>
            <button className="w-full py-4 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all">Audit Portal Access</button>
         </div>
      </div>
    </div>
  );
};
