import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Search,
  FileText,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Send,
  X,
  Receipt,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi, salesApi } from '@/src/lib/api';
import { toast } from 'sonner';

interface EstimateItem {
  id: string;
  productId: string;
  name: string;
  supplier: string;
  purchaseRate: number;
  purchaseGst: number;
  landedCost: number;
  marginType: 'percentage' | 'amount';
  margin: number;
  salesRate: number;
  qty: number;
  unit: string;
  gstRate: number;
  total: number;
}

interface EstimateFormProps {
  onCancel: () => void;
}

export const EstimateForm = ({ onCancel }: EstimateFormProps) => {
  const [items, setItems]           = useState<EstimateItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientGst, setClientGst]   = useState('');
  const [clientAddr, setClientAddr] = useState('');
  const [notes, setNotes]           = useState('');
  const [searchQ, setSearchQ]       = useState('');
  const [showDrop, setShowDrop]     = useState(false);
  const [isSaved, setIsSaved]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [products, setProducts]     = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch real products from backend
  useEffect(() => {
    inventoryApi.getAllProducts()
      .then(res => { if (res.status === 1) setProducts(res.data); })
      .catch(err => console.error('Product fetch failed:', err));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredProducts = searchQ.length > 0
    ? products.filter(p => p.productName?.toLowerCase().includes(searchQ.toLowerCase()))
    : products.slice(0, 8);

  const addItem = (product: any) => {
    const cost    = product.purchasePrice || 0;
    const gstPct  = 18; // default GST
    const gstAmt  = (cost * gstPct) / 100;
    const landed  = cost + gstAmt;
    const defMgn  = 20;
    const sRate   = Math.round(landed * (1 + defMgn / 100));
    const gstRate = 18;
    const total   = Math.round(sRate * 1 * (1 + gstRate / 100));

    setItems(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id?.toString() || '0',
      name: product.productName,
      supplier: product.supplier || 'N/A',
      purchaseRate: cost,
      purchaseGst: gstPct,
      landedCost: landed,
      marginType: 'percentage',
      margin: defMgn,
      salesRate: sRate,
      qty: 1,
      unit: product.unit || 'PCS',
      gstRate,
      total,
    }]);
    setSearchQ('');
    setShowDrop(false);
  };

  const addService = (type: 'installation' | 'labor' | 'transport') => {
    const services = {
      installation: { name: 'Installation & Commissioning Service', cost: 5000, gst: 18, unit: 'JOB' },
      labor:        { name: 'On-site Labor Charges',               cost: 2000, gst: 0,  unit: 'DAY' },
      transport:    { name: 'Transportation & Logistics',           cost: 1500, gst: 5,  unit: 'LS' },
    };
    const s = services[type];
    const landed = s.cost * (1 + s.gst/100);
    
    setItems(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      productId: 'SRV-' + type.toUpperCase(),
      name: s.name,
      supplier: 'Internal Service',
      purchaseRate: s.cost,
      purchaseGst: s.gst,
      landedCost: landed,
      marginType: 'amount',
      margin: 0,
      salesRate: landed,
      qty: 1,
      unit: s.unit,
      gstRate: 18,
      total: Math.round(landed * 1 * 1.18),
    }]);
  };

  const updateItem = (id: string, updates: Partial<EstimateItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const u = { ...item, ...updates };

      // Recalculate salesRate from margin
      if (updates.margin !== undefined || updates.marginType !== undefined) {
        u.salesRate = u.marginType === 'percentage'
          ? Math.round(u.landedCost * (1 + u.margin / 100))
          : Math.round(u.landedCost + u.margin);
      }

      // Back-calculate margin when salesRate is edited directly
      if (updates.salesRate !== undefined && updates.margin === undefined) {
        u.margin = u.marginType === 'percentage'
          ? Number(((u.salesRate / u.landedCost - 1) * 100).toFixed(2))
          : u.salesRate - u.landedCost;
      }

      const base = u.salesRate * u.qty;
      u.total = Math.round(base * (1 + u.gstRate / 100));
      return u;
    }));
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal   = items.reduce((a, b) => a + b.salesRate * b.qty, 0);
  const totalGst   = items.reduce((a, b) => a + b.salesRate * b.qty * b.gstRate / 100, 0);
  const grandTotal = subtotal + totalGst;
  const totalProfit = items.reduce((a, b) => a + (b.salesRate - b.landedCost) * b.qty, 0);

  const handleSave = async () => {
    if (!clientName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (items.length === 0) {
      toast.error('Add at least one item to the estimate');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customerName: clientName,
        customerGstin: clientGst,
        customerAddress: clientAddr,
        notes,
        totalAmount: grandTotal,
        netAmount: subtotal,
        taxAmount: totalGst,
        status: 'PENDING',
        items: items.map(i => ({
          product: { id: parseInt(i.productId) || 0 },
          quantity: i.qty,
          unitPrice: i.salesRate,
          taxRate: i.gstRate,
          totalPrice: i.total
        }))
      };

      const res = await salesApi.saveEstimate(payload);
      if (res.status === 1) {
        toast.success('Estimate saved successfully!');
        setIsSaved(true);
        setTimeout(() => { setIsSaved(false); onCancel(); }, 1500);
      } else {
        toast.error(res.message || 'Failed to save estimate');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while saving estimate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in font-['Poppins']" style={{ background: '#F8FAFC' }}>
      
      {/* ── Header ── */}
      <div className="page-header shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="btn-ghost !p-1.5 hover:bg-slate-100 rounded-[5px]" title="Go Back">
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">New Estimate / Quotation</h2>
              <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-[3px] text-[7px] font-black text-slate-400 uppercase tracking-widest">Draft</span>
            </div>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-0.5">Sales & Revenue Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-7 px-3 text-[10px]" onClick={onCancel}>Discard</button>
          <button 
            className="btn-primary h-7 px-4 text-[10px] shadow-sm bg-red-600 hover:bg-red-700 border-red-700" 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
            Finalize & Send
          </button>
        </div>
      </div>

      {/* ── Form Body (Scrollable) ── */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-4 pb-12 mx-auto">
          
          {/* Top Row: Customer & Summary Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Customer Details Card */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
               <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <FileText size={12} className="text-slate-400" />
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Customer Information</h3>
               </div>
               <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <label className="erp-label">Customer / Party Name *</label>
                    <input
                      type="text"
                      placeholder="Search or enter business name..."
                      className="erp-input h-8 font-bold"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="erp-label">GSTIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="09ABCDE1234F1Z5"
                      className="erp-input h-8 uppercase font-mono"
                      value={clientGst}
                      onChange={e => setClientGst(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="erp-label">Site / Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Location context..."
                      className="erp-input h-8"
                      value={clientAddr}
                      onChange={e => setClientAddr(e.target.value)}
                    />
                 </div>
               </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-3">
               {[
                 { label: 'Line Items', value: items.length, color: 'text-slate-900' },
                 { label: 'Avg Margin', value: items.length > 0 ? (items.reduce((a, b) => a + b.margin, 0) / items.length).toFixed(1) + '%' : '—', color: 'text-emerald-600' },
                 { label: 'Net (Excl. Tax)', value: '₹' + subtotal.toLocaleString(), color: 'text-slate-900' },
                 { label: 'Tax Agg.', value: '₹' + Math.round(totalGst).toLocaleString(), color: 'text-slate-900' }
               ].map((card, i) => (
                 <div key={i} className="bg-white border border-slate-200 p-3 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                   <p className={cn("text-[13px] font-black tracking-tight", card.color)}>{card.value}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Search & Quick Actions Bar */}
          <div className="bg-white border border-slate-200 p-2 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-3">
            <div ref={searchRef} className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-500 transition-colors" />
              <input
                type="text"
                placeholder="Find catalog item or service to add..."
                className="w-full h-8 pl-9 pr-4 bg-slate-50/50 text-[11px] font-bold text-slate-800 placeholder:text-slate-300 outline-none border border-transparent focus:border-slate-200 focus:bg-white rounded-[5px] transition-all"
                value={searchQ}
                onChange={e => { setSearchQ(e.target.value); setShowDrop(true); }}
              />
              {showDrop && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-2xl z-50 mt-1 max-h-48 overflow-y-auto rounded-[5px]">
                  {filteredProducts.map(p => (
                    <button
                      key={p.id}
                      onMouseDown={() => addItem(p)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 last:border-0"
                    >
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{p.productName || p.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Supplier: {p.supplier || 'STOCK'} • Cost: ₹{p.purchasePrice || p.cost}</p>
                      </div>
                      <Plus size={10} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-2">
              <button onClick={() => addService('installation')} className="btn-secondary h-7 px-2.5 text-[9px]">+ Installation</button>
              <button onClick={() => addService('labor')} className="btn-secondary h-7 px-2.5 text-[9px]">+ Labor</button>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100/50">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider">Engine: ON</span>
              </div>
            </div>
          </div>

          {/* Line Items Table Container (Scrolling enabled here) */}
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
             <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt size={12} className="text-slate-400" />
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Quotation Workspace</h3>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase italic">{items.length} positions added</span>
             </div>
             
             <div className="overflow-x-auto custom-scrollbar">
                <table className="erp-table min-w-[1100px]">
                  <thead>
                    <tr>
                      <th className="w-10 text-center">#</th>
                      <th className="w-[30%]">Item Description</th>
                      <th>Supplier</th>
                      <th className="w-20">Qty</th>
                      <th className="w-16">Unit</th>
                      <th className="w-32">Purchase Cost (₹)</th>
                      <th className="w-28 text-center">Margin</th>
                      <th className="w-32">Sales Rate (₹)</th>
                      <th className="w-20 text-center">GST %</th>
                      <th className="w-40 text-right">Total Amt</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                       <tr>
                         <td colSpan={11} className="py-20 text-center opacity-30 select-none">
                            <Receipt size={32} className="mx-auto text-slate-300 mb-3" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Workspace Empty</p>
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">Search catalog items from above to populate</p>
                         </td>
                       </tr>
                    ) : items.map((item, idx) => (
                      <tr key={item.id} className="group hover:bg-slate-50/50">
                        <td className="text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={item.name}
                            className="w-full bg-transparent p-0 text-[10.5px] font-bold text-slate-900 uppercase focus:ring-0"
                            onChange={e => updateItem(item.id, { name: e.target.value })}
                          />
                        </td>
                        <td>
                          <span className="text-[9px] font-bold text-slate-400 uppercase truncate block max-w-[120px]">{item.supplier}</span>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={e => updateItem(item.id, { qty: parseFloat(e.target.value) || 1 })}
                            className="w-full h-7 bg-slate-50/50 border border-slate-200 text-center text-[11px] font-bold text-slate-900 group-hover:bg-white rounded-[5px]"
                          />
                        </td>
                        <td className="text-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{item.unit}</span>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-[10.5px] font-black text-slate-900">₹{item.purchaseRate.toLocaleString()}</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Landed: ₹{Math.round(item.landedCost)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 justify-center">
                            <input
                              type="number"
                              value={item.margin}
                              onChange={e => updateItem(item.id, { margin: parseFloat(e.target.value) || 0 })}
                              className="w-10 h-7 bg-slate-50/50 border border-slate-200 text-center text-[10px] font-black text-emerald-600 rounded-[5px]"
                            />
                            <button 
                              onClick={() => updateItem(item.id, { marginType: item.marginType === 'percentage' ? 'amount' : 'percentage', margin: 0 })}
                              className="w-6 h-7 bg-slate-100 border border-slate-200 text-[8px] font-black text-slate-500 rounded-[5px] hover:bg-slate-200 transition-colors"
                            >
                              {item.marginType === 'percentage' ? '%' : '₹'}
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.salesRate}
                            onChange={e => updateItem(item.id, { salesRate: parseFloat(e.target.value) || 0 })}
                            className="w-full h-7 bg-blue-50/30 border border-blue-100 px-2 text-[11px] font-black text-blue-600 rounded-[5px]"
                          />
                        </td>
                        <td className="text-center">
                          <select
                            value={item.gstRate}
                            onChange={e => updateItem(item.id, { gstRate: parseInt(e.target.value) })}
                            className="bg-transparent text-[10px] font-bold text-slate-500 hover:text-slate-900"
                          >
                            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </td>
                        <td className="text-right px-4">
                           <p className="text-[11px] font-black text-slate-900 tracking-tight">₹{item.total.toLocaleString()}</p>
                        </td>
                        <td className="text-center px-1">
                          <button onClick={() => removeItem(item.id)} className="p-1 text-slate-200 hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Footer Grid: Notes & Bill Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Notes Card */}
             <div className="bg-white border border-slate-200 rounded-[5px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
                  <TrendingUp size={12} className="text-slate-400" /> Commercial Terms
                </h3>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Validity, Payment Terms, Delivery context..." 
                  className="erp-input !h-auto py-2 focus:border-slate-400 transition-all font-sans italic" 
                />
             </div>

             {/* Bill Summary Matrix */}
             <div className="bg-slate-900 rounded-[5px] p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                <div className="flex items-center justify-between mb-4 pb-2 border-white/10 border-b">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Bill Aggregate</h3>
                  <div className="px-2 py-0.5 bg-white/10 rounded-[3px] text-[8px] font-black text-slate-400 tracking-widest">SUMMARY</div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10.5px] font-bold text-white/40 uppercase">
                      <span>Subtotal (Excl. Tax)</span>
                      <span className="text-white">₹{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10.5px] font-bold text-white/40 uppercase">
                      <span>GST Aggregate</span>
                      <span className="text-white">₹{Math.round(totalGst).toLocaleString()}</span>
                   </div>
                   <div className="pt-3 border-t border-white/10 flex justify-between items-center bg-white/5 p-2 rounded-[5px]">
                      <span className="text-[10.5px] font-black text-emerald-400 uppercase tracking-tight">Projected Margin</span>
                      <span className="text-[13px] font-black text-emerald-400">₹{Math.round(totalProfit).toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* ── Fixed Bottom Result Bar ── */}
      <div className="h-[52px] bg-slate-900 px-6 border-t border-slate-800 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cloud Sync Active</span>
           </div>
           <p className="hidden md:block text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">Helixion ERP Quotation Engine v2.4</p>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
             <span className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none">GRAND TOTAL</span>
             <span className="text-[20px] font-black text-white italic tracking-tighter leading-none mt-1">₹{Math.round(grandTotal).toLocaleString()}</span>
           </div>
           <button
             onClick={handleSave}
             disabled={saving}
             className={cn(
               "h-9 px-6 text-[10px] font-bold uppercase tracking-widest transition-all rounded-[5px] shadow-lg",
               isSaved ? "bg-emerald-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
             )}
           >
             {saving ? <Loader2 size={12} className="animate-spin" /> : isSaved ? <><CheckCircle2 size={12} /> Estimate Saved</> : "Finalize Quotation"}
           </button>
        </div>
      </div>
    </div>
  );
};
