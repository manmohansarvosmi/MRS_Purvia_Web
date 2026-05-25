import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  Plus,
  BookOpen,
  PieChart,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Filter,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AccountManager } from './modules/AccountManager';
import { LedgerDirectory } from './modules/LedgerDirectory';
import { CashBookView } from './modules/CashBookView';
import { DayBookView } from './modules/DayBookView';
import { VoucherEntryForm } from './modules/VoucherEntryForm';
import { ExpenseModule } from './modules/ExpenseModule';
import { IncomeModule } from './modules/IncomeModule';

type AccountingTab = 'accounts' | 'ledger' | 'cashbook' | 'daybook' | 'vouchers' | 'expenses' | 'income' | 'balance-sheet' | 'profit-loss' | 'trial-balance';

interface LedgerEngineProps {
  initialTab?: string;
}

export const LedgerEngine = ({ initialTab }: LedgerEngineProps) => {
  const [activeTab, setActiveTab] = useState<AccountingTab>((initialTab as AccountingTab) || 'accounts');

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab as AccountingTab);
  }, [initialTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts': return <AccountManager />;
      case 'ledger': return <LedgerDirectory />;
      case 'cashbook': return <CashBookView />;
      case 'daybook': return <DayBookView />;
      case 'vouchers': return <VoucherEntryForm />;
      case 'expenses': return <ExpenseModule />;
      case 'income': return <IncomeModule />;
      case 'trial-balance': return <TrialBalanceView />;
      case 'profit-loss': return <ProfitLossView />;
      case 'balance-sheet': return <BalanceSheetView />;
      default: return <AccountManager />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
      {/* ── Sub Navigation ────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {[
            { id: 'accounts', label: 'Accounts', icon: CreditCard },
            { id: 'ledger', label: 'Ledger Registry', icon: BookOpen },
            { id: 'cashbook', label: 'Cash Book', icon: Banknote },
            { id: 'daybook', label: 'Day Book', icon: History },
            { id: 'vouchers', label: 'Voucher Entry', icon: ArrowRightLeft },
            { id: 'expenses', label: 'Expenses', icon: TrendingDown },
            { id: 'income', label: 'Income', icon: TrendingUp },
            { id: 'trial-balance', label: 'Trial Balance', icon: Filter },
            { id: 'profit-loss', label: 'Profit & Loss', icon: PieChart },
            { id: 'balance-sheet', label: 'Balance Sheet', icon: CircleDollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AccountingTab)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all",
                activeTab === tab.id 
                  ? "bg-primary/5 text-primary font-bold shadow-[inset_0_0_0_1px_rgba(203,12,31,0.1)]" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
              <span className="text-[10px] uppercase font-bold tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-4">
        <div className="w-full mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// ── Placeholder Views (Compacted) ───────────────────────────────────

const TrialBalanceView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900 uppercase">Trial Balance</h3>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200">FY 2026-27</div>
    </div>
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest">
          <tr>
            <th className="p-4">Account Particulars</th>
            <th className="p-4 text-right">Debit (Dr)</th>
            <th className="p-4 text-right">Credit (Cr)</th>
          </tr>
        </thead>
        <tbody className="text-[11px] font-bold text-slate-700 divide-y divide-slate-50 uppercase">
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="p-4">Example Ledger Item {i}</td>
              <td className="p-4 text-right">₹{i*10000}</td>
              <td className="p-4 text-right">-</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50/50 text-[11px] font-black italic">
          <tr>
            <td className="p-4 text-primary font-bold">Consolidated Total</td>
            <td className="p-4 text-right text-primary">₹1,50,000</td>
            <td className="p-4 text-right text-primary">₹1,50,000</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

const ProfitLossView = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="text-center space-y-2">
       <h1 className="text-xl font-bold uppercase tracking-widest text-slate-900 italic">Profit & Loss Statement</h1>
       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Generated for Fiscal Period May 2026</p>
    </div>
    <div className="grid grid-cols-2 gap-6">
       <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-[10px] font-bold text-rose-500 uppercase mb-4 border-b border-rose-50 pb-2">Trading Expenses</h4>
          <div className="space-y-3">
             <div className="flex justify-between text-[11px] font-bold text-slate-600"><span>Purchases</span> <span>₹2.4L</span></div>
             <div className="flex justify-between text-[11px] font-bold text-slate-600"><span>Direct Wages</span> <span>₹1.2L</span></div>
          </div>
       </div>
       <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-[10px] font-bold text-emerald-500 uppercase mb-4 border-b border-emerald-50 pb-2">Revenue Streams</h4>
          <div className="space-y-3">
             <div className="flex justify-between text-[11px] font-bold text-slate-600"><span>Net Sales</span> <span>₹8.5L</span></div>
             <div className="flex justify-between text-[11px] font-bold text-slate-600"><span>Closing Stock</span> <span>₹1.5L</span></div>
          </div>
       </div>
    </div>
    <div className="bg-slate-900 rounded-xl p-5 text-center shadow-lg">
       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Calculated Net Profit</p>
       <p className="text-2xl font-black text-emerald-400 italic">₹4,40,000.00</p>
    </div>
  </div>
);

const BalanceSheetView = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
       <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
             <h2 className="text-base font-bold italic uppercase tracking-widest">Balance Sheet</h2>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Provisional Summary</p>
          </div>
          <CircleDollarSign className="w-8 h-8 text-primary" />
       </div>
       <div className="grid grid-cols-2 divide-x divide-slate-100">
          <div className="p-6">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Liabilities</h4>
             <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase"><span>Capital Account</span> <span>15.0L</span></div>
                <div className="flex justify-between text-[11px] font-bold uppercase"><span>Loans (Liability)</span> <span>5.5L</span></div>
             </div>
          </div>
          <div className="p-6">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Assets</h4>
             <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase"><span>Fixed Assets</span> <span>12.5L</span></div>
                <div className="flex justify-between text-[11px] font-bold uppercase"><span>Current Assets</span> <span>8.0L</span></div>
             </div>
          </div>
       </div>
       <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center px-10">
          <p className="text-[11px] font-black italic">Total Magnitude</p>
          <p className="text-lg font-black italic text-primary">₹20,50,000.00</p>
       </div>
    </div>
  </div>
);
