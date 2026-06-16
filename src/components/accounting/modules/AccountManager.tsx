import React, { useState, useEffect } from 'react';
import {
  Plus, Search, ArrowRightLeft, X, Edit2, Trash2,
  Loader2, Landmark, Wallet, CreditCard, Banknote, Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { accountsApi } from '@/src/lib/api';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  CASH_IN_HAND: 'Cash', BANK_ACCOUNT: 'Bank',
  UPI: 'UPI', CREDIT_CARD: 'Card', WALLET: 'Wallet',
};

const TYPE_COLORS: Record<string, string> = {
  CASH_IN_HAND: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  BANK_ACCOUNT: 'bg-blue-50 text-blue-700 border-blue-100',
  UPI:          'bg-violet-50 text-violet-700 border-violet-100',
  CREDIT_CARD:  'bg-amber-50 text-amber-700 border-amber-100',
  WALLET:       'bg-slate-50 text-slate-600 border-slate-200',
};

const EMPTY_FORM = {
  name: '', category: 'CASH_IN_HAND', currentBalance: 0,
  accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '',
};

export const AccountManager = () => {
  const [ledgers, setLedgers]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [newLedger, setNewLedger]       = useState({ ...EMPTY_FORM });
  const [saving, setSaving]             = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [transferring, setTransferring] = useState(false);
  const [transfer, setTransfer]         = useState({ fromId: '', toId: '', amount: '' });

  useEffect(() => { fetchLedgers(); }, []);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await accountsApi.getAllAccounts();
      if (res.status === 1) setLedgers(res.data || []);
    } catch { toast.error('Failed to load accounts'); }
    finally { setLoading(false); }
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    setEditingAccount(null);
    setNewLedger({ ...EMPTY_FORM });
  };

  const handleSaveLedger = async () => {
    if (!newLedger.name) { toast.error('Account name is required'); return; }
    try {
      setSaving(true);
      const res = editingAccount
        ? await accountsApi.updateAccount(editingAccount.id, newLedger)
        : await accountsApi.saveAccount(newLedger);
      if (res.status === 1) {
        toast.success(editingAccount ? 'Account updated' : 'Account created');
        closeAddModal();
        fetchLedgers();
      } else toast.error(res.message || 'Failed');
    } catch { toast.error('Error saving account'); }
    finally { setSaving(false); }
  };

  const handleTransfer = async () => {
    if (!transfer.fromId || !transfer.toId || !transfer.amount) { toast.error('All fields required'); return; }
    try {
      setTransferring(true);
      const res = await accountsApi.saveTransaction({
        debitAccount:  { id: Number(transfer.toId) },
        creditAccount: { id: Number(transfer.fromId) },
        amount: Number(transfer.amount),
        description: 'Fund Transfer', referenceType: 'TRANSFER',
      });
      if (res.status === 1) {
        toast.success('Transfer successful');
        setIsTransferOpen(false);
        setTransfer({ fromId: '', toId: '', amount: '' });
        fetchLedgers();
      } else toast.error(res.message || 'Transfer failed');
    } catch { toast.error('Transfer error'); }
    finally { setTransferring(false); }
  };

  const safeLedgers  = Array.isArray(ledgers) ? ledgers : [];
  const filtered     = safeLedgers.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()));
  const totalBalance = safeLedgers.reduce((s, a) => s + (a.currentBalance || 0), 0);
  const bankBalance  = safeLedgers.filter(a => a.category === 'BANK_ACCOUNT').reduce((s, a) => s + (a.currentBalance || 0), 0);
  const cashBalance  = safeLedgers.filter(a => a.category === 'CASH_IN_HAND').reduce((s, a) => s + (a.currentBalance || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">

      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8 shadow-sm">
            <Landmark size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Financial Accounts</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Bank, Cash &amp; Digital Ledgers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-56">
            <Search size={12} className="text-slate-400" />
            <input
              placeholder="Search accounts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium"
            />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]" onClick={() => setIsTransferOpen(true)}>
            <ArrowRightLeft size={11} /> Transfer
          </button>
          <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20" onClick={() => setIsAddOpen(true)}>
            <Plus size={14} /> New Account
          </button>
        </div>
      </div>

      {/* ── Summary Bar ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Bank Reserves</p>
          <p className="text-[14px] font-black text-slate-900 italic">₹{bankBalance.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Liquid Cash</p>
          <p className="text-[14px] font-black text-slate-900 italic">₹{cashBalance.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Equity</p>
          <p className="text-[14px] font-black text-primary italic">₹{totalBalance.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Sync Active</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-[90px]">A/C ID</th>
              <th>Account Name</th>
              <th className="w-[110px]">Category</th>
              <th>Bank Information</th>
              <th>A/C Holder</th>
              <th className="w-[140px] text-right">Balance</th>
              <th className="w-[90px] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Accounts...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <Landmark size={32} />
                    <p className="text-[11px] font-black uppercase tracking-widest">No accounts found</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(acc => (
              <tr key={acc.id} className="group">
                <td className="font-mono text-[10px] font-black text-primary italic">
                  #{acc.id?.toString().padStart(3, '0')}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors font-black text-[9px] uppercase">
                      {acc.name?.slice(0, 2)}
                    </div>
                    <span className="text-[10.5px] font-black text-slate-900 uppercase tracking-tight">{acc.name}</span>
                  </div>
                </td>
                <td>
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-[3px] border',
                    TYPE_COLORS[acc.category] || 'bg-slate-50 text-slate-600 border-slate-200'
                  )}>
                    {TYPE_LABELS[acc.category] || acc.category}
                  </span>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="text-[10.5px] font-bold text-slate-700">{acc.bankName || 'N/A'}</span>
                    {acc.accountNumber && (
                      <span className="text-slate-400 font-mono text-[9px] mt-0.5">
                        {acc.accountNumber}{acc.ifscCode ? ` | ${acc.ifscCode}` : ''}
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-[10.5px] font-semibold text-slate-600">
                  {acc.accountHolderName || '—'}
                </td>
                <td className="text-right">
                  <span className={cn(
                    'text-[12px] font-black italic tracking-tighter',
                    (acc.currentBalance || 0) < 0 ? 'text-primary' : 'text-slate-900'
                  )}>
                    ₹{(acc.currentBalance || 0).toLocaleString()}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-[5px] transition-all"
                      title="Edit"
                      onClick={() => {
                        setEditingAccount(acc);
                        setNewLedger({
                          name: acc.name || '', category: acc.category || 'CASH_IN_HAND',
                          currentBalance: acc.currentBalance || 0, accountNumber: acc.accountNumber || '',
                          ifscCode: acc.ifscCode || '', bankName: acc.bankName || '',
                          accountHolderName: acc.accountHolderName || '',
                        });
                        setIsAddOpen(true);
                      }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[5px] transition-all"
                      title="Delete"
                      onClick={async () => {
                        if (window.confirm(`Delete account "${acc.name}"?`)) {
                          try {
                            const res = await accountsApi.deleteAccount(acc.id);
                            if (res.status === 1) { toast.success('Account deleted'); fetchLedgers(); }
                            else toast.error(res.message || 'Delete failed');
                          } catch { toast.error('Error deleting account'); }
                        }
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Account Registry — {filtered.length} of {safeLedgers.length} Active Nodes
        </p>
      </div>

      {/* ══ NEW / EDIT ACCOUNT MODAL ══ */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden border border-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div>
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
                    {editingAccount ? 'Edit Account' : 'New Account'}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                    {editingAccount ? 'Update existing account details' : 'Add to financial ledger'}
                  </p>
                </div>
                <button
                  onClick={closeAddModal}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="erp-label">Category / Type</label>
                    <select className="erp-select" value={newLedger.category} onChange={e => setNewLedger({ ...newLedger, category: e.target.value })}>
                      <option value="CASH_IN_HAND">Cash in Hand</option>
                      <option value="BANK_ACCOUNT">Bank Account</option>
                      <option value="UPI">UPI / Digital Wallet</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="WALLET">Other Digital Asset</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="erp-label">Account Name *</label>
                    <input
                      autoFocus
                      className="erp-input"
                      placeholder="e.g. HDFC Primary or Office Cash"
                      value={newLedger.name}
                      onChange={e => setNewLedger({ ...newLedger, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="erp-label">Opening Balance (₹)</label>
                    <input
                      className="erp-input"
                      type="number" placeholder="0.00"
                      value={newLedger.currentBalance}
                      onChange={e => setNewLedger({ ...newLedger, currentBalance: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="erp-label">Account Holder Name</label>
                    <input
                      className="erp-input"
                      placeholder="Name as per records"
                      value={newLedger.accountHolderName}
                      onChange={e => setNewLedger({ ...newLedger, accountHolderName: e.target.value })}
                    />
                  </div>

                  {newLedger.category !== 'CASH_IN_HAND' && (
                    <>
                      <div className="col-span-2 h-px bg-slate-100 my-1" />
                      <div>
                        <label className="erp-label">Bank Name</label>
                        <input className="erp-input" placeholder="e.g. Axis Bank" value={newLedger.bankName} onChange={e => setNewLedger({ ...newLedger, bankName: e.target.value })} />
                      </div>
                      <div>
                        <label className="erp-label">Account Number</label>
                        <input className="erp-input" placeholder="Account #" value={newLedger.accountNumber} onChange={e => setNewLedger({ ...newLedger, accountNumber: e.target.value })} />
                      </div>
                      <div className="col-span-2">
                        <label className="erp-label">IFSC Code</label>
                        <input className="erp-input" placeholder="AXIS0001234" value={newLedger.ifscCode} onChange={e => setNewLedger({ ...newLedger, ifscCode: e.target.value })} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/40">
                <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]" onClick={closeAddModal}>Cancel</button>
                <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px]" onClick={handleSaveLedger} disabled={saving}>
                  {saving ? <Loader2 size={13} className="animate-spin" /> : editingAccount ? 'Update Account' : 'Save Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ TRANSFER MODAL ══ */}
      <AnimatePresence>
        {isTransferOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-[380px] overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div>
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">Fund Transfer</h3>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Move balance between accounts</p>
                </div>
                <button
                  onClick={() => setIsTransferOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="erp-label">From Account</label>
                  <select className="erp-select" value={transfer.fromId} onChange={e => setTransfer({ ...transfer, fromId: e.target.value })}>
                    <option value="">Select account...</option>
                    {ledgers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="erp-label">To Account</label>
                  <select className="erp-select" value={transfer.toId} onChange={e => setTransfer({ ...transfer, toId: e.target.value })}>
                    <option value="">Select account...</option>
                    {ledgers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="erp-label">Amount (₹)</label>
                  <input
                    className="erp-input text-[18px] font-black"
                    type="number" placeholder="0.00"
                    value={transfer.amount}
                    onChange={e => setTransfer({ ...transfer, amount: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/40">
                <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]" onClick={() => setIsTransferOpen(false)}>Cancel</button>
                <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px]" onClick={handleTransfer} disabled={transferring}>
                  {transferring ? <Loader2 size={13} className="animate-spin" /> : 'Confirm Transfer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
