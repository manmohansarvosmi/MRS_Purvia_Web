import React, { useState } from 'react';
import {
  UserPlus,
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  User,
  Fingerprint,
  Building2,
  Calendar,
  CreditCard,
  Upload,
  FileImage,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { userApi } from '../../lib/api';

interface AddEmployeeProps {
  onBack: () => void;
  onSuccess: () => void;
  employeeId?: number | null;
}

const fieldClass =
  'h-10 pl-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 hover:border-slate-300 transition-colors';

interface DocumentUploadProps {
  label: string;
  name: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUpload = ({ label, name, preview, onChange }: DocumentUploadProps) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <label
      htmlFor={name}
      className={`flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors
        ${preview ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
    >
      {preview ? (
        <img src={preview} alt={label} className="h-full w-full object-contain rounded-lg p-1" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <FileImage className="w-7 h-7" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-center px-2">
            Click to upload {label}
          </span>
        </div>
      )}
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
  </div>
);

export const AddEmployee = ({ onBack, onSuccess, employeeId }: AddEmployeeProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [panPreview, setPanPreview]       = useState<string | null>(null);
  const [initialData, setInitialData]     = useState<any>(null);

  React.useEffect(() => {
    if (employeeId) {
      const fetchEmp = async () => {
        try {
          const res = await userApi.getUserById(employeeId);
          if (res.code === 1) {
            setInitialData(res.data);
            setAadharPreview(res.data.aadharCardImage);
            setPanPreview(res.data.panCardImage);
          }
        } catch (err) {
          toast.error("Failed to fetch employee details");
        }
      };
      fetchEmp();
    }
  }, [employeeId]);

  const handleFileChange = (setter: (v: string | null) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setter(URL.createObjectURL(file));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get('name'),
      fathersName: formData.get('fatherName'),
      employeeId: formData.get('empId'),
      designation: formData.get('designation'),
      department: formData.get('department'),
      email: formData.get('email'),
      mobileNumber: formData.get('phone'),
      joiningDate: formData.get('joiningDate'),
      aadharCardNo: formData.get('aadharNo'),
      panCardNo: formData.get('panNo'),
      aadharCardImage: aadharPreview, // In a real app, you'd upload files to S3/Cloudinary first
      panCardImage: panPreview,
      password: 'User@123', // Standard default password
    };

    try {
      let response;
      if (employeeId) {
        response = await userApi.updateUser(employeeId, payload);
      } else {
        response = await userApi.createUser(payload);
      }
      
      if (response.code === 1) {
        toast.success(employeeId ? 'Employee updated.' : 'Employee registered.');
        onSuccess();
      } else {
        toast.error(response.message || 'Action failed.');
      }
    } catch (error) {
      toast.error('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="group text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-3 py-2 text-xs font-semibold gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Employee List
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
              <UserPlus className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
                {employeeId ? 'Edit Employee Details' : 'New Employee Registration'}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500 mt-0.5">
                {employeeId ? 'Update employee professional and KYC records' : 'Fill in professional, contact, and document details'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Row 1: Professional Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="name" defaultValue={initialData?.fullName} placeholder="John Doe" required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Father's Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="fatherName" defaultValue={initialData?.fathersName} placeholder="Robert Doe" required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Employee ID</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="empId" defaultValue={initialData?.username} placeholder="EMP-101" required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="designation" defaultValue={initialData?.designation} placeholder="Operations Lead" required className={fieldClass} />
                </div>
              </div>
            </div>

            {/* ── Row 2: Contact Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="department" defaultValue={initialData?.department} placeholder="Logistics" required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="email" defaultValue={initialData?.email} type="email" placeholder="john@purvia.com" required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="phone" defaultValue={initialData?.mobileNumber} placeholder="+91 XXXXX XXXXX" required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Joining Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input name="joiningDate" defaultValue={initialData?.joiningDate ? initialData.joiningDate.split('T')[0] : ''} type="date" required className={fieldClass} />
                </div>
              </div>
            </div>

            {/* ── Row 3: KYC Numbers ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aadhar Card No.</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    name="aadharNo"
                    defaultValue={initialData?.aadharCardNo}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PAN Card No.</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    name="panNo"
                    defaultValue={initialData?.panCardNo}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    required
                    className={`${fieldClass} uppercase`}
                  />
                </div>
              </div>
            </div>

            {/* ── Row 4: Document Uploads ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <DocumentUpload
                label="Aadhar Card Image"
                name="aadharImage"
                preview={aadharPreview}
                onChange={handleFileChange(setAadharPreview)}
              />
              <DocumentUpload
                label="PAN Card Image"
                name="panImage"
                preview={panPreview}
                onChange={handleFileChange(setPanPreview)}
              />
            </div>

            {/* ── Actions ── */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="h-10 px-6 rounded-lg text-slate-500 font-semibold text-sm hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : employeeId ? 'Update Employee' : 'Confirm Registration'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
