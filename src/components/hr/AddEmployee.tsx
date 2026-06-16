import React, { useState, useEffect } from 'react';
import {
  UserPlus, ArrowLeft, Mail, Phone, Briefcase, User, Fingerprint,
  Building2, Calendar, CreditCard, FileImage, Users, CheckCircle2, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '../../lib/api';

const fieldClass = 'h-8 px-3 w-full rounded-[4px] border border-slate-200 bg-white text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:ring-0 transition-colors outline-none';

interface AddEmployeeProps {
  onBack: () => void;
  onSuccess: () => void;
  employeeId?: number | null;
}

const DocumentUpload = ({ label, preview, onChange, id }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <label
      htmlFor={id}
      className={`flex flex-col items-center justify-center w-full h-32 rounded-[5px] border border-dashed cursor-pointer transition-all
        ${preview ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'}`}
    >
      {preview ? (
        <img src={preview} alt={label} className="h-full w-full object-contain rounded-[4px] p-2" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-300">
          <FileImage size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center px-4">Upload Payload</span>
        </div>
      )}
      <input id={id} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  </div>
);

export const AddEmployee = ({ onBack, onSuccess, employeeId }: AddEmployeeProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [panPreview, setPanPreview]       = useState<string | null>(null);
  const [initialData, setInitialData]     = useState<any>(null);

  useEffect(() => {
    if (employeeId) {
      const fetchEmp = async () => {
        try {
          const res = await userApi.getUserById(employeeId);
          if (res.code === 1) {
            setInitialData(res.data);
            setAadharPreview(res.data.aadharCardImage);
            setPanPreview(res.data.panCardImage);
          }
        } catch (err) { toast.error("Identity Fetch Failure"); }
      };
      fetchEmp();
    }
  }, [employeeId]);

  const handleFileChange = (setter: (v: string | null) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get('name'),
      fathersName: formData.get('fatherName'),
      username: formData.get('empId'),
      designation: formData.get('designation'),
      department: formData.get('department'),
      email: formData.get('email'),
      mobileNumber: formData.get('phone'),
      joiningDate: formData.get('joiningDate'),
      aadharCardNo: formData.get('aadharNo'),
      panCardNo: formData.get('panNo'),
      aadharCardImage: aadharPreview,
      panCardImage: panPreview,
      password: 'User@123',
    };

    try {
      const res = employeeId 
        ? await userApi.updateUser(employeeId, payload)
        : await userApi.createUser(payload);
      
      if (res.code === 1) {
        toast.success(employeeId ? 'Identity Updated' : 'Identity Registered');
        onSuccess();
      } else {
        toast.error(res.message || 'Operation Denied');
      }
    } catch (err) { toast.error('Communication Link Failure'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-[4px] transition-colors"><ArrowLeft size={14} /></button>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
               {employeeId ? 'Edit Identity Node' : 'New Identity Registration'}
            </h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Personnel Core Configuration Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onBack} className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">Discard</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-slate-50/20">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          
          {/* Section: Professional */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 border border-slate-200 rounded-[8px] shadow-sm relative overflow-hidden">
             <div className="col-span-full border-b border-slate-100 pb-2 mb-2">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.1em]">Professional & Identity Core</p>
             </div>
             
             <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
               <input name="name" defaultValue={initialData?.fullName} required className={fieldClass} placeholder="JOHN DOE" />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Father's Name</label>
               <input name="fatherName" defaultValue={initialData?.fathersName} required className={fieldClass} placeholder="ROBERT DOE" />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Employment ID</label>
               <input name="empId" defaultValue={initialData?.username} required className={fieldClass} placeholder="EMP-101" />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Joining Date</label>
               <input name="joiningDate" type="date" defaultValue={initialData?.joiningDate?.split('T')[0]} required className={fieldClass} />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Designation</label>
               <input name="designation" defaultValue={initialData?.designation} required className={fieldClass} placeholder="OPS LEAD" />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Department</label>
               <input name="department" defaultValue={initialData?.department} required className={fieldClass} placeholder="LOGISTICS" />
             </div>
          </div>

          {/* Section: Communication & KYC */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 border border-slate-200 rounded-[8px] shadow-sm">
             <div className="col-span-full border-b border-slate-100 pb-2 mb-2">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.1em]">Communication Node & Compliance</p>
             </div>

             <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Official Email Matrix</label>
                <input name="email" type="email" defaultValue={initialData?.email} required className={fieldClass} placeholder="admin@helixion.com" />
             </div>
             <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mobile Link</label>
                <input name="phone" defaultValue={initialData?.mobileNumber} required className={fieldClass} placeholder="+91 XXXXX XXXXX" />
             </div>

             <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aadhar Reference Number</label>
                <input name="aadharNo" defaultValue={initialData?.aadharCardNo} required className={fieldClass} placeholder="XXXX XXXX XXXX" />
             </div>
             <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PAN Reference Number</label>
                <input name="panNo" defaultValue={initialData?.panCardNo} required className={`${fieldClass} uppercase`} placeholder="ABCDE1234F" />
             </div>
          </div>

          {/* Section: Payload Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <DocumentUpload
                label="Aadhar Optical Payload"
                id="aadhar-up"
                preview={aadharPreview}
                onChange={handleFileChange(setAadharPreview)}
             />
             <DocumentUpload
                label="PAN Optical Payload"
                id="pan-up"
                preview={panPreview}
                onChange={handleFileChange(setPanPreview)}
             />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 pb-10">
              <button
                type="button"
                onClick={onBack}
                className="h-9 px-6 rounded-[5px] text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
              >
                Discard Identity
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary h-9 px-10 text-[10px] font-black uppercase rounded-[5px] shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {employeeId ? 'Apply identity changes' : 'Finalize Registration'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};
