import React from 'react';
import { 
  RotateCcw, RefreshCw, Search, Eye, Download, Filter, Plus, AlertCircle, Loader2
} from 'lucide-react';
import { cn } from "@/src/lib/utils";

const mockReturnData = [
  { id: 'RET-001', inv: 'INV-992', product: 'Solar Inverter 5KV', date: '2026-04-20', reason: 'Defective Power Board', status: 'In Review', type: 'Replacement' },
  { id: 'RET-002', inv: 'INV-985', product: 'Li-ion Battery 150Ah', date: '2026-04-18', reason: 'Order Cancellation', status: 'Completed', type: 'Return' },
  { id: 'RET-003', inv: 'INV-970', product: 'AC Cable 10m', date: '2026-04-15', reason: 'Wrong Product Sent', status: 'Completed', type: 'Replacement' },
];

export const ReturnsLogs = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div>
          <h2>Reverse Logistics</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Asset Returns & Replacement Registry</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar">
            <Search />
            <input placeholder="Search return logs..." style={{ width: 220 }} />
          </div>
          <button className="btn-secondary"><Filter size={12} /> Filter</button>
          <button className="btn-secondary"><Download size={12} /> export</button>
          <button className="btn-primary">
            <Plus size={13} /> Log New Return
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="flex items-center gap-10 px-5 py-3 shrink-0" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <p className="erp-label !mb-1">Pending RMA</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#C8102E' }}>04 Requests</p>
        </div>
        <div>
          <p className="erp-label !mb-1">Completed Cycles</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>12 Records</p>
        </div>
      </div>

      {/* ── Data Grid ── */}
      <div className="flex-1 overflow-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Request ID</th>
              <th>Asset Origin Details</th>
              <th style={{ width: 140 }}>Protocol Type</th>
              <th>Deviation Narrative</th>
              <th style={{ width: 120, textAlign: 'center' }}>Workflow Status</th>
              <th style={{ width: 50, textAlign: 'center' }}>Ops</th>
            </tr>
          </thead>
          <tbody>
            {mockReturnData.map((ret) => (
              <tr key={ret.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#111827', fontWeight: 600 }}>{ret.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                      <AlertCircle size={14} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#111827', fontSize: 12 }}>{ret.product}</p>
                      <p style={{ fontSize: 10, color: '#C8102E', fontWeight: 500 }}>INV: {ret.inv}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={12} className={cn(ret.type === 'Replacement' ? "text-blue-500" : "text-amber-500")} />
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#4B5563' }}>{ret.type}</span>
                  </div>
                </td>
                <td style={{ fontSize: 11, color: '#64748B', maxWidth: 200 }}>
                  {ret.reason}
                </td>
                <td>
                   <span className={cn("badge", ret.status === 'Completed' ? "badge-success" : "badge-neutral")} style={{ width: '100%', justifyContent: 'center' }}>
                      {ret.status}
                   </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-ghost"><Eye size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
