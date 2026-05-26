import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, Search, Printer, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { accountsApi } from '@/src/lib/api';
import { format, parseISO } from 'date-fns';

export const CashBookView = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    Promise.all([
      accountsApi.getAllTransactions(),
      accountsApi.getAllLedgers()
    ]).then(([txnRes, ledgerRes]) => {
      if (txnRes.status === 1) setTransactions(txnRes.data);
      if (ledgerRes.status === 1) setLedgers(ledgerRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Filter cash / bank ledger IDs
  const cashLedgerIds = useMemo(() =>
    ledgers.filter(l => ['CASH', 'BANK'].includes(l.category?.toUpperCase())).map((l: any) => l.id),
    [ledgers]
  );

  // Filter by selected date and cash ledger involvement
  const dayEntries = useMemo(() => transactions.filter(t => {
    const txnDate = t.transactionDate ? format(new Date(t.transactionDate), 'yyyy-MM-dd') : '';
    const isCash = cashLedgerIds.includes(t.debitLedger?.id) || cashLedgerIds.includes(t.creditLedger?.id);
    return txnDate === selectedDate && isCash;
  }), [transactions, selectedDate, cashLedgerIds]);

  // Running balance calculations
  const receipts = dayEntries.filter(t => cashLedgerIds.includes(t.debitLedger?.id));
  const payments = dayEntries.filter(t => cashLedgerIds.includes(t.creditLedger?.id));
  const totalReceipts = receipts.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalPayments = payments.reduce((s, t) => s + Number(t.amount || 0), 0);

  // Previous day opening balance (sum of all prior transactions)
  const priorTransactions = useMemo(() => transactions.filter(t => {
    const txnDate = t.transactionDate ? format(new Date(t.transactionDate), 'yyyy-MM-dd') : '';
    return txnDate < selectedDate && (cashLedgerIds.includes(t.debitLedger?.id) || cashLedgerIds.includes(t.creditLedger?.id));
  }), [transactions, selectedDate, cashLedgerIds]);

  const openingBalance = priorTransactions.reduce((s, t) => {
    if (cashLedgerIds.includes(t.debitLedger?.id)) return s + Number(t.amount || 0);
    if (cashLedgerIds.includes(t.creditLedger?.id)) return s - Number(t.amount || 0);
    return s;
  }, 0);

  const closingBalance = openingBalance + totalReceipts - totalPayments;

  const changeDay = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(format(d, 'yyyy-MM-dd'));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase">Cash Book</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Real-time recording of daily cash flow</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-widest leading-none">Excel</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-slate-600 text-[9px] font-bold uppercase tracking-widest transition-all leading-none">PDF</button>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Opening Bal.', value: openingBalance, color: 'slate' },
          { label: 'Receipts (+)', value: totalReceipts, color: 'emerald' },
          { label: 'Payments (-)', value: totalPayments, color: 'rose' },
          { label: 'Closing Bal.', value: closingBalance, color: 'primary' },
        ].map((box, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{box.label}</p>
            <h4 className={cn("text-base font-black italic",
              box.color === 'emerald' ? "text-emerald-600" :
              box.color === 'rose' ? "text-rose-600" :
              box.color === 'primary' ? "text-primary" : "text-slate-900"
            )}>₹{Math.abs(box.value).toLocaleString()}</h4>
          </div>
        ))}
      </div>

      {/* Cash Book Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <button onClick={() => changeDay(-1)} className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                className="text-[10px] font-bold text-slate-700 uppercase tracking-widest bg-transparent outline-none border-none" />
            </div>
            <button onClick={() => changeDay(1)} className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[8px] font-bold tracking-widest">
                <th className="p-4 border-r border-slate-800">Time</th>
                <th className="p-4 border-r border-slate-800">Particulars</th>
                <th className="p-4 border-r border-slate-800">Voucher No</th>
                <th className="p-4 border-r border-slate-800 text-right">Receipt (Dr)</th>
                <th className="p-4 border-r border-slate-800 text-right">Payment (Cr)</th>
                <th className="p-4 text-right">Type</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold text-slate-700 uppercase tracking-tight divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-[9px] uppercase tracking-widest">Loading Cash Book...</span>
                  </div>
                </td></tr>
              ) : dayEntries.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-[9px] text-slate-400 uppercase tracking-widest italic">
                  No cash transactions for {format(new Date(selectedDate), 'dd MMM yyyy')}
                </td></tr>
              ) : dayEntries.map((entry, idx) => {
                const isReceipt = cashLedgerIds.includes(entry.debitLedger?.id);
                return (
                  <tr key={entry.id} className={cn("hover:bg-slate-50/50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-slate-50/20")}>
                    <td className="p-4 border-r border-slate-100 text-slate-400 font-medium">
                      {entry.transactionDate ? format(new Date(entry.transactionDate), 'hh:mm a') : '—'}
                    </td>
                    <td className="p-4 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", isReceipt ? "bg-emerald-500" : "bg-rose-500")} />
                        {entry.description || (isReceipt ? `From: ${entry.creditLedger?.name}` : `To: ${entry.debitLedger?.name}`)}
                      </div>
                    </td>
                    <td className="p-4 border-r border-slate-100 text-[9px] text-slate-400 font-mono tracking-widest">{entry.transactionNumber || '—'}</td>
                    <td className="p-4 border-r border-slate-100 text-right text-emerald-600 italic">
                      {isReceipt ? `₹${Number(entry.amount || 0).toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 border-r border-slate-100 text-right text-rose-600 italic">
                      {!isReceipt ? `₹${Number(entry.amount || 0).toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase",
                        isReceipt ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>{entry.referenceType || 'JOURNAL'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-slate-900 flex justify-between items-center text-white border-t border-slate-800">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">Daily Receipts</p>
              <p className="text-lg font-black text-emerald-400">₹{totalReceipts.toLocaleString()}</p>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">Daily Payments</p>
              <p className="text-lg font-black text-rose-400">₹{totalPayments.toLocaleString()}</p>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">Closing Balance</p>
              <p className="text-lg font-black text-white">₹{closingBalance.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold text-primary uppercase italic">Live Sync Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
