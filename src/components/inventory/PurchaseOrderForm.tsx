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
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { inventoryApi, accountingApi } from '@/src/lib/api';
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
        const [supRes, prodRes, whRes, accRes] = await Promise.all([
          inventoryApi.getAllSuppliers(),
          inventoryApi.getAllProducts(),
          inventoryApi.getAllWarehouses(),
          accountingApi.getPaymentAccounts()
        ]);
        
        if (supRes.status === 1) setSuppliers(supRes.data);
        if (prodRes.status === 1) setProducts(prodRes.data);
        if (whRes.status === 1) setWarehouses(whRes.data);
        if (accRes.status === 1) {
            setPaymentAccounts(accRes.data);
            if (accRes.data.length > 0) setSelectedAccount(accRes.data[0].id.toString());
        }
      } catch (error) {
        console.error("Fetch error:", error);
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
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden animate-in fade-in duration-500">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-all">
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-100 mx-1" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase">Create Purchase Order</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Sourcing & Inventory Procurement</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center gap-2">
              Save Draft
           </button>
           <button 
                onClick={handleFinalize}
                disabled={saving || loading}
                className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Finalize Order'}
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
         <div className="w-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* ── Left Column: Basic Details ────────────────────────── */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                     <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                        <Building2 className="w-4.5 h-4.5 text-primary" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Vendor & Transaction Details</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div>
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Select Vendor</label>
                               <div className="relative">
                                  <select 
                                     value={selectedSupplier}
                                     onChange={e => setSelectedSupplier(e.target.value)}
                                     className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all appearance-none"
                                 >
                                     <option value="">Select Vendor...</option>
                                     {suppliers.map(s => (
                                         <option key={s.id} value={s.id}>{s.supplierName}</option>
                                     ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                               </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">PO Ref #</label>
                                  <input 
                                    type="text" 
                                    value={invoiceNumber} 
                                    onChange={e => setInvoiceNumber(e.target.value)}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-primary" 
                                  />
                               </div>
                               <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Date</label>
                                  <div className="relative">
                                     <input 
                                        type="date" 
                                        value={purchaseDate} 
                                        onChange={e => setPurchaseDate(e.target.value)}
                                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-primary" 
                                    />
                                  </div>
                               </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                               <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Warehouse (Target)</label>
                                  <select 
                                    value={selectedWarehouse}
                                    onChange={e => setSelectedWarehouse(e.target.value)}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all"
                                  >
                                     <option value="">Select Warehouse...</option>
                                     {warehouses.map(w => (
                                         <option key={w.id} value={w.id}>{w.warehouseName}</option>
                                     ))}
                                  </select>
                               </div>
                           <div>
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Payment Account</label>
                              <select 
                                value={selectedAccount}
                                onChange={e => setSelectedAccount(e.target.value)}
                                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                              >
                                 <option value="">Select Account...</option>
                                 {paymentAccounts.map(acc => (
                                     <option key={acc.id} value={acc.id}>{acc.name} ({acc.category})</option>
                                 ))}
                              </select>
                           </div>
                           <div>
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Payment Terms</label>
                              <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all">
                                 <option>Net 30 Days</option>
                                 <option>Advance 50% / Balance COD</option>
                                 <option>Immediate Transfer</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <FileText className="w-4 h-4 text-primary" />
                           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 italic">Bill of Materials / Items</h3>
                        </div>
                        <button onClick={addItem} className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm">
                           <Plus className="w-3 h-3 text-primary" /> Add Row
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-slate-900 text-white border-b border-slate-800">
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest w-16">#</th>
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest">Item Specification</th>
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest w-24">Qty</th>
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest w-16">Unit</th>
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest w-32">Rate (₹)</th>
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest w-20">Tax %</th>
                                 <th className="px-6 py-3 text-[8px] font-bold uppercase tracking-widest w-32 text-right">Magnitude</th>
                                 <th className="px-6 py-3 text-center w-12"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {items.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 group transition-colors italic-tabular font-bold text-slate-700 text-[11px]">
                                   <td className="px-6 py-4 text-slate-400 font-medium">0{idx + 1}</td>
                                   <td className="px-6 py-4">
                                       <select 
                                            value={item.productId}
                                            onChange={e => updateItem(item.id, 'productId', e.target.value)}
                                            className="w-full bg-transparent outline-none focus:text-primary transition-colors appearance-none font-bold"
                                        >
                                            <option value="">Select Item...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.productName}</option>
                                            ))}
                                       </select>
                                   </td>
                                   <td className="px-6 py-4">
                                       <input 
                                            type="number" 
                                            value={item.qty} 
                                            onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary/20" 
                                        />
                                   </td>
                                   <td className="px-6 py-4 text-slate-400">{item.unit}</td>
                                   <td className="px-6 py-4">
                                       <input 
                                            type="number" 
                                            value={item.rate}
                                            onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                            placeholder="0.00" 
                                            className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary/20 text-slate-900" 
                                        />
                                   </td>
                                   <td className="px-6 py-4">
                                       <select 
                                            value={item.tax}
                                            onChange={e => updateItem(item.id, 'tax', parseInt(e.target.value))}
                                            className="bg-transparent outline-none appearance-none"
                                        >
                                          <option value={18}>18%</option>
                                          <option value={12}>12%</option>
                                          <option value={5}>5%</option>
                                          <option value={0}>0%</option>
                                       </select>
                                   </td>
                                   <td className="px-6 py-4 text-right italic text-slate-900">₹{(item.qty * item.rate * (1 + item.tax / 100)).toLocaleString()}</td>
                                   <td className="px-6 py-4 text-center">
                                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-slate-200 hover:text-rose-500 transition-colors">
                                         <Trash2 className="w-3.5 h-3.5" />
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
               <div className="space-y-6">
                  <div className="bg-slate-900 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                     <div className="flex items-center justify-between mb-8 pb-4 border-white/10 border-b">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Consolidated Values</h3>
                        <Calculator className="w-4 h-4 text-primary" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                           <span>Total Quantities</span>
                           <span className="text-white">{items.reduce((a, b) => a + b.qty, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                           <span>Subtotal (Net)</span>
                           <span className="text-white">₹{calculateSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                           <span>Tax Aggregate</span>
                           <span className="text-white">₹{calculateTax().toLocaleString()}</span>
                        </div>
                        <div className="w-full h-px bg-white/10 my-6" />
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-primary uppercase italic tracking-widest">GRAND TOTAL Magnitude</p>
                              <p className="text-3xl font-black italic tracking-tighter text-emerald-400">₹{(calculateSubtotal() + calculateTax()).toLocaleString()}</p>
                           </div>
                           <ArrowRight className="w-6 h-6 text-white/20" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6 italic">Narration & Instructions</h3>
                     <textarea 
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Enter special procurement instructions or vendor notes..." 
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] font-medium text-slate-600 outline-none focus:border-primary focus:bg-white transition-all resize-none shadow-inner" 
                    />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
