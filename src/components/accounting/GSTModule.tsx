import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck,
  Calendar,
  PieChart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const GSTModule = () => {
  const [activeReport, setActiveReport] = useState('gstr1');

  const renderReportContent = () => {
    switch (activeReport) {
      case 'gstr1':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">R1</div>
                  <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">GSTR-1: Outward Supplies</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Sales Liability for May 2026</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 italic tracking-tighter">₹4,25,000.00</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Total GST Liability</p>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Invoice Type</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Taxable Value</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">IGST</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">CGST</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">SGST</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[
                        { type: 'B2B Invoices', value: 1240000, igst: 145000, cgst: 39100, sgst: 39100 },
                        { type: 'B2C (Large)', value: 450000, igst: 81000, cgst: 0, sgst: 0 },
                        { type: 'B2C (Small)', value: 89000, igst: 0, cgst: 8010, sgst: 8010 },
                        { type: 'Credit/Debit Notes', value: -12000, igst: -2160, cgst: 0, sgst: 0 },
                     ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 text-sm font-black text-slate-900 uppercase tracking-tight">{row.type}</td>
                           <td className="px-8 py-6 text-right font-black text-slate-600 text-sm">₹{row.value.toLocaleString()}</td>
                           <td className="px-8 py-6 text-right font-black text-slate-900 text-sm italic">₹{row.igst.toLocaleString()}</td>
                           <td className="px-8 py-6 text-right font-black text-slate-400 text-sm">₹{row.cgst.toLocaleString()}</td>
                           <td className="px-8 py-6 text-right font-black text-slate-400 text-sm">₹{row.sgst.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        );
      case 'gstr3b':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                   <ArrowUpRight className="w-5 h-5 text-rose-500" />
                   Outward Tax Liability
                </h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-600">Total Tax Payable</span>
                      <span className="text-lg font-black text-slate-900">₹4,25,000</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-600">Late Fee / Interest</span>
                      <span className="text-lg font-black text-rose-500">₹0.00</span>
                   </div>
                </div>
             </div>
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                   <ArrowDownRight className="w-5 h-5 text-emerald-500" />
                   Input Tax Credit (ITC)
                </h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-600">Eligible ITC</span>
                      <span className="text-lg font-black text-slate-900">₹3,12,450</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-600">ITC Reversed</span>
                      <span className="text-lg font-black text-rose-500">₹0.00</span>
                   </div>
                </div>
             </div>
             <div className="md:col-span-2 bg-slate-900 p-12 rounded-[3rem] text-white flex items-center justify-between shadow-2xl">
                <div>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Net GST Payable (Cash)</p>
                   <h2 className="text-5xl font-black italic tracking-tighter">₹1,12,550.00</h2>
                </div>
                <button className="px-10 py-5 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                   Generate JSON for Filing
                </button>
             </div>
          </div>
        );
      case 'hsn':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">HSN Code</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Description</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">UQC</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Total Qty</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Taxable Value</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {[
                      { code: '8541', desc: 'Solar Photovoltaic Cells', uqc: 'PCS', qty: 1200, value: 4500000 },
                      { code: '8504', desc: 'Static Converters (Inverters)', uqc: 'PCS', qty: 45, value: 1250000 },
                      { code: '7308', desc: 'Structure of Iron/Steel', uqc: 'KGS', qty: 5400, value: 890000 },
                   ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6 text-sm font-black text-slate-900 italic">#{row.code}</td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{row.desc}</td>
                         <td className="px-8 py-6 text-right text-[10px] font-black text-slate-400">{row.uqc}</td>
                         <td className="px-8 py-6 text-right font-black text-slate-900 text-sm">{row.qty.toLocaleString()}</td>
                         <td className="px-8 py-6 text-right font-black text-slate-900 text-sm italic">₹{row.value.toLocaleString()}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* GST Header */}
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
             </div>
             GST Compliance & Returns
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Government Filing & Tax Reconciliation Engine</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Calendar className="w-4 h-4 text-primary" /> May 2026
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
             <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="px-8 bg-transparent flex items-center gap-10 overflow-x-auto no-scrollbar shrink-0 mt-4">
        {[
          { id: 'gstr1', label: 'GSTR-1 (Sales)', icon: ArrowUpRight },
          { id: 'gstr3b', label: 'GSTR-3B (Summary)', icon: PieChart },
          { id: 'hsn', label: 'HSN Summary', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] py-4 transition-all relative group",
              activeReport === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon className={cn("w-4 h-4 transition-colors", activeReport === tab.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500")} />
            {tab.label}
            {activeReport === tab.id && (
              <motion.div layoutId="active-gst-tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(178,0,26,0.3)]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {renderReportContent()}
      </div>

    </div>
  );
};
