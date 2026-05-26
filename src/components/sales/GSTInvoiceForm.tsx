import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  Send,
  Building2,
  User,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Search,
  X,
  ChevronDown,
  Layers,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi, salesApi, accountingApi } from '@/src/lib/api';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  productId?: number;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;           // selling rate (excl. GST)
  discount: number;
  taxRate: number;
  costPrice?: number;
  landedCost?: number;
  margin?: number;
  marginType?: 'percentage' | 'amount';
}

export interface EstimateSource {
  id?: number;
  estimateNumber?: string;
  customerName: string;
  customerGstin?: string;
  customerAddress?: string;
  items: any[];
}

interface GSTInvoiceFormProps {
  fromEstimate?: EstimateSource;   // pre-fill when converting estimate → invoice
  onSuccess?: () => void;
  isQuotation?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────
const calcSubtotal = (item: InvoiceItem) => {
  const gross = item.qty * item.rate;
  return gross - gross * (item.discount / 100);
};

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all";
const tdCls   = "px-5 py-3 border-b border-slate-100 align-top text-sm text-slate-700";
const thCls   = "px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 bg-slate-50 border-b border-slate-200 whitespace-nowrap text-left";

// ── Component ─────────────────────────────────────────────────────────
export const GSTInvoiceForm = ({ fromEstimate, onSuccess, isQuotation = false }: GSTInvoiceFormProps) => {
  const blankItem = (): InvoiceItem => ({
    id: Date.now().toString(),
    name: '', hsn: '', qty: 1, unit: 'PCS',
    rate: 0, discount: 0, taxRate: 18,
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [clientName,    setClientName]    = useState('');
  const [clientGstin,   setClientGstin]   = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [showMargin,    setShowMargin]    = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [searchQ,       setSearchQ]       = useState('');
  const [showDrop,      setShowDrop]      = useState(false);
  const [ledgerAccount, setLedgerAccount] = useState('');
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [products,      setProducts]      = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchPaymentAccounts();
    if (fromEstimate) {
      setClientName(fromEstimate.customerName || '');
      setClientAddress(fromEstimate.customerAddress || '');
      // Map items from estimate
      if (fromEstimate.items) {
        setItems(fromEstimate.items.map(i => ({
          id: Math.random().toString(36).substr(2, 9),
          productId: i.product?.id,
          name: i.product?.productName || i.name,
          hsn: i.product?.hsn || i.hsn || '',
          qty: i.quantity || i.qty || 1,
          unit: i.product?.unit || i.unit || 'PCS',
          rate: i.unitPrice || i.rate || 0,
          discount: 0,
          taxRate: i.taxRate || 18,
          costPrice: i.product?.purchasePrice || 0,
          landedCost: i.product?.purchasePrice || 0,
          margin: 0,
          marginType: 'percentage'
        })));
      }
    }
  }, [fromEstimate]);

  const fetchProducts = async () => {
    try {
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPaymentAccounts = async () => {
    try {
        const res = await accountingApi.getPaymentAccounts();
        if (res.status === 1) {
            setPaymentAccounts(res.data);
            if (res.data.length > 0) setLedgerAccount(res.data[0].id.toString());
        }
    } catch (e) {
        console.error("Ledger fetch error:", e);
    }
  };

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
    ? products.filter(p => p.productName.toLowerCase().includes(searchQ.toLowerCase()))
    : products.slice(0, 5);

  const addItemFromProduct = (product: any) => {
    const cost = product.purchasePrice || 0;
    const landed  = cost; // Simplified
    const sRate   = product.sellingPrice || 0;

    setItems(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.productName,
      hsn: product.hsn || '8541',
      qty: 1,
      unit: product.unit || 'PCS',
      rate: sRate,
      discount: 0,
      taxRate: 18,
      costPrice: cost,
      landedCost: landed,
      margin: cost > 0 ? Number(((sRate / cost - 1) * 100).toFixed(2)) : 0,
      marginType: 'percentage',
    }]);
    setSearchQ('');
    setShowDrop(false);
  };

  const addItem = () => setItems(p => [...p, blankItem()]);

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(p => p.filter(i => i.id !== id));
    else setItems([blankItem()]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) =>
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const u = { ...item, [field]: value };

      if (!u.landedCost && u.costPrice) u.landedCost = u.costPrice;

      if (field === 'margin' || field === 'marginType') {
        if (u.landedCost) {
          u.rate = u.marginType === 'percentage'
            ? Math.round(u.landedCost * (1 + (u.margin || 0) / 100))
            : Math.round(u.landedCost + (u.margin || 0));
        }
      }

      if (field === 'rate' && u.landedCost && u.landedCost > 0) {
        u.margin = u.marginType === 'percentage'
          ? Number(((u.rate / u.landedCost - 1) * 100).toFixed(2))
          : u.rate - u.landedCost;
      }

      return u;
    }));

  const totals = items.reduce((acc, item) => {
    const sub = calcSubtotal(item);
    const tax = sub * (item.taxRate / 100);
    return { subtotal: acc.subtotal + sub, tax: acc.tax + tax, total: acc.total + sub + tax };
  }, { subtotal: 0, tax: 0, total: 0 });

  const totalProfit = items.reduce((acc, item) => {
    if (!item.costPrice) return acc;
    return acc + (item.rate - item.costPrice) * item.qty;
  }, 0);

  const hasMarginData = items.some(i => i.costPrice !== undefined);
  const invoiceNo     = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = async () => {
    if (!clientName) {
      toast.error("Customer name is required");
      return;
    }
    if (items.length === 0 || !items[0].name) {
      toast.error("Add at least one item");
      return;
    }
    if (!isQuotation && !ledgerAccount) {
      toast.error("Please select a Payment/Ledger Account for the invoice");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        customerName: clientName,
        customerAddress: clientAddress,
        customerGstin: clientGstin,
        items: items.map(i => ({
          product: i.productId ? { id: i.productId } : null,
          name: i.name,
          quantity: i.qty,
          unitPrice: i.rate,
          taxRate: i.taxRate,
          totalPrice: calcSubtotal(i) * (1 + i.taxRate / 100)
        })),
        totalAmount: totals.total,
        netAmount: totals.subtotal,
        taxAmount: totals.tax,
        status: isQuotation ? 'PENDING' : 'PAID',
        ledger: ledgerAccount ? { id: parseInt(ledgerAccount) } : null
      };

      let res;
      if (isQuotation) {
        res = await salesApi.saveEstimate(payload);
      } else {
        // If it's a conversion, maybe mark estimate as converted?
        res = await inventoryApi.saveSale({ ...payload, isPos: false });
      }

      if (res.success || res.status === 1) {
        toast.success(isQuotation ? "Quotation saved successfully" : "Invoice generated successfully");
        onSuccess?.();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto custom-scrollbar">
      
      {fromEstimate && (
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Converted from Estimate <strong>{fromEstimate.estimateNumber || fromEstimate.id}</strong> — review and finalize
            </span>
          </div>
          {hasMarginData && (
            <button
              onClick={() => setShowMargin(v => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 border text-[9px] font-bold uppercase tracking-widest transition-all",
                showMargin
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary"
              )}
            >
              {showMargin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showMargin ? 'Hide Margin' : 'Show Margin'}
            </button>
          )}
        </div>
      )}

      <div className="p-4 lg:p-6 space-y-8 w-full">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center shadow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{isQuotation ? 'Sales Quotation / Estimate' : 'Tax Invoice / Bill of Supply'}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {fromEstimate ? `Based on ${fromEstimate.estimateNumber || fromEstimate.id}` : `Create New ${isQuotation ? 'Quotation' : 'GST Compliant Invoice'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!fromEstimate && hasMarginData && (
              <button
                onClick={() => setShowMargin(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Margin View
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
              )}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> {isQuotation ? 'Save Quotation' : 'Finalize & Send'}</>}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
            <input
              type="text"
              placeholder="Search products in catalog..."
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
                    onMouseDown={() => addItemFromProduct(p)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 last:border-0 text-left group transition-colors"
                  >
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 uppercase">{p.productName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          STOCK: {p.stockQuantity} {p.unit}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300">|</span>
                        <span className="text-[9px] font-bold text-slate-400">Rate: ₹{p.sellingPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Plus className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-slate-100">
            <div className="p-8 border-r border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Billed From</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Helixion Innovations LLP</h3>
              <div className="space-y-1 text-xs text-slate-500">
                <p>Sector 62, Noida, Uttar Pradesh – 201301</p>
                <p>GSTIN: <span className="font-bold text-slate-800 uppercase">09AAACH1234F1Z5</span></p>
                <p>billing@helixion.in</p>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <User className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Billed To</span>
              </div>
              <input
                type="text"
                placeholder="Customer Name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full bg-transparent text-base font-bold text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-300 mb-3"
              />
              <input
                type="text"
                placeholder="GSTIN (Optional)"
                value={clientGstin}
                onChange={e => setClientGstin(e.target.value)}
                className="w-full h-8 bg-white border border-slate-200 px-3 text-xs font-bold uppercase focus:border-primary outline-none mb-2"
              />
              <textarea
                placeholder="Billing Address"
                value={clientAddress}
                onChange={e => setClientAddress(e.target.value)}
                className="w-full h-16 bg-white border border-slate-200 p-3 text-xs focus:border-primary outline-none resize-none mb-4"
              />

              {!isQuotation && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Deposit Account (MANDATORY)</span>
                    </div>
                    <select 
                        value={ledgerAccount}
                        onChange={e => setLedgerAccount(e.target.value)}
                        className="w-full h-10 bg-white border border-slate-200 px-3 text-xs font-bold uppercase focus:border-primary outline-none"
                    >
                        <option value="">-- SELECT PAYMENT ACCOUNT --</option>
                        {paymentAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} ({acc.category})</option>
                        ))}
                    </select>
                  </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr>
                  <th className={cn(thCls, "w-8")}>#</th>
                  <th className={cn(thCls, "min-w-[220px]")}>Item Description</th>
                  <th className={cn(thCls, "w-20 text-center")}>Qty</th>
                  <th className={cn(thCls, "w-16 text-center")}>Unit</th>
                  {showMargin && <th className={cn(thCls)}>Margin Info</th>}
                  <th className={cn(thCls)}>Sales Rate</th>
                  <th className={cn(thCls, "w-20")}>GST %</th>
                  <th className={cn(thCls, "text-right")}>Total</th>
                  <th className={cn(thCls, "w-10")}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className={cn(tdCls, "text-center text-slate-400 font-bold text-xs")}>{idx + 1}</td>
                    <td className={tdCls}>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className="bg-transparent border-none focus:ring-0 p-0 text-[12px] font-bold text-slate-800 placeholder:text-slate-300 w-full uppercase"
                      />
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5 italic">HSN: {item.hsn || 'N/A'}</p>
                    </td>
                    <td className={cn(tdCls, "text-center")}>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 1)}
                        className="w-16 py-1.5 px-2 text-center border border-slate-200 text-sm font-bold text-slate-800 bg-white"
                      />
                    </td>
                    <td className={cn(tdCls, "text-center")}>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.unit}</span>
                    </td>
                    {showMargin && (
                      <td className={tdCls}>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.margin || 0}
                            onChange={e => updateItem(item.id, 'margin', parseFloat(e.target.value) || 0)}
                            className="w-14 py-1 border border-slate-200 text-[11px] font-bold text-slate-700 text-center"
                          />
                          <span className="ml-1 text-[10px] font-bold text-slate-400">%</span>
                        </div>
                        <p className="text-[8px] text-emerald-600 font-black mt-1">PROFIT: ₹{Math.round(((item.rate - (item.costPrice || 0)) * item.qty)).toLocaleString()}</p>
                      </td>
                    )}
                    <td className={tdCls}>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-24 py-1.5 px-2 border border-slate-200 text-sm font-bold text-primary bg-white"
                      />
                    </td>
                    <td className={tdCls}>
                      <select
                        value={item.taxRate}
                        onChange={e => updateItem(item.id, 'taxRate', parseInt(e.target.value))}
                        className="py-1 px-1 border border-slate-200 text-xs font-bold bg-white"
                      >
                        {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    <td className={cn(tdCls, "text-right")}>
                       <p className="text-[12px] font-bold text-slate-900">₹{(calcSubtotal(item) * (1 + item.taxRate/100)).toLocaleString()}</p>
                    </td>
                    <td className={cn(tdCls, "text-center")}>
                       <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-primary"><X className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <button onClick={addItem} className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              <Plus className="w-3.5 h-3.5" /> Add Manual Line
            </button>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Subtotal: ₹{Math.round(totals.subtotal).toLocaleString()}</span>
               <span>Tax: ₹{Math.round(totals.tax).toLocaleString()}</span>
               <span className="text-primary">Total: ₹{Math.round(totals.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
