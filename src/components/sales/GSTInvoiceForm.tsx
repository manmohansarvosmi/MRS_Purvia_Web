import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Plus, Printer, Save, User, CreditCard, Search, X,
  Loader2, ShieldCheck, Layers, Send, TrendingUp, FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi, salesApi, accountsApi } from '@/src/lib/api';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  productId?: number;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  costPrice?: number;
  landedCost?: number;
  margin?: number;
  marginType?: 'percentage' | 'amount';
}

export interface EstimateSource {
  id?: number;
  customerName: string;
  customerMobile: string;
  billingAddress?: string;
  items: any[];
}

interface GSTInvoiceFormProps {
  onSuccess?: () => void;
  isQuotation?: boolean;
  fromEstimate?: EstimateSource;
}

const calcSubtotal = (item: InvoiceItem) => item.qty * item.rate;

export const GSTInvoiceForm = ({ onSuccess, isQuotation = false, fromEstimate }: GSTInvoiceFormProps) => {
  const blankItem = (): InvoiceItem => ({
    id: Math.random().toString(36).substr(2, 9),
    name: '', hsn: '8541', qty: 1, unit: 'PCS',
    rate: 0, discount: 0, taxRate: 18,
    margin: 0, marginType: 'percentage'
  });

  const [items, setItems] = useState<InvoiceItem[]>([blankItem()]);
  const [clientName, setClientName] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [ledgerAccount, setLedgerAccount] = useState('');
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQ, setSearchQ] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const [saving, setSaving] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchAccounts();

    if (fromEstimate) {
      setClientName(fromEstimate.customerName || '');
      setClientPhone(fromEstimate.customerMobile || '');
      setClientAddress(fromEstimate.billingAddress || '');
      
      if (fromEstimate.items && fromEstimate.items.length > 0) {
        const mappedItems = fromEstimate.items.map(item => ({
          id: Math.random().toString(36).substr(2, 9),
          productId: item.productId || item.product?.id,
          name: item.productName || item.product?.productName || item.name,
          hsn: item.hsn || '8541',
          qty: item.quantity || item.qty || 1,
          unit: item.unit || 'PCS',
          rate: item.unitPrice || item.rate || 0,
          discount: item.discount || 0,
          taxRate: item.taxRate || 18,
        }));
        setItems(mappedItems);
      }
    }
  }, [fromEstimate]);

  const fetchProducts = async () => {
    try {
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) setProducts(res.data);
    } catch (e) { toast.error("Catalog load failed"); }
  };

  const fetchAccounts = async () => {
    try {
      const res = await accountsApi.getAllAccounts();
      if (res.status === 1) setPaymentAccounts(res.data);
    } catch (e) { console.error(e); }
  };

  const addItemFromProduct = (product: any) => {
    const cost = product.purchasePrice || 0;
    const sRate = product.sellingPrice || 0;
    const margin = cost > 0 ? Number(((sRate / cost - 1) * 100).toFixed(2)) : 0;
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id, name: product.productName,
      hsn: product.hsn || '8541', qty: 1, unit: product.unit || 'PCS',
      rate: sRate, discount: 0, taxRate: 18,
      costPrice: cost, landedCost: cost, margin, marginType: 'percentage',
    };
    setItems(prev => prev.length === 1 && !prev[0].name ? [newItem] : [...prev, newItem]);
    setSearchQ(''); setShowCatalog(false);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) =>
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const u = { ...item, [field]: value };
      if (field === 'margin' && u.costPrice) {
        u.rate = Math.round(u.costPrice * (1 + (u.margin || 0) / 100));
      }
      return u;
    }));

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(p => p.filter(i => i.id !== id));
    else setItems([blankItem()]);
  };

  const totals = useMemo(() => items.reduce((acc, item) => {
    const sub = calcSubtotal(item);
    const tax = sub * (item.taxRate / 100);
    return { subtotal: acc.subtotal + sub, tax: acc.tax + tax, total: acc.total + sub + tax, qty: acc.qty + item.qty };
  }, { subtotal: 0, tax: 0, total: 0, qty: 0 }), [items]);

  const totalProfit = items.reduce((acc, item) =>
    acc + ((item.rate - (item.costPrice || 0)) * item.qty), 0);

  const handleSubmit = async (post: boolean = true) => {
    if (!clientName) { toast.error("Customer name is required"); return; }
    if (!ledgerAccount && !isQuotation) { toast.error("Select deposit account"); return; }
    setSaving(true);
    try {
      const payload = {
        customerName: clientName, customerAddress: clientAddress, customerGstin: clientGstin,
        items: items.map(i => ({
          product: i.productId ? { id: i.productId } : null,
          name: i.name, quantity: i.qty, unitPrice: i.rate, taxRate: i.taxRate,
          totalPrice: calcSubtotal(i) * (1 + i.taxRate / 100)
        })),
        totalAmount: totals.total, netAmount: totals.subtotal, taxAmount: totals.tax,
        status: post ? 'PAID' : 'PENDING',
        financialAccountId: ledgerAccount ? Number(ledgerAccount) : null
      };
      const res = isQuotation
        ? await salesApi.saveEstimate(payload)
        : await inventoryApi.saveSale({ ...payload, isPos: false });
      if (res.status === 1) {
        toast.success(isQuotation ? "Quotation Saved" : "Invoice Finalized");
        onSuccess?.();
      } else toast.error(res.message);
    } catch { toast.error("System error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in font-['Poppins'] relative" style={{ background: '#F8FAFC' }}>
      
      {/* ── Header ── */}
      <div className="page-header shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-[5px] shadow-sm">
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">
                {isQuotation ? 'Sales Quotation' : 'Tax Invoice'}
              </h2>
              {!isQuotation && (
                <span className="px-1.5 py-0.5 bg-emerald-100 border border-emerald-200 rounded-[3px] text-[7px] font-black text-emerald-700 uppercase tracking-widest">Gst Compliant</span>
              )}
            </div>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-0.5">Direct Transaction Entry</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-7 px-3 text-[10px] rounded-[5px] flex items-center gap-1.5">
            <Printer size={12} /> Print
          </button>
          <button onClick={() => handleSubmit(false)} disabled={saving} className="btn-secondary h-7 px-3 text-[10px] rounded-[5px] flex items-center gap-1.5 disabled:opacity-50">
            <Save size={12} /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving || totals.total <= 0}
            className="h-7 px-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-red-700 disabled:opacity-30 flex items-center gap-2 rounded-[5px]"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <><Send size={12} /> {isQuotation ? 'Save Quotation' : 'Finalize & Post'}</>}
          </button>
        </div>
      </div>

      {/* ── Form Body (Scrollable) ── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">

        {/* ── Main Invoice Form Content ── */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-x-hidden">
          <div className="space-y-4 pb-12 w-full max-w-[1400px] mx-auto">

            {/* Top Row: Party & Ledger Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Party Details Card */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <User size={12} className="text-slate-400" />
                <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Party / Customer Details</h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="erp-label">Customer Name *</label>
                  <input type="text" placeholder="Enter party name..." className="erp-input h-8 font-bold" value={clientName} onChange={e => setClientName(e.target.value)} />
                </div>
                <div>
                  <label className="erp-label">GSTIN (Optional)</label>
                  <input type="text" placeholder="09ABCDE1234F1Z5" className="erp-input h-8 uppercase font-mono" value={clientGstin} onChange={e => setClientGstin(e.target.value)} />
                </div>
                <div>
                  <label className="erp-label">Billing Address</label>
                  <input type="text" placeholder="Location context..." className="erp-input h-8" value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment Card */}
            {!isQuotation && (
              <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <CreditCard size={12} className="text-slate-400" />
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Payment Context</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <label className="erp-label">Deposit Ledger / Bank Account</label>
                    <select value={ledgerAccount} onChange={e => setLedgerAccount(e.target.value)} className="erp-input h-8 font-bold cursor-pointer">
                      <option value="">-- SELECT ACCOUNT --</option>
                      {paymentAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-[5px]">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck size={10} className="text-white" />
                    </div>
                    <p className="text-[9px] font-bold text-blue-700 leading-tight">Payments auto-reconciled against this ledger.</p>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Quick Finder / Action Bar */}
          <div className="bg-white border border-slate-200 p-2 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-500 transition-colors" />
              <input
                type="text"
                placeholder="QUICK FINDER / CATALOG SEARCH OR BARCODE..."
                className="w-full h-8 pl-9 pr-4 bg-slate-50/50 text-[11px] font-bold text-slate-800 placeholder:text-slate-300 outline-none border border-transparent focus:border-slate-200 focus:bg-white rounded-[5px] transition-all"
                value={searchQ}
                onChange={e => { setSearchQ(e.target.value); if(!showCatalog) setShowCatalog(true); }}
                onClick={() => setShowCatalog(true)}
              />
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCatalog(!showCatalog)} 
                className={cn(
                  "h-8 px-4 text-[9px] font-bold uppercase tracking-widest rounded-[5px] transition-all flex items-center gap-2",
                  showCatalog ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Layers size={12} /> {showCatalog ? 'Close Catalog' : 'Open Catalog'}
              </button>
              <button onClick={() => setItems([...items, blankItem()])} className="btn-secondary h-8 px-4 text-[9px] flex items-center gap-2">
                <Plus size={12} /> Custom Row
              </button>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden min-h-[280px]">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Layers size={12} className="text-slate-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Invoice Line Items</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 opacity-50">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-wider">HSN Auto-fetch</span>
                </div>
                <div className="h-3 w-[1px] bg-white/10" />
                <span className="text-[9px] font-bold text-blue-400 uppercase italic">Active Positions: {items.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-10 text-center whitespace-nowrap">#</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">ITEM DESCRIPTION / PARTICULARS</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-20 text-center whitespace-nowrap">UNIT QTY</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-24 text-center whitespace-nowrap italic bg-slate-50">P. RATE (EX)</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-emerald-600 uppercase tracking-widest w-24 text-center whitespace-nowrap bg-emerald-50/30">PROFIT %</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-blue-600 uppercase tracking-widest w-24 text-center whitespace-nowrap bg-blue-50/30">SALE RATE</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-20 text-center whitespace-nowrap">TAX %</th>
                    <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-32 text-right pr-6 whitespace-nowrap">LINE TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all relative">
                      <td className="py-2 px-3 text-center text-[9px] font-black text-slate-300 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <input
                          value={item.name}
                          onChange={e => updateItem(item.id, 'name', e.target.value)}
                          className="w-full bg-transparent text-[10px] font-bold text-slate-900 uppercase focus:ring-0 outline-none placeholder:text-slate-200"
                          placeholder="Enter item particulars..."
                        />
                        <p className="text-[7px] font-black text-slate-300 uppercase mt-0.5 tracking-tighter">
                          HSN: {item.hsn || '8541'} • CID: {item.productId || 'GEN'}
                        </p>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number" value={item.qty}
                          onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 1)}
                          className="w-full h-7 bg-slate-50 border border-slate-100 text-center text-[10px] font-black text-slate-900 rounded group-hover:bg-white transition-all outline-none focus:border-primary"
                        />
                      </td>
                      <td className="py-2 px-3 bg-slate-50/40">
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-slate-400 italic">₹{item.costPrice || 0}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 bg-emerald-50/20">
                        <div className="flex items-center justify-center gap-0.5">
                          <input
                            type="number" value={item.margin}
                            onChange={e => updateItem(item.id, 'margin', parseFloat(e.target.value) || 0)}
                            className="w-10 h-6 border-b border-emerald-200 bg-transparent text-center text-[10px] font-black text-emerald-600 outline-none focus:border-emerald-400"
                          />
                          <span className="text-[8px] font-bold text-emerald-300">%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 bg-blue-50/20">
                        <div className="text-center">
                          <span className="text-[11px] font-black text-blue-600 underline underline-offset-2 decoration-blue-100">₹{item.rate}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-center">
                          <select
                            value={item.taxRate}
                            onChange={e => updateItem(item.id, 'taxRate', parseInt(e.target.value))}
                            className="bg-transparent text-[9px] font-black text-slate-500 border-none focus:ring-0 cursor-pointer text-center"
                          >
                            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="py-2 pr-6 px-3 text-right">
                        <p className="text-[11px] font-black text-slate-900 tracking-tight">
                          ₹{Math.round(calcSubtotal(item) * (1 + item.taxRate / 100)).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
            <div className="bg-white border border-slate-200 rounded-[5px] p-4 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pre-Tax Subtotal</p>
                <p className="text-[14px] font-black text-slate-900 leading-none">₹{Math.round(totals.subtotal).toLocaleString()}</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                <Layers size={14} className="text-slate-400" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[5px] p-4 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tax Aggregate</p>
                <p className="text-[14px] font-black text-slate-900 leading-none">₹{Math.round(totals.tax).toLocaleString()}</p>
              </div>
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
                <ShieldCheck size={14} className="text-blue-500" />
              </div>
            </div>
            <div className="bg-emerald-600 rounded-[5px] p-4 flex items-center justify-between shadow-lg shadow-emerald-200/50">
              <div>
                <p className="text-[8px] font-black text-emerald-100 uppercase tracking-widest leading-none mb-1">Projected Profit</p>
                <p className="text-[16px] font-black text-white leading-none">₹{Math.round(totalProfit).toLocaleString()}</p>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* ── Slide-out Catalog Panel (Right Side) ── */}
        <div 
          className={cn(
            "absolute top-0 right-0 bottom-0 z-50 bg-white border-l border-slate-200 shadow-2xl transition-all duration-300 ease-in-out flex flex-col",
            showCatalog ? "w-[300px] visible translate-x-0" : "w-0 invisible translate-x-full"
          )}
        >
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Catalog</p>
              <p className="text-[8px] font-bold text-primary uppercase">Click to add to invoice</p>
            </div>
            <button onClick={() => setShowCatalog(false)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors">
              <X size={14} className="text-slate-400" />
            </button>
          </div>

          <div className="p-3 border-b border-slate-100 shrink-0">
             <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                <input
                  type="text"
                  placeholder="Filter catalog..."
                  className="w-full h-8 pl-8 pr-3 bg-slate-50/50 border border-slate-200 rounded-[5px] text-[10px] font-bold text-slate-700 outline-none focus:border-primary transition-all"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {(searchQ ? products.filter(p => p.productName?.toLowerCase().includes(searchQ.toLowerCase())) : products).map(p => (
              <button
                key={p.id}
                onClick={() => { addItemFromProduct(p); /* toast.success('Added ' + p.productName); */ }}
                className="w-full flex items-center justify-between px-3 py-3 border border-transparent hover:border-primary/20 hover:bg-primary/5 rounded-[5px] transition-all text-left mb-1 group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold text-slate-800 uppercase leading-tight truncate">{p.productName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Stock: {p.stockQuantity ?? '0'}</span>
                    </div>
                    <span className="text-[9px] font-black text-primary italic font-mono">₹{p.sellingPrice ?? p.purchasePrice}</span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded bg-slate-50 group-hover:bg-primary flex items-center justify-center shrink-0 transition-all border border-slate-100 group-hover:border-primary shadow-sm">
                  <Plus size={12} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
            {products.length === 0 && (
              <div className="py-20 text-center opacity-30 flex flex-col items-center">
                <Layers size={32} className="mb-2 text-slate-300" />
                <p className="text-[9px] font-bold uppercase tracking-widest">No catalog nodes found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
             <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-[5px]">
                <ShieldCheck size={12} className="text-blue-500" />
                <p className="text-[8px] font-bold text-blue-700 uppercase">Auto-sync with Inventory</p>
             </div>
             <button onClick={() => setShowCatalog(false)} className="w-full h-8 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-[5px]">Hide Catalog View</button>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Footer ── */}
      <div className="h-[60px] bg-slate-900 px-6 border-t border-slate-800 flex items-center justify-between shrink-0 z-40 shadow-[0_-8px_20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">NET PAYABLE (EXCL. TAX)</span>
            <span className="text-[13px] font-bold text-slate-400">₹{Math.round(totals.subtotal).toLocaleString()}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.15em]">Compliance Engine: OK</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">GRAND TOTAL</span>
            <span className="text-[24px] font-black text-white leading-none tracking-tighter italic">₹{Math.round(totals.total).toLocaleString()}</span>
          </div>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving || totals.total <= 0}
            className={cn(
              "h-10 px-7 text-[10px] font-black uppercase tracking-[0.15em] rounded-[5px] flex items-center gap-2 transition-all",
              "bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
            )}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} strokeWidth={3} /> {isQuotation ? 'Save Quotation' : 'Finalize & Post'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};
