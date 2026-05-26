import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowRightLeft, 
  Search, 
  MoreVertical,
  Building2,
  Banknote,
  Smartphone,
  Wallet,
  ArrowUpRight,
  Loader2,
  X,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { accountsApi } from '@/src/lib/api';
import { toast } from 'sonner';

export const AccountManager = () => {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLedger, setNewLedger] = useState({ 
    name: '', type: 'CASH_IN_HAND', openingBalance: 0,
    accountNumber: '', ifscCode: '', accountHolderName: '', bankName: '',
    branchName: '', currency: 'INR', status: 'ACTIVE', description: ''
  });
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transfer, setTransfer] = useState({ fromId: '', toId: '', amount: '' });

  useEffect(() => { fetchLedgers(); }, []);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await accountsApi.getAllAccounts();
      if (res.status === 1) setLedgers(res.data);
    } catch (e) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'BANK_ACCOUNT': return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'CASH_IN_HAND': return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      case 'UPI': return <Smartphone className="w-3.5 h-3.5 text-indigo-600" />;
      case 'WALLET': return <Wallet className="w-3.5 h-3.5 text-purple-600" />;
      case 'CREDIT_CARD': return <CreditCard className="w-3.5 h-3.5 text-rose-600" />;
      default: return <Wallet className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const handleSaveLedger = async () => {
    if (!newLedger.name) { toast.error('Account name is required'); return; }
    try {
      setSaving(true);
      const payload = { ...newLedger };
      const nonBankTypes = ['CASH_IN_HAND', 'WALLET', 'UPI'];
      if (nonBankTypes.includes(payload.type)) {
        delete (payload as any).accountNumber;
        delete (payload as any).ifscCode;
        delete (payload as any).accountHolderName;
        delete (payload as any).bankName;
        delete (payload as any).branchName;
      }
      const res = await accountsApi.saveAccount(payload);
      if (res.status === 1) {
        toast.success('Account created successfully');
        setIsAddOpen(false);
        setNewLedger({ 
          name: '', type: 'CASH_IN_HAND', openingBalance: 0,
          accountNumber: '', ifscCode: '', accountHolderName: '', bankName: '',
          branchName: '', currency: 'INR', status: 'ACTIVE', description: ''
        });
        fetchLedgers();
      } else {
        toast.error(res.message || 'Failed to create account');
      }
    } catch (e) {
      toast.error('Error creating account');
    } finally {
      setSaving(false);
    }
  };

  const handleTransfer = async () => {
    if (!transfer.fromId || !transfer.toId || !transfer.amount) {
      toast.error('All fields are required'); return;
    }
    try {
      setTransferring(true);
      const txn = {
        debitLedger: { id: Number(transfer.toId) },
        creditLedger: { id: Number(transfer.fromId) },
        amount: Number(transfer.amount),
        description: 'Fund Transfer',
        referenceType: 'TRANSFER'
      };
      const res = await accountsApi.saveTransaction(txn);
      if (res.status === 1) {
        toast.success('Transfer successful');
        setIsTransferOpen(false);
        setTransfer({ fromId: '', toId: '', amount: '' });
        fetchLedgers();
      } else {
        toast.error(res.message || 'Transfer failed');
      }
    } catch (e) {
      toast.error('Transfer error');
    } finally {
      setTransferring(false);
    }
  };

  const filtered = ledgers.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()));
  const totalBalance = ledgers.reduce((s, a) => s + (a.currentBalance || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Bank & Cash Master</h2>
          <div className="flex items-center gap-2 mt-0.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Real-time Asset Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" placeholder="Search accounts..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all w-56 shadow-sm"
            />
          </div>
          <button onClick={() => setIsAddOpen(true)} className="h-10 px-5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Bank Reserves', val: ledgers.filter(a => a.type === 'BANK_ACCOUNT').reduce((s, a) => s + (a.currentBalance || 0), 0), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Liquid Cash', val: ledgers.filter(a => a.type === 'CASH_IN_HAND').reduce((s, a) => s + (a.currentBalance || 0), 0), icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Credit/Debt', val: ledgers.filter(a => a.type === 'CREDIT_CARD').reduce((s, a) => s + (a.currentBalance || 0), 0), icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Net Liquidity', val: totalBalance, icon: Wallet, color: 'text-slate-900', bg: 'bg-slate-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={cn("text-lg font-black italic tracking-tighter", stat.color)}>₹{stat.val.toLocaleString()}</h3>
            </div>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Account Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[8px] font-black tracking-[0.2em] border-b border-slate-100">
                <th className="p-5">Account Head</th>
                <th className="p-5">Classification</th>
                <th className="p-5 text-right">Balance</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold text-slate-700 uppercase tracking-tight divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-[10px] uppercase font-black tracking-[0.3em]">Syncing Helixion Accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-[10px] text-slate-300 uppercase font-bold tracking-widest italic animate-pulse">
                    No active accounts found in database
                  </td>
                </tr>
              ) : filtered.map((acc, idx) => (
                <tr key={acc.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-1.5 h-8 rounded-full transition-all group-hover:h-10", 
                        acc.type === 'BANK_ACCOUNT' ? "bg-blue-500" : 
                        acc.type === 'CASH_IN_HAND' ? "bg-emerald-500" : "bg-slate-300")} />
                      <div>
                        <span className="text-slate-900 text-xs block font-black italic">{acc.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {acc.accountNumber && <span className="text-[8px] text-slate-400 font-mono tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded">A/C: ****{acc.accountNumber.slice(-4)}</span>}
                          {acc.branchName && <span className="text-[8px] text-slate-300 font-medium">@ {acc.branchName}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6">
                        {getIcon(acc.type)}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-900 leading-none mb-1">{acc.type?.replace('_', ' ')}</p>
                        <p className="text-[8px] text-slate-400 font-medium tracking-[0.2em]">{acc.currency}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <p className={cn("text-base font-black italic tracking-tighter transition-all group-hover:scale-105 origin-right", 
                      (acc.currentBalance || 0) >= 0 ? "text-slate-900" : "text-rose-600")}>
                      {acc.currency === 'INR' ? '₹' : acc.currency} {Math.abs(acc.currentBalance || 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="p-5">
                    <span className={cn("px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit shadow-sm border", 
                      acc.status === 'ACTIVE' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      {acc.status === 'ACTIVE' ? <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
                      {acc.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button className="w-8 h-8 rounded-lg text-slate-300 hover:text-primary hover:bg-red-50 transition-all flex items-center justify-center mx-auto">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] my-auto border border-white/20"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Register New Asset</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Initialize bank or cash holdings</p>
                </div>
                <button onClick={() => setIsAddOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all font-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account Name*</label>
                    <input value={newLedger.name} onChange={e => setNewLedger({...newLedger, name: e.target.value})}
                      placeholder="e.g. HDFC Current Account" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account Type</label>
                    <select value={newLedger.type} onChange={e => setNewLedger({...newLedger, type: e.target.value})}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                      <option value="CASH_IN_HAND">Cash in Hand</option>
                      <option value="BANK_ACCOUNT">Bank Account</option>
                      <option value="UPI">UPI / Digital Payment</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="WALLET">Wallet</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Currency</label>
                      <select value={newLedger.currency} onChange={e => setNewLedger({...newLedger, currency: e.target.value})}
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                      <select value={newLedger.status} onChange={e => setNewLedger({...newLedger, status: e.target.value})}
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Opening Balance</label>
                    <input type="number" value={newLedger.openingBalance} onChange={e => setNewLedger({...newLedger, openingBalance: parseFloat(e.target.value) || 0})}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode='wait'>
                    {['BANK_ACCOUNT', 'CREDIT_CARD', 'UPI'].includes(newLedger.type) ? (
                      <motion.div key="bank-fields" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Bank Name</label>
                          <input value={newLedger.bankName} onChange={e => setNewLedger({...newLedger, bankName: e.target.value})}
                            placeholder="e.g. HDFC Bank" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account Number</label>
                          <input value={newLedger.accountNumber} onChange={e => setNewLedger({...newLedger, accountNumber: e.target.value})}
                            placeholder="0123456789" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">IFSC Code</label>
                            <input value={newLedger.ifscCode} onChange={e => setNewLedger({...newLedger, ifscCode: e.target.value})}
                              placeholder="HDFC0001234" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary uppercase" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Branch Name</label>
                            <input value={newLedger.branchName} onChange={e => setNewLedger({...newLedger, branchName: e.target.value})}
                              placeholder="City/State" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">A/c Holder Name</label>
                          <input value={newLedger.accountHolderName} onChange={e => setNewLedger({...newLedger, accountHolderName: e.target.value})}
                            placeholder="Exact name as per bank" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="desc-field" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                         <textarea value={newLedger.description} onChange={e => setNewLedger({...newLedger, description: e.target.value})}
                           rows={6} placeholder="Notes about this cash/wallet source..." 
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] font-bold outline-none focus:border-primary resize-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                <button onClick={handleSaveLedger} disabled={saving}
                  className="flex-[2] py-3 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {isTransferOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase italic">Fund Transfer</h3>
                <button onClick={() => setIsTransferOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">From</label>
                    <select value={transfer.fromId} onChange={e => setTransfer({...transfer, fromId: e.target.value})}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                      <option value="">Select...</option>
                      {ledgers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">To</label>
                    <select value={transfer.toId} onChange={e => setTransfer({...transfer, toId: e.target.value})}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                      <option value="">Select...</option>
                      {ledgers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Amount (₹)</label>
                  <input type="number" placeholder="0.00" value={transfer.amount} onChange={e => setTransfer({...transfer, amount: e.target.value})}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xl font-black italic text-slate-900 outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsTransferOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                <button onClick={handleTransfer} disabled={transferring}
                  className="flex-[2] py-2.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {transferring ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Transfer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
