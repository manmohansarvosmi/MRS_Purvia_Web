import React, { useState } from 'react';
import { 
  Users, Plus, Search, TrendingUp, Briefcase, Clock, CreditCard, 
  FileText, Download, AlertCircle, CheckCircle2, Filter, 
  ArrowRight, ShieldCheck, Ban, RefreshCw, Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const payrollStats = [
  { label: 'Personnel Nodes', value: '42 Units', color: '#1E2330' },
  { label: 'Fiscal Liability', value: '₹12.4L', color: '#059669' },
  { label: 'Pending Approvals', value: '03', color: '#D97706' },
  { label: 'Tax Deductions', value: '₹1.8L', color: '#DC2626' },
];

const staffList = [
  { id: '1', name: 'Arjun Sharma', role: 'Sr. Engineer', dept: 'Tech', salary: 85000, status: 'Paid', date: '25 May' },
  { id: '2', name: 'Neha Gupta', role: 'Marketing Lead', dept: 'Sales', salary: 62000, status: 'Processing', date: '25 May' },
  { id: '3', name: 'Rahul Verma', role: 'Operations Mgr', dept: 'Ops', salary: 55000, status: 'Paid', date: '25 May' },
];

export const PayrollModule = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white h-full">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-[5px] w-8 h-8">
            <CreditCard size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Financial Payroll Engine</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Commercial Disbursement Ledger & Compliance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
            <FileText size={11} /> Bulk Generate
          </button>
          <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            <Plus size={13} /> Initiate Fiscal Cycle
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        {payrollStats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && <div className="w-px h-6 bg-slate-200" />}
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
              <p className="text-[14px] font-black italic" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </React.Fragment>
        ))}
        <div className="ml-auto flex items-center gap-2">
           <div className="search-bar w-56">
             <Search size={11} className="text-slate-400" />
             <input 
               placeholder="Filter personnel..." 
               value={search} 
               onChange={e => setSearch(e.target.value)} 
               className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" 
             />
           </div>
        </div>
      </div>

      {/* ── Main Data View ── */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-6">
        
        {/* Active Roll Table */}
        <div className="bg-white border border-slate-200 rounded-[5px] shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white">
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Identity Disbursement Registry</p>
             <button className="h-6 px-3 bg-slate-50 border border-slate-200 text-[8.5px] font-black uppercase rounded-[3px] hover:bg-slate-900 hover:text-white transition-all"><Filter size={10} /> Filter</button>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-[200px]">Personnel Identifying Node</th>
                <th className="w-[120px]">Deployment Unit</th>
                <th>Monthly CTC (INR)</th>
                <th>Temporal Cycle</th>
                <th className="text-center">Verification Status</th>
                <th className="text-right w-[100px]">Operational Links</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[5px] bg-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight mb-1 leading-none">{staff.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-[3px] italic">{staff.dept}</span>
                  </td>
                  <td className="font-mono text-[11px] font-black italic">₹{staff.salary.toLocaleString()}</td>
                  <td className="text-[10px] font-bold text-slate-500 uppercase">{staff.date} Node</td>
                  <td className="text-center">
                    <span className={cn(
                      "badge inline-flex items-center justify-center px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest border min-w-[90px] rounded-[3px]",
                      staff.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                    )}>
                      {staff.status === 'Paid' ? 'VERIFIED' : 'PENDING SYNC'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-200 rounded-[5px] hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                         <Download size={12} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center bg-primary text-white border border-primary rounded-[5px] hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                         <ArrowRight size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Units: 42 personnel</p>
             <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-all">LOAD EXTENDED ROSTER</button>
          </div>
        </div>

        {/* Analytics & Compliance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
           {/* Deduction Index */}
           <div className="bg-slate-900 rounded-[5px] border border-slate-800 p-5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] italic text-white flex items-center gap-2">
                       <ShieldCheck size={14} className="text-emerald-400" /> Deduction Metric Matrix
                    </h3>
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">EPF / PT / TDS Logical Distribution</p>
                 </div>
              </div>
              <div className="space-y-4 relative z-10">
                 {[
                   { label: 'Provident Fund (EPF)', value: '₹42,500', pct: 12 },
                   { label: 'Prof. Tax (PT)', value: '₹8,400', pct: 2 },
                   { label: 'TDS (Income Tax)', value: '₹1,28,000', pct: 86 },
                 ].map((d, i) => (
                    <div key={i} className="space-y-1.5">
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className="text-white/50">{d.label}</span>
                          <span className="text-white">{d.value}</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${d.pct}%` }} 
                            className="h-full bg-primary" 
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                       </div>
                    </div>
                 ))}
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />
           </div>

           {/* Compliance Audit */}
           <div className="bg-white rounded-[5px] border border-slate-200 p-5 shadow-sm flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-2">
                 <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Verification Audit Logs</h3>
                 <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-emerald-100 rounded-[3px]">Protocol Status: OK</span>
              </div>
              <div className="space-y-2 mb-6">
                 {[
                   { label: 'EPF REGISTRY (MAY)', status: 'SYNC SUCCESS', icon: CheckCircle2, color: 'text-emerald-500' },
                   { label: 'FORM 24Q FILING', status: 'QUARTER OK', icon: CheckCircle2, color: 'text-emerald-500' },
                   { label: 'ESIC CONTRIBUTION', status: 'GATEWAY PENDING', icon: Ban, color: 'text-slate-300' },
                 ].map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-[4px] border border-slate-100 hover:border-slate-300 transition-all cursor-pointer">
                       <div className="w-8 h-8 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <c.icon size={13} className={c.color} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{c.label}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">{c.status}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="btn-secondary w-full h-8 text-[9px] font-black uppercase rounded-[5px] shadow-sm">View Full Regulatory Audit Hub</button>
           </div>
        </div>
      </div>

      {/* ── Fixed Footer ── */}
      <div className="h-[38px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Secure Fiscal Payload Transmission — Cycle Node: ACTIVE
        </p>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Compliance Sync Online</span>
        </div>
      </div>
    </div>
  );
};
