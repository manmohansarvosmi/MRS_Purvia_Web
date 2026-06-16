import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Eye, Edit2, Loader2, X, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { accountsApi } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

export const LedgerDirectory = () => {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<any>(null);
  const [newLedger, setNewLedger] = useState({ name: '', category: 'EXPENSE', description: '', openingBalance: 0 });
  const [saving, setSaving] = useState(false);

  const categories = ['All', 'ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'];

  useEffect(() => { fetchLedgers(); }, []);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await accountsApi.getAllLedgers();
      if (res.status === 1) setLedgers(res.data || []);
    } catch {
      toast.error('Failed to load ledgers');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLedger = async () => {
    if (!newLedger.name) { toast.error('Ledger name is required'); return; }
    try {
      setSaving(true);
      const res = editingLedger 
        ? await accountsApi.updateLedger(editingLedger.id, newLedger)
        : await accountsApi.saveLedger(newLedger as any);

      if (res.status === 1) {
        toast.success(editingLedger ? 'Ledger updated' : 'Ledger created');
        setIsAddOpen(false);
        setEditingLedger(null);
        setNewLedger({ name: '', category: 'EXPENSE', description: '', openingBalance: 0 });
        fetchLedgers();
      } else toast.error(res.message || 'Failed');
    } catch {
      toast.error('Error saving ledger');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLedger = async (id: number, name: string) => {
    if (!window.confirm(`Delete ledger "${name}"?`)) return;
    try {
      // Note: accountsApi doesn't have deleteLedger yet, we should add it to api.ts
      // or use a consistent endpoint. For now assuming we add it.
      const res = await (accountsApi as any).deleteLedger(id);
      if (res.status === 1) {
        toast.success('Ledger deleted');
        fetchLedgers();
      } else toast.error(res.message || 'Delete failed');
    } catch {
      toast.error('Error deleting ledger');
    }
  };

  const safeLedgers = Array.isArray(ledgers) ? ledgers : [];

  const filtered = useMemo(() => safeLedgers.filter(l => {
    const matchCat = activeCategory === 'All' || l.category?.toUpperCase() === activeCategory;
    const matchSearch = l.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeCategory, search, safeLedgers]);

  const totalAssets = safeLedgers.filter(l => ['ASSET','BANK','CASH'].includes(l.category?.toUpperCase())).reduce((s,l) => s + (l.currentBalance || 0), 0);
  const totalLiabilities = safeLedgers.filter(l => l.category?.toUpperCase() === 'LIABILITY').reduce((s,l) => s + (l.currentBalance || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2>Ledger Registry</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Chart of Accounts & General Ledger Directory</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar">
            <Search />
            <input 
              placeholder="Search ledgers..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
          <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
            <Plus size={13} /> New Ledger
          </button>
        </div>
      </div>

      {/* ── Dashboard Stats Bar ── */}
      <div className="flex items-center gap-10 px-5 py-4 shrink-0" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <p className="erp-label !mb-1">Total Ledgers</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{ledgers.length}</p>
        </div>
        <div>
          <p className="erp-label !mb-1">Asset Value</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#059669' }}>₹{totalAssets.toLocaleString()}</p>
        </div>
        <div>
          <p className="erp-label !mb-1">Liabilities</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#DC2626' }}>₹{totalLiabilities.toLocaleString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 h-7 rounded border text-[10px] font-bold uppercase tracking-wider transition-all",
                activeCategory === cat 
                  ? "bg-slate-800 text-white border-slate-800" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Data View ── */}
      <div className="flex-1 overflow-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: 'center' }}>CODE</th>
              <th>Ledger Name</th>
              <th>Category</th>
              <th>Description / Sub-group</th>
              <th style={{ textAlign: 'right' }}>Current Balance</th>
              <th style={{ width: 80, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin" color="#C8102E" />
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Indexing Chart of Accounts...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 12 }}>
                  No ledger accounts found.
                </td>
              </tr>
            ) : filtered.map((ledger) => (
              <tr key={ledger.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
                  {ledger.id?.toString().padStart(4, '0')}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-7 h-7 shrink-0 flex items-center justify-center text-[10px] font-bold text-white rounded"
                      style={{ background: ledger.category === 'EXPENSE' ? '#DC2626' : ledger.category === 'INCOME' ? '#059669' : '#1E2330' }}
                    >
                      {ledger.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500, color: '#111827' }}>{ledger.name}</span>
                  </div>
                </td>
                <td>
                  <span className={cn(
                    "badge",
                    ledger.category === 'ASSET' ? 'badge-info' : 
                    ledger.category === 'LIABILITY' ? 'badge-warning' :
                    ledger.category === 'INCOME' ? 'badge-success' : 'badge-danger'
                  )}>
                    {ledger.category}
                  </span>
                </td>
                <td style={{ fontSize: 11, color: '#9CA3AF' }}>{ledger.description || '—'}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 13, color: (ledger.currentBalance || 0) < 0 ? '#DC2626' : '#111827' }}>
                  ₹{Math.abs(ledger.currentBalance || 0).toLocaleString()}
                  <span style={{ fontSize: 10, marginLeft: 4, fontWeight: 500, color: '#9CA3AF' }}>{(ledger.currentBalance || 0) >= 0 ? 'DR' : 'CR'}</span>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <button className="btn-ghost" onClick={() => {
                        setEditingLedger(ledger);
                        setNewLedger({
                            name: ledger.name || '',
                            category: ledger.category || 'EXPENSE',
                            description: ledger.description || '',
                            openingBalance: ledger.openingBalance || 0
                        });
                        setIsAddOpen(true);
                    }}><Edit2 size={13} /></button>
                    <button className="btn-ghost text-red-500 hover:bg-red-50" onClick={() => handleDeleteLedger(ledger.id, ledger.name)}>
                        <X size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
        <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Registered Ledger Accounts: <strong style={{ color: '#111827' }}>{filtered.length}</strong>
        </p>
      </div>

      {/* ── Add Modal ── */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
              style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 400, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>{editingLedger ? 'Edit Ledger Details' : 'New General Ledger'}</h3>
                <button onClick={() => {
                    setIsAddOpen(false);
                    setEditingLedger(null);
                    setNewLedger({ name: '', category: 'EXPENSE', description: '', openingBalance: 0 });
                }} className="btn-ghost !p-1"><X size={16} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="erp-label">Account Name *</label>
                  <input autoFocus className="erp-input" value={newLedger.name} onChange={e => setNewLedger({...newLedger, name: e.target.value})} placeholder="e.g. Sales Revenue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="erp-label">Category</label>
                    <select className="erp-select" value={newLedger.category} onChange={e => setNewLedger({...newLedger, category: e.target.value})}>
                      {['ASSET','LIABILITY','INCOME','EXPENSE'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="erp-label">Opening Bal.</label>
                    <input type="number" className="erp-input" value={newLedger.openingBalance} onChange={e => setNewLedger({...newLedger, openingBalance: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div>
                  <label className="erp-label">Description (Optional)</label>
                  <textarea 
                    style={{ width: '100%', minHeight: 60, padding: 8, border: '1px solid #D1D5DB', borderRadius: 4, fontSize: 12, outline: 'none' }}
                    value={newLedger.description} onChange={e => setNewLedger({...newLedger, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
                <button className="btn-secondary" onClick={() => {
                    setIsAddOpen(false);
                    setEditingLedger(null);
                    setNewLedger({ name: '', category: 'EXPENSE', description: '', openingBalance: 0 });
                }}>Cancel</button>
                <button className="btn-primary" onClick={handleSaveLedger} disabled={saving}>
                  {saving ? <Loader2 size={13} className="animate-spin" /> : editingLedger ? 'Update Ledger' : 'Create Ledger'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
