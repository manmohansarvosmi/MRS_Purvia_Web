import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Calendar, 
  Building2, 
  ChevronDown,
  ChevronLeft,
  X,
  FileText,
  Calculator,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { inventoryApi, accountsApi, vendorApi } from '@/src/lib/api';
import { toast } from 'sonner';

interface PurchaseOrderItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unit: string;
  rate: number;
  tax: number;
}

interface PurchaseOrderFormProps {
  onBack: () => void;
}

export const PurchaseOrderForm = ({ onBack }: PurchaseOrderFormProps) => {
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { id: '1', productId: '', name: '', qty: 1, unit: 'PCS', rate: 0, tax: 18 }
  ]);
  const [suppliers, setSuppliers]   = useState<any[]>([]);
  const [products, setProducts]     = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);

  // Form States
  const [selectedSupplier, setSelectedSupplier]   = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedAccount, setSelectedAccount]     = useState('');
  const [purchaseDate, setPurchaseDate]           = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber]         = useState(`PO-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes]                         = useState('');

  const [paymentAccounts, setPaymentAccounts]     = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vendRes, prodRes, whRes, accRes] = await Promise.allSettled([
          vendorApi.getAllVendors(),
          inventoryApi.getAllProducts(),
          inventoryApi.getAllWarehouses(),
          accountsApi.getAllAccounts()
        ]);
        
        if (vendRes.status === 'fulfilled' && vendRes.value.status === 1) {
          console.log("Vendors Loaded:", vendRes.value.data);
          setSuppliers(vendRes.value.data || []);
        } else {
          console.error("Vendor fetch failed:", vendRes);
        }

        if (prodRes.status === 'fulfilled' && prodRes.value.status === 1) {
          setProducts(prodRes.value.data || []);
        }

        if (whRes.status === 'fulfilled' && whRes.value.status === 1) {
          setWarehouses(whRes.value.data || []);
        }

        if (accRes.status === 'fulfilled' && accRes.value.status === 1) {
            setPaymentAccounts(accRes.value.data || []);
            if (accRes.value.data?.length > 0) setSelectedAccount(accRes.value.data[0].id.toString());
        }
      } catch (error) {
        console.error("Critical fetch error:", error);
        toast.error("Failed to load form dependencies");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: '', name: '', qty: 1, unit: 'PCS', rate: 0, tax: 18 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof PurchaseOrderItem, value: any) => {
    setItems(items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'productId') {
            const prod = products.find(p => p.id.toString() === value);
            if (prod) {
                updated.name = prod.productName;
                updated.rate = prod.purchasePrice;
                updated.unit = prod.unit;
            }
        }
        return updated;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };

  const calculateTax = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate * (item.tax / 100)), 0);
  };

  const handleFinalize = async () => {
      if (!selectedSupplier) return toast.error("Please select a vendor");
      if (!selectedAccount) return toast.error("Please select a payment account");
      if (items.some(i => !i.productId)) return toast.error("Please select products for all rows");

      setSaving(true);
      try {
          const payload = {
              supplier: { id: parseInt(selectedSupplier) },
              purchaseDate: new Date(purchaseDate),
              invoiceNumber,
              notes,
              totalAmount: calculateSubtotal(),
              taxAmount: calculateTax(),
              netAmount: calculateSubtotal() + calculateTax(),
              status: 'RECEIVED',
              ledger: { id: parseInt(selectedAccount) },
              items: items.map(i => ({
                  product: { id: parseInt(i.productId) },
                  quantity: i.qty,
                  unitPrice: i.rate,
                  taxAmount: i.qty * i.rate * (i.tax / 100),
                  totalAmount: i.qty * i.rate * (1 + i.tax / 100)
              }))
          };

          const res = await inventoryApi.savePurchase(payload);
          if (res.status === 1) {
              toast.success("Purchase Order finalized successfully");
              onBack();
          } else {
              toast.error(res.message || "Failed to save purchase");
          }
      } catch (error) {
          console.error("Save error:", error);
          toast.error("System error while saving purchase");
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#F8FAFC' }}>
      
      {/* ── Header ── */}
      <div className="page-header shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-ghost !p-1.5 hover:bg-slate-100 rounded-[5px]" title="Go Back">
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">Create Purchase Order</h2>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-0.5">Procurement & Supply Chain</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-7 px-3 text-[10px]" onClick={onBack}>Discard</button>
          <button 
            className="btn-primary h-7 px-4 text-[10px] shadow-sm" 
            onClick={handleFinalize} 
            disabled={saving || loading}
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Finalize Order
          </button>
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="space-y-4 pb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ── Left Column: Basic Details ────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Vendor & Transaction Details */}
              <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Building2 size={12} className="text-slate-400" />
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Vendor & Transaction</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="erp-label">Select Vendor *</label>
                      <select 
                        value={selectedSupplier}
                        onChange={e => setSelectedSupplier(e.target.value)}
                        className="erp-select h-8 font-bold"
                      >
                        <option value="">Select Vendor...</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.vendorName || s.supplierName}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="erp-label">PO Ref #</label>
                        <input name="invoiceNumber" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="erp-input h-8 font-mono !text-primary" />
                      </div>
                      <div>
                        <label className="erp-label">Order Date</label>
                        <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="erp-input h-8" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="erp-label">Warehouse (Target)</label>
                      <select value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)} className="erp-select h-8">
                        <option value="">Select Warehouse...</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name || w.warehouseName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="erp-label">Payment Account</label>
                      <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="erp-select h-8">
                        <option value="">Select Account...</option>
                        {paymentAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill of Materials */}
              <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={12} className="text-slate-400" />
                    <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Bill of Materials</h3>
                  </div>
                  <button onClick={addItem} className="btn-secondary h-6 px-2 text-[9px]">
                    <Plus size={10} /> Add Item
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th className="w-10 text-center">#</th>
                        <th>Item Description</th>
                        <th className="w-24">Qty</th>
                        <th className="w-16">Unit</th>
                        <th className="w-28">Rate (₹)</th>
                        <th className="w-20">Tax %</th>
                        <th className="text-right w-32">Amount</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={item.id} className="group">
                          <td className="text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td>
                            <select 
                              value={item.productId}
                              onChange={e => updateItem(item.id, 'productId', e.target.value)}
                              className="w-full bg-transparent outline-none font-bold text-slate-700"
                            >
                              <option value="">Search Item...</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
                            </select>
                          </td>
                          <td>
                            <input 
                              type="number" 
                              step="any" 
                              value={item.qty} 
                              onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} 
                              className="w-full bg-slate-50/50 hover:bg-white focus:bg-white px-2 py-1 rounded border border-transparent focus:border-slate-300 outline-none font-bold text-slate-900 transition-all text-sm" 
                            />
                          </td>
                          <td className="text-slate-400 font-medium uppercase text-[9px]">{item.unit || '---'}</td>
                          <td>
                            <input 
                              type="number" 
                              step="any" 
                              value={item.rate} 
                              onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} 
                              className="w-full bg-slate-50/50 hover:bg-white focus:bg-white px-2 py-1 rounded border border-transparent focus:border-blue-400 outline-none font-bold text-blue-600 transition-all text-sm" 
                            />
                          </td>
                          <td>
                            <select value={item.tax} onChange={e => updateItem(item.id, 'tax', parseInt(e.target.value))} className="bg-transparent outline-none">
                              {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                            </select>
                          </td>
                          <td className="text-right font-bold text-slate-900">₹{(item.qty * item.rate * (1 + item.tax / 100)).toLocaleString()}</td>
                          <td className="text-center">
                            <button onClick={() => removeItem(item.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── Right Column: Summary & Notes ───────────────────── */}
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-[5px] p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                <div className="flex items-center justify-between mb-6 pb-2 border-white/10 border-b">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Summary Matrix</h3>
                  <Calculator size={14} className="text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                    <span>Subtotal</span>
                    <span className="text-white">₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                    <span>Tax Aggregate</span>
                    <span className="text-white">₹{calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest">NET AMOUNT REQ.</p>
                    <p className="text-2xl font-black italic tracking-tighter text-emerald-400">₹{(calculateSubtotal() + calculateTax()).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
                  <FileText size={12} className="text-slate-400" /> Procurement Notes
                </h3>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Narration for supplier..." 
                  className="erp-input !h-auto py-2 focus:border-slate-400 transition-all font-sans italic" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
