import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;           // selling rate (excl. GST)
  discount: number;
  taxRate: number;
  // margin info
  costPrice?: number;
  landedCost?: number;
  margin?: number;
  marginType?: 'percentage' | 'amount';
}

export interface EstimateSource {
  estimateId: string;
  clientName: string;
  clientGstin: string;
  clientAddress: string;
  items: InvoiceItem[];
}

interface GSTInvoiceFormProps {
  fromEstimate?: EstimateSource;   // pre-fill when converting estimate → invoice
}

// ── Helpers ───────────────────────────────────────────────────────────
const calcSubtotal = (item: InvoiceItem) => {
  const gross = item.qty * item.rate;
  return gross - gross * (item.discount / 100);
};

const mockProducts = [
  { id: '1', name: 'Solar Panel 450W Mono', cost: 10500, gst: 12, supplier: 'Tata Solar Systems', unit: 'PCS' },
  { id: '2', name: 'Hybrid Inverter 5kVA',  cost: 38200, gst: 18, supplier: 'Havells India',       unit: 'PCS' },
  { id: '3', name: 'Lithium Battery 100Ah', cost: 28000, gst: 18, supplier: 'Microtek Power',      unit: 'PCS' },
  { id: '4', name: 'DC Wire 4sqmm (100m)',  cost: 3500,  gst: 12, supplier: 'Polycab',             unit: 'MTR' },
  { id: '5', name: 'MPPT Controller 60A',   cost: 7800,  gst: 18, supplier: 'Luminous Tech',       unit: 'PCS' },
  { id: '6', name: 'Mounting Structure L2', cost: 2100,  gst: 18, supplier: 'Solar Labs',          unit: 'SET' },
];

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all";
const tdCls   = "px-5 py-3 border-b border-slate-100 align-top text-sm text-slate-700";
const thCls   = "px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 bg-slate-50 border-b border-slate-200 whitespace-nowrap text-left";

