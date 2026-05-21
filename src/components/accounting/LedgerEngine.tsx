import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Calendar,
  History,
  Scale,
  TrendingUp,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const ledgerEntries = [
  { id: '1', date: '14 May', particular: 'Sales to Kumar Electronics', voucherType: 'Sales', debit: 45000, credit: 0, balance: 1570200 },
  { id: '2', date: '14 May', particular: 'Payment to Tata Solar', voucherType: 'Payment', debit: 0, credit: 12000, balance: 1525200 },
  { id: '3', date: '13 May', particular: 'Cash deposited in HDFC', voucherType: 'Contra', debit: 0, credit: 10000, balance: 1537200 },
  { id: '4', date: '12 May', particular: 'Service Charge Received', voucherType: 'Receipt', debit: 2500, credit: 0, balance: 1547200 },
];

const DayBookView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between px-2">
       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Daily Transaction Register</h3>
       <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">14 May 2026</span>
    </div>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
       <table className="w-full text-left border-collapse">
          <thead>
             <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Voucher No</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Account Particulars</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Type</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Debit</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Credit</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { id: 'V-001', account: 'Cash Account', type: 'Receipt', debit: 45000, credit: 0 },
               { id: 'V-002', account: 'Sharma Electronics', type: 'Sales', debit: 12000, credit: 0 },
               { id: 'V-003', account: 'HDFC Bank', type: 'Contra', debit: 0, credit: 10000 },
             ].map((row, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-black text-slate-900 text-xs italic">{row.id}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tight">{row.account}</td>
                  <td className="px-8 py-5">
                     <span className="px-2 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-500 uppercase">{row.type}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-emerald-600 text-sm">{row.debit > 0 ? `₹${row.debit.toLocaleString()}` : '—'}</td>
                  <td className="px-8 py-5 text-right font-black text-rose-600 text-sm">{row.credit > 0 ? `₹${row.credit.toLocaleString()}` : '—'}</td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

const TrialBalanceView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {['Capital Accounts', 'Current Assets', 'Current Liabilities', 'Fixed Assets'].map((group, i) => (
      <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
         <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">{group}</h4>
         <div className="space-y-4">
            {[1, 2].map(item => (
              <div key={item} className="flex justify-between items-center pb-4 border-b border-slate-50">
                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Account Name {item}</span>
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900 italic">₹4,50,000</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Debit Balance</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    ))}
  </div>
);

const ProfitLossView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       {/* Income */}
       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Revenue & Income</h3>
          </div>
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 uppercase">Sales Accounts</span>
                <span className="text-lg font-black text-slate-900 italic">₹42,50,000</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 uppercase">Interest Earned</span>
                <span className="text-lg font-black text-slate-900 italic">₹12,400</span>
             </div>
             <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase">Total Income</span>
                <span className="text-2xl font-black text-emerald-600 italic">₹42,62,400</span>
             </div>
          </div>
       </div>
       {/* Expense */}
       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><ArrowDownRight className="w-5 h-5" /></div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Direct & Indirect Expenses</h3>
          </div>
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 uppercase">Purchase Accounts</span>
                <span className="text-lg font-black text-slate-900 italic">₹28,40,000</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 uppercase">Operating Expenses</span>
                <span className="text-lg font-black text-slate-900 italic">₹4,20,000</span>
             </div>
             <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase">Total Expense</span>
                <span className="text-2xl font-black text-rose-600 italic">₹32,60,000</span>
             </div>
          </div>
       </div>
    </div>
    
    <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-slate-900/20">
       <div className="space-y-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Operational Performance</p>
          <h4 className="text-4xl font-black italic tracking-tighter">Net Profit: ₹10,02,400</h4>
       </div>
       <div className="mt-6 md:mt-0 px-8 py-3 bg-white/10 rounded-2xl border border-white/20 text-emerald-400 font-black text-xs uppercase italic animate-pulse">
          Exceeding Quarterly Targets
       </div>
    </div>
  </div>
);

const BalanceSheetView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 border-b border-slate-50 pb-6">Liabilities</h3>
        <div className="space-y-8">
           <div className="space-y-4">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">Capital Accounts</p>
              <div className="flex justify-between font-black text-slate-900 italic text-sm"><span>Partners Capital</span><span>₹50,00,000</span></div>
           </div>
           <div className="space-y-4">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">Current Liabilities</p>
              <div className="flex justify-between font-black text-slate-900 italic text-sm"><span>Sundry Creditors</span><span>₹17,40,200</span></div>
           </div>
        </div>
        <div className="mt-20 pt-8 border-t-4 border-slate-900 flex justify-between items-center">
           <span className="text-lg font-black text-slate-900 uppercase">Total</span>
           <span className="text-2xl font-black text-slate-900 italic">₹67,40,200</span>
        </div>
     </div>
     <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 border-b border-slate-50 pb-6">Assets</h3>
        <div className="space-y-8">
           <div className="space-y-4">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">Fixed Assets</p>
              <div className="flex justify-between font-black text-slate-900 italic text-sm"><span>Property & Machinery</span><span>₹47,00,000</span></div>
           </div>
           <div className="space-y-4">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">Current Assets</p>
              <div className="flex justify-between font-black text-slate-900 italic text-sm"><span>Cash & Bank</span><span>₹20,40,200</span></div>
           </div>
        </div>
        <div className="mt-20 pt-8 border-t-4 border-slate-900 flex justify-between items-center">
           <span className="text-lg font-black text-slate-900 uppercase">Total</span>
           <span className="text-2xl font-black text-slate-900 italic">₹67,40,200</span>
        </div>
     </div>
  </div>
);

export const LedgerEngine = () => {
  const [activeReport, setActiveReport] = useState('ledger');

  const renderReport = () => {
    switch (activeReport) {
      case 'ledger':
        return (
          <div className="w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                     <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  Main Cash Ledger
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">FY 2026-27 • April 1 to May 14</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                  <Calendar className="w-4 h-4 text-primary" /> Period
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Opening Balance', value: '₹12,40,200', color: 'slate', icon: Wallet },
                { label: 'Total Debit (+)', value: '₹4,50,000', color: 'emerald', icon: ArrowUpRight },
                { label: 'Total Credit (-)', value: '₹1,20,000', color: 'rose', icon: ArrowDownRight }
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all">
                  <div className={cn("absolute top-0 left-0 w-1.5 h-full", card.color === 'emerald' ? "bg-emerald-500" : card.color === 'rose' ? "bg-rose-500" : "bg-slate-900")} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{card.label}</p>
                  <h3 className={cn("text-2xl font-black tracking-tight", card.color === 'emerald' ? "text-emerald-600" : card.color === 'rose' ? "text-rose-600" : "text-slate-900")}>{card.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Particulars</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Debit</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Credit</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ledgerEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 text-sm font-bold text-slate-500">{entry.date}</td>
                        <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tight">{entry.particular}</td>
                        <td className="px-8 py-5"><span className="px-2 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-500 uppercase">{entry.voucherType}</span></td>
                        <td className="px-8 py-5 text-sm font-black text-emerald-600 italic">{entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '—'}</td>
                        <td className="px-8 py-5 text-sm font-black text-rose-600 italic">{entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '—'}</td>
                        <td className="px-8 py-5 text-right font-black text-slate-900 italic">₹{entry.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          </div>
        );
      case 'daybook': return <DayBookView />;
      case 'trial': return <TrialBalanceView />;
      case 'pl': return <ProfitLossView />;
      case 'balance': return <BalanceSheetView />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      <div className="px-8 bg-white border-b border-slate-100 flex items-center gap-10 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'ledger', label: 'General Ledger', icon: BookOpen },
          { id: 'daybook', label: 'Day Book', icon: History },
          { id: 'trial', label: 'Trial Balance', icon: Scale },
          { id: 'pl', label: 'Profit & Loss', icon: TrendingUp },
          { id: 'balance', label: 'Balance Sheet', icon: Wallet },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] py-5 transition-all relative group",
              activeReport === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon className={cn("w-4 h-4 transition-colors", activeReport === tab.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500")} />
            {tab.label}
            {activeReport === tab.id && (
              <motion.div layoutId="active-ledger-tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(178,0,26,0.3)]" />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {renderReport()}
      </div>
    </div>
  );
};
