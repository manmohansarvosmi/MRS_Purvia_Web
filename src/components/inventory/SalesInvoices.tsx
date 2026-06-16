import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Search, Plus, Calendar, ShieldCheck, ShieldAlert, User, ArrowRight, Loader2, Filter
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi } from '../../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const SalesInvoices = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllSales();
      if (res.status === 1) setSales(res.data);
    } catch {
      toast.error("Failed to fetch sales history");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (sale: any) => {
    try {
      setDownloadingId(sale.id);
      await inventoryApi.downloadInvoicePdf(
        sale.id,
        sale.invoiceNumber || `INV-${sale.id.toString().padStart(4, '0')}`
      );
      toast.success('Invoice PDF downloaded!');
    } catch (e) {
      toast.error('Failed to download invoice PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8">
            <FileText size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Sales Registry & Invoicing</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Revenue Acquisition & Asset Disposal Logs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search size={12} className="text-slate-400" />
            <input placeholder="Search client name, invoice ID..." className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]"><Filter size={11} /> Filters</button>
          <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            <Plus size={14} /> New Sales Invoice
          </button>
        </div>
      </div>

      {/* ── Summary Matrix (High Density) ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Periodic Growth</p>
          <p className="text-[14px] font-black text-emerald-600 italic">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Processing Node Count</p>
          <p className="text-[14px] font-black text-slate-900">{sales.length} <span className="text-[9px] text-slate-400 font-bold">UNITS</span></p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Outstanding Claims</p>
          <p className="text-[14px] font-black text-primary">
            {sales.filter(s => s.paymentStatus !== 'PAID').length}
          </p>
        </div>
        <div className="ml-auto">
           <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">REVENUE SERVER ONLINE</span>
           </div>
        </div>
      </div>

      {/* ── Transaction Grid ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-[120px]">Reference ID</th>
              <th>Customer Engagement / Commercial Node</th>
              <th className="w-[180px]">Registry Date</th>
              <th className="w-[160px] text-right">Yield Asset Value</th>
              <th className="w-[120px] text-center">Settlement</th>
              <th className="w-[100px] text-center">Operations</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-40">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Calibrating Revenue Matrix...</span>
                  </div>
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-20">
                      <FileText size={32} />
                      <p className="text-[11px] font-black uppercase tracking-widest">No transaction records found</p>
                   </div>
                </td>
              </tr>
            ) : sales.map((sale) => (
              <tr key={sale.id} className="group">
                <td className="font-mono text-[10px] font-black text-primary italic">
                  INV-{sale.id.toString().padStart(4, '0')}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-[5px] flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                      {sale.customerName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{sale.customerName}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{sale.customerPhone || 'UNREGISTERED'}</p>
                    </div>
                  </div>
                </td>
                <td className="text-[10px] font-bold text-slate-500 uppercase">
                  {sale.createdOn ? format(new Date(sale.createdOn), 'dd MMM yyyy, hh:mm a') : 'Temporal Error'}
                </td>
                <td className="text-right">
                   <p className="text-[12px] font-black text-slate-900 italic tracking-tighter">₹{Number(sale.totalAmount || 0).toLocaleString()}</p>
                   <p className="text-[8px] font-bold text-slate-400 underline decoration-slate-200 underline-offset-2">{sale.items?.length || 0} ASSETS INCLUDED</p>
                </td>
                <td className="text-center">
                   <span className={cn(
                      "badge inline-flex items-center justify-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border min-w-[80px] rounded-[3px]",
                      sale.paymentStatus === 'PAID' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                   )}>
                      {sale.paymentStatus === 'PAID' ? 'SECURED' : 'PENDING'}
                   </span>
                </td>
                 <td className="text-center">
                   <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => handleDownloadInvoice(sale)}
                       disabled={downloadingId === sale.id}
                       className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-[5px] hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                       title="Download Invoice PDF"
                     >
                        {downloadingId === sale.id 
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Download size={12} />}
                     </button>
                     <button className="w-7 h-7 flex items-center justify-center bg-primary text-white border border-primary rounded-[5px] hover:bg-primary/90 transition-all shadow-md shadow-primary/10" title="View Detail Engine">
                        <ArrowRight size={12} strokeWidth={3} />
                     </button>
                   </div>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* ── Fixed Footer Pagination ── */}
       <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             Operations Matrix — Node 1-{sales.length} of {sales.length} Verified Records
          </p>
          <div className="flex items-center gap-1.5">
             <button className="h-6 px-3 text-[9px] font-black uppercase rounded-[5px] bg-slate-900 text-white shadow-lg shadow-slate-900/20">1</button>
          </div>
       </div>
    </div>
  );
};