// ── Component ─────────────────────────────────────────────────────────
export const GSTInvoiceForm = ({ fromEstimate }: GSTInvoiceFormProps) => {
  const blankItem = (): InvoiceItem => ({
    id: Date.now().toString(),
    name: '', hsn: '', qty: 1, unit: 'PCS',
    rate: 0, discount: 0, taxRate: 18,
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    fromEstimate?.items?.length ? fromEstimate.items : []
  );
  const [clientName,    setClientName]    = useState(fromEstimate?.clientName    ?? '');
  const [clientGstin,   setClientGstin]   = useState(fromEstimate?.clientGstin   ?? '');
  const [clientAddress, setClientAddress] = useState(fromEstimate?.clientAddress ?? '');
  const [showMargin,    setShowMargin]    = useState(true);
  const [saved,         setSaved]         = useState(false);
  const [searchQ,       setSearchQ]       = useState('');
  const [showDrop,      setShowDrop]      = useState(false);
  const [ledgerAccount, setLedgerAccount] = useState('sales_primary');
  const searchRef = useRef<HTMLDivElement>(null);

  const ledgerAccounts = [
    { id: 'sales_primary', name: 'Primary Sales Account', type: 'Sales' },
    { id: 'cash_in_hand',  name: 'Cash in Hand',         type: 'Cash' },
    { id: 'hdfc_bank',     name: 'HDFC Bank - 5678',     type: 'Bank' },
    { id: 'sbi_bank',      name: 'SBI Bank - 1234',      type: 'Bank' },
  ];

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
    ? mockProducts.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.supplier.toLowerCase().includes(searchQ.toLowerCase()))
    : mockProducts;

  const addItemFromProduct = (product: typeof mockProducts[0]) => {
    const gstAmt  = (product.cost * product.gst) / 100;
    const landed  = product.cost + gstAmt;
    const defMgn  = 20;
    const sRate   = Math.round(landed * (1 + defMgn / 100));

    setItems(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name,
      hsn: '8541',
      qty: 1,
      unit: product.unit,
      rate: sRate,
      discount: 0,
      taxRate: 18,
      costPrice: product.cost,
      landedCost: landed,
      margin: defMgn,
      marginType: 'percentage',
    }]);
    setSearchQ('');
    setShowDrop(false);
  };

  const addItem = () => setItems(p => [...p, blankItem()]);

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(p => p.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) =>
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const u = { ...item, [field]: value };

      // Landed cost is costPrice + tax on cost (simplified for non-stock items, or passed from estimate)
      if (!u.landedCost && u.costPrice) u.landedCost = u.costPrice;

      // Recalculate sales Rate from margin
      if (field === 'margin' || field === 'marginType') {
        if (u.landedCost) {
          u.rate = u.marginType === 'percentage'
            ? Math.round(u.landedCost * (1 + (u.margin || 0) / 100))
            : Math.round(u.landedCost + (u.margin || 0));
        }
      }

      // Back-calculate margin when rate is edited directly
      if (field === 'rate' && u.landedCost) {
        u.margin = u.marginType === 'percentage'
          ? Number(((u.rate / u.landedCost - 1) * 100).toFixed(2))
          : u.rate - u.landedCost;
      }

      return u;
    }));

  const addService = (type: 'installation' | 'labor' | 'transport') => {
    const services = {
      installation: { name: 'Installation & Commissioning Service', cost: 5000, gst: 18, unit: 'JOB' },
      labor:        { name: 'On-site Labor Charges',               cost: 2000, gst: 0,  unit: 'DAY' },
      transport:    { name: 'Transportation & Logistics',           cost: 1500, gst: 5,  unit: 'LS' },
    };
    const s = services[type];
    
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name: s.name,
      hsn: '9987',
      qty: 1,
      unit: s.unit,
      rate: s.cost * (1 + (s.gst / 100)),
      discount: 0,
      taxRate: 18,
      costPrice: s.cost,
      landedCost: s.cost * (1 + (s.gst / 100)),
      margin: 0,
      marginType: 'amount',
    }]);
  };

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

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto custom-scrollbar">
      
      {/* ── Banner when converted from Estimate ── */}
      {fromEstimate && (
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Converted from Estimate <strong>{fromEstimate.estimateId}</strong> — review and finalize
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

        {/* ── Top Action Bar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center shadow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Tax Invoice / Bill of Supply</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {fromEstimate ? `Based on ${fromEstimate.estimateId}` : 'Create New GST Compliant Invoice'}
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
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow",
                saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"
              )}
            >
              {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</> : <><Send className="w-3.5 h-3.5" /> Finalize & Send</>}
            </button>
          </div>
        </div>

        {/* Search & Add Product */}
        <div className="bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
            <input
              type="text"
              placeholder="Search products or suppliers to add items..."
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
                      <p className="text-[11px] font-bold text-slate-800 uppercase">{p.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" /> {p.supplier}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300">|</span>
                        <span className="text-[9px] font-bold text-slate-400">Cost: ₹{p.cost.toLocaleString()}</span>
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

          <div className="flex items-center gap-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-2 border-r border-slate-100 pr-4">Quick Services:</p>
            <button 
              onClick={() => addService('installation')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white"
            >
              Installation
            </button>
            <button 
              onClick={() => addService('labor')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white"
            >
              Labor
            </button>
          </div>
        </div>

        {/* ── Invoice Body ── */}
        <div className="bg-white border border-slate-200 shadow-sm">

          {/* Billed From / To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-slate-100">
            {/* FROM */}
            <div className="p-8 border-r border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Billed From</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Helixion Innovations LLP</h3>
              <div className="space-y-1 text-xs text-slate-500">
                <p>Sector 62, Noida, Uttar Pradesh – 201301</p>
                <p>GSTIN: <span className="font-bold text-slate-800 uppercase">09AAACH1234F1Z5</span></p>
                <p>billing@helixion.in &nbsp;|&nbsp; +91-9876543210</p>
              </div>
            </div>
            {/* TO */}
            <div className="p-8 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <User className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Billed To</span>
              </div>
              <input
                type="text"
                placeholder="Customer / Business Name"
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
                className="w-full h-16 bg-white border border-slate-200 p-3 text-xs focus:border-primary outline-none resize-none"
              />
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">
            {[
              { label: 'Invoice No.',   value: invoiceNo,               icon: FileText  },
              { label: 'Invoice Date',  value: '25 May 2026',           icon: Calendar  },
              { label: 'Due Date',      value: '09 Jun 2026',           icon: Calendar  },
              { label: 'Supply State',  value: 'Uttar Pradesh (09)',    icon: MapPin    },
            ].map((m, i) => (
              <div key={i} className={cn("p-5 space-y-1", i < 3 && "border-r border-slate-100")}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <m.icon className="w-3 h-3" /> {m.label}
                </p>
                <p className="text-sm font-bold text-slate-900">{m.value}</p>
              </div>
            ))}
          </div>

          {/* ── Items Table ── */}
          <div className="overflow-x-auto">
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
              <tbody className="divide-y divide-slate-50">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className={cn(tdCls, "text-center text-slate-400 font-bold text-xs")}>{idx + 1}</td>
                    
                    <td className={tdCls}>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className="bg-transparent border-none focus:ring-0 p-0 text-[12px] font-bold text-slate-800 placeholder:text-slate-300 w-full"
                      />
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">HSN: {item.hsn}</p>
                    </td>

                    <td className={tdCls}>
                       <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Standard Supply</span>
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
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-2 py-1">{item.unit}</span>
                    </td>

                    <td className={tdCls}>
                       <p className="text-[12px] font-bold text-slate-800">₹{item.landedCost?.toLocaleString() ?? 0}</p>
                       <p className="text-[9px] text-slate-400 mt-0.5">Net Landed Cost</p>
                    </td>

                    <td className={tdCls}>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={item.margin || 0}
                          onChange={e => updateItem(item.id, 'margin', parseFloat(e.target.value) || 0)}
                          className="w-20 py-1.5 px-2 border border-slate-200 border-r-0 text-sm font-bold text-slate-800 bg-white"
                        />
                        <button
                          onClick={() => updateItem(item.id, 'marginType', item.marginType === 'percentage' ? 'amount' : 'percentage')}
                          className="h-[34px] px-2.5 bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-primary hover:text-white transition-all"
                        >
                          {item.marginType === 'percentage' ? '%' : '₹'}
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" />
                        +₹{Math.round((item.rate - (item.landedCost || 0)) * item.qty).toLocaleString()} profit
                      </p>
                    </td>

                    <td className={tdCls}>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-28 py-1.5 px-2 border-2 border-slate-200 text-sm font-bold text-primary bg-white focus:border-primary outline-none"
                      />
                      <p className="text-[9px] text-slate-400 mt-0.5">per {item.unit}</p>
                    </td>

                    <td className={tdCls}>
                      <select
                        value={item.taxRate}
                        onChange={e => updateItem(item.id, 'taxRate', parseInt(e.target.value))}
                        className="py-1.5 px-2 border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:border-primary outline-none cursor-pointer"
                      >
                        {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>

                    <td className={cn(tdCls, "text-right")}>
                       <p className="text-[13px] font-bold text-slate-900">₹{calcSubtotal(item).toLocaleString()}</p>
                       <p className="text-[9px] text-slate-400 mt-0.5">Total Line Amt</p>
                    </td>

                    <td className={cn(tdCls, "text-center")}>
                       <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-primary p-2"><X className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-16 text-center text-slate-300">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-10 h-10" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em]">No items added — Search above to add products</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <button
              onClick={addItem}
              className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-red-700 transition-colors uppercase tracking-[0.2em]"
            >
              <Plus className="w-3.5 h-3.5" /> Force Add Manual Item
            </button>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Use search above for catalog products</p>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-slate-100">

            {/* Notes + Bank */}
            <div className="p-8 border-r border-slate-100 space-y-6">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes / Payment Instructions</p>
                <textarea
                  placeholder="Add a note to the customer..."
                  className="w-full h-20 bg-slate-50 border border-slate-100 p-3 text-xs focus:border-primary outline-none resize-none"
                />
              </div>
              <div className="p-5 bg-slate-900 text-white space-y-3">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Bank Details</span>
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold">HDFC BANK LTD</p>
                  <p className="text-white/50">A/C: 50200012345678</p>
                  <p className="text-white/50">IFSC: HDFC0001234</p>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="p-8 space-y-3 bg-slate-50/30">
              {hasMarginData && (
                <div className="flex justify-between items-center py-2 border border-emerald-100 bg-emerald-50 px-4 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> Total Profit (this invoice)
                  </span>
                  <span className="text-sm font-black text-emerald-600">₹{Math.round(totalProfit).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{Math.round(totals.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>CGST {(items[0]?.taxRate ?? 18) / 2}%</span>
                <span className="font-bold text-slate-900">₹{Math.round(totals.tax / 2).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>SGST {(items[0]?.taxRate ?? 18) / 2}%</span>
                <span className="font-bold text-slate-900">₹{Math.round(totals.tax / 2).toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 my-2" />

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-2 mb-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                       <Layers className="w-3.5 h-3.5" /> Posting Ledger
                    </span>
                    <span className="text-[8px] font-bold text-primary bg-white px-2 py-0.5 rounded border border-primary/10 uppercase italic">Financial Link</span>
                 </div>
                 <select 
                    value={ledgerAccount}
                    onChange={(e) => setLedgerAccount(e.target.value)}
                    className="w-full bg-white border border-primary/20 text-xs font-bold text-slate-800 py-2.5 px-3 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none rounded-lg"
                 >
                    {ledgerAccounts.map(lac => (
                       <option key={lac.id} value={lac.id}>{lac.name} ({lac.type})</option>
                    ))}
                 </select>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Account ledger selection is mandatory for double-entry posting.</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">₹{Math.round(totals.total).toLocaleString()}</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="px-8 pb-12 pt-8 flex justify-end border-t border-slate-50">
            <div className="text-center">
              <div className="w-40 h-px bg-slate-800 mb-2" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-xs font-bold text-slate-800 mt-1 uppercase">For Helixion Innovations LLP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
