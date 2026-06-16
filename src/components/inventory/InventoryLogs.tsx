import React, { useState, useEffect } from 'react';
import { 
  History, ArrowUpRight, ArrowDownRight, Search, Filter, Download, ArrowRight, RefreshCw, Clock, Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi } from '../../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const InventoryLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllLogs();
      if (res.status === 1) setLogs(res.data);
    } catch {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div>
          <h2>Movement Ledger</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Global Inventory Audit Trail</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar">
            <Search />
            <input placeholder="Search audit logs..." style={{ width: 220 }} />
          </div>
          <button className="btn-secondary" onClick={fetchLogs}><RefreshCw size={12} /> Sync</button>
          <button className="btn-secondary"><Download size={12} /> Export CSV</button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="flex items-center gap-10 px-5 py-3 shrink-0" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <p className="erp-label !mb-1">Total Logs Indexed</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{logs.length}</p>
        </div>
        <div>
          <p className="erp-label !mb-1">Recent Movements</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>
            {logs.filter(l => l.logType === 'PURCHASE' || l.logType === 'SALE').length} Records
          </p>
        </div>
      </div>

      {/* ── Data Grid ── */}
      <div className="flex-1 overflow-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Timestamp</th>
              <th style={{ width: 120 }}>Type</th>
              <th>Product Details</th>
              <th>Movement Audit</th>
              <th style={{ textAlign: 'right', width: 100 }}>Adjustment</th>
              <th style={{ width: 100, textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0' }}>
                   <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin" color="#C8102E" />
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Tracing Audit History...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 12 }}>
                  No movement logs found in central registry.
                </td>
              </tr>
            ) : logs.map((m) => (
              <tr key={m.id}>
                <td style={{ fontSize: 11, color: '#4B5563', fontWeight: 500 }}>
                  {m.createdOn ? format(new Date(m.createdOn), 'dd MMM, hh:mm a') : '—'}
                </td>
                <td>
                  <span className={cn(
                    "badge",
                    m.logType === 'PURCHASE' ? 'badge-success' : 
                    m.logType === 'SALE' ? 'badge-danger' : 
                    m.logType === 'ADJUSTMENT' ? 'badge-info' : 'badge-neutral'
                  )} style={{ width: '100%', justifyContent: 'center' }}>
                    {m.logType}
                  </span>
                </td>
                <td>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{m.product?.productName}</p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>SKU: {m.product?.sku}</p>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span style={{ padding: '2px 6px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 2 }}>{m.previousStock}</span>
                    <ArrowRight size={10} className="text-slate-300" />
                    <span style={{ padding: '2px 6px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 2, color: '#111827', fontWeight: 700 }}>{m.finalStock}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 13, color: m.changeAmount > 0 ? '#059669' : '#DC2626' }}>
                  {m.changeAmount > 0 ? '+' : ''}{m.changeAmount}
                  <span style={{ fontSize: 10, marginLeft: 2, fontWeight: 500, color: '#9CA3AF' }}>{m.product?.unit}</span>
                </td>
                <td>
                   <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', width: '100%', display: 'block', textAlign: 'center' }}>
                      {m.reason || 'SYSTEM'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
