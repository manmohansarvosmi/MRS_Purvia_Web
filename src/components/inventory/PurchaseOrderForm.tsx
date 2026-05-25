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
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: '', name: '', qty: 1, unit: 'PCS', rate: 0, tax: 18 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };

  const calculateTax = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate * (item.tax / 100)), 0);
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
           <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-black transition-all flex items-center gap-2">
              Finalize Order
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
                                 <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all appearance-none">
                                    <option>Search Vendor...</option>
                                    <option>Tata Solar Systems Ltd.</option>
                                    <option>Havells India Pvt. Ltd.</option>
                                    <option>Waaree Energies</option>
                                 </select>
                                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">PO Ref #</label>
                                 <input type="text" defaultValue="PO-2026-0045" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-primary" />
                              </div>
                              <div>
                                 <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Date</label>
                                 <div className="relative">
                                    <input type="date" defaultValue="2026-05-25" className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-primary" />
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div>
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-1.5">Warehouse (Target)</label>
                              <select className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[11px] font-bold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all">
                                 <option>Main Warehouse (Gwalior)</option>
                                 <option>Secondary Hub (Indore)</option>
                                 <option>Transit Point (Bhopal)</option>
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
                                      <input type="text" placeholder="Select Item..." className="w-full bg-transparent outline-none focus:text-primary transition-colors" />
                                   </td>
                                   <td className="px-6 py-4">
                                      <input type="number" defaultValue={item.qty} className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary/20" />
                                   </td>
                                   <td className="px-6 py-4 text-slate-400">PCS</td>
                                   <td className="px-6 py-4">
                                      <input type="number" placeholder="0.00" className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary/20 text-slate-900" />
                                   </td>
                                   <td className="px-6 py-4">
                                      <select className="bg-transparent outline-none appearance-none">
                                         <option>18%</option>
                                         <option>12%</option>
                                         <option>5%</option>
                                         <option>0%</option>
                                      </select>
                                   </td>
                                   <td className="px-6 py-4 text-right italic text-slate-900">₹0.00</td>
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
                     <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Consolidated Values</h3>
                        <Calculator className="w-4 h-4 text-primary" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                           <span>Total Quantities</span>
                           <span className="text-white">0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                           <span>Subtotal (Net)</span>
                           <span className="text-white">₹0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                           <span>Tax Aggregate</span>
                           <span className="text-white">₹0.00</span>
                        </div>
                        <div className="w-full h-px bg-white/10 my-6" />
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-primary uppercase italic tracking-widest">GRAND TOTAL Magnitude</p>
                              <p className="text-3xl font-black italic tracking-tighter text-emerald-400">₹0.00</p>
                           </div>
                           <ArrowRight className="w-6 h-6 text-white/20" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6 italic">Narration & Instructions</h3>
                     <textarea placeholder="Enter special procurement instructions or vendor notes..." className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] font-medium text-slate-600 outline-none focus:border-primary focus:bg-white transition-all resize-none shadow-inner" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
