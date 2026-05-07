import React, { useState } from 'react';
import {
  FileText,
  Download,
  Settings,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Clock,
  UserCheck,
  CalendarDays,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/src/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from 'sonner';
import { salaryApi, userApi } from '../../lib/api';
import { useEffect } from 'react';

// Shared field style — consistent for all inputs and selects
const fieldClass =
  'h-10 pl-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 hover:border-slate-300 transition-colors';

const selectTriggerClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-colors px-3';



// ─── Salary Config Form (Full Page) ────────────────────────────────────────────
const SalaryConfigForm = ({ onBack, initialUserId }: { onBack: () => void, initialUserId?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || '');
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getAllUsers();
        if (res.code === 1) setUserList(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch existing config when user is selected
  useEffect(() => {
    const fetchConfig = async () => {
      if (!selectedUserId) return;
      try {
        const res = await salaryApi.getConfigByUser(Number(selectedUserId));
        if (res.code === 1) {
          setInitialData(res.data);
        } else {
          setInitialData(null);
        }
      } catch (err) {
        setInitialData(null);
        console.warn("No existing config for this user");
      }
    };
    fetchConfig();
  }, [selectedUserId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      userId: selectedUserId,
      baseSalary: Number(formData.get('baseSalary')),
      incentive: Number(formData.get('incentive')),
      workingDaysPerMonth: Number(formData.get('workingDays')),
      shiftStart: formData.get('shiftStart'),
      shiftEnd: formData.get('shiftEnd'),
      allowedLeavesPerMonth: Number(formData.get('allowedLeaves')),
      extraLeavePenaltyPerDay: Number(formData.get('leavePenalty')),
      latePunchCharge: Number(formData.get('lateCharge')),
    };

    if (!selectedUserId) {
      toast.error('Please select an employee');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await salaryApi.saveConfig(payload);
      if (response.code === 1) {
        toast.success('Salary configuration saved.');
        onBack();
      }
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error(error);
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
          Back to Salary List
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
              <Settings className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
                {initialData ? 'Edit Salary Configuration' : 'New Salary Configuration'}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500 mt-0.5">
                {initialData 
                  ? `Updating records for ${initialData.user?.fullName}` 
                  : 'Set compensation, shift timings, and deduction rules per employee'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-8">
          <form onSubmit={handleSave} className="space-y-8">

            {/* ── Row 1: Employee + Compensation ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Select Employee</label>
                <Select onValueChange={setSelectedUserId} value={selectedUserId}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Choose employee..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200 shadow-md">
                    {userList.map(u => (
                      <SelectItem key={u.id} value={u.id.toString()} className="text-sm font-medium">
                        {u.fullName} ({u.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Base Monthly Salary (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="baseSalary" 
                    type="number" 
                    placeholder="45000" 
                    required 
                    className={fieldClass} 
                    key={initialData?.baseSalary}
                    defaultValue={initialData?.baseSalary || ''}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Incentive / Performance (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="incentive" 
                    type="number" 
                    placeholder="5000" 
                    className={fieldClass} 
                    key={initialData?.incentive}
                    defaultValue={initialData?.incentive || ''}
                  />
                </div>
              </div>
            </div>

            {/* ── Row 2: Shift & Attendance ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Working Days / Month</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="workingDays" 
                    type="number" 
                    required 
                    className={fieldClass} 
                    key={initialData?.workingDaysPerMonth}
                    defaultValue={initialData?.workingDaysPerMonth || '26'}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Shift Start</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="shiftStart" 
                    type="time" 
                    required 
                    className={fieldClass} 
                    key={initialData?.shiftStart}
                    defaultValue={initialData?.shiftStart?.substring(0, 5) || '09:00'}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Shift End</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="shiftEnd" 
                    type="time" 
                    required 
                    className={fieldClass} 
                    key={initialData?.shiftEnd}
                    defaultValue={initialData?.shiftEnd?.substring(0, 5) || '18:00'}
                  />
                </div>
              </div>
            </div>

            {/* ── Row 3: Deduction Rules ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Allowed Leaves / Month</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="allowedLeaves" 
                    type="number" 
                    required 
                    className={fieldClass} 
                    key={initialData?.allowedLeavesPerMonth}
                    defaultValue={initialData?.allowedLeavesPerMonth || '2'}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Extra Leave Penalty / Day (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="leavePenalty" 
                    type="number" 
                    required 
                    className={fieldClass} 
                    key={initialData?.extraLeavePenaltyPerDay}
                    defaultValue={initialData?.extraLeavePenaltyPerDay || ''}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Late Punch Charge (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input 
                    name="lateCharge" 
                    type="number" 
                    required 
                    className={fieldClass} 
                    key={initialData?.latePunchCharge}
                    defaultValue={initialData?.latePunchCharge || ''}
                  />
                </div>
              </div>
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
                {isSubmitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Employee Salary History View ───────────────────────────────────────────
const EmployeeSalaryHistory = ({ user, onBack }: { user: any, onBack: () => void }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.user?.id) return;
      setLoading(true);
      try {
        const res = await salaryApi.getHistory(user.user.id);
        if (res.code === 1) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await salaryApi.updateStatus(id, status);
      if (res.code === 1) {
        toast.success(`Salary marked as ${status}`);
        // Refresh history
        if (user?.user?.id) {
          const freshHistory = await salaryApi.getHistory(user.user.id);
          if (freshHistory.code === 1) setHistory(freshHistory.data);
        }
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Ledger
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
            {user.user?.fullName?.charAt(0) || 'E'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.user?.fullName}</h2>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{user.user?.username}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Base', value: `₹${user.baseSalary?.toLocaleString()}`, icon: IndianRupee },
          { label: 'Avg Incentive', value: `₹${(user.incentive || 0).toLocaleString()}`, icon: CheckCircle2 },
          { label: 'Working Days', value: `${user.workingDaysPerMonth || 26} Days`, icon: CalendarDays },
          { label: 'Current Status', value: 'Active', icon: UserCheck },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-black text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/40 overflow-hidden">
        <CardHeader className="px-10 py-8 border-b border-slate-50">
          <CardTitle className="text-xl font-black text-slate-900">Salary Disbursement History</CardTitle>
          <CardDescription>Detailed month-wise breakdown for the current fiscal year</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-50">
              <TableHead className="px-10 h-14 text-[10px] font-black uppercase text-slate-400 tracking-widest">Month / Cycle</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase text-slate-400 tracking-widest">Attendance</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase text-slate-400 tracking-widest">Base Salary</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase text-slate-400 tracking-widest text-emerald-500">Incentive</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase text-slate-400 tracking-widest text-red-500">Deductions</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase text-slate-400 tracking-widest">Net Payable</TableHead>
              <TableHead className="px-10 h-14 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((rec, idx) => (
              <TableRow key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <TableCell className="px-10 py-6 font-black text-slate-900 text-sm">{rec.month}</TableCell>
                <TableCell className="py-6 font-bold text-slate-600 text-sm">{rec.daysPresent || 0} Days</TableCell>
                <TableCell className="py-6 font-bold text-slate-900 text-sm">₹{(rec.baseSalary || 0).toLocaleString()}</TableCell>
                <TableCell className="py-6 font-black text-emerald-600 text-sm">+₹{(rec.incentive || 0).toLocaleString()}</TableCell>
                <TableCell className="py-6 font-black text-red-500 text-sm">-₹{(rec.deductions || 0).toLocaleString()}</TableCell>
                <TableCell className="py-6 font-black text-slate-900 text-sm">₹{(rec.netSalary || 0).toLocaleString()}</TableCell>
                <TableCell className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {rec.status !== 'PAID' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(rec.id, 'PAID')}
                        className="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
                      >
                        Disburse
                      </Button>
                    )}
                    <Badge className={cn(
                      "font-black text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider border-none",
                      rec.status === 'PAID' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {rec.status}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};


// ─── Salary List / Main View ────────────────────────────────────────────────────
export const SalaryManagement = () => {
  const [view, setView] = useState<'list' | 'config' | 'overview'>('list');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [editUserId, setEditUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await salaryApi.getConfigs(); // Fetching configs as proxy for payroll for now
        if (res.code === 1) setPayrollRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch payroll", err);
      }
    };
    fetchPayroll();
  }, [view]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const monthStr = '2026-04'; // Dynamic based on selection ideally
    try {
      const response = await salaryApi.generatePayroll(monthStr);
      if (response.code === 1) {
        toast.success(`Salary generated for ${monthStr}`);
        // Optionally refresh list here
      }
    } catch (error) {
      toast.error('Failed to generate payroll');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await salaryApi.updateStatus(id, status);
      if (res.code === 1) {
        toast.success(`Payroll marked as ${status}`);
        // Refresh list
        const fresh = await salaryApi.getConfigs();
        if (fresh.code === 1) setPayrollRecords(fresh.data);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (view === 'config') {
    return <SalaryConfigForm onBack={() => { setView('list'); setEditUserId(undefined); }} initialUserId={editUserId} />;
  }

  if (view === 'overview' && selectedRecord) {
    return <EmployeeSalaryHistory user={selectedRecord} onBack={() => setView('list')} />;
  }

  const filtered = payrollRecords.filter(p =>
    p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) || p.user?.username?.includes(search)
  );

  // Dynamic Statistics
  const stats = {
    totalPayout: filtered.reduce((acc, curr) => acc + (curr.baseSalary + (curr.incentive || 0) - (curr.deductions || 0)), 0),
    avgSalary: filtered.length > 0 
      ? filtered.reduce((acc, curr) => acc + (curr.baseSalary + (curr.incentive || 0) - (curr.deductions || 0)), 0) / filtered.length 
      : 0,
    totalDeductions: filtered.reduce((acc, curr) => acc + (curr.deductions || 0), 0),
    employeeCount: filtered.length,
    absenceCount: filtered.filter(f => (f.deductions || 0) > 0).length
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Salary Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Monthly payroll generation & disbursement</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setView('config')}
            className="h-10 px-5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 gap-2 shadow-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configure Salary
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="h-10 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors active:scale-[0.98] gap-2"
          >
            {isGenerating ? 'Generating...' : 'Generate Payroll'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-slate-900 bg-slate-900 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="p-6 relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-3">Total Payout (Est.)</p>
            <span className="text-3xl font-bold tracking-tight text-white">₹{stats.totalPayout.toLocaleString()}</span>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-white/60">Verified · {stats.employeeCount} Employees</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Average Salary</p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">₹{Math.round(stats.avgSalary).toLocaleString()}</h3>
            <p className="text-xs font-semibold text-slate-400 mt-4 uppercase">Attendance weighted</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Total Deductions</p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold tracking-tight text-red-600">₹{stats.totalDeductions.toLocaleString()}</h3>
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-4 uppercase">{stats.absenceCount} Penalties Detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payslip Ledger</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">April 2026 — Distribution Records</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-60 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 pl-9 rounded-lg border border-slate-200 bg-white text-sm font-medium placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-colors"
              />
            </div>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-lg border border-slate-200 font-semibold text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 gap-2 shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              {['Employee', 'Days Present', 'Base Salary', 'Incentive', 'Deductions', 'Net Pay', 'Status', ''].map((h, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    'h-11 px-6 text-[11px] font-bold uppercase text-slate-400 tracking-wider',
                    i === 7 && 'text-right'
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm shrink-0">
                      {row.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="cursor-pointer" onClick={() => { setSelectedRecord(row); setView('overview'); }}>
                      <p className="font-semibold text-slate-900 text-sm hover:text-primary transition-colors">{row.user?.fullName || 'Unknown'}</p>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">{row.user?.username || 'N/A'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 font-semibold text-sm text-slate-600">
                  {row.workingDaysPerMonth || 26} Days
                </TableCell>
                <TableCell className="px-6 py-4 font-semibold text-sm text-slate-900">
                  ₹{(row.baseSalary || 0).toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className={cn(
                    "font-bold text-sm",
                    row.incentive > 0 ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {row.incentive > 0 ? `+₹${row.incentive.toLocaleString()}` : '—'}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-semibold text-sm text-red-400">
                    {row.deductions > 0 ? `-₹${row.deductions.toLocaleString()}` : '—'}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-bold text-sm text-slate-900">
                    ₹{(row.baseSalary + (row.incentive || 0) - (row.deductions || 0)).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant="outline" className={cn(
                    'rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase border',
                    row.status === 'PAID' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  )}>
                    {row.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {row.status !== 'PAID' && row.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(row.id, 'PAID')}
                        className="h-8 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all font-bold text-[10px] uppercase"
                      >
                        Paid
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { 
                        setEditUserId(row.user?.id?.toString());
                        setView('config'); 
                      }}
                      className="h-8 w-8 p-0 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900 transition-all"
                      title="Edit Salary Config"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedRecord(row); setView('overview'); }}
                      className="h-8 w-8 p-0 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:text-primary transition-all"
                      title="View Overview"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:border-slate-300 gap-1.5 font-semibold text-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Payslip
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="px-6 py-10 text-center text-sm font-medium text-slate-400">
                  No employees match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
