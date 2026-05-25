import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Settings2, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  FileText,
  Warehouse,
  ChevronDown,
  CheckCircle2,
  ArrowLeft,
  Hash,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-normal text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200";
const selectClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 appearance-none cursor-pointer";

export const NewAdjustmentForm = ({ onCancel }: { onCancel: () => void }) => {
  const [adjustType, setAdjustType] = useState<'addition' | 'deduction'>('addition');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => onCancel(), 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/40 overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors group text-[11px] font-medium uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back
          </button>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">New Stock Adjustment</h2>
              <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Correct physical stock discrepancies</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-[11px] font-medium uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "px-6 py-2.5 rounded-xl text-white text-[11px] font-medium uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg",
              saved
                ? "bg-emerald-500 shadow-emerald-200"
                : "bg-primary shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02]"
            )}
          >
            {saved
              ? <><CheckCircle2 className="w-4 h-4" /> Applied!</>
              : <><Save className="w-4 h-4" /> Apply Adjustment</>
            }
          </button>
        </div>
      </div>

      {/* ── Form Body with Margin & Card ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            
            {/* Adjustment Type Selector */}
            <div className="p-6 border-b border-slate-50">
              <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-6">Adjustment Type</p>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setAdjustType('addition')}
                  className={cn(
                    "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left",
                    adjustType === 'addition'
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    adjustType === 'addition' ? "bg-white text-emerald-500" : "bg-slate-100"
                  )}>
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest">Addition</p>
                    <p className="text-[10px] font-normal mt-1 opacity-70 italic">Increase stock total (+)</p>
                  </div>
                </button>
                <button
                  onClick={() => setAdjustType('deduction')}
                  className={cn(
                    "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left",
                    adjustType === 'deduction'
                      ? "border-rose-400 bg-rose-50 text-rose-700 shadow-lg shadow-rose-500/10"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-rose-200 hover:bg-rose-50/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    adjustType === 'deduction' ? "bg-white text-rose-500" : "bg-slate-100"
                  )}>
                    <ArrowDownRight className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest">Deduction</p>
                    <p className="text-[10px] font-normal mt-1 opacity-70 italic">Decrease stock total (-)</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Product & Quantity */}
            <div className="p-6 space-y-8 bg-white">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Discrepancy Details</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                    <Package className="w-3.5 h-3.5" /> Select Item <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Enter Item Name or SKU..."
                      className={cn(inputClass, "pl-11")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                    <Hash className="w-3.5 h-3.5" /> Adjustment Quantity <span className="text-primary">*</span>
                  </label>
                  <input type="number" min="1" placeholder="0 Units" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                    <Warehouse className="w-3.5 h-3.5" /> Warehouse Unit
                  </label>
                  <div className="relative">
                    <select className={selectClass}>
                      <option value="">Select Warehouse</option>
                      <option>Main Hub — Gwalior HQ</option>
                      <option>Secondary — Branch Store</option>
                      <option>Transit Depot</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" /> Date of Adjustment
                  </label>
                  <input type="date" className={inputClass} defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                  <FileText className="w-3.5 h-3.5" /> Reason & Internal Remarks <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide detailed context for this adjustment..."
                  className={cn(inputClass, "resize-none leading-relaxed")}
                />
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50/50 border-t border-amber-100 px-8 py-6 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
              <p className="text-[11px] font-normal text-amber-800 leading-relaxed italic">
                <strong>Attention:</strong> These changes are logged permanently in the Movement Registry. Please verify the actual physical stock levels before committing the adjustment to avoid inventory drift.
              </p>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-medium uppercase tracking-widest hover:bg-slate-100 transition-all font-mono"
              >
                Abort
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  "px-8 py-3 rounded-xl text-white text-[11px] font-medium uppercase tracking-widest shadow-lg transition-all",
                  saved ? "bg-emerald-500" : "bg-slate-900 hover:bg-slate-800"
                )}
              >
                {saved ? "Adjustment Applied Successfully" : "Apply to Ledger"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
