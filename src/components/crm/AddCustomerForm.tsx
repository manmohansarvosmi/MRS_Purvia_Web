import React, { useState } from 'react';
import { 
  X, 
  Save, 
  UserPlus, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  ShieldCheck,
  Globe,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { salesApi } from '@/src/lib/api';
import { toast } from 'sonner';

export const AddCustomerForm = ({ onCancel }: { onCancel: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    customerType: 'RETAIL',
    companyName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Name and Phone are required');
      return;
    }

    try {
      setLoading(true);
      const response = await salesApi.saveCustomer(formData);
      if (response.success) {
        toast.success('Customer registered successfully');
        onCancel();
      } else {
        toast.error(response.message || 'Failed to register customer');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('An error occurred while saving the customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-xl p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-400 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
         <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-red-50 text-primary flex items-center justify-center rounded-xl">
               <UserPlus className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Onboard New Customer</h3>
               <p className="text-sm text-gray-500 mt-1">Register detailed business profile for CRM and Billing</p>
            </div>
         </div>
         <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
         </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Left Column: Business Profile */}
         <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2.5">
               <label className="text-[13px] font-semibold text-gray-700 ml-0.5">Company Legal Entity Name</label>
               <input 
                  type="text" 
                  placeholder="e.g. Tata Consultancy Services Ltd." 
                  className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none transition-all" 
                  value={formData.companyName}
                  onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
               />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-0.5">GST Registration Number</label>
                  <input 
                     type="text" 
                     placeholder="09AAAAA0000A1Z5" 
                     className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none uppercase transition-all" 
                     value={formData.gstin}
                     onChange={e => setFormData(p => ({ ...p, gstin: e.target.value }))}
                  />
               </div>
               <div className="space-y-2.5 relative">
                  <label className="text-[13px] font-semibold text-gray-700 ml-0.5">Account Tier</label>
                  <div className="relative">
                     <select 
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none appearance-none cursor-pointer"
                        value={formData.customerType}
                        onChange={e => setFormData(p => ({ ...p, customerType: e.target.value }))}
                     >
                        <option value="WHOLESALE">Wholesale Partner</option>
                        <option value="RETAIL">Retail Customer</option>
                        <option value="ENTERPRISE">Direct Enterprise</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
               </div>
            </div>

            <div className="space-y-2.5">
               <label className="text-[13px] font-semibold text-gray-700 ml-0.5">Registered Billing Address</label>
               <div className="relative group">
                  <MapPin className="absolute left-4 top-4 w-4.5 h-4.5 text-gray-400" />
                  <textarea 
                     placeholder="Enter full address details for invoicing" 
                     className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-lg text-sm font-normal focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-primary outline-none h-28 resize-none transition-all" 
                     value={formData.address}
                     onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  />
               </div>
            </div>
         </div>

         {/* Right Column: Contact Information */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50/80 border border-gray-100 p-8 rounded-xl space-y-6">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-4">Communication Details</h4>
               
               <div className="space-y-2.5">
                  <label className="text-[12px] font-semibold text-gray-600 ml-0.5">Contact Person*</label>
                  <input 
                    type="text" 
                    placeholder="Full name of representative" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-primary/30" 
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    required
                  />
               </div>

               <div className="space-y-4">
                  <div className="space-y-2.5">
                     <label className="text-[12px] font-semibold text-gray-600 ml-0.5">Phone Number*</label>
                     <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                           type="tel" 
                           placeholder="+91" 
                           className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-primary/30" 
                           value={formData.phone}
                           onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                           required
                        />
                     </div>
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-[12px] font-semibold text-gray-600 ml-0.5">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                           type="email" 
                           placeholder="contact@company.com" 
                           className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-primary/30" 
                           value={formData.email}
                           onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-5 bg-white border border-gray-100 rounded-xl flex items-start gap-4 shadow-sm">
               <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-indigo-600" />
               </div>
               <div>
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">Master Sync Active</p>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">This customer profile will be universally available across all business units and GST engines.</p>
               </div>
            </div>
         </div>

         {/* Footer Overlay (Absolute positioned in the relative parent if needed, but here it's part of the grid) */}
         <div className="lg:col-span-12 mt-12 pt-8 border-t border-gray-100 flex items-center justify-end gap-6">
            <button type="button" onClick={onCancel} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-4">Cancel Entry</button>
            <button 
               type="submit"
               disabled={loading}
               className="px-10 py-4 bg-primary text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-md shadow-red-100 flex items-center gap-3 rounded-lg group disabled:opacity-50"
            >
               {loading ? (
                  <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Registering...
                  </>
               ) : (
                  <>
                     Complete Registration
                     <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </>
               )}
            </button>
         </div>
      </form>
    </div>
  );
};
