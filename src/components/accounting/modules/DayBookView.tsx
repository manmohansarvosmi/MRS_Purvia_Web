import React, { useState, useEffect } from 'react';
import { 
  History, Search, Loader2, ArrowUpRight, ArrowDownRight, Repeat, ShoppingCart, CreditCard, FileText, Download, Filter
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { accountsApi } from '@/src/lib/api';
import { format } from 'date-fns';

export const DayBookView = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    accountsApi.getAllTransactions()
      .then(res => { 
        if (res.status === 1) setTransactions(res.data || []); 
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'RECEIPT': return <ArrowUpRight size={13} color="#059669" />;
      case 'PAYMENT': return <ArrowDownRight size={13} color="#DC2626" />;
      case 'CONTRA': case 'TRANSFER': return <Repeat size={13} color="#2563EB" />;
      case 'SALES': return <ShoppingCart size={13} color="#C8102E" />;
      case 'PURCHASE': return <CreditCard size={13} color="#D97706" />;
      default: return <FileText size={13} color="#64748B" />;
    }
  };

  const filtered = transactions.filter(e =>
    (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.transactionNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2>Day Book</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Chronological Transaction Timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar">
            <Search />
            <input 
              placeholder="Search by ID, Ledger..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
          <button className="btn-secondary">
            <Filter size={12} /> Filter
          </button>
          <button className="btn-secondary">
            <Download size={12} /> export
          </button>
        </div>
      </div>

      {/* ── Summary Bar ── */}
      <div className="flex items-center gap-10 px-5 py-3 shrink-0" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <p className="erp-label !mb-1">Total Entries</p>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{filtered.length}</p>
        </div>
        <div>
          <p className="erp-label !mb-1">Aggregate Volume</p>
          <p style={{ fontSize: 14, fontWeight: 700 }}>₹{filtered.reduce((s,t) => s + (t.amount || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* ── Data View (Uniform Table) ── */}
      <div className="flex-1 overflow-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: 150 }}>Timestamp</th>
              <th style={{ width: 120 }}>Voucher No.</th>
              <th style={{ width: 100 }}>Type</th>
              <th>Description / Narrative</th>
              <th>Debit Account</th>
              <th>Credit Account</th>
              <th style={{ textAlign: 'right', width: 120 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0' }}>
                   <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin" color="#C8102E" />
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Synchronizing Timeline...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 12 }}>
                  No transactions recorded for the selected period.
                </td>
              </tr>
            ) : filtered.map((entry) => (
              <tr key={entry.id}>
                <td style={{ fontSize: 11, color: '#4B5563', fontWeight: 500 }}>
                  {entry.transactionDate ? format(new Date(entry.transactionDate), 'dd MMM yyyy, hh:mm a') : '—'}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF' }}>
                  {entry.transactionNumber || `V-${entry.id}`}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(entry.referenceType)}
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#4B5563' }}>
                      {entry.referenceType || 'JV'}
                    </span>
                  </div>
                </td>
                <td style={{ maxWidth: 300 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#111827', truncate: true }}>
                    {entry.description || 'Standard Entry'}
                  </p>
                </td>
                <td>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB' }}>
                    {entry.debitLedger?.name || entry.debitAccount?.name || '—'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                    {entry.creditLedger?.name || entry.creditAccount?.name || '—'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 13, color: '#111827' }}>
                  ₹{(entry.amount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
