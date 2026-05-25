import React from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const movements = [
  { id: '1', type: 'IN',       item: 'Solar Panel 450W Mono-Crystalline',  sku: 'SP-450-MO',   qty: 50,  from: 'Vendor: Tata Solar',     to: 'Main Hub',          time: '2 mins ago',   status: 'Completed'  },
  { id: '2', type: 'OUT',      item: 'Hybrid Inverter 5kVA — Series 9',    sku: 'INV-HYB-5',   qty: 2,   from: 'Main Hub',               to: 'Customer: Sharma',  time: '15 mins ago',  status: 'Completed'  },
  { id: '3', type: 'TRANSFER', item: 'Lithium Battery 100Ah (Deep Cycle)', sku: 'BATT-LI-100', qty: 10,  from: 'Main Hub',               to: 'Delhi Depot',       time: '1 hour ago',   status: 'In Transit' },
  { id: '4', type: 'IN',       item: 'DC Wire 4sqmm (100m Roll)',          sku: 'WIRE-DC-4',   qty: 100, from: 'Vendor: Havells',        to: 'Secondary',         time: '3 hours ago',  status: 'Completed'  },
  { id: '5', type: 'OUT',      item: 'MPPT Controller 60A Pulse',          sku: 'MPPT-60A',    qty: 3,   from: 'Main Hub',               to: 'Customer: Verma',   time: '5 hours ago',  status: 'Completed'  },
];

const typeConfig = {
  IN:       { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: ArrowDownRight },
  OUT:      { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    icon: ArrowUpRight   },
  TRANSFER: { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100',  icon: RefreshCw      },
};

export const InventoryLogs = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-100/40 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 uppercase tracking-tight">Movement Logs</h2>
            <p className="text-[10px] font-normal text-slate-400 mt-0.5 uppercase tracking-widest">Real-time audit trail and stock tracing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            <Download className="w-4 h-4" /> Export Audit
          </button>
        </div>
      </div>

      {/* Content with Margin */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* Card Component */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          
          {/* Internal Toolbar */}
          <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search logs by product, SKU, or user..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-normal outline-none focus:border-primary/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] font-medium uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" /> Date Range
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Time & Info', 'Transaction Type', 'Product Details', 'Movement Log', 'Result'].map((h) => (
                    <th key={h} className="px-8 py-5 text-[10px] font-medium uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {movements.map((m) => {
                  const cfg = typeConfig[m.type as keyof typeof typeConfig];
                  const Icon = cfg.icon;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all">
                              <Clock className="w-4 h-4" />
                           </div>
                           <span className="text-xs font-medium text-slate-900 tracking-tight">{m.time}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-semibold uppercase tracking-widest', cfg.bg, cfg.text, cfg.border)}>
                          <Icon className="w-3.5 h-3.5" />
                          {m.type}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">{m.item}</p>
                        <p className="text-[10px] font-normal text-slate-400 mt-2 uppercase tracking-widest">SKU: {m.sku}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-xs font-normal text-slate-600">
                          <span className="truncate max-w-[120px] bg-slate-50 px-2 py-1 rounded border border-slate-100">{m.from}</span>
                          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                          <span className="truncate max-w-[120px] bg-slate-50 px-2 py-1 rounded border border-slate-100">{m.to}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                           <p className="text-sm font-semibold text-slate-900">{m.qty > 0 ? `+${m.qty}` : m.qty} Units</p>
                           <span className={cn(
                             'text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md',
                             m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                           )}>{m.status}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {movements.length} audit logs displayed for current session
          </div>
        </div>
      </div>
    </div>
  );
};
