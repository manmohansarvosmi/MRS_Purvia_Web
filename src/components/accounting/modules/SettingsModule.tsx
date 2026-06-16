import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  CreditCard, 
  Building2, 
  ChevronRight, 
  Save, 
  Smartphone,
  Mail,
  Fingerprint,
  MapPin,
  Globe,
  Camera,
  AlertTriangle,
  ChevronLeft,
  Bell,
  Lock,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from "@/components/ui/button";
import { settingsApi } from '@/src/lib/api';
import { toast } from 'sonner';

const settingSections = [
  { id: 'profile', label: 'Identity & Access', icon: User, desc: 'Personal details & security' },
  { id: 'business', label: 'Organization Profile', icon: Building2, desc: 'Legal name, GST & Presence' },
  { id: 'security', label: 'Security & Shields', icon: Shield, desc: 'MFA & Audit protection' },
  { id: 'finance', label: 'Financial Controls', icon: CreditCard, desc: 'Currency & Ledger rules' },
];

export const SettingsModule = () => {
  const [activeSubTab, setActiveSubTab] = useState('business');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    organizationName: '',
    gstin: '',
    directorName: '',
    contactNumber: '',
    address: '',
    email: '',
    timezone: 'Asia/Kolkata (GMT+5:30)'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await settingsApi.getOrganization();
      if (res.code === 1 && res.data) {
        setFormData(res.data);
        if (res.data.logo) {
          setLogoPreview(`data:image/jpeg;base64,${res.data.logo}`);
        }
      }
    } catch (e) {
      toast.error("Failed to load organization profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Updating System Parameters...");
    try {
      const res = await settingsApi.updateOrganization(formData, logoFile || undefined);
      if (res.code === 1) {
        toast.success("Profile Synchronized Successfully", { id: toastId });
        if (res.data?.logo) {
           setLogoPreview(`data:image/jpeg;base64,${res.data.logo}`);
        }
      } else {
        toast.error(res.message || "Failed to update profile", { id: toastId });
      }
    } catch (e) {
      toast.error("System Error: Update Interrupted", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Control Center...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-[#F8FAFC]">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-[5px] flex items-center justify-center text-white">
            <SettingsIcon size={16} />
          </div>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">System Control Center</h2>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider leading-none mt-0.5">Enterprise Configuration Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="btn-primary h-8 px-5 text-[10px] shadow-sm uppercase font-bold tracking-widest flex items-center gap-2" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Commit changes
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
         
         <div className="w-[240px] bg-white border-r border-slate-200 flex flex-col p-3 overflow-y-auto no-scrollbar shrink-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2 mb-3">Nodes</p>
            <div className="space-y-1">
              {settingSections.map((sec) => (
                 <button 
                  key={sec.id} 
                  onClick={() => setActiveSubTab(sec.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] transition-all text-left",
                    activeSubTab === sec.id ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                  )}
                 >
                    <sec.icon size={14} className={activeSubTab === sec.id ? "text-primary" : "text-slate-400"} />
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[10px] font-bold uppercase truncate">{sec.label}</h4>
                    </div>
                 </button>
              ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-4xl space-y-6">
               
               {activeSubTab === 'business' ? (
                 <div className="bg-white border border-slate-200 rounded-[5px] shadow-sm overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Building2 size={12} className="text-slate-400" />
                          <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Organization Credentials</h3>
                       </div>
                    </div>
                    <div className="p-6 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                             <label className="erp-label">Legal Organization Name</label>
                             <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} className="erp-input h-9 font-bold text-slate-800 uppercase" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="erp-label">GSTIN / Tax ID</label>
                             <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className="erp-input h-9 font-mono !text-primary uppercase" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="erp-label">Principal Director / Authority</label>
                             <input type="text" name="directorName" value={formData.directorName} onChange={handleInputChange} className="erp-input h-9 font-bold text-slate-800 uppercase" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="erp-label">Support / Contact Helplne</label>
                             <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="erp-input h-9 font-bold text-slate-800 uppercase" />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                             <label className="erp-label">Registered Office Address</label>
                             <textarea name="address" value={formData.address} onChange={handleInputChange} className="erp-input !h-20 py-2 font-bold text-slate-800 uppercase resize-none" />
                          </div>
                       </div>
                       
                       <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div 
                              onClick={() => fileInputRef.current?.click()}
                              className="w-14 h-14 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[5px] flex items-center justify-center text-slate-300 group cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
                             >
                                {logoPreview ? (
                                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                  <Camera size={20} />
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-700 uppercase">Organization Logo</p>
                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Stored as BLOB in Database</p>
                             </div>
                          </div>
                          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary h-7 px-4 text-[9px]">Replace Logo</button>
                       </div>
                    </div>
                 </div>
               ) : activeSubTab === 'profile' ? (
                 <div className="bg-white border border-slate-200 rounded-[5px] shadow-sm overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                       <User size={12} className="text-slate-400" />
                       <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Admin Identity</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                          <label className="erp-label">Work Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="erp-input h-9 font-bold text-slate-800" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="erp-label">System Timezone</label>
                          <select name="timezone" value={formData.timezone} onChange={handleInputChange} className="erp-select h-9 font-bold text-slate-800 uppercase">
                             <option>Asia/Kolkata (GMT+5:30)</option>
                             <option>UTC (Neutral Time)</option>
                          </select>
                       </div>
                    </div>
                 </div>
               ) : (
                  <div className="bg-white border border-slate-200 rounded-[5px] shadow-sm p-20 flex flex-col items-center justify-center text-slate-300 italic">
                    <SettingsIcon size={32} className="mb-3 opacity-20" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Section content synchronizing...</p>
                 </div>
               )}

               <div className="bg-white border border-red-100 rounded-[5px] overflow-hidden shadow-sm">
                  <div className="px-4 py-2 bg-red-50/50 border-b border-red-100 flex items-center gap-2">
                     <AlertTriangle size={12} className="text-red-500" />
                     <h3 className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Sensitive Master Controls</h3>
                  </div>
                  <div className="p-4 space-y-4">
                     <p className="text-[9px] font-medium text-slate-500 leading-relaxed italic border-l-2 border-red-200 pl-3">Purging auditing records or resetting environment logs will delete all historical telemetry forever. Authorized Principal Authority clearance required.</p>
                     <div className="flex gap-2">
                        <button className="btn-secondary border-red-100 text-red-500 hover:bg-red-600 hover:text-white h-7 px-4 text-[9px]">Reset Journals</button>
                        <button className="btn-secondary border-red-100 text-red-500 hover:bg-red-600 hover:text-white h-7 px-4 text-[9px]">Purge Audit Logs</button>
                     </div>
                  </div>
               </div>

            </div>
         </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};
