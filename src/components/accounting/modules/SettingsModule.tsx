import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  Database, 
  ChevronRight, 
  Save, 
  RefreshCw,
  Building2,
  FileText,
  Smartphone,
  Mail,
  MoreVertical,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingSections = [
  { id: 'profile', label: 'Identity & Access', icon: User, desc: 'Manage personal details and credentials' },
  { id: 'business', label: 'Organization Profile', icon: Building2, desc: 'GSTIN, Branding, and Legal configurations' },
  { id: 'security', label: 'Security & Shields', icon: Shield, desc: '2FA, Audit logs, and IP restrictions' },
  { id: 'finance', label: 'Financial Controls', icon: CreditCard, desc: 'Currency defaults, Tax rates, and Ledger rules' },
  { id: 'notification', label: 'Alert Preferences', icon: Bell, desc: 'Webhook, Email, and Push configurations' },
  { id: 'backup', label: 'Data & Infinity', icon: Database, desc: 'Cloud backups, Export, and History purging' },
];

export const SettingsModule = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-100 rounded-[1.75rem] flex items-center justify-center border-2 border-slate-900 shadow-xl">
              <SettingsIcon className="w-8 h-8 text-slate-900 animate-spin-slow" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Control Center</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Configure your business logic & intelligence parameters</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-black transition-all">
             <Save className="w-4 h-4 text-primary" /> Commit All Changes
           </button>
        </div>
      </div>

      {/* ── Layout ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         
         {/* Navigation Sidebar */}
         <div className="space-y-3">
            {settingSections.map((sec) => (
               <button key={sec.id} className={cn(
                  "w-full p-6 bg-white rounded-[2rem] border transition-all flex items-center gap-5 group text-left",
                  sec.id === 'profile' ? "border-primary shadow-xl ring-4 ring-primary/5" : "border-slate-50 hover:border-slate-200 shadow-sm"
               )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
                    sec.id === 'profile' ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
                  )}>
                     <sec.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{sec.label}</h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">{sec.desc}</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", sec.id === 'profile' ? "text-primary" : "text-slate-200")} />
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-12">
               
               {/* Section: Profile */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] italic">Profile Configuration</h3>
                     <button className="text-[9px] font-black text-primary uppercase underline">Edit Avatar</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                        <input type="text" defaultValue="Manmohan Sarvosmi" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-xs font-black text-slate-800 outline-none focus:border-primary transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
                        <input type="email" defaultValue="manmohan@helixion.in" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-xs font-black text-slate-800 outline-none focus:border-primary transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                        <input type="text" defaultValue="Principal Director" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-xs font-black text-slate-800 outline-none focus:border-primary transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone / Locale</label>
                        <select className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-xs font-black text-slate-800 outline-none appearance-none">
                           <option>Asia/Kolkata (GMT+5:30)</option>
                           <option>America/New_York (GMT-5:00)</option>
                        </select>
                     </div>
                  </div>
               </section>

               {/* Section: Organization */}
               <section className="space-y-8 pt-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] italic border-b border-slate-50 pb-8">Organization Credentials</h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <Shield className="w-6 h-6 text-emerald-500" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">GSTIN Authentication</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">09AAACH1234F1Z5 • VERIFIED</p>
                           </div>
                        </div>
                        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm">Update Cert</button>
                     </div>
                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <Smartphone className="w-6 h-6 text-blue-500" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Multi-Factor Auth (MFA)</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">ENABLED • PROTECTING YOUR CREDENTIALS</p>
                           </div>
                        </div>
                        <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                        </div>
                     </div>
                  </div>
               </section>

               {/* Section: Danger Zone */}
               <section className="pt-8 space-y-6">
                  <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                     <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.2em] mb-3 italic">Danger Zone</h4>
                     <p className="text-[10px] text-rose-500/80 uppercase font-black tracking-widest leading-relaxed">Hard-deleting assets or purging financial history is irreversible. Exercise extreme caution before proceeding.</p>
                     <div className="mt-8 flex flex-wrap gap-4">
                        <button className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">Deactivate Workspace</button>
                        <button className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">Purge Audit Logs</button>
                     </div>
                  </div>
               </section>

            </div>
         </div>

      </div>
    </div>
  );
};
