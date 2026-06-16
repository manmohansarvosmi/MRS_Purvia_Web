import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi } from '@/src/lib/api';
import { format } from 'date-fns';

export const SalesHistory = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await inventoryApi.getAllSales();
        if (res.status === 1) {
          setSales(res.data);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalSalesToday = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fade-in">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8">
            <History size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Financial Ledger Logs</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Complete Transaction History</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search size={12} className="text-slate-400" />
            <input placeholder="Search transaction ID, customer..." className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
             <Calendar className="w-3.5 h-3.5" /> Date Matrix
          </button>
          <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-slate-900/10">
             <Download className="w-3.5 h-3.5" /> Export Logs
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
         <div>
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Gross Inbound Volume</p>
           <p className="text-[14px] font-black text-slate-900 italic">₹{totalSalesToday.toLocaleString()}</p>
         </div>
         <div className="w-px h-6 bg-slate-200" />
         <div>
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Transactions</p>
           <p className="text-[14px] font-black text-slate-900">
             {sales.length} <span className="text-[9px] text-slate-400 font-bold uppercase">Records</span>
           </p>
         </div>
         <div className="w-px h-6 bg-slate-200" />
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live Engine</span>
         </div>
      </div>


         {/* Transaction Engine Table */}
         <div className="p-0">
            <table className="erp-table">
               <thead>
                  <tr>
                     <th className="w-[180px]">Transaction ID</th>
                     <th>Commercial Entity / Customer</th>
                     <th className="w-[200px]">Node Timestamp</th>
                     <th className="w-[150px] text-right">Net Aggregate</th>
                     <th className="w-[150px] text-center">Settlement</th>
                     <th className="w-10"></th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                     <tr>
                       <td colSpan={6} className="py-24 text-center">
                         <div className="flex flex-col items-center gap-3 opacity-40">
                           <Loader2 size={24} className="animate-spin text-primary" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em]">Extracting Primary Ledger...</p>
                         </div>
                       </td>
                     </tr>
                  ) : sales.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-2 opacity-20">
                             <History size={32} />
                             <p className="text-[11px] font-black uppercase tracking-widest">Digital void detected (No Logs)</p>
                          </div>
                       </td>
                     </tr>
                  ) : sales.map((h) => (
                     <tr key={h.id} className="group">
                        <td className="font-mono text-[10px] font-black text-primary italic">
                           #{h.id.toString().padStart(6, '0')}
                        </td>
                        <td>
                           <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors font-bold text-[9px]">
                                 {h.customerName?.charAt(0) || 'C'}
                              </div>
                              <p className="text-[10.5px] font-black text-slate-900 uppercase tracking-tight">{h.customerName || 'Walk-in Client'}</p>
                           </div>
                        </td>
                        <td className="text-[10px] font-bold text-slate-500">
                           {h.invoiceDate ? format(new Date(h.invoiceDate), 'dd MMM, hh:mm a') : 'Temporal Error'}
                        </td>
                        <td className="text-right text-[11px] font-black text-slate-900 italic">
                           ₹{h.totalAmount?.toLocaleString()}
                        </td>
                        <td className="text-center">
                           <span className={cn(
                              "badge inline-flex items-center justify-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border min-w-[70px] rounded-[3px]",
                              h.paymentMethod === 'CASH' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              h.paymentMethod === 'UPI' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-amber-50 text-amber-600 border-amber-100"
                           )}>{h.paymentMethod || 'SECURE'}</span>
                        </td>
                        <td className="text-center">
                           <div className="flex items-center gap-1">
                              <button 
                                 onClick={() => inventoryApi.downloadInvoicePdf(h.id, h.invoiceNumber)}
                                 className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-primary transition-colors" 
                                 title="Download Invoice"
                              >
                                 <FileText size={12} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

       {/* ── Fixed Footer Pagination ── */}
       <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             Operations Log — Displaying {sales.length} Nodes of Primary Ledger
          </p>
          <div className="flex items-center gap-1.5">
             <button className="h-6 px-3 text-[9px] font-black uppercase rounded-[5px] bg-slate-900 text-white">1</button>
          </div>
       </div>
    </div>
  );
};
