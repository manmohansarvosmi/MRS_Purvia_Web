import React from 'react';
import { 
  X, Package, Warehouse, IndianRupee, Hash, Tag, LayoutGrid, ArrowLeft, 
  TrendingUp, BarChart3, Clock, MapPin, ShieldCheck, Box
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
}

export const ProductDetailView = ({ product, onBack }: ProductDetailViewProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-slate-50 font-['Poppins']">
      
      {/* ── Header ── */}
      <div className="h-[52px] px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="btn-ghost !p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-slate-900 rounded-[8px] flex items-center justify-center shadow-lg">
                <Box size={18} className="text-white" />
             </div>
             <div>
                <h2 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight leading-none">{product.productName}</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Item SKU: {product.sku}</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
            product.stockQuantity > (product.lowStockThreshold || 10) 
              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
              : "bg-amber-50 border-amber-100 text-amber-600"
          )}>
            {product.stockQuantity > (product.lowStockThreshold || 10) ? 'Available' : 'Low Stock'}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Stock</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 italic tracking-tighter">{product.stockQuantity}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{product.unit || 'PCS'}</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selling Price</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 italic tracking-tighter text-emerald-600">₹{product.sellingPrice?.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Purchase Price</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 italic tracking-tighter text-blue-600">₹{product.purchasePrice?.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax (GST %)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 italic tracking-tighter text-slate-700">{product.gstRate}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rate</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Core Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Identity & Technicals */}
              <div className="bg-white rounded-[8px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <Tag size={14} className="text-slate-400" />
                  <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Item Specification Matrix</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-8 gap-x-12">
                   <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Product Category</p>
                      <div className="flex items-center gap-2">
                         <LayoutGrid size={14} className="text-slate-300" />
                         <span className="text-[12px] font-bold text-slate-800">{product.category?.categoryName || 'General Stock'}</span>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Manufacturer / Brand</p>
                      <div className="flex items-center gap-2">
                         <Building2Icon size={14} className="text-slate-300" />
                         <span className="text-[12px] font-bold text-slate-800">{product.brand || 'Original Equipment Manufacturer'}</span>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">HSN Protocol Code</p>
                      <div className="flex items-center gap-2">
                         <Hash size={14} className="text-slate-300" />
                         <span className="text-[12px] font-bold text-slate-800 font-mono italic">{product.hsnCode || '---'}</span>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Storage Node</p>
                      <div className="flex items-center gap-2">
                         <Warehouse size={14} className="text-slate-300" />
                         <span className="text-[12px] font-bold text-slate-800 uppercase italic tracking-tighter">{product.warehouse?.name || 'Main Fulfillment Hub'}</span>
                      </div>
                   </div>
                   <div className="col-span-2 space-y-1.5 pt-4 border-t border-slate-50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Item Description / Technical Notes</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">
                        {product.description || 'No detailed technical documentation provided for this asset.'}
                      </p>
                   </div>
                </div>
              </div>

              {/* Transaction Logs (Placeholder) */}
              <div className="bg-white rounded-[8px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Recent Movement Ledger</h3>
                  </div>
                  <button className="text-[9px] font-bold text-primary uppercase hover:underline">View Full Logs</button>
                </div>
                <div className="p-12 flex flex-col items-center justify-center opacity-20">
                    <Clock size={48} className="mb-4 stroke-[1px]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Logs...</p>
                </div>
              </div>
            </div>

            {/* Right Column: Storage & Logistics */}
            <div className="space-y-6">
               <div className="bg-[#1e293b] rounded-[8px] p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <h3 className="text-[12px] font-black uppercase tracking-widest italic">Logistics Node</h3>
                     </div>
                     <div className="space-y-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-[4px]">
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Rack / Bin Location</p>
                           <p className="text-xl font-black text-center italic tracking-tighter">{product.rackLocation || 'A-00-Z'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="p-2 border border-white/5 bg-white/5 rounded-[4px] text-center">
                              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Low Stock Alert</p>
                              <p className="text-[12px] font-black font-mono">{product.lowStockThreshold || 10} {product.unit}</p>
                           </div>
                           <div className="p-2 border border-white/5 bg-white/5 rounded-[4px] text-center">
                              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Taxation Protocol</p>
                              <p className="text-[12px] font-black italic">{product.taxType || 'EXCLUSIVE'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-[8px] border border-slate-200 p-6 flex flex-col items-center text-center gap-4 shadow-inner">
                  <div className="w-16 h-16 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                     <Package size={32} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Operational Summary</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter max-w-[180px] leading-relaxed">
                        This asset is current registered on the cluster and available for inventory transactions.
                     </p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

const Building2Icon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);
