import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Box, 
  QrCode, 
  Warehouse,
  MoreVertical,
  ChevronRight,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AddProductForm } from './AddProductForm';
import { inventoryApi } from '@/src/lib/api';
import { toast } from 'sonner';

const statusConfig = {
  'In Stock':  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: 'bg-emerald-500' },
  'Low Stock': { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   bar: 'bg-amber-500'   },
  'Critical':  { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    bar: 'bg-rose-500'    },
};

export const ProductMaster = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) {
        setProducts(res.data);
      } else {
        toast.error(res.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  if (isAdding) {
    return <AddProductForm onCancel={() => { setIsAdding(false); fetchProducts(); }} />;
  }

  const getStatus = (stock: number, low: number) => {
    if (stock <= 0) return 'Critical';
    if (stock <= low) return 'Low Stock';
    return 'In Stock';
  };

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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-8 py-10 text-center text-slate-400 uppercase tracking-widest text-[10px]">
                      Loading Inventory...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-8 py-10 text-center text-slate-400 uppercase tracking-widest text-[10px]">
                      No Products Found
                    </td>
                  </tr>
                ) : products.map((item) => {
                  const status = getStatus(item.stockQuantity, item.lowStockThreshold || 10);
                  const cfg = statusConfig[status as keyof typeof statusConfig];
                  const total = (item.stockQuantity || 0) + 100; // Mock total for percentage
                  const pct = Math.min(((item.stockQuantity || 0) / total) * 100, 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5"><input type="checkbox" className="rounded text-primary" /></td>
                      <td className="px-8 py-5 min-w-[240px]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-white group-hover:border-primary/20 transition-all">
                            <Box className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 leading-none group-hover:text-primary transition-colors">{item.productName}</p>
                            <p className="text-[10px] font-normal text-slate-400 mt-2 uppercase tracking-widest">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-md">{item.category?.categoryName || 'General'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-normal text-slate-700">{item.brand || 'No Brand'}</p>
                        <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest mt-1">{item.hsnCode || 'N/A'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="w-32 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-semibold">
                            <span className="text-slate-700">{item.stockQuantity || 0} {item.unit}</span>
                            <span className="text-slate-400">{Math.round(pct)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn('h-full', cfg.bar)} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-slate-900">₹{item.sellingPrice?.toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={cn('text-[9px] font-semibold px-3 py-1.5 rounded-xl border uppercase tracking-widest', cfg.bg, cfg.text, cfg.border)}>
                          {status}
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
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Showing {products.length} Items</p>
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
