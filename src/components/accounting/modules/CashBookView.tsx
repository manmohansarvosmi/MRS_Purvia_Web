import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Printer, Download, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { accountsApi } from '@/src/lib/api';
import { format } from 'date-fns';

export const CashBookView = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      accountsApi.getAllTransactions(),
      accountsApi.getAllLedgers()
    ]).then(([txnRes, ledgerRes]) => {
      if (txnRes.status === 1) setTransactions(txnRes.data || []);
      if (ledgerRes.status === 1) setLedgers(ledgerRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cashLedgerIds = useMemo(() => {
    if (!Array.isArray(ledgers)) return [];
    return ledgers.filter(l => ['CASH', 'BANK'].includes(l.category?.toUpperCase())).map((l: any) => l.id);
  }, [ledgers]);

  const dayEntries = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => {
      const txnDate = t.transactionDate ? format(new Date(t.transactionDate), 'yyyy-MM-dd') : '';
      const isCash = cashLedgerIds.includes(t.debitLedger?.id) || cashLedgerIds.includes(t.creditLedger?.id);
      return txnDate === selectedDate && isCash;
    });
  }, [transactions, selectedDate, cashLedgerIds]);

  const receipts = dayEntries.filter(t => cashLedgerIds.includes(t.debitLedger?.id));
  const payments = dayEntries.filter(t => cashLedgerIds.includes(t.creditLedger?.id));
  const totalReceipts = receipts.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalPayments = payments.reduce((s, t) => s + Number(t.amount || 0), 0);

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
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="flex items-center gap-4">
          <div>
            <h2>Cash Book</h2>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Daily Liquid Asset Registry</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded ml-4">
            <button onClick={() => changeDay(-1)} className="p-1 hover:bg-white rounded transition-all text-slate-400 hover:text-slate-900">
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-2 px-2">
              <Calendar size={12} className="text-slate-400" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#374151' }}
              />
            </div>
            <button onClick={() => changeDay(1)} className="p-1 hover:bg-white rounded transition-all text-slate-400 hover:text-slate-900">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary"><Download size={12} /> Export</button>
          <button className="btn-secondary"><Printer size={12} /> Print Book</button>
        </div>
      </div>

      {/* ── Balance Summary ── */}
      <div className="flex items-center gap-10 px-5 py-4 shrink-0" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        {[
          { label: 'Opening Balance', value: openingBalance },
          { label: 'Day Receipts (+)', value: totalReceipts, color: '#059669' },
          { label: 'Day Payments (-)', value: totalPayments, color: '#DC2626' },
          { label: 'Closing Balance', value: closingBalance, highlight: true },
        ].map((s, i) => (
          <div key={i}>
            <p className="erp-label !mb-1">{s.label}</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: s.highlight ? '#C8102E' : s.color || '#111827' }}>
              ₹{Math.abs(s.value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ── Data Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Time</th>
              <th>Particulars / Ledger Narrative</th>
              <th style={{ width: 120 }}>Voucher No</th>
              <th style={{ textAlign: 'right', width: 130 }}>Receipt (DR)</th>
              <th style={{ textAlign: 'right', width: 130 }}>Payment (CR)</th>
              <th style={{ width: 100, textAlign: 'center' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0' }}>
                   <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin" color="#C8102E" />
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Consolidating Ledger...</span>
                  </div>
                </td>
              </tr>
            ) : dayEntries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 12 }}>
                  No cash transactions found for {format(new Date(selectedDate), 'dd MMM yyyy')}.
                </td>
              </tr>
            ) : dayEntries.map((entry) => {
              const isReceipt = cashLedgerIds.includes(entry.debitLedger?.id);
              return (
                <tr key={entry.id}>
                  <td style={{ fontSize: 11, color: '#9CA3AF' }}>{entry.transactionDate ? format(new Date(entry.transactionDate), 'hh:mm a') : '—'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isReceipt ? '#059669' : '#DC2626' }} />
                      <span style={{ fontWeight: 500, color: '#111827' }}>
                         {entry.description || (isReceipt ? `From: ${entry.creditLedger?.name}` : `To: ${entry.debitLedger?.name}`)}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF' }}>{entry.transactionNumber || '-'}</td>
                  <td style={{ textAlign: 'right', color: '#059669', fontWeight: 700 }}>
                    {isReceipt ? `₹${Number(entry.amount || 0).toLocaleString()}` : '—'}
                  </td>
                  <td style={{ textAlign: 'right', color: '#DC2626', fontWeight: 700 }}>
                    {!isReceipt ? `₹${Number(entry.amount || 0).toLocaleString()}` : '—'}
                  </td>
                  <td>
                     <span className={cn("badge", isReceipt ? 'badge-success' : 'badge-danger')} style={{ width: '100%', justifyContent: 'center' }}>
                        {entry.referenceType || 'JV'}
                     </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer Summary ── */}
      <div className="px-5 py-4 shrink-0 flex items-center justify-between" style={{ background: '#1E2330', borderTop: '1px solid #2D3347', color: '#fff' }}>
        <div className="flex items-center gap-10">
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Daily Receipts</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>₹{totalReceipts.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Daily Payments</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#F87171' }}>₹{totalPayments.toLocaleString()}</p>
          </div>
          <div style={{ width: 1, height: 30, background: '#2D3347' }} />
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Physical Closing</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>₹{closingBalance.toLocaleString()}</p>
          </div>
        </div>
        <p style={{ fontSize: 10, color: '#C8102E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Helixion Live Ledger</p>
      </div>
    </div>
  );
};
