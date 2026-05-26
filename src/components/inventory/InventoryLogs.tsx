import React, { useState, useEffect } from 'react';
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
import { cn } from '@/src/lib/utils';
import { inventoryApi } from '../../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

const typeConfig = {
  IN:       { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: ArrowDownRight },
  OUT:      { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    icon: ArrowUpRight   },
  ADJUST:   { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100',  icon: RefreshCw      },
  RETURN:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   icon: RefreshCw      },
};

export const InventoryLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllLogs();
      if (res.status === 1) {
        setLogs(res.data);
      } else {
        toast.error(res.message || "Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("An error occurred while fetching logs");
    } finally {
      setLoading(false);
    }
  };

  const getLogType = (type: string) => {
    if (type === 'PURCHASE') return 'IN';
    if (type === 'SALE') return 'OUT';
    if (type === 'ADJUSTMENT') return 'ADJUST';
    if (type === 'RETURN') return 'RETURN';
    return 'ADJUST';
  };
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 uppercase tracking-widest text-[10px]">
                      Loading Logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 uppercase tracking-widest text-[10px]">
                      No Movement Logs
                    </td>
                  </tr>
                ) : logs.map((m) => {
                  const type = getLogType(m.logType);
                  const cfg = typeConfig[type as keyof typeof typeConfig];
                  const Icon = cfg.icon;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all">
                              <Clock className="w-4 h-4" />
                           </div>
                           <span className="text-xs font-medium text-slate-900 tracking-tight">
                             {m.createdOn ? format(new Date(m.createdOn), 'dd MMM, hh:mm a') : 'N/A'}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-semibold uppercase tracking-widest', cfg.bg, cfg.text, cfg.border)}>
                          <Icon className="w-3.5 h-3.5" />
                          {m.logType}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">{m.product?.productName}</p>
                        <p className="text-[10px] font-normal text-slate-400 mt-2 uppercase tracking-widest">SKU: {m.product?.sku}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-xs font-normal text-slate-600">
                          <span className="truncate max-w-[120px] bg-slate-50 px-2 py-1 rounded border border-slate-100">Stock: {m.previousStock}</span>
                          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                          <span className="truncate max-w-[120px] bg-slate-50 px-2 py-1 rounded border border-slate-100">Final: {m.finalStock}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                           <p className="text-sm font-semibold text-slate-900">
                             {m.changeAmount > 0 ? `+${m.changeAmount}` : m.changeAmount} {m.product?.unit}
                           </p>
                           <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                             {m.reason || 'Completed'}
                           </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {logs.length} audit logs displayed for current session
          </div>
        </div>
      </div>
    </div>
  );
};
