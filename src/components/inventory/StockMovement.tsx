import React from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Package, User, Clock, Search, Filter, Activity, Box, Download, MoreVertical, Loader2
} from 'lucide-react';
import { cn } from "@/src/lib/utils";

const MOCK_MOVEMENTS = [
  { id: 'MOV-001', product: 'Solar Panel 400W', type: 'in', qty: 24, person: 'Rajesh Kumar', date: '2026-05-13', time: '14:22', reason: 'Stock Replenishment' },
  { id: 'MOV-002', product: 'Inverter 5KVA', type: 'out', qty: 2, person: 'Sunil Verma', date: '2026-05-13', time: '13:45', reason: 'Customer Sale (INV-1024)' },
  { id: 'MOV-003', product: 'AC Cable 10mm', type: 'out', qty: 50, person: 'Amit Singh', date: '2026-05-13', time: '11:10', reason: 'Project Allocation (PRJ-88)' },
  { id: 'MOV-004', product: 'Battery 150Ah', type: 'in', qty: 15, person: 'System Auto', date: '2026-05-12', time: '17:30', reason: 'Inter-warehouse Transfer' },
  { id: 'MOV-005', product: 'Solar Controller 60A', type: 'out', qty: 5, person: 'Rahul Gupta', date: '2026-05-12', time: '15:20', reason: 'Warranty Replacement' },
];

export const StockMovement = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div>
          <h2>Movement History</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Live Asset Displacement & Flow Audit</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar">
            <Search />
            <input placeholder="Search asset or person..." style={{ width: 220 }} />
          </div>
          <button className="btn-secondary"><Filter size={12} /> Filter</button>
          <button className="btn-secondary"><Download size={12} /> export</button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="flex items-center gap-10 px-5 py-3 shrink-0" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <p className="erp-label !mb-1">Last 24h Activity</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{MOCK_MOVEMENTS.length} Movements</p>
        </div>
        <div>
          <p className="erp-label !mb-1">Active Transfers</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>02 Pending</p>
        </div>
      </div>

      {/* ── Data Grid ── */}
      <div className="flex-1 overflow-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Log SID</th>
              <th>Asset Information</th>
              <th style={{ width: 140, textAlign: 'center' }}>Direction</th>
              <th style={{ width: 120, textAlign: 'right' }}>Magnitude</th>
              <th>Personnel / Handler</th>
              <th>Temporal Log</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MOVEMENTS.map((mov) => (
              <tr key={mov.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#111827', fontWeight: 600 }}>{mov.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-900 rounded flex items-center justify-center text-white">
                      <Box size={14} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#111827', fontSize: 12 }}>{mov.product}</p>
                      <p style={{ fontSize: 10, color: '#9CA3AF' }}>{mov.reason}</p>
                    </div>
                  </div>
                </td>
                <td>
                   <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span className={cn(
                      "badge",
                      mov.type === 'in' ? "badge-success" : "badge-danger"
                    )} style={{ width: 80, justifyContent: 'center' }}>
                        {mov.type === 'in' ? 'INFLOW' : 'OUTFLOW'}
                    </span>
                   </div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 13, color: mov.type === 'in' ? '#059669' : '#DC2626' }}>
                   {mov.type === 'in' ? '+' : '-'}{mov.qty}
                   <span style={{ fontSize: 10, marginLeft: 2, fontWeight: 500, color: '#9CA3AF' }}>PCS</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-slate-400" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#4B5563' }}>{mov.person}</span>
                  </div>
                </td>
                <td style={{ fontSize: 11, color: '#9CA3AF' }}>
                   <p style={{ color: '#111827', fontWeight: 500 }}>{new Date(mov.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                   <p>{mov.time}</p>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-ghost"><MoreVertical size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
