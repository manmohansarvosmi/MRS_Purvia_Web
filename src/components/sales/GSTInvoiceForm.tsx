import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Send, 
  ChevronDown, 
  Search,
  Building2,
  User,
  MapPin,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
}

export const GSTInvoiceForm = () => {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', hsn: '', qty: 1, unit: 'PCS', rate: 0, discount: 0, taxRate: 18 }
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      name: '', 
      hsn: '', 
      qty: 1, 
      unit: 'PCS', 
      rate: 0, 
      discount: 0, 
      taxRate: 18 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = (item: InvoiceItem) => {
    const gross = item.qty * item.rate;
    const afterDiscount = gross - (gross * (item.discount / 100));
    return afterDiscount;
  };

  const totals = items.reduce((acc, item) => {
    const subtotal = calculateSubtotal(item);
    const tax = subtotal * (item.taxRate / 100);
    return {
      subtotal: acc.subtotal + subtotal,
      tax: acc.tax + tax,
      total: acc.total + subtotal + tax
    };
  }, { subtotal: 0, tax: 0, total: 0 });

  return (
    <div className="flex-1 bg-slate-50/50 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      <div className="w-full space-y-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Tax Invoice / Bill of Supply</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create New GST Compliant Invoice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-premium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="btn-premium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button className="btn-premium btn-primary bg-slate-900 text-white shadow-lg shadow-slate-200">
              <Send className="w-4 h-4" /> Finalize & Send
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="premium-card bg-white p-8 lg:p-12 shadow-2xl shadow-slate-200/50">
          
          {/* Company & Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12 border-b border-slate-100">
            {/* From */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Billed From</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Helixion Innovations LLP</h3>
                <div className="space-y-2 text-sm text-slate-600 font-medium">
                  <p>Sector 62, Noida, Uttar Pradesh, 201301</p>
                  <p>GSTIN: <span className="font-bold text-slate-900 uppercase">09AAACH1234F1Z5</span></p>
                  <p>Email: billing@helixion.in</p>
                </div>
              </div>
            </div>

            {/* To */}
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Billed To</span>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Customer / Business Name" 
                  className="w-full bg-transparent text-lg font-bold text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-300"
                />
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="GSTIN (Optional)" 
                    className="w-full h-8 bg-white border border-slate-200 rounded-lg px-3 text-xs font-bold uppercase focus:border-brand-indigo outline-none"
                  />
                  <textarea 
                    placeholder="Billing Address" 
                    className="w-full h-20 bg-white border border-slate-200 rounded-lg p-3 text-xs font-medium focus:border-brand-indigo outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-slate-100">
            {[
              { label: 'Invoice No.', value: 'HEL-2026-0042', icon: FileText },
              { label: 'Invoice Date', value: '14 May 2026', icon: Calendar },
              { label: 'Due Date', value: '29 May 2026', icon: Calendar },
              { label: 'Supply State', value: 'Uttar Pradesh (09)', icon: MapPin },
            ].map((meta, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <meta.icon className="w-3 h-3" /> {meta.label}
                </p>
                <p className="text-sm font-bold text-slate-900">{meta.value}</p>
              </div>
            ))}
          </div>

          {/* Item Table */}
          <div className="py-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-left">
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">HSN</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Disc %</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">GST %</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                    <th className="py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, index) => (
                    <tr key={item.id} className="group">
                      <td className="py-4 pr-4">
                        <input 
                          type="text" 
                          placeholder="Item description..." 
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-800"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="text" 
                          placeholder="8541" 
                          value={item.hsn}
                          onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                          className="w-20 bg-transparent border-none focus:ring-0 p-0 text-sm font-medium text-slate-500"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="number" 
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value))}
                          className="w-16 bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-800"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="number" 
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                          className="w-24 bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-800"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="number" 
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value))}
                          className="w-16 bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-800"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <select 
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, 'taxRate', parseInt(e.target.value))}
                          className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-800 outline-none"
                        >
                          {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </td>
                      <td className="py-4 text-right font-bold text-slate-900">
                        ₹{calculateSubtotal(item).toLocaleString()}
                      </td>
                      <td className="py-4 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-brand-rose transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button 
              onClick={addItem}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-brand-indigo hover:text-brand-indigo/80 transition-colors uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
          </div>

          {/* Footer Totals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
            {/* Notes & Terms */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Notes / Payment Instructions</p>
                <textarea 
                  placeholder="Add a note to the customer..." 
                  className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium focus:border-brand-indigo outline-none resize-none"
                />
              </div>
              <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <CreditCard className="w-4 h-4 text-brand-emerald" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Bank Details</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold">HDFC BANK LTD</p>
                  <p className="text-white/60">A/C: 50200012345678</p>
                  <p className="text-white/60">IFSC: HDFC0001234</p>
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                <span>CGST (9%)</span>
                <span className="font-bold text-slate-900">₹{(totals.tax/2).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                <span>SGST (9%)</span>
                <span className="font-bold text-slate-900">₹{(totals.tax/2).toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Amount</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-brand-indigo italic tracking-tighter">₹{totals.total.toLocaleString()}</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Area */}
          <div className="pt-24 flex justify-end">
            <div className="text-center space-y-4">
              <div className="w-48 h-px bg-slate-900 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
              <h4 className="text-sm font-bold text-slate-900 uppercase">For Helixion Innovations LLP</h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
