import React from 'react';
import { 
  Settings2, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { NewAdjustmentForm } from './NewAdjustmentForm';

const adjustments = [
  { id: 'ADJ-992', item: 'Solar Panel 450W Mono', sku: 'SP-450-MO', qty: -2,  reason: 'Damaged in transit',           date: 'Today, 11:20 AM',    warehouse: 'Main Hub',  type: 'Deduction' },
  { id: 'ADJ-991', item: 'MC4 Connector Pair',   sku: 'MC4-MF-01', qty: 100, reason: 'Physical audit correction',    date: 'Yesterday, 3:45 PM', warehouse: 'Main Hub',  type: 'Addition'  },
  { id: 'ADJ-990', item: 'Hybrid Inverter 5kVA', sku: 'INV-HYB-5', qty: -1,  reason: 'Customer Return (RMA)',         date: '12 May, 09:00 AM',  warehouse: 'Secondary', type: 'Deduction' },
  { id: 'ADJ-989', item: 'Lithium Battery 100Ah', sku: 'BATT-LI-100', qty: 5,  reason: 'Received stock — GRN-2025-44', date: '10 May, 02:15 PM',  warehouse: 'Main Hub',  type: 'Addition'  },
  { id: 'ADJ-988', item: 'DC Wire 4sqmm (100m)', sku: 'WIRE-DC-4',  qty: -3,  reason: 'Expired / Obsolete batch',    date: '8 May, 10:00 AM',   warehouse: 'Main Hub',  type: 'Deduction' },
];

export const StockAdjustment = () => {
  const [isAdding, setIsAdding] = React.useState(false);

  if (isAdding) {
    return <NewAdjustmentForm onCancel={() => setIsAdding(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100/40 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 uppercase tracking-tight">Stock Adjustments</h2>
            <p className="text-[10px] font-normal text-slate-400 mt-0.5 uppercase tracking-widest">Manual reconciliation & corrections</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-primary text-white text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> New Adjustment
        </button>
      </div>

      {/* Content with Margin */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          
          {/* Internal Toolbar */}
          <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search by Ref ID, Reason, or Product SKU..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-normal outline-none focus:border-primary/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] font-medium uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
              <ClipboardList className="w-4 h-4" /> Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[950px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Ref ID', 'Product Ledger', 'Discrepancy', 'Reason for Adjustment', 'Location', 'Auth Date', ''].map(h => (
                    <th key={h} className="px-8 py-4 text-[10px] font-medium uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {adjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-900 font-mono tracking-tighter italic">{adj.id}</span>
                    </td>
                    <td className="px-8 py-5 min-w-[200px]">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors leading-none">{adj.item}</p>
                      <p className="text-[10px] font-normal text-slate-400 mt-2 uppercase tracking-widest">SKU: {adj.sku}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
                          adj.type === 'Addition' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        )}>
                          {adj.type === 'Addition' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <span className={cn('text-sm font-bold', adj.type === 'Addition' ? 'text-emerald-600' : 'text-rose-600 font-mono')}>
                          {adj.qty > 0 ? `+${adj.qty}` : adj.qty}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">{adj.reason}</span>
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-slate-700">{adj.warehouse}</td>
                    <td className="px-8 py-5 text-[11px] font-normal text-slate-400">{adj.date}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
