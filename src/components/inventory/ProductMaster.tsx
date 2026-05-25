import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Box, 
  QrCode, 
  Warehouse,
  MoreVertical,
  ChevronRight,
  AlertTriangle,
  Layers,
  Tag,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddProductForm } from './AddProductForm';

const inventoryItems = [
  { id: '1', name: 'Solar Panel 450W Mono', category: 'Energy', sku: 'SP-450-MO', stock: 120, total: 200, warehouse: 'Main Hub', location: 'Rack A-12', status: 'In Stock', price: '₹12,500' },
  { id: '2', name: 'Hybrid Inverter 5kVA', category: 'Energy', sku: 'INV-HYB-5', stock: 15, total: 200, warehouse: 'Secondary', location: 'Rack B-04', status: 'Low Stock', price: '₹45,000' },
  { id: '3', name: 'Lithium Battery 100Ah', category: 'Storage', sku: 'BATT-LI-100', stock: 42, total: 200, warehouse: 'Main Hub', location: 'Rack C-01', status: 'In Stock', price: '₹32,000' },
  { id: '4', name: 'DC Wire 4sqmm (100m)', category: 'Cables', sku: 'WIRE-DC-4', stock: 8, total: 200, warehouse: 'Main Hub', location: 'Rack D-09', status: 'Critical', price: '₹4,200' },
  { id: '5', name: 'MPPT Charge Controller 60A', category: 'Controllers', sku: 'MPPT-60A', stock: 34, total: 100, warehouse: 'Main Hub', location: 'Rack E-02', status: 'In Stock', price: '₹8,900' },
  { id: '6', name: 'Mounting Structure L2 Kit', category: 'Hardware', sku: 'MNT-L2-KIT', stock: 22, total: 50, warehouse: 'Secondary', location: 'Rack F-11', status: 'In Stock', price: '₹2,400' },
];

const statusConfig = {
  'In Stock':  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: 'bg-emerald-500' },
  'Low Stock': { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   bar: 'bg-amber-500'   },
  'Critical':  { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    bar: 'bg-rose-500'    },
};

export const ProductMaster = () => {
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return <AddProductForm onCancel={() => setIsAdding(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100/40 overflow-hidden">

      {/* ── Header ── */}
      <div className="px-6 py-5 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 uppercase tracking-tight">Stock Master</h2>
            <p className="text-[10px] font-normal text-slate-400 mt-0.5 uppercase tracking-widest">Global inventory ledger</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
            <QrCode className="w-3.5 h-3.5" /> Bulk Print
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-5 py-2.5 bg-primary text-white text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> New Item
          </button>
        </div>
      </div>

      {/* ── Content with Margins ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total SKUs',  value: '1,248',     icon: Layers,        color: 'text-primary' },
            { label: 'Stock Value', value: '₹1.2 Cr',   icon: BarChart3,     color: 'text-emerald-600' },
            { label: 'Warehouses',  value: '4 Units',   icon: Warehouse,     color: 'text-amber-600' },
            { label: 'Critical',    value: '12 Items',  icon: AlertTriangle, color: 'text-rose-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:border-primary/20 transition-all group">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 group-hover:bg-white', stat.color.replace('text', 'text'))}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Data Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          
          {/* Search & Filter Top Bar in Card */}
          <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search Item Registry..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-normal outline-none focus:border-primary/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] font-medium uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 w-10"><input type="checkbox" className="rounded" /></th>
                  {['Item Information', 'Category', 'Location', 'Stock Level', 'Price', 'Status', ''].map(h => (
                    <th key={h} className="px-8 py-4 text-[10px] font-medium uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventoryItems.map((item) => {
                  const cfg = statusConfig[item.status as keyof typeof statusConfig];
                  const pct = Math.min((item.stock / item.total) * 100, 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5"><input type="checkbox" className="rounded text-primary" /></td>
                      <td className="px-8 py-5 min-w-[240px]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-white group-hover:border-primary/20 transition-all">
                            <Box className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 leading-none group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-[10px] font-normal text-slate-400 mt-2 uppercase tracking-widest">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-md">{item.category}</span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-normal text-slate-700">{item.warehouse}</p>
                        <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest mt-1">{item.location}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="w-32 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-semibold">
                            <span className="text-slate-700">{item.stock} Units</span>
                            <span className="text-slate-400">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn('h-full', cfg.bar)} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-slate-900">{item.price}</td>
                      <td className="px-8 py-5">
                        <span className={cn('text-[9px] font-semibold px-3 py-1.5 rounded-xl border uppercase tracking-widest', cfg.bg, cfg.text, cfg.border)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-300 hover:text-slate-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Showing {inventoryItems.length} of 1,248 Items</p>
            <div className="flex items-center gap-2">
               {['1', '2', '3', 'Next'].map(p => (
                 <button key={p} className={cn(
                   "w-9 h-9 flex items-center justify-center text-[10px] font-semibold rounded-xl border transition-all",
                   p === '1' ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary"
                 )}>{p}</button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
