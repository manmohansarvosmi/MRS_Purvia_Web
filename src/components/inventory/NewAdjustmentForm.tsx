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
import { cn } from '@/src/lib/utils';

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
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#F8FAFC' }}>
      
      {/* ── Header ── */}
      <div className="page-header shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="btn-ghost !p-1.5 hover:bg-slate-100 rounded-[5px]" title="Go Back">
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">New Stock Adjustment</h2>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-0.5">Physical Stock Reconciliation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-7 px-3 text-[10px]" onClick={onCancel}>Discard</button>
          <button 
            className={cn(
              "btn-primary h-7 px-4 text-[10px] shadow-sm",
              saved ? "bg-emerald-500 hover:bg-emerald-600" : ""
            )}
            onClick={handleSave}
          >
            {saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
            {saved ? "Applied" : "Apply Adjustment"}
          </button>
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="space-y-4 pb-12">
          
          {/* Adjustment Type Selector */}
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Settings2 size={12} className="text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Adjustment Protocol</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setAdjustType('addition')}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-[5px] border transition-all text-left",
                  adjustType === 'addition'
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 ring-1 ring-emerald-200"
                    : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-300"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 shadow-sm",
                  adjustType === 'addition' ? "bg-white text-emerald-500" : "bg-slate-200/50"
                )}>
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Addition (+)</p>
                  <p className="text-[9px] font-medium opacity-60">Increase stock total</p>
                </div>
              </button>
              <button
                onClick={() => setAdjustType('deduction')}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-[5px] border transition-all text-left",
                  adjustType === 'deduction'
                    ? "border-rose-200 bg-rose-50/50 text-rose-800 ring-1 ring-rose-200"
                    : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-300"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 shadow-sm",
                  adjustType === 'deduction' ? "bg-white text-rose-500" : "bg-slate-200/50"
                )}>
                  <ArrowDownRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Deduction (-)</p>
                  <p className="text-[9px] font-medium opacity-60">Decrease stock total</p>
                </div>
              </button>
            </div>
          </div>

          {/* Discrepancy Details */}
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Package size={12} className="text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Discrepancy Details</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2 md:col-span-1">
                <label className="erp-label">Select Item *</label>
                <div className="relative">
                  <input type="text" placeholder="Search by name or SKU..." className="erp-input h-8 pl-8" />
                  <Package size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="erp-label">Adjustment Quantity *</label>
                <input type="number" min="1" placeholder="0 Units" className="erp-input h-8 font-bold" />
              </div>
              <div>
                <label className="erp-label">Warehouse Unit</label>
                <select className="erp-select h-8">
                  <option value="">Select Warehouse</option>
                  <option>Main Hub — Gwalior HQ</option>
                  <option>Secondary — Branch Store</option>
                </select>
              </div>
              <div>
                <label className="erp-label">Date of Adjustment</label>
                <input type="date" className="erp-input h-8" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="col-span-2">
                <label className="erp-label">Reason & Internal Remarks *</label>
                <textarea
                  rows={3}
                  placeholder="Provide context for this stock adjustment (e.g. Damage, Miscount, Theft)..."
                  className="erp-input !h-auto py-2 focus:border-slate-400 transition-all font-sans italic"
                />
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-100 rounded-[5px] px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[10px] font-medium text-amber-800 leading-relaxed italic">
              <strong>Audit Notice:</strong> These changes are logged permanently in the Movement Registry. Please verify the actual physical stock levels before committing the adjustment to avoid inventory drift.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
