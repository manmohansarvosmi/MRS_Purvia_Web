import React, { useState, useEffect } from 'react';
import { 
  X, Save, Package, Warehouse, IndianRupee, Hash, FileText, Tag, LayoutGrid, Weight, MapPin, Percent, ArrowLeft, Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi } from '../../lib/api';
import { toast } from 'sonner';

interface AddProductFormProps {
  onCancel: () => void;
  initialData?: any;
  readOnly?: boolean;
}

export const AddProductForm = ({ onCancel, initialData, readOnly }: AddProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    productName: initialData?.productName || '', 
    description: initialData?.description || '', 
    sku: initialData?.sku || '',
    category: { id: initialData?.category?.id || null as number | null }, 
    brand: initialData?.brand || '', 
    purchasePrice: initialData?.purchasePrice || 0,
    sellingPrice: initialData?.sellingPrice || 0, 
    stockQuantity: initialData?.stockQuantity || 0, 
    lowStockThreshold: initialData?.lowStockThreshold || 10,
    unit: initialData?.unit || 'PCS', 
    hsnCode: initialData?.hsnCode || '', 
    warehouse: { id: initialData?.warehouse?.id || null as number | null },
    rackLocation: initialData?.rackLocation || '', 
    gstRate: initialData?.gstRate || 18, 
    taxType: initialData?.taxType || 'EXCLUSIVE',
  });

  useEffect(() => {
    Promise.all([inventoryApi.getAllCategories(), inventoryApi.getAllWarehouses()])
      .then(([catRes, whRes]) => {
        if (catRes.status === 1) setCategories(catRes.data);
        if (whRes.status === 1) setWarehouses(whRes.data);
      });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'categoryId') setFormData(p => ({ ...p, category: { id: value ? parseInt(value) : null } }));
    else if (name === 'warehouseId') setFormData(p => ({ ...p, warehouse: { id: value ? parseInt(value) : null } }));
    else setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.productName || !formData.sku || !formData.category.id) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      setLoading(true);
      let res;
      if (initialData?.id) {
        res = await inventoryApi.updateProduct(initialData.id, formData);
      } else {
        res = await inventoryApi.saveProduct(formData);
      }
      
      if (res.status === 1) {
        toast.success(initialData?.id ? "Product updated" : "Product registered");
        onCancel();
      } else toast.error(res.message || "Failed");
    } catch { toast.error("An error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#F8FAFC' }}>
      
      {/* ── Header ── */}
      <div className="page-header shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="btn-ghost !p-1.5 hover:bg-slate-100 rounded-[5px]" title="Go Back">
            <ArrowLeft size={14} className="text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 tracking-tight">
                {readOnly ? 'VIEW PRODUCT' : (initialData?.id ? 'EDIT PRODUCT' : 'REGISTER NEW ITEM')}
            </h2>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-0.5">Global Catalog Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-7 px-3 text-[10px]" onClick={onCancel}>{readOnly ? 'Back' : 'Discard'}</button>
          {!readOnly && (
            <button className="btn-primary h-7 px-4 text-[10px] shadow-sm" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                {initialData?.id ? 'Update Product' : 'Save Product'}
            </button>
          )}
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="space-y-3 pb-12">
          
          {/* Section: Basic Identity */}
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Tag size={12} className="text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Basic Identity</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <label className="erp-label">Product Name *</label>
                <input name="productName" value={formData.productName} onChange={handleChange} disabled={readOnly} className="erp-input h-8 text-sm focus:border-slate-400 transition-all font-medium" placeholder="e.g. Solar Panel 450W Mono PERC" />
              </div>
              <div>
                <label className="erp-label">SKU / Item Code *</label>
                <input name="sku" value={formData.sku} onChange={handleChange} disabled={readOnly} className="erp-input h-8 focus:border-slate-400 transition-all" placeholder="SP-450-MO" />
              </div>
              <div>
                <label className="erp-label">HSN Code</label>
                <div className="relative">
                  <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} disabled={readOnly} className="erp-input h-8 pl-8 focus:border-slate-400 transition-all" placeholder="Enter HSN Code" />
                  <Hash size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="erp-label">Category *</label>
                <select name="categoryId" value={formData.category.id || ''} onChange={handleChange} disabled={readOnly} className="erp-select h-8 focus:border-slate-400 transition-all">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                </select>
              </div>
              <div>
                <label className="erp-label">Brand / Manufacturer</label>
                <input name="brand" value={formData.brand} onChange={handleChange} disabled={readOnly} className="erp-input h-8 focus:border-slate-400 transition-all" placeholder="e.g. Luminous" />
              </div>
            </div>
          </div>

          {/* Section: Pricing & Stock */}
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <IndianRupee size={12} className="text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Pricing & Inventory</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
              <div>
                <label className="erp-label">Initial Stock</label>
                <input name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} disabled={readOnly} className="erp-input h-8 font-semibold text-slate-700" />
              </div>
              <div>
                <label className="erp-label">Unit of Measure</label>
                <select name="unit" value={formData.unit} onChange={handleChange} disabled={readOnly} className="erp-select h-8">
                  {['PCS', 'MTR', 'KGS', 'LTR', 'BOX', 'SET'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="erp-label">Low Stock Alert</label>
                <input name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} disabled={readOnly} className="erp-input h-8" />
              </div>
              <div className="bg-slate-50/50 p-3 rounded-[5px] border border-dashed border-slate-200">
                <label className="erp-label">Purchase Price (₹)</label>
                <input name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} disabled={readOnly} className="erp-input h-8 bg-white font-mono font-bold text-blue-600" placeholder="0.00" />
              </div>
              <div className="bg-slate-50/50 p-3 rounded-[5px] border border-dashed border-slate-200">
                <label className="erp-label">Selling Price (₹)</label>
                <input name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} disabled={readOnly} className="erp-input h-8 bg-white font-mono font-bold text-green-600" placeholder="0.00" />
              </div>
              <div>
                <label className="erp-label">GST Rate (%)</label>
                <select name="gstRate" value={formData.gstRate} onChange={handleChange} disabled={readOnly} className="erp-select h-8">
                  {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}% GST Standard</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Storage & Compliance */}
          <div className="bg-white border border-slate-200 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Warehouse size={12} className="text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Storage & Compliance</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="erp-label">Warehouse Location</label>
                <select name="warehouseId" value={formData.warehouse.id || ''} onChange={handleChange} disabled={readOnly} className="erp-select h-8">
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="erp-label">Rack / Bin No.</label>
                <input name="rackLocation" value={formData.rackLocation} onChange={handleChange} disabled={readOnly} className="erp-input h-8" placeholder="R-12/B-04" />
              </div>

              <div>
                <label className="erp-label">Tax Type</label>
                <div className="flex gap-1 p-0.5 bg-slate-100 rounded-[5px] border border-slate-200 h-8">
                   {['EXCLUSIVE', 'INCLUSIVE'].map(t => (
                     <button
                        key={t}
                        type="button"
                        onClick={() => !readOnly && setFormData(p => ({ ...p, taxType: t }))}
                        className={cn(
                          "flex-1 text-[9px] font-bold uppercase rounded-[4px] transition-all duration-200",
                          formData.taxType === t ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700",
                          readOnly && "cursor-default"
                        )}
                      >
                        {t}
                      </button>
                   ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="erp-label">Product Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  disabled={readOnly}
                  rows={2} 
                  className="erp-input !h-auto py-2 focus:border-slate-400 transition-all font-sans" 
                  placeholder="Additional specifications or warranty details..."
                />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
