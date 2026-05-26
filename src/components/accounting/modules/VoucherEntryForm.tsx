import React, { useState, useEffect } from 'react';
import { 
  Repeat, ArrowRightLeft, Banknote, FileText, ShoppingCart, CreditCard,
  CloudUpload, Calendar, ChevronDown, CheckCircle2, Loader2,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { accountsApi } from '@/src/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

type VoucherType = 'Payment' | 'Receipt' | 'Journal' | 'Contra' | 'Sales' | 'Purchase';

export const VoucherEntryForm = () => {
  const [activeType, setActiveType] = useState<VoucherType>('Payment');
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    debitLedgerId: '', creditLedgerId: '', amount: '',
    date: format(new Date(), 'yyyy-MM-dd'), description: ''
  });

  const types = [
    { id: 'Payment' as VoucherType, icon: CreditCard, desc: 'Outward flow' },
    { id: 'Receipt' as VoucherType, icon: Banknote, desc: 'Inward flow' },
    { id: 'Journal' as VoucherType, icon: FileText, desc: 'Adjustments' },
    { id: 'Contra' as VoucherType, icon: ArrowRightLeft, desc: 'Internal move' },
    { id: 'Sales' as VoucherType, icon: ShoppingCart, desc: 'Credit Sales' },
    { id: 'Purchase' as VoucherType, icon: CloudUpload, desc: 'Credit Purchase' },
  ];

  useEffect(() => {
    accountsApi.getAllLedgers().then(res => { if (res.status === 1) setLedgers(res.data); }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.debitLedgerId || !form.creditLedgerId || !form.amount) {
      toast.error('Please fill all required fields'); return;
    }
    try {
      setSubmitting(true);
      const res = await accountsApi.saveTransaction({
        debitLedger: { id: Number(form.debitLedgerId) },
        creditLedger: { id: Number(form.creditLedgerId) },
        amount: Number(form.amount),
        transactionDate: form.date,
        transactionNumber: `HELX-V${Date.now().toString().slice(-4)}`,
        description: form.description || `${activeType} Voucher`,
        referenceType: activeType.toUpperCase()
      });
      if (res.status === 1) {
        setShowSuccess(true);
        setForm({ debitLedgerId: '', creditLedgerId: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), description: '' });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        toast.error(res.message || 'Voucher posting failed');
      }
    } catch (e) {
      toast.error('Error posting voucher');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {types.map((t) => (
          <button key={t.id} onClick={() => setActiveType(t.id)}
            className={cn("p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5",
              activeType === t.id ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-400 hover:border-primary/20"
            )}>
            <t.icon className={cn("w-4 h-4", activeType === t.id ? "text-primary" : "text-slate-300")} />
            <div className="text-center">
              <h4 className="text-[10px] font-bold uppercase tracking-wider">{t.id}</h4>
              <p className="text-[7px] font-bold uppercase opacity-50">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center"><Repeat className="w-5 h-5 text-primary" /></div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase">Ledger / Voucher Entry — {activeType}</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Post an Accounting Entry (Voucher)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              className="bg-transparent text-[10px] font-bold uppercase outline-none border border-slate-200 rounded-lg px-3 py-1.5" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Debit Account (Target)*</label>
                <div className="relative">
                  <select value={form.debitLedgerId} onChange={e => setForm({...form, debitLedgerId: e.target.value})}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-bold text-slate-700 outline-none focus:border-primary appearance-none">
                    <option value="">Select Ledger...</option>
                    {ledgers.map(l => <option key={l.id} value={l.id}>{l.name} ({l.category})</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Credit Account (Source)*</label>
                <div className="relative">
                  <select value={form.creditLedgerId} onChange={e => setForm({...form, creditLedgerId: e.target.value})}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-bold text-slate-700 outline-none focus:border-primary appearance-none">
                    <option value="">Select Ledger...</option>
                    {ledgers.map(l => <option key={l.id} value={l.id}>{l.name} ({l.category})</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Amount (₹)*</label>
                <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-lg font-black italic text-primary outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Narration</label>
                <input type="text" placeholder="Enter narration..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Entry Validated</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ debitLedgerId: '', creditLedgerId: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), description: '' })}
                className="px-5 py-2.5 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase">Clear</button>
              <button type="submit" disabled={submitting}
                className="px-8 py-2.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Entry'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Voucher Posted Successfully</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
