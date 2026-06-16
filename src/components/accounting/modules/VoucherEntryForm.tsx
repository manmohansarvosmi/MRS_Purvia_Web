import React, { useState, useEffect } from 'react';
import { 
  Repeat, ArrowRightLeft, Banknote, FileText, ShoppingCart, CreditCard,
  CloudUpload, Calendar, ChevronDown, CheckCircle2, Loader2, LayoutGrid
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
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    debitId: '', creditId: '', // These can be either ledger or account IDs
    debitType: 'LEDGER' as 'LEDGER' | 'ACCOUNT',
    creditType: 'ACCOUNT' as 'LEDGER' | 'ACCOUNT',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'), 
    description: '',
    category: 'EXPENSE'
  });

  const types = [
    { id: 'Payment' as VoucherType, icon: CreditCard },
    { id: 'Receipt' as VoucherType, icon: Banknote },
    { id: 'Journal' as VoucherType, icon: FileText },
    { id: 'Contra' as VoucherType, icon: ArrowRightLeft },
    { id: 'Sales' as VoucherType, icon: ShoppingCart },
    { id: 'Purchase' as VoucherType, icon: CreditCard },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ledres, accres] = await Promise.all([
          accountsApi.getAllLedgers(),
          accountsApi.getAllAccounts()
        ]);
        if (ledres.status === 1) setLedgers(ledres.data || []);
        if (accres.status === 1) setBankAccounts(accres.data || []);
      } catch (e) {
        toast.error('Failed to load accounts/ledgers');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.debitId || !form.creditId || !form.amount) {
      toast.error('Please select both debit and credit entities'); return;
    }
    try {
      setSubmitting(true);
      const res = await accountsApi.saveTransaction({
        debitLedger: form.debitType === 'LEDGER' ? { id: Number(form.debitId) } : null,
        debitAccount: form.debitType === 'ACCOUNT' ? { id: Number(form.debitId) } : null,
        creditLedger: form.creditType === 'LEDGER' ? { id: Number(form.creditId) } : null,
        creditAccount: form.creditType === 'ACCOUNT' ? { id: Number(form.creditId) } : null,
        amount: Number(form.amount),
        transactionDate: form.date,
        transactionNumber: `VCH-${Date.now().toString().slice(-6)}`,
        description: form.description || `${activeType} Entry`,
        referenceType: activeType.toUpperCase()
      });
      if (res.status === 1) {
        setShowSuccess(true);
        setForm({ ...form, debitId: '', creditId: '', amount: '', description: '' });
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        toast.error(res.message || 'Error saving voucher');
      }
    } catch (e) {
      toast.error('Network Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-300 pb-12 pt-4">
      
      {/* ── Main Form ── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <FileText size={16} className="text-white" />
             </div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Record Transaction Entry</h3>
          </div>
          <input 
            type="date" 
            value={form.date} 
            onChange={e => setForm({...form, date: e.target.value})}
            className="bg-white text-[11px] font-bold border border-slate-200 rounded-md px-3 py-1 outline-none focus:border-primary" 
          />
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
           {/* Debit Column */}
           <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Select Expense / Purpose*</label>
                <select 
                  value={form.debitId} 
                  onChange={e => setForm({...form, debitId: e.target.value, debitType: 'LEDGER'})}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 focus:border-primary outline-none"
                >
                  <option value="">Select category...</option>
                  {ledgers.map(l => <option key={`l-${l.id}`} value={l.id}>{l.name} ({l.category})</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Paid From (Bank / Cash)*</label>
                <select 
                  value={form.creditId} 
                  onChange={e => setForm({...form, creditId: e.target.value, creditType: 'ACCOUNT'})}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 focus:border-primary outline-none"
                >
                  <option value="">Select payment source...</option>
                  {bankAccounts.map(a => <option key={`a-${a.id}`} value={a.id}>{a.name} (Balance: ₹{a.currentBalance})</option>)}
                </select>
              </div>
           </div>

           {/* Amount & Description Column */}
           <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount (₹)*</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={form.amount} 
                  onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg text-lg font-black text-slate-900 focus:bg-white focus:border-primary outline-none transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Narration / Remark</label>
                <textarea 
                  placeholder="Details of transaction..." 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full h-14 p-3 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 focus:border-primary outline-none resize-none" 
                />
              </div>
           </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setForm({ ...form, debitId: '', creditId: '', amount: '', description: '' })}
              className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
            >
              Clear Form
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-primary/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              Save Voucher
            </button>
        </div>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-3 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Transaction Recorded</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
