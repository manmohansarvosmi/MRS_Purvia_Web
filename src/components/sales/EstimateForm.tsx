import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Search,
  Building2,
  User,
  FileText,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Printer,
  Send,
  X,
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

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all";
const tdCls   = "px-5 py-3 border-b border-slate-100 align-top text-sm text-slate-700";
const thCls   = "px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 bg-slate-50 border-b border-slate-200 whitespace-nowrap text-left";

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
      productId: product.id.toString(),
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
          product: { id: parseInt(i.productId) },
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
    <div className="flex-1 flex flex-col bg-[#F5F6FA] overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">New Estimate / Quotation</span>
            <span className="ml-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5">DRAFT</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 px-5 py-1.5 text-white text-[10px] font-bold uppercase tracking-widest transition-all",
              isSaved ? "bg-emerald-600" : "bg-primary hover:bg-red-700"
            )}
          >
            {isSaved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</> : <><Send className="w-3.5 h-3.5" /> Finalize & Send</>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {/* ── Estimate Header Info ── */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Customer Details */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Customer / Party Name *</p>
              <input
                type="text"
                placeholder="Enter customer or business name..."
                className={inputCls}
                value={clientName}
                onChange={e => setClientName(e.target.value)}
              />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">GSTIN (Optional)</p>
              <input
                type="text"
                placeholder="09ABCDE1234F1Z5"
                className={cn(inputCls, "uppercase")}
                value={clientGst}
                onChange={e => setClientGst(e.target.value)}
              />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Site / Project Address</p>
              <input
                type="text"
                placeholder="Delivery / project address..."
                className={inputCls}
                value={clientAddr}
                onChange={e => setClientAddr(e.target.value)}
              />
            </div>
          </div>

          {/* Estimate Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Items', value: items.length.toString() },
              { label: 'Avg Margin', value: items.length > 0 ? `${Math.round(items.reduce((a, b) => a + (b.marginType === 'percentage' ? b.margin : (b.margin / b.landedCost) * 100), 0) / items.length)}%` : '—' },
              { label: 'Total (Excl. GST)', value: subtotal > 0 ? `₹${subtotal.toLocaleString()}` : '₹0' },
              { label: 'GST Amount', value: totalGst > 0 ? `₹${Math.round(totalGst).toLocaleString()}` : '₹0' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                <p className="text-base font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search & Add Product ── */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
            <input
              type="text"
              placeholder="Type product name or supplier to add item to estimate..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); setShowDrop(true); }}
              onFocus={() => setShowDrop(true)}
            />
            {showDrop && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-xl z-50 mt-0.5 max-h-72 overflow-y-auto">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onMouseDown={() => addItem(p)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 last:border-0 text-left group transition-colors"
                  >
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 uppercase">{p.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" /> {p.supplier}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300">|</span>
                        <span className="text-[9px] font-bold text-slate-400">Cost: ₹{p.cost.toLocaleString()} + {p.gst}% GST</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Add</span>
                      <Plus className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Auto-Calc ON</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-2 border-r border-slate-200 pr-4">Quick Add:</p>
            <button 
              onClick={() => addService('installation')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> Installation
            </button>
            <button 
              onClick={() => addService('labor')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> Labor Cost
            </button>
          </div>
        </div>

        {/* ── Line Items Table ── */}
        <div className="px-0">
          <div className="overflow-x-auto bg-white border-b border-slate-200">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr>
                  <th className={cn(thCls, "w-8")}>#</th>
                  <th className={cn(thCls, "min-w-[220px]")}>Item Description</th>
                  <th className={cn(thCls, "min-w-[140px]")}>Supplier</th>
                  <th className={cn(thCls, "w-20 text-center")}>Qty</th>
                  <th className={cn(thCls, "w-16 text-center")}>Unit</th>
                  <th className={cn(thCls)}>Purchase Cost<br /><span className="text-[8px] font-normal normal-case tracking-normal text-slate-300">Base + GST = Landed</span></th>
                  <th className={cn(thCls)}>Your Margin</th>
                  <th className={cn(thCls)}>Sales Rate</th>
                  <th className={cn(thCls, "w-20")}>GST %</th>
                  <th className={cn(thCls, "text-right")}>Total Amt <br/><span className="text-[8px] font-normal normal-case tracking-normal text-slate-300">Incl. GST</span></th>
                  <th className={cn(thCls, "w-10")}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* # */}
                    <td className={cn(tdCls, "text-center text-slate-400 font-bold text-xs")}>{idx + 1}</td>

                    {/* Name */}
                    <td className={tdCls}>
                      <p className="text-[12px] font-bold text-slate-800">{item.name}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">ID: #{item.productId}</p>
                    </td>

                    {/* Supplier */}
                    <td className={tdCls}>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-600">{item.supplier}</span>
                      </div>
                    </td>

                    {/* Qty */}
                    <td className={cn(tdCls, "text-center")}>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={e => updateItem(item.id, { qty: parseFloat(e.target.value) || 1 })}
                        className="w-16 py-1.5 px-2 text-center border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary bg-white"
                      />
                    </td>

                    {/* Unit */}
                    <td className={cn(tdCls, "text-center")}>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-2 py-1">{item.unit}</span>
                    </td>

                    {/* Purchase Cost */}
                    <td className={tdCls}>
                      <p className="text-[12px] font-bold text-slate-800">₹{item.landedCost.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        ₹{item.purchaseRate.toLocaleString()} + {item.purchaseGst}% GST
                      </p>
                    </td>

                    {/* Margin */}
                    <td className={tdCls}>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={item.margin}
                          onChange={e => updateItem(item.id, { margin: parseFloat(e.target.value) || 0 })}
                          className="w-20 py-1.5 px-2 border border-slate-200 border-r-0 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary bg-white"
                        />
                        <button
                          onClick={() => updateItem(item.id, { marginType: item.marginType === 'percentage' ? 'amount' : 'percentage', margin: 0 })}
                          className="h-[34px] px-2.5 bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          {item.marginType === 'percentage' ? '%' : '₹'}
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" />
                        +₹{Math.round((item.salesRate - item.landedCost) * item.qty).toLocaleString()} profit
                      </p>
                    </td>

                    {/* Sales Rate */}
                    <td className={tdCls}>
                      <input
                        type="number"
                        value={item.salesRate}
                        onChange={e => updateItem(item.id, {
                          salesRate: parseFloat(e.target.value) || 0,
                        })}
                        className="w-28 py-1.5 px-2 border-2 border-primary/30 text-sm font-bold text-primary focus:outline-none focus:border-primary bg-white"
                      />
                      <p className="text-[9px] text-slate-400 mt-0.5">per {item.unit}</p>
                    </td>

                    {/* GST Rate */}
                    <td className={tdCls}>
                      <select
                        value={item.gstRate}
                        onChange={e => updateItem(item.id, { gstRate: parseInt(e.target.value) })}
                        className="py-1.5 px-2 border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:border-primary cursor-pointer"
                      >
                        {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>

                    {/* Total */}
                    <td className={cn(tdCls, "text-right")}>
                      <p className="text-[13px] font-bold text-slate-900">₹{item.total.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Incl. GST</p>
                    </td>

                    {/* Delete */}
                    <td className={cn(tdCls, "text-center")}>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-slate-300 hover:text-primary hover:bg-red-50 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-16 text-center text-slate-300 border-b border-slate-100">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-10 h-10" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No items added — search above to add products</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer: Notes + Bill Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border-t border-slate-200">

          {/* Notes */}
          <div className="p-6 border-r border-slate-200">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Terms & Notes</p>
            <textarea
              rows={5}
              placeholder="Payment terms, validity period, site conditions, special instructions..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-primary resize-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="mt-4 flex items-center gap-3">
              <button onClick={onCancel} className="px-5 py-2 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-5 py-2 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Printer className="w-3.5 h-3.5" /> Print Preview
              </button>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center justify-between">
              Bill Summary
              <span className="text-[8px] font-bold text-slate-300 normal-case tracking-normal">{items.length} line items</span>
            </p>

            <div className="space-y-0 border border-slate-200">
              {[
                { label: 'Subtotal (Excl. Tax)', value: `₹${Math.round(subtotal).toLocaleString()}`, muted: true },
                { label: 'GST / Tax Amount', value: `₹${Math.round(totalGst).toLocaleString()}`, muted: true },
                { label: 'Expected Profit', value: `₹${Math.round(totalProfit).toLocaleString()}`, green: true },
              ].map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex justify-between items-center px-4 py-3 border-b border-slate-100 last:border-0",
                    row.green ? "bg-emerald-50" : "bg-white"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{row.label}</span>
                  <span className={cn(
                    "text-sm font-bold",
                    row.green ? "text-emerald-600" : "text-slate-800"
                  )}>{row.value}</span>
                </div>
              ))}

              {/* Grand Total */}
              <div className="flex justify-between items-center px-4 py-4 bg-primary">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Total Estimate Amount</span>
                <span className="text-2xl font-black text-white">₹{Math.round(grandTotal).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className={cn(
                "mt-4 w-full py-3 text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                isSaved ? "bg-emerald-600" : "bg-primary hover:bg-red-700"
              )}
            >
              {isSaved
                ? <><CheckCircle2 className="w-4 h-4" /> Estimate Saved!</>
                : <><Save className="w-4 h-4" /> Save Estimate</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
