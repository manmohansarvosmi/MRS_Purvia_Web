import React from 'react';
import { 
  X, 
  Save, 
  Package, 
  Tag, 
  Barcode, 
  Layers, 
  IndianRupee,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AddProductForm = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <div className="bg-white border border-gray-100 shadow-xl p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
         <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-red-50 text-primary flex items-center justify-center rounded-xl">
               <Package className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Create New Product</h3>
               <p className="text-sm text-gray-500 mt-1">Populate the master catalog with item specific metadata</p>
            </div>
         </div>
         <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Left Column: Core Details */}
         <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2.5">
               <label className="text-[13px] font-semibold text-gray-700 ml-0.5">Full Product Name</label>
               <input 
                  type="text" 
                  placeholder="e.g. Solar Panel 450W Mono-Crystalline" 
                  className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none transition-all placeholder:text-gray-400" 
               />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-0.5">HSN Code</label>
                  <input 
                     type="text" 
                     placeholder="8541" 
                     className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none transition-all" 
                  />
               </div>
               <div className="space-y-2.5 relative">
                  <label className="text-[13px] font-semibold text-gray-700 ml-0.5">Category</label>
                  <div className="relative">
                     <select className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none appearance-none cursor-pointer">
                        <option>Solar Modules</option>
                        <option>Power Inverters</option>
                        <option>Energy Storage</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
               </div>
            </div>

            <div className="space-y-2.5">
               <label className="text-[13px] font-semibold text-gray-700 ml-0.5">SKU / Barcode ID</label>
               <div className="relative">
                  <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Scan or enter manual identification code" 
                     className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none transition-all" 
                  />
               </div>
            </div>
         </div>

         {/* Right Column: Pricing & Stock */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50/80 border border-gray-100 p-8 rounded-xl space-y-6">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-4">Pricing & Inventory</h4>
               
               <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                     <label className="text-[12px] font-semibold text-gray-600">Purchase Price</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                        <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-primary/30" />
                     </div>
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-[12px] font-semibold text-gray-600">Sales Price</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                        <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-primary/30" />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2.5">
                     <label className="text-[12px] font-semibold text-gray-600">Opening Stock</label>
                     <input type="number" placeholder="0" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-primary/30" />
                  </div>
                  <div className="space-y-2.5 relative">
                     <label className="text-[12px] font-semibold text-gray-600">Unit Type</label>
                     <div className="relative">
                        <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none appearance-none cursor-pointer">
                           <option>PCS</option>
                           <option>MTR</option>
                           <option>KGS</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-5 bg-white border border-gray-100 rounded-xl flex items-start gap-4 shadow-sm">
               <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
               </div>
               <div>
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">Stock Buffer Enabled</p>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">Notifications will trigger automatically when inventory reaches 10% of total capacity.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-end gap-6">
         <button onClick={onCancel} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-4">Discard Changes</button>
         <button className="px-10 py-4 bg-primary text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-md shadow-red-100 flex items-center gap-3 rounded-lg group">
            Save Product to Registry
            <Save className="w-4 h-4 group-hover:translate-y-[-1px] transition-transform" />
         </button>
      </div>
    </div>
  );
};
