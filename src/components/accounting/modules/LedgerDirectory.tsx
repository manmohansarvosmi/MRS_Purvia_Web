import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Layers, History, Plus, Filter, ArrowRight,
  TrendingDown, TrendingUp, MoreVertical, Eye, Edit2, Trash2, Loader2, X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ledgersApi } from '@/src/lib/api';
import { toast } from 'sonner';

export const LedgerDirectory = () => {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLedger, setNewLedger] = useState({ name: '', category: 'EXPENSE', description: '', openingBalance: 0 });
  const [saving, setSaving] = useState(false);

  const categories = ['All', 'ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'];

  useEffect(() => { fetchLedgers(); }, []);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await ledgersApi.getAllLedgers();
      if (res.status === 1) setLedgers(res.data);
    } catch (e) {
      toast.error('Failed to load ledgers');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLedger = async () => {
    if (!newLedger.name) { toast.error('Ledger name is required'); return; }
    try {
      setSaving(true);
      const res = await ledgersApi.saveLedger(newLedger);
      if (res.status === 1) {
        toast.success('Ledger created');
        setIsAddOpen(false);
        setNewLedger({ name: '', category: 'EXPENSE', description: '', openingBalance: 0 });
        fetchLedgers();
      } else {
        toast.error(res.message || 'Failed');
      }
    } catch (e) {
      toast.error('Error saving ledger');
    } finally {
      setSaving(false);
    }
  };

  const filteredLedgers = useMemo(() => ledgers.filter(l => {
    const matchCat = activeCategory === 'All' || l.category?.toUpperCase() === activeCategory;
    const matchSearch = l.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeCategory, search, ledgers]);

  const totalAssets = ledgers.filter(l => ['ASSET','BANK','CASH'].includes(l.category?.toUpperCase())).reduce((s,l) => s + (l.currentBalance || 0), 0);
  const totalLiabilities = ledgers.filter(l => l.category?.toUpperCase() === 'LIABILITY').reduce((s,l) => s + (l.currentBalance || 0), 0);
  const assetPct = totalAssets + totalLiabilities > 0 ? Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100) : 0;

  const getCategoryColor = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'ASSET': case 'BANK': case 'CASH': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'LIABILITY': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'INCOME': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  const getAvatar = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'INCOME': return 'bg-emerald-600';
      case 'EXPENSE': return 'bg-rose-500';
      case 'ASSET': case 'BANK': case 'CASH': return 'bg-slate-900';
      default: return 'bg-amber-500';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input placeholder="Search ledgers by name..." className="pl-10 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-primary transition-all"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> New Ledger
        </Button>
      </div>

      {/* Filter Shelf */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 border border-slate-100 rounded-2xl shadow-sm">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              activeCategory === cat ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600 bg-slate-50"
            )}>{cat}</button>
        ))}
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <Card className="rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b border-slate-200">
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Account Name</TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Category</TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-right">Balance</TableHead>
                    <TableHead className="h-12 px-6 text-right text-[11px] font-bold uppercase text-slate-500 tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30"><Loader2 className="w-6 h-6 animate-spin" /><span className="text-[9px] uppercase">Loading Ledgers...</span></div>
                      </TableCell>
                    </TableRow>
                  ) : filteredLedgers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center text-[9px] text-slate-400 uppercase tracking-widest italic">
                        No ledgers found. Create your Chart of Accounts.
                      </TableCell>
                    </TableRow>
                  ) : filteredLedgers.map((ledger) => (
                    <TableRow key={ledger.id} className="group hover:bg-slate-50/80 border-b border-slate-50 transition-all">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm", getAvatar(ledger.category))}>
                            {ledger.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm leading-none mb-1">{ledger.name}</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter italic">{ledger.description || ledger.code || '—'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 text-[8px] font-black uppercase italic border transition-all", getCategoryColor(ledger.category))}>
                          {ledger.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <p className={cn("text-base font-black italic", (ledger.currentBalance || 0) >= 0 ? "text-emerald-600" : "text-rose-600")}>
                          ₹{Math.abs(ledger.currentBalance || 0).toLocaleString()}
                          <span className="text-[9px] ml-1 uppercase">{(ledger.currentBalance || 0) >= 0 ? 'Dr' : 'Cr'}</span>
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-primary shadow-sm"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-primary shadow-sm"><Edit2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-100 shadow-xl p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 italic text-white/50">Core Metrics</h3>
            <div className="space-y-6">
              {[
                { label: 'Asset Magnitude', percentage: assetPct, color: 'bg-emerald-500' },
                { label: 'Liability Split', percentage: 100 - assetPct, color: 'bg-rose-500' },
              ].map((bar, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40">
                    <span>{bar.label}</span><span>{bar.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${bar.percentage}%` }} className={cn("h-full", bar.color)} />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] font-bold text-emerald-400 uppercase italic mb-1">Status: Live Sync</p>
                <p className="text-xl font-black italic">₹{totalAssets.toLocaleString()} <span className="text-[10px] text-white/20 not-italic">Total Assets</span></p>
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl border border-slate-100 p-5 bg-white shadow-lg space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center"><History className="w-4 h-4 text-slate-400" /></div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Audit Summary</h4>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group hover:bg-emerald-50 transition-colors">
                <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-emerald-600">Total Ledgers</span>
                <span className="text-sm font-black italic text-emerald-600">{ledgers.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group hover:bg-blue-50 transition-colors">
                <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-blue-600">Active</span>
                <span className="text-sm font-black italic text-blue-600">{filteredLedgers.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Ledger Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase">New Ledger Account</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Account Name*</label>
                <input value={newLedger.name} onChange={e => setNewLedger({...newLedger, name: e.target.value})}
                  placeholder="e.g. Sales Revenue" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select value={newLedger.category} onChange={e => setNewLedger({...newLedger, category: e.target.value})}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none">
                    {['ASSET','LIABILITY','INCOME','EXPENSE'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Opening Bal.</label>
                  <input type="number" value={newLedger.openingBalance} onChange={e => setNewLedger({...newLedger, openingBalance: parseFloat(e.target.value) || 0})}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-primary" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsAddOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">Cancel</button>
              <button onClick={handleSaveLedger} disabled={saving}
                className="flex-[2] py-2.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Ledger'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
