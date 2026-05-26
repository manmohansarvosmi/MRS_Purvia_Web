import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
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
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* Header */}
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <History className="w-5 h-5 text-primary" />
             </div>
             Sales History & POS Logs
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Track every transaction and payment mode</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Calendar className="w-4 h-4" /> Filter Date
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
             <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Transaction Volume</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1 italic">₹{totalSalesToday.toLocaleString()}</h3>
               <div className="mt-3 flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                  <TrendingUp className="w-3 h-3" /> Live Sync Active
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Orders Processed</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1 italic">{sales.length}</h3>
               <div className="mt-3 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  Average ₹{(totalSalesToday / (sales.length || 1)).toFixed(0)} / Bill
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1 italic">OPTIMAL</h3>
               <div className="mt-3 flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                  <ShieldCheck className="w-3 h-3" /> All engines online
               </div>
            </div>
         </div>

         {/* Sales Table */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Transaction ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client / Customer</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[200px]">Timestamp</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Net Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Payment</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-10 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="w-6 h-6 text-primary animate-spin" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Fetching global ledger...</p>
                            </div>
                          </td>
                        </tr>
                     ) : sales.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                            No transactions detected in primary registry
                          </td>
                        </tr>
                     ) : sales.map((h) => (
                        <tr key={h.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-slate-900 text-sm italic">#{h.id}</td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{h.customerName}</p>
                           </td>
                           <td className="px-8 py-6 text-xs font-bold text-slate-500">
                              {h.invoiceDate ? format(new Date(h.invoiceDate), 'dd MMM, hh:mm a') : 'N/A'}
                           </td>
                           <td className="px-8 py-6 text-sm font-black text-slate-900 italic">₹{h.totalAmount?.toLocaleString()}</td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                 "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                 h.paymentMethod === 'CASH' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                 h.paymentMethod === 'UPI' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-amber-50 text-amber-600 border-amber-100"
                              )}>{h.paymentMethod || 'OTHER'}</span>
                           </td>
                           <td className="px-8 py-6 flex items-center gap-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><FileText className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300"><MoreVertical className="w-5 h-5" /></button>
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

// Helper for icon
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
