import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Package, 
  Barcode,
  ChevronDown,
  Warehouse,
  AlertTriangle,
  IndianRupee,
  Hash,
  FileText,
  Tag,
  LayoutGrid,
  Weight,
  MapPin,
  Percent,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddProductFormProps {
  onCancel: () => void;
}

const FormField = ({ label, icon: Icon, required, children }: { label: string; icon?: any; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
      {required && <span className="text-primary ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-normal text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200";
const selectClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 appearance-none cursor-pointer";

export const AddProductForm = ({ onCancel }: AddProductFormProps) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'pricing' | 'stock' | 'tax'>('basic');
  const [saved, setSaved] = useState(false);

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: IndianRupee },
    { id: 'stock', label: 'Stock & Location', icon: Warehouse },
    { id: 'tax', label: 'Tax & Compliance', icon: Percent },
  ] as const;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      onCancel();
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/40 overflow-hidden">
      {/* Top Bar - Full Width but clean */}
      <div className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors group text-[11px] font-medium uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back
          </button>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Add New Item</h2>
              <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Product Master Registry</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-[11px] font-medium uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "px-6 py-2.5 rounded-xl text-white text-[11px] font-medium uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg",
              saved
                ? "bg-emerald-500 shadow-emerald-200"
                : "bg-primary shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-100"
            )}
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Product</>
            )}
          </button>
        </div>
      </div>

      {/* Section Tabs - Sticky or part of header */}
      <div className="bg-white border-b border-slate-200 px-8 flex items-center gap-1 shrink-0">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3.5 text-[10px] font-medium uppercase tracking-widest transition-all relative",
              activeSection === sec.id
                ? "text-primary"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <sec.icon className="w-3.5 h-3.5" />
            {sec.label}
            {activeSection === sec.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Form Content Area with Card Layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          
          {/* === BASIC INFO === */}
          {activeSection === 'basic' && (
            <div className="animate-in fade-in duration-300">
              <div className="p-6 space-y-8">
                <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Product Identity</p>

                <FormField label="Full Product Name" icon={Package} required>
                  <input type="text" placeholder="e.g. Solar Panel 450W Mono-Crystalline" className={inputClass} />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="SKU / Item Code" icon={Hash} required>
                    <input type="text" placeholder="e.g. SP-450-MO" className={inputClass} />
                  </FormField>
                  <FormField label="Barcode / EAN" icon={Barcode}>
                    <input type="text" placeholder="Scan or enter barcode" className={inputClass} />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Category" icon={LayoutGrid} required>
                    <div className="relative">
                      <select className={selectClass}>
                        <option value="">Select Category</option>
                        <option>Solar Modules</option>
                        <option>Power Inverters</option>
                        <option>Energy Storage</option>
                        <option>Cables & Wiring</option>
                        <option>Mounting Systems</option>
                        <option>Accessories</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                  <FormField label="Brand / Manufacturer" icon={Tag}>
                    <input type="text" placeholder="e.g. Luminous, Waaree" className={inputClass} />
                  </FormField>
                </div>

                <FormField label="Description / Notes" icon={FileText}>
                  <textarea
                    rows={4}
                    placeholder="Brief product description, warranty notes, or specifications..."
                    className={cn(inputClass, "resize-none leading-relaxed")}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="Unit of Measure" icon={Weight} required>
                    <div className="relative">
                      <select className={selectClass}>
                        <option>PCS (Pieces)</option>
                        <option>MTR (Meters)</option>
                        <option>KGS (Kilograms)</option>
                        <option>LTR (Litres)</option>
                        <option>BOX</option>
                        <option>SET</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                  <FormField label="Model Number">
                    <input type="text" placeholder="Optional model no." className={inputClass} />
                  </FormField>
                  <FormField label="Item Type">
                    <div className="relative">
                      <select className={selectClass}>
                        <option>Goods</option>
                        <option>Service</option>
                        <option>Digital / Software</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="flex justify-end p-6 bg-slate-50/50 border-t border-slate-200">
                <button
                  onClick={() => setActiveSection('pricing')}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-medium uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
                >
                  Next: Pricing <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          )}

          {/* === PRICING === */}
          {activeSection === 'pricing' && (
            <div className="animate-in fade-in duration-300">
              <div className="p-6 space-y-8">
                <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Pricing Matrix</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Purchase / Cost Price" icon={IndianRupee} required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-normal text-sm">₹</span>
                      <input type="number" min="0" placeholder="0.00" className={cn(inputClass, "pl-8")} />
                    </div>
                  </FormField>
                  <FormField label="Sales / MRP Price" icon={IndianRupee} required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-normal text-sm">₹</span>
                      <input type="number" min="0" placeholder="0.00" className={cn(inputClass, "pl-8")} />
                    </div>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Wholesale Price">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-normal text-sm">₹</span>
                      <input type="number" min="0" placeholder="0.00" className={cn(inputClass, "pl-8")} />
                    </div>
                  </FormField>
                  <FormField label="Minimum Selling Price">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-normal text-sm">₹</span>
                      <input type="number" min="0" placeholder="0.00" className={cn(inputClass, "pl-8")} />
                    </div>
                  </FormField>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest">Gross Margin Calculator</p>
                    <p className="text-xs font-normal text-emerald-600/80 mt-1">Pricing information will be used to calculate margins and taxes automatically.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between p-6 bg-slate-50/50 border-t border-slate-200">
                <button onClick={() => setActiveSection('basic')} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-medium uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 rotate-90" /> Back
                </button>
                <button onClick={() => setActiveSection('stock')} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-medium uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                  Next: Stock <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          )}

          {/* Additional sections follow the same card pattern... */}
        </div>
      </div>
    </div>
  );
};
