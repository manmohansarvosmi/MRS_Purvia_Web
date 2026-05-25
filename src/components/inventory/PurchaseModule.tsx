import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Building2,
  ChevronRight,
  PackageCheck,
  Clock,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PurchaseOrderForm } from './PurchaseOrderForm';

const purchaseOrders = [
  { id: 'PO-2026-0042', vendor: 'Tata Solar Systems',  items: 15,  value: '₹14.2L', date: 'Today',     eta: '28 May',     status: 'Sent'     },
  { id: 'PO-2026-0041', vendor: 'Havells India',        items: 120, value: '₹2.4L',  date: 'Yesterday', eta: 'Delivered',  status: 'Received' },
  { id: 'PO-2026-0030', vendor: 'Microtek Power',       items: 8,   value: '₹8.9L',  date: '12 May',    eta: '30 May',     status: 'Partial'  },
  { id: 'PO-2026-0029', vendor: 'Luminous Tech',        items: 40,  value: '₹6.1L',  date: '10 May',    eta: '26 May',     status: 'Sent'     },
  { id: 'PO-2026-0028', vendor: 'Waaree Energies',      items: 22,  value: '₹19.8L', date: '9 May',     eta: 'Delivered',  status: 'Received' },
];

const statusConfig = {
  'Received': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  'Partial':  { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   dot: 'bg-amber-500'   },
  'Sent':     { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100',  dot: 'bg-indigo-400'  },
};

export const PurchaseModule = () => {
  const [view, setView] = useState<'list' | 'create'>('list');

  if (view === 'create') {
    return <PurchaseOrderForm onBack={() => setView('list')} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden animate-in fade-in duration-500">

      {/* Header - More Compact */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
            <ShoppingCart className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">Purchase Orders</h2>
            <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest leading-none mt-1">Vendor Procurement Ledger</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[9px] font-semibold uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> Vendors
          </button>
          <button onClick={() => setView('create')} className="px-4 py-2 bg-primary text-white text-[9px] font-semibold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/10">
            <Plus className="w-3.5 h-3.5" /> New Order
          </button>
        </div>
      </div>

      {/* Content with Smaller Margins */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Active POs', value: '7', icon: ShoppingCart, color: 'text-primary' },
             { label: 'Open Value', value: '₹43.2L', icon: IndianRupee, color: 'text-amber-600' },
             { label: 'Received (MTD)', value: '18 Units', icon: PackageCheck, color: 'text-emerald-600' },
           ].map((s, i) => (
             <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                   <s.icon className={cn("w-5 h-5", s.color)} />
                </div>
                <div>
                   <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">{s.label}</p>
                   <p className="text-base font-bold text-slate-800 mt-0.5">{s.value}</p>
                </div>
             </div>
           ))}
        </div>

        {/* PO List Card - Less Rounding */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Find orders..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-normal outline-none focus:border-primary/20 transition-all h-9"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[9px] font-semibold uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all h-9">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['PO Number', 'Vendor Details', 'Summary', 'ETA', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {purchaseOrders.map((po) => {
                  const cfg = statusConfig[po.status as keyof typeof statusConfig];
                  return (
                    <tr key={po.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-800 font-mono italic">{po.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <Building2 className="w-3.5 h-3.5 text-slate-300" />
                           <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{po.vendor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{po.value}</p>
                        <p className="text-[9px] font-normal text-slate-400 uppercase mt-0.5">{po.items} Units</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-normal text-slate-500">
                           <Clock className="w-3.5 h-3.5 opacity-40" />
                           <span>{po.eta}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-widest', cfg.bg, cfg.text, cfg.border)}>
                          <span className={cn('w-1 h-1 rounded-full', cfg.dot)} />
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-300 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
