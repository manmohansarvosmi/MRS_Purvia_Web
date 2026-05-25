import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  History, 
  Plus, 
  Filter, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LedgerItem {
  id: string;
  name: string;
  category: 'Assets' | 'Liabilities' | 'Income' | 'Expenses';
  balance: number;
  transactions: number;
  status: 'Active' | 'Archived';
  lastActivity: string;
}

const mockLedgers: LedgerItem[] = [
  { id: 'l1', name: 'Sales Revenue', category: 'Income', balance: 1250000, transactions: 142, status: 'Active', lastActivity: 'Today' },
  { id: 'l2', name: 'Inventory Asset', category: 'Assets', balance: 450000, transactions: 85, status: 'Active', lastActivity: '2h ago' },
  { id: 'l3', name: 'Office Rent', category: 'Expenses', balance: 120000, transactions: 12, status: 'Active', lastActivity: 'Yesterday' },
  { id: 'l4', name: 'Vendor Payables', category: 'Liabilities', balance: -210000, transactions: 34, status: 'Active', lastActivity: 'Today' },
  { id: 'l5', name: 'Interest Income', category: 'Income', balance: 25000, transactions: 8, status: 'Active', lastActivity: '3d ago' },
  { id: 'l6', name: 'Salary Expense', category: 'Expenses', balance: 850000, transactions: 65, status: 'Active', lastActivity: 'Today' },
];

export const LedgerDirectory = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const categories = ['All', 'Assets', 'Liabilities', 'Income', 'Expenses'];
  const statuses = ['All', 'Active', 'Archived'];

  const filteredLedgers = useMemo(() => {
    return mockLedgers.filter(l => {
      const matchCategory = activeCategory === 'All' || l.category === activeCategory;
      const matchStatus = activeStatus === 'All' || l.status === activeStatus;
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });
  }, [activeCategory, activeStatus, search]);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 custom-scrollbar">
      {/* ── Header Controls ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search ledgers by name..." 
            className="pl-10 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => {}} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> New Ledger
          </Button>
        </div>
      </div>

      {/* ── Filter Shelf ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 border border-slate-100 rounded-2xl shadow-sm">
         <div className="flex items-center gap-1.5 p-1 bg-slate-50/50 rounded-xl">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 border-r border-slate-200">Group</span>
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                 activeCategory === cat ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {cat}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-1.5 p-1 bg-slate-50/50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 border-r border-slate-200">Status</span>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeStatus === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {s}
              </button>
            ))}
         </div>
      </div>

      {/* ── Data Grid ─────────────────────────────────────────────── */}
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
                          <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Activity</TableHead>
                          <TableHead className="h-12 px-6 text-right text-[11px] font-bold uppercase text-slate-500 tracking-wider">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {filteredLedgers.map((ledger) => (
                          <TableRow key={ledger.id} className="group hover:bg-slate-50/80 border-b border-slate-50 transition-all">
                             <TableCell className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm",
                                      ledger.category === 'Income' ? "bg-emerald-600" : 
                                      ledger.category === 'Expenses' ? "bg-rose-500" :
                                      ledger.category === 'Assets' ? "bg-slate-900" : "bg-amber-500"
                                   )}>
                                      {ledger.name.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="font-semibold text-slate-900 text-sm leading-none mb-1">{ledger.name}</p>
                                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter italic">Last: {ledger.lastActivity}</p>
                                   </div>
                                </div>
                             </TableCell>
                             <TableCell className="px-6 py-4">
                                <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 text-[8px] font-black uppercase italic border transition-all",
                                   ledger.category === 'Assets' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                   ledger.category === 'Liabilities' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                   ledger.category === 'Income' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                   'bg-rose-50 text-rose-600 border-rose-100'
                                )}>{ledger.category}</Badge>
                             </TableCell>
                             <TableCell className="px-6 py-4 text-right">
                                <p className={cn("text-base font-black italic", ledger.balance >= 0 ? "text-emerald-600" : "text-rose-600")}>
                                  ₹{Math.abs(ledger.balance).toLocaleString()}
                                  <span className="text-[9px] ml-1 uppercase">{ledger.balance >= 0 ? 'Dr' : 'Cr'}</span>
                                </p>
                             </TableCell>
                             <TableCell className="px-6 py-4">
                                <p className="text-[10px] font-bold text-slate-400 italic">[{ledger.transactions} Trx]</p>
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

        {/* Sidebar Summary */}
        <div className="space-y-6">
           <Card className="rounded-2xl border border-slate-100 shadow-xl p-6 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 italic text-white/50">Core Metrics</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Asset Magnitude', percentage: 75, color: 'bg-emerald-500' },
                   { label: 'Liability Split', percentage: 25, color: 'bg-rose-500' },
                 ].map((bar, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40">
                        <span>{bar.label}</span>
                        <span>{bar.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${bar.percentage}%` }} className={cn("h-full", bar.color)} />
                      </div>
                   </div>
                 ))}
                 <div className="pt-4 border-t border-white/5">
                    <p className="text-[8px] font-bold text-emerald-400 uppercase italic mb-1">Status: Operational</p>
                    <p className="text-xl font-black italic">₹42.5L <span className="text-[10px] text-white/20 not-italic">Total Assets</span></p>
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
                    <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-emerald-600">Total Inflow</span>
                    <span className="text-sm font-black italic text-emerald-600 font-mono">₹85.2L</span>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group hover:bg-rose-50 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-rose-600">Total Outflow</span>
                    <span className="text-sm font-black italic text-rose-600 font-mono">₹32.5L</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
