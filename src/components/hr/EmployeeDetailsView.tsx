import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, User, Mail, Phone, Briefcase, Building2, Calendar, 
  CreditCard, Users, Fingerprint, Download, ExternalLink, ShieldCheck
} from 'lucide-react';
import { userApi } from '../../lib/api';
import { cn } from "@/src/lib/utils";

interface EmployeeDetailsViewProps {
  employeeId: number;
  onBack: () => void;
}

export const EmployeeDetailsView = ({ employeeId, onBack }: EmployeeDetailsViewProps) => {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await userApi.getUserById(employeeId);
        if (res.code === 1) setEmployee(res.data);
      } catch (err) { console.error("Identity Fetch Failure"); }
      finally { setLoading(false); }
    };
    fetchDetails();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white opacity-40">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Extracting Personal Metadata...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mb-4">Identity Not Found</p>
        <button onClick={onBack} className="btn-secondary h-8 px-6 text-[10px] rounded-[5px]">Return To Index</button>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, color = "text-slate-900" }: any) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-[5px] transition-all hover:bg-white hover:border-slate-300">
      <div className="w-8 h-8 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <Icon size={12} className="text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className={cn("text-[11px] font-black truncate uppercase italic", color)}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white h-full">
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-[4px] transition-colors"><ArrowLeft size={14} /></button>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Identity Profile: {employee.fullName}</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Personnel Metadata Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]"><Download size={11} /> Export Dossier</button>
          <button className="btn-primary h-8 px-6 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">Edit Details</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-slate-50/20 custom-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Avatar & Core Bio */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm overflow-hidden">
               <div className="h-16 bg-slate-900 relative" />
               <div className="px-6 pb-6">
                  <div className="relative -mt-8 mb-4">
                     <div className="w-16 h-16 rounded-[8px] bg-white border border-slate-200 p-1 shadow-xl">
                        <div className="w-full h-full rounded-[4px] bg-slate-100 flex items-center justify-center">
                           <User size={32} className="text-slate-300" />
                        </div>
                     </div>
                  </div>
                  <div className="mb-6">
                     <h3 className="text-[14px] font-black text-slate-900 uppercase italic tracking-tight">{employee.fullName}</h3>
                     <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Fingerprint size={10} /> {employee.username || 'EMP-NODE'}
                     </p>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                     <InfoItem icon={Briefcase} label="Professional Rank" value={employee.designation} />
                     <InfoItem icon={Building2} label="Deployment Hub" value={employee.department} />
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[8px] p-4 shadow-sm">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-800">Compliance & KYC Verify</span>
               </div>
               <div className="space-y-2">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-[4px]">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Aadhar Identification</p>
                     <p className="text-[11px] font-black text-slate-900 tracking-wider">XXXX-XXXX-XXXX-{(employee.aadharCardNo || '').slice(-4)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-[4px]">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">PAN Identification</p>
                     <p className="text-[11px] font-black text-slate-900 tracking-wider uppercase italic">{employee.panCardNo || 'Not Registered'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Extended Info & Docs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm overflow-hidden">
               <div className="px-6 py-3 border-b border-slate-100 bg-white">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Metadata Repository</p>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={Users} label="Ancestry / Father Name" value={employee.fathersName} />
                  <InfoItem icon={Mail} label="Digital Node (Email)" value={employee.email} />
                  <InfoItem icon={Phone} label="Communication Link (Phone)" value={employee.mobileNumber} />
                  <InfoItem icon={Calendar} label="Deployment Initiation" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'} />
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm overflow-hidden">
               <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Optical Evidence Log</p>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Aadhar Optical Payload</p>
                     <div className="aspect-[1.586/1] bg-slate-100 rounded-[5px] border border-slate-200 flex items-center justify-center overflow-hidden">
                        {employee.aadharCardImage ? (
                          <img src={employee.aadharCardImage} alt="Aadhar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center opacity-20"><CreditCard size={24} className="mx-auto mb-1" /><p className="text-[8px] font-black uppercase">No Payload</p></div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">PAN Optical Payload</p>
                     <div className="aspect-[1.586/1] bg-slate-100 rounded-[5px] border border-slate-200 flex items-center justify-center overflow-hidden">
                        {employee.panCardImage ? (
                          <img src={employee.panCardImage} alt="PAN" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center opacity-20"><CreditCard size={24} className="mx-auto mb-1" /><p className="text-[8px] font-black uppercase">No Payload</p></div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
