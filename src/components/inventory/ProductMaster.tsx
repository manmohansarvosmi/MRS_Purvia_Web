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
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

const inventoryItems = [
  { id: '1', name: 'Solar Panel 450W Mono', category: 'Energy', sku: 'SP-450-MO', stock: 120, warehouse: 'Main Hub', location: 'Rack A-12', status: 'In Stock', price: '₹12,500' },
  { id: '2', name: 'Hybrid Inverter 5kVA', category: 'Energy', sku: 'INV-HYB-5', stock: 15, warehouse: 'Secondary', location: 'Rack B-04', status: 'Low Stock', price: '₹45,000' },
  { id: '3', name: 'Lithium Battery 100Ah', category: 'Storage', sku: 'BATT-LI-100', stock: 42, warehouse: 'Main Hub', location: 'Rack C-01', status: 'In Stock', price: '₹32,000' },
  { id: '4', name: 'DC Wire 4sqmm (100m)', category: 'Cables', sku: 'WIRE-DC-4', stock: 8, warehouse: 'Main Hub', location: 'Rack D-09', status: 'Critical', price: '₹4,200' },
];

import { AddProductForm } from './AddProductForm';

export const ProductMaster = () => {
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return (
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <AddProductForm onCancel={() => setIsAdding(false)} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* Header Section */}
      <div className="p-6 md:p-8 pb-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-slate-200 border border-slate-100 shrink-0">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Product Master</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global inventory and stock levels</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-premium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0">
              <QrCode className="w-4 h-4" /> Bulk Labels
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-premium btn-primary bg-primary text-white shadow-lg shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add New Item
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total SKUs', value: '1,248', icon: Layers, color: 'primary' },
            { label: 'Total Value', value: '₹1.2 Cr', icon: BarChart3, color: 'emerald' },
            { label: 'Warehouses', value: '4 Units', icon: Warehouse, color: 'amber' },
            { label: 'Low Stock', value: '12 Alerts', icon: AlertTriangle, color: 'rose' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all">
              <div className={cn(
                "p-2.5 rounded-xl",
                stat.color === 'primary' ? "bg-primary/10 text-primary" : `bg-brand-${stat.color}/10 text-brand-${stat.color}`
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-base font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex-1 flex items-center gap-3 px-4 py-1">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by Product Name, SKU, or Barcode..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium h-10 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4 pr-2">
            <div className="hidden lg:flex items-center gap-2">
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-widest flex items-center gap-1.5 border border-slate-100 hover:bg-slate-100 transition-colors">Category <ChevronRight className="w-3 h-3 rotate-90" /></button>
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-widest flex items-center gap-1.5 border border-slate-100 hover:bg-slate-100 transition-colors">Warehouse <ChevronRight className="w-3 h-3 rotate-90" /></button>
            </div>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
        <div className="premium-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Item Details</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock Level</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unit Price</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="px-6 py-4 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-700">{item.warehouse}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.location}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-40 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                          <span className="text-slate-900">{item.stock} Units</span>
                          <span className="text-slate-400">Tgt: 200</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full transition-all duration-500",
                            item.status === 'Critical' ? "bg-brand-rose shadow-[0_0_8px_rgba(244,63,94,0.4)]" : 
                            item.status === 'Low Stock' ? "bg-brand-amber shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          )} style={{ width: `${(item.stock/200)*100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-900">{item.price}</td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border",
                        item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        item.status === 'Low Stock' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900">
                        <MoreVertical className="w-4.5 h-4.5" />
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

