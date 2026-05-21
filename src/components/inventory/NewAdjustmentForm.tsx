import React from 'react';
import { 
  X, 
  Save, 
  Settings2, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const NewAdjustmentForm = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 lg:p-12 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
         <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
               <Settings2 className="w-5 h-5 text-primary" /> Stock Adjustment
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Correct physical stock discrepancies manually</p>
         </div>
         <button onClick={onCancel} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
            <X className="w-6 h-6" />
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Product</label>
               <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input type="text" placeholder="Search product to adjust..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button className="flex flex-col items-center justify-center gap-3 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] text-emerald-600 hover:bg-emerald-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowUpRight className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Addition (+)</span>
               </button>
               <button className="flex flex-col items-center justify-center gap-3 p-6 bg-rose-50/50 border border-rose-100 rounded-[2rem] text-rose-600 hover:bg-rose-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowDownRight className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Deduction (-)</span>
               </button>
            </div>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Adjustment Quantity</label>
               <input type="number" placeholder="Enter units" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:border-primary/20" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Reason for Adjustment</label>
               <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                  <textarea placeholder="e.g. Damaged, Physical Audit discrepancy, Return" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none h-28 resize-none" />
               </div>
            </div>
         </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end gap-4">
         <button onClick={onCancel} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
         <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3">
            <Save className="w-4 h-4 text-primary fill-primary" /> Apply Adjustment
         </button>
      </div>
    </div>
  );
};
