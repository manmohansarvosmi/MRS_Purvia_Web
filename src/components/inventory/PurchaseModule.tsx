import React, { useState } from 'react';
import { 
  ShoppingCart, Plus, Search, Filter, Download, MoreVertical, Building2, PackageCheck, IndianRupee, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { inventoryApi } from '@/src/lib/api';
import { toast } from 'sonner';

export const PurchaseModule = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllPurchases();
      if (res.status === 1) setPurchases(res.data);
    } catch {
      toast.error("Failed to load purchase records");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'create') {
    return <PurchaseOrderForm onBack={() => { setView('list'); fetchPurchases(); }} />;
  }

  const totalValue = purchases.reduce((a, b) => a + (b.netAmount || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8">
            <ShoppingCart size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Procurement & Sourcing Registry</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Purchase Orders & Goods Inward Logs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search size={12} className="text-slate-400" />
            <input placeholder="Search PO#, supplier or status..." className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]"><Filter size={11} /> Filters</button>
          <button onClick={() => setView('create')} className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            <Plus size={14} /> Create Order
          </button>
        </div>
      </div>

      {/* ── Summary Matrix (High Density) ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Active Pipeline</p>
          <p className="text-[14px] font-black text-slate-900">{purchases.length} <span className="text-[9px] text-slate-400 font-bold uppercase">Orders</span></p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Procurement Sum</p>
          <p className="text-[14px] font-black text-slate-900">₹{totalValue.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Pending GRNs</p>
          <p className="text-[14px] font-black text-primary">
            {purchases.filter(p => p.status !== 'RECEIVED').length}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-[8px]">Ledger Sync: 100% OK</span>
        </div>
      </div>

      {/* ── Transaction Grid ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-[140px]">PO Reference</th>
              <th>Supplier / Commercial Unit</th>
              <th className="w-[120px]">Case Load</th>
              <th className="w-[180px]">Procurement Date</th>
              <th className="w-[160px] text-right">Gross Aggregate</th>
              <th className="w-[120px] text-center">Engine Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-40">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Extracting Procurement Books...</span>
                  </div>
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-20">
                      <ShoppingCart size={32} />
                      <p className="text-[11px] font-black uppercase tracking-widest">No procurement records found</p>
                   </div>
                </td>
              </tr>
            ) : purchases.map((po) => (
              <tr key={po.id} className="group">
                <td className="font-mono text-[10px] font-black text-primary italic">
                  {po.invoiceNumber || `PO-${po.id.toString().padStart(4, '0')}`}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                       <Building2 size={12} />
                    </div>
                    <div>
                       <p className="text-[10.5px] font-black text-slate-900 uppercase tracking-tight">{po.supplier?.supplierName || 'General Vendor'}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.05em] mt-0.5">Verified Supply Chain Partner</p>
                    </div>
                  </div>
                </td>
                <td>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                      <PackageCheck size={11} className="text-slate-300" />
                      {po.items?.length || 0} SKU Case
                   </div>
                </td>
                <td className="text-[10px] font-bold text-slate-500 uppercase">
                  {po.purchaseDate ? format(new Date(po.purchaseDate), 'dd MMM yyyy') : 'Date Error'}
                </td>
                <td className="text-right">
                   <span className="text-[12px] font-black text-slate-900 italic tracking-tighter">₹{Number(po.netAmount || 0).toLocaleString()}</span>
                </td>
                <td className="text-center">
                  <span className={cn(
                    "badge inline-flex items-center justify-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border min-w-[80px] rounded-[3px]",
                    po.status === 'RECEIVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    po.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  )}>
                    {po.status || 'PENDING'}
                  </span>
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
             Records Registry — 1-{purchases.length} of {purchases.length} Active Nodes
          </p>
          <div className="flex items-center gap-1.5">
             <button className="h-6 px-3 text-[9px] font-black uppercase rounded-[5px] bg-slate-900 text-white">1</button>
          </div>
       </div>

    </div>
  );
};
