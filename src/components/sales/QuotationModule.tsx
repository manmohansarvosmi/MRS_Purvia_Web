import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  ArrowRight,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { salesApi } from '@/src/lib/api';

import { EstimateForm } from './EstimateForm';

interface QuotationModuleProps {
  onConvertToInvoice?: (estimate: any) => void;
}

export const QuotationModule: React.FC<QuotationModuleProps> = ({ onConvertToInvoice }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAllEstimates();
      if (response.status === 1) {
        setQuotations(response.data);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdding) {
    return <EstimateForm onCancel={() => { setIsAdding(false); fetchQuotations(); }} />;
  }

  return (
    <div className="space-y-6">
       {/* Actions Bar */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                   type="text" 
                   placeholder="Search quotations..." 
                   className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
             </div>
             <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 transition-all hover:bg-slate-100"><Filter className="w-5 h-5" /></button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
             <Plus className="w-4 h-4" /> Create Quotation
          </button>
       </div>

       {/* Table Module */}
       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                   <FileText className="w-4 h-4 text-primary" /> Active Proposals Matrix
                </h3>
             </div>
             <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><Filter className="w-5 h-5" /></button>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Quotation ID</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client / Customer</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Items</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">Total Value</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Valid Until</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[150px]">Status</th>
                      <th className="px-8 py-5 w-12"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                     <tr>
                        <td colSpan={7} className="px-8 py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                           Analyzing proposal registry...
                        </td>
                     </tr>
                   ) : quotations.length === 0 ? (
                     <tr>
                        <td colSpan={7} className="px-8 py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                           No active estimates found in current matrix
                        </td>
                     </tr>
                   ) : quotations.map((q) => (
                     <tr key={q.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 font-black text-slate-900 text-sm italic">{q.estimateNumber || `EST-${q.id}`}</td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{q.customerName}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-600">Assets Included</td>
                        <td className="px-8 py-6 text-sm font-black text-slate-900 italic">₹{q.totalAmount?.toLocaleString() || q.netAmount?.toLocaleString()}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{q.expiryDate ? format(new Date(q.expiryDate), 'dd MMM y') : 'N/A'}</td>
                        <td className="px-8 py-6">
                           <span className={cn(
                              "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                              q.status === 'ACCEPTED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              q.status === 'PENDING' || q.status === 'DRAFT' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                           )}>{q.status}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              {q.status === 'PENDING' && onConvertToInvoice && (
                                <button 
                                  onClick={() => onConvertToInvoice(q)}
                                  className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                                >
                                  <ArrowRight className="w-2.5 h-2.5" /> Convert
                                </button>
                              )}
                              <button className="text-slate-300"><MoreVertical className="w-5 h-5" /></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};
