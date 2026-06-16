import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Box, QrCode, Edit2, Loader2, Trash2, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { AddProductForm } from './AddProductForm';
import { ProductDetailView } from './ProductDetailView';
import { inventoryApi } from '@/src/lib/api';
import { toast } from 'sonner';

const statusConfig: any = {
  'In Stock':  { cls: 'badge-success' },
  'Low Stock': { cls: 'badge-warning' },
  'Critical':  { cls: 'badge-danger'  },
  bar: {
    'In Stock':  'bg-emerald-500',
    'Low Stock': 'bg-amber-500',
    'Critical':  'bg-rose-500',
  }
};

export const ProductMaster = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) setProducts(res.data);
      else toast.error(res.message || 'Failed to fetch products');
    } catch {
      toast.error('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await inventoryApi.deleteProduct(id);
      if (res.status === 1) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(res.message || "Failed to delete product");
      }
    } catch {
      toast.error("An error occurred while deleting product");
    }
  };

  if (viewingProduct) return (
    <ProductDetailView 
      product={viewingProduct} 
      onBack={() => { 
        setViewingProduct(null); 
        fetchProducts(); 
      }} 
    />
  );

  if (isAdding || editingProduct) return (
    <AddProductForm 
      initialData={editingProduct} 
      onCancel={() => { 
        setIsAdding(false); 
        setEditingProduct(null); 
        fetchProducts(); 
      }} 
    />
  );

  const getStatus = (stock: number, low: number) => {
    if (stock <= 0) return 'Critical';
    if (stock <= low) return 'Low Stock';
    return 'In Stock';
  };

  const filtered = products.filter(p =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">

      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded w-7 h-7">
            <Package size={14} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Stock Master Registry</h2>
            <p className="text-[9px] text-slate-400 font-medium">REAL-TIME GLOBAL INVENTORY LEDGER</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search className="text-slate-400" size={12} />
            <input
              type="text"
              placeholder="Search items, SKU, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[10.5px] w-full"
            />
          </div>
          <button className="btn-secondary h-7 px-3 text-[9.5px]">
            <Filter size={11} />
            Filters
          </button>
          <button className="btn-primary h-7 px-3 text-[9.5px]" onClick={() => setIsAdding(true)}>
            <Plus size={12} />
            New Item
          </button>
        </div>
      </div>

      {/* ── Table Area ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <input type="checkbox" className="accent-primary w-3 h-3" />
              </th>
              <th>Item Information</th>
              <th>Category / Brand</th>
              <th>Stock Level</th>
              <th className="text-right">Price</th>
              <th className="text-center">Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Synchronizing...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-slate-400 text-[10.5px]">
                  No items found in the registry.
                </td>
              </tr>
            ) : filtered.map(item => {
              const status = getStatus(item.stockQuantity, item.lowStockThreshold || 10);
              const barColor = statusConfig.bar[status as keyof typeof statusConfig.bar];
              const pct = Math.min(((item.stockQuantity || 0) / ((item.stockQuantity || 0) + 100)) * 100, 100);

              return (
                <tr key={item.id} className="group">
                  <td className="text-center">
                    <input type="checkbox" className="accent-primary w-3 h-3" />
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center shrink-0 w-7 h-7 bg-slate-50 border border-slate-100 rounded group-hover:border-slate-200 transition-colors">
                        <Box size={12} className="text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[10.5px] line-clamp-1">{item.productName}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-slate-700">{item.category?.categoryName || 'General'}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider">{item.brand || 'No Brand'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="w-24">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] font-bold text-slate-700">{item.stockQuantity || 0} <span className="text-[8px] text-slate-400 uppercase">{item.unit}</span></span>
                        <span className="text-[8px] font-bold text-slate-400">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={cn("h-full", barColor)} 
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-bold text-slate-900 text-[10.5px]">
                    ₹{item.sellingPrice?.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "badge inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold min-w-[60px]",
                      statusConfig[status as keyof typeof statusConfig]?.cls
                    )}>
                      {status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1 transition-all">
                       <button onClick={() => setViewingProduct(item)} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-900" title="View Details">
                        <Eye size={11} />
                      </button>
                      <button onClick={() => setEditingProduct(item)} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-blue-600" title="Edit Item">
                        <Edit2 size={11} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-red-500" title="Delete Item">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ── */}
      <div
        className="flex items-center justify-between px-5 py-2.5 shrink-0 bg-white border-t border-slate-200 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]"
      >
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
          Displaying <strong className="text-slate-700">{filtered.length}</strong> of {products.length} registered items
        </p>
        <div className="flex items-center gap-1.5">
          {['1', '2', '3', 'Next'].map(p => (
            <button
              key={p}
              className={cn(
                "h-7 min-w-[28px] px-2 text-[10px] font-bold rounded-[5px] transition-all flex items-center justify-center uppercase tracking-tighter",
                p === '1' ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              )}
            >{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
