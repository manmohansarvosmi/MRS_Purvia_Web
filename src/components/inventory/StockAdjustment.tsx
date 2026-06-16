import React from 'react';
import { 
  Settings2, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, MoreVertical, ClipboardList
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { NewAdjustmentForm } from './NewAdjustmentForm';

const adjustments = [
  { id: 'ADJ-992', item: 'Solar Panel 450W Mono', sku: 'SP-450-MO', qty: -2,  reason: 'Damaged in transit',           date: '25 May, 11:20 AM',    warehouse: 'Main Hub',  type: 'Deduction' },
  { id: 'ADJ-991', item: 'MC4 Connector Pair',   sku: 'MC4-MF-01', qty: 100, reason: 'Physical audit correction',    date: '24 May, 03:45 PM', warehouse: 'Main Hub',  type: 'Addition'  },
  { id: 'ADJ-990', item: 'Hybrid Inverter 5kVA', sku: 'INV-HYB-5', qty: -1,  reason: 'Customer Return (RMA)',         date: '12 May, 09:00 AM',  warehouse: 'Secondary', type: 'Deduction' },
  { id: 'ADJ-989', item: 'Lithium Battery 100Ah', sku: 'BATT-LI-100', qty: 5,  reason: 'Received stock — GRN-2025-44', date: '10 May, 02:15 PM',  warehouse: 'Main Hub',  type: 'Addition'  },
  { id: 'ADJ-988', item: 'DC Wire 4sqmm (100m)', sku: 'WIRE-DC-4',  qty: -3,  reason: 'Expired / Obsolete batch',    date: '08 May, 10:00 AM',   warehouse: 'Main Hub',  type: 'Deduction' },
];

export const StockAdjustment = () => {
  const [isAdding, setIsAdding] = React.useState(false);

  if (isAdding) {
    return <NewAdjustmentForm onCancel={() => setIsAdding(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8">
            <Settings2 size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Stock Reconciliations</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Manual Inventory Adjustment Ledger</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search size={12} className="text-slate-400" />
            <input placeholder="Search ref, SKU or reason..." className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]"><Filter size={11} /> Filters</button>
          <button onClick={() => setIsAdding(true)} className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            <Plus size={14} /> New Adjustment
          </button>
        </div>
      </div>

      {/* ── Summary Matrix (High Density) ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Logs</p>
          <p className="text-[14px] font-black text-slate-900">{adjustments.length} <span className="text-[9px] text-slate-400 font-bold uppercase">Actions</span></p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Net Flow MTD</p>
          <p className="text-[14px] font-black text-emerald-600">
            +{adjustments.reduce((s, a) => s + a.qty, 0)} <span className="text-[9px] font-bold uppercase tracking-tighter">Units</span>
          </p>
        </div>
        <div className="ml-auto">
           <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full flex items-center gap-2">
              <ClipboardList size={10} className="text-amber-600" />
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">AUDIT TRAIL ACTIVE</span>
           </div>
        </div>
      </div>

      {/* ── Adjustment Grid ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-[120px]">Reference</th>
              <th>Asset / Product Node</th>
              <th className="w-[150px]">Discrepancy</th>
              <th>Adjustment Rationale</th>
              <th className="w-[150px]">Node Location</th>
              <th className="w-[160px]">Auth Timestamp</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((adj) => (
              <tr key={adj.id} className="group">
                <td className="font-mono text-[10px] font-black text-primary italic">{adj.id}</td>
                <td>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{adj.item}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Global SKU: {adj.sku}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-[4px] flex items-center justify-center text-white shadow-sm",
                      adj.type === 'Addition' ? "bg-emerald-600" : "bg-rose-600"
                    )}>
                      {adj.type === 'Addition' ? <ArrowUpRight size={11} strokeWidth={3} /> : <ArrowDownRight size={11} strokeWidth={3} />}
                    </div>
                    <span className={cn(
                       "text-[12px] font-black tracking-tighter italic",
                       adj.type === 'Addition' ? 'text-emerald-700' : 'text-rose-700'
                    )}>
                       {adj.qty > 0 ? `+${adj.qty}` : adj.qty}
                    </span>
                  </div>
                </td>
                <td>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{adj.reason}</span>
                </td>
                <td>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      {adj.warehouse}
                   </div>
                </td>
                <td className="text-[10px] font-bold text-slate-400 uppercase italic">
                   {adj.date}
                </td>
                <td className="text-center">
                  <button className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors">
                     <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* ── Fixed Footer Pagination ── */}
       <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             Audit Ledger — Displaying {adjustments.length} Total Discrepancy Signals
          </p>
          <div className="flex items-center gap-1.5">
             <button className="h-6 px-3 text-[9px] font-black uppercase rounded-[5px] bg-slate-900 text-white">1</button>
          </div>
       </div>

    </div>
  );
};
