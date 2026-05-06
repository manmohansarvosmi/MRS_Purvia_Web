import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Calendar, 
  CreditCard, 
  Users,
  Fingerprint,
  Download,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { userApi } from '../../lib/api';
import { Badge } from "@/components/ui/badge";
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
      console.log("Fetching details for ID:", employeeId);
      try {
        const res = await userApi.getUserById(employeeId);
        console.log("API Response:", res);
        if (res.code === 1) {
          setEmployee(res.data);
        } else {
          console.error("API returned error code:", res.code, res.message);
        }
      } catch (err) {
        console.error("Failed to fetch employee details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-medium">Employee not found.</p>
        <Button variant="link" onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, color = "text-slate-900" }: any) => (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className={cn("text-sm font-bold truncate", color)}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="group text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-4 py-2 text-xs font-bold gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-10 px-4 text-xs font-bold gap-2 border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Profile
          </Button>
          <Button className="rounded-xl h-10 px-6 text-xs font-bold gap-2 bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95">
            Edit Details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="h-24 bg-slate-900 relative">
              <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
              </div>
            </div>
            <CardContent className="pt-16 pb-8 px-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{employee.fullName}</h2>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">Active</Badge>
              </div>
              <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mb-6">
                <Fingerprint className="w-4 h-4 text-primary" />
                {employee.username || 'EMP-ID'}
              </p>
              
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Designation</p>
                    <p className="text-sm font-bold text-slate-900">{employee.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Department</p>
                    <p className="text-sm font-bold text-slate-900">{employee.department}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">KYC Verification</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Aadhar Number</p>
                <p className="text-sm font-bold text-slate-900 tracking-wider">{employee.aadharCardNo || 'Not Provided'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PAN Number</p>
                <p className="text-sm font-bold text-slate-900 tracking-wider uppercase">{employee.panCardNo || 'Not Provided'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900 uppercase tracking-wider">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={Users} label="Father's Name" value={employee.fathersName} />
                <InfoItem icon={Mail} label="Official Email" value={employee.email} />
                <InfoItem icon={Phone} label="Mobile Number" value={employee.mobileNumber} />
                <InfoItem icon={Calendar} label="Joining Date" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900 uppercase tracking-wider">Document Previews</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhar Card</p>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase gap-1 text-primary">
                      <ExternalLink className="w-3 h-3" /> View Large
                    </Button>
                  </div>
                  <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                    {employee.aadharCardImage ? (
                      <img src={employee.aadharCardImage} alt="Aadhar" className="w-full h-full object-cover" />
                    ) : (
                      <CreditCard className="w-10 h-10 text-slate-300 opacity-50" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PAN Card</p>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase gap-1 text-primary">
                      <ExternalLink className="w-3 h-3" /> View Large
                    </Button>
                  </div>
                  <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                    {employee.panCardImage ? (
                      <img src={employee.panCardImage} alt="PAN" className="w-full h-full object-cover" />
                    ) : (
                      <CreditCard className="w-10 h-10 text-slate-300 opacity-50" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
