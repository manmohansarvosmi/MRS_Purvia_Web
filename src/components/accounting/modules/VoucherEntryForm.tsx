import React, { useState } from 'react';
import { 
  Repeat, 
  ArrowRightLeft, 
  Banknote, 
  FileText, 
  ShoppingCart, 
  CreditCard,
  CloudUpload,
  Calendar,
  X,
  Plus,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type VoucherType = 'Payment' | 'Receipt' | 'Journal' | 'Contra' | 'Sales' | 'Purchase';

export const VoucherEntryForm = () => {
  const [activeType, setActiveType] = useState<VoucherType>('Payment');
  const [showSuccess, setShowSuccess] = useState(false);

  const types: { id: VoucherType; icon: any; desc: string }[] = [
    { id: 'Payment', icon: CreditCard, desc: 'Outward flow' },
    { id: 'Receipt', icon: Banknote, desc: 'Inward flow' },
    { id: 'Journal', icon: FileText, desc: 'Adjustments' },
    { id: 'Contra', icon: ArrowRightLeft, desc: 'Internal move' },
    { id: 'Sales', icon: ShoppingCart, desc: 'Credit Sales' },
    { id: 'Purchase', icon: CloudUpload, desc: 'Credit Purchase' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ── Type Selector ─────────────────────────────────────────── */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full max-w-4xl">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={cn(
                "p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 group relative",
                activeType === t.id 
                  ? "bg-slate-900 border-slate-900 text-white shadow-md active-type-glow" 
                  : "bg-white border-slate-200 text-slate-400 hover:border-primary/20 hover:shadow-sm"
              )}
            >
              <t.icon className={cn("w-4 h-4", 
                activeType === t.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500"
              )} />
              <div className="text-center">
                 <h4 className="text-[10px] font-bold uppercase tracking-wider">{t.id}</h4>
                 <p className="text-[7px] font-bold uppercase opacity-50 tracking-tighter">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Form Card ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                 <Repeat className="w-5 h-5 text-primary" />
              </div>
              <div>
                 <h2 className="text-base font-bold text-slate-900 uppercase">Voucher Entry</h2>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Ledger Mapping Active</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-right">
                 <p className="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Voucher ID</p>
                 <p className="text-[10px] font-bold text-slate-900 font-mono tracking-widest uppercase">HELX-V882</p>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                 <Calendar className="w-3.5 h-3.5 text-slate-300" />
                 <input type="date" defaultValue="2026-05-25" className="bg-transparent text-[10px] font-bold uppercase outline-none" />
              </div>
        </div>
        </div>

        <div className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Debit Account (Target)</label>
                    <div className="relative">
                       <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all appearance-none">
                          <option>Select Ledger...</option>
                          <option>Sharma Agencies (Creditor)</option>
                          <option>Electricity Utility Board</option>
                          <option>Salary Payable</option>
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                 </div>
                 <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Credit Account (Source)</label>
                    <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all appearance-none">
                       <option>HDFC Bank Corporate</option>
                       <option>Cash Counter (Gala)</option>
                       <option>SBI Secondary</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Magnitude (₹)</label>
                    <input type="number" placeholder="0.00" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-lg font-black italic text-primary outline-none focus:border-primary focus:bg-white transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Ref. No</label>
                       <input type="text" placeholder="UTR/Chq" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[10px] font-bold outline-none focus:border-primary" />
                    </div>
                    <div>
                       <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Tax (%)</label>
                       <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[10px] font-bold outline-none focus:border-primary">
                          <option>0%</option>
                          <option>5%</option>
                          <option>12%</option>
                          <option>18%</option>
                          <option>28%</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>

           <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Narration / Remarks</label>
              <textarea placeholder="Enter detailed narration..." className="w-full h-20 bg-slate-50 border border-slate-200 rounded-lg p-4 text-[11px] font-medium text-slate-600 outline-none focus:border-primary focus:bg-white transition-all resize-none" />
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
                 <CheckCircle2 className="w-4 h-4" />
                 <span className="text-[9px] font-bold uppercase tracking-widest">Entry Validated</span>
              </div>
              <div className="flex items-center gap-3">
                 <button type="button" className="px-5 py-2.5 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest">Clear</button>
                 <button type="submit" className="px-8 py-2.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Post Entry</button>
              </div>
           </div>
        </div>
      </form>

      <AnimatePresence>
         {showSuccess && (
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 20, opacity: 0 }}
               className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3"
            >
               <CheckCircle2 className="w-5 h-5 text-emerald-400" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Voucher Posted Successfully</p>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
