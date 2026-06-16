import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Settings, ChevronRight, Search, CheckCircle2,
  AlertTriangle, IndianRupee, Clock, UserCheck, CalendarDays, ArrowLeft,
  Plus, History, Briefcase, RefreshCw, Loader2
} from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { toast } from 'sonner';
import { salaryApi, userApi } from '../../lib/api';

const fieldClass = 'h-8 px-3 w-full rounded-[4px] border border-slate-200 bg-white text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:ring-0 transition-colors outline-none';

// ─── Salary Config Form ────────────────────────────────────────────
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
      } catch (err) { console.error("Failed to fetch users", err); }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!selectedUserId) return;
      try {
        const res = await salaryApi.getConfigByUser(Number(selectedUserId));
        if (res.code === 1) setInitialData(res.data);
        else setInitialData(null);
      } catch (err) { setInitialData(null); }
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

    if (!selectedUserId) { toast.error('Selection required'); setIsSubmitting(false); return; }

    try {
      const response = await salaryApi.saveConfig(payload);
      if (response.code === 1) { toast.success('Config Synchronized'); onBack(); }
    } catch (error) { toast.error('Sync failed'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-[4px] transition-colors"><ArrowLeft size={14} /></button>
          <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Salary Configuration</h2>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onBack} className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">Discard</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
        <div className="max-w-4xl mx-auto space-y-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-slate-200 rounded-[8px] shadow-sm">
            <div className="col-span-full border-b border-slate-100 pb-2 mb-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Personnel Selection & Primary Compensation</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Employee</label>
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className={fieldClass}
                required
              >
                <option value="">Choose Employee...</option>
                {userList.map(u => (
                  <option key={u.id} value={u.id.toString()}>{u.fullName} ({u.username})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Base Monthly Salary (₹)</label>
              <input name="baseSalary" type="number" defaultValue={initialData?.baseSalary} required className={fieldClass} placeholder="45000" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Variable Incentive (₹)</label>
              <input name="incentive" type="number" defaultValue={initialData?.incentive} className={fieldClass} placeholder="5000" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Allowed Leaves / Month</label>
              <input name="allowedLeaves" type="number" defaultValue={initialData?.allowedLeavesPerMonth || 2} required className={fieldClass} />
            </div>

            <div className="col-span-full pt-4 border-b border-slate-100 pb-2 mt-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Temporal Logic & Shift Management</p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shift Initiation</label>
              <input name="shiftStart" type="time" defaultValue={initialData?.shiftStart?.substring(0, 5) || '09:00'} required className={fieldClass} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shift Conclusion</label>
              <input name="shiftEnd" type="time" defaultValue={initialData?.shiftEnd?.substring(0, 5) || '18:00'} required className={fieldClass} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Standard Working Units (Days)</label>
              <input name="workingDays" type="number" defaultValue={initialData?.workingDaysPerMonth || 26} required className={fieldClass} />
            </div>

            <div className="col-span-full pt-4 border-b border-slate-100 pb-2 mt-2">
               <p className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.1em]">Deduction Protocol & Penalties</p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-red-500/70 uppercase tracking-widest">Extra Leave Penalty (₹/Day)</label>
              <input name="leavePenalty" type="number" defaultValue={initialData?.extraLeavePenaltyPerDay} required className={fieldClass} style={{ borderLeft: '2px solid rgba(239, 68, 68, 0.2)' }} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Late Punch Charge (₹)</label>
              <input name="lateCharge" type="number" defaultValue={initialData?.latePunchCharge} required className={fieldClass} style={{ borderLeft: '2px solid rgba(245, 158, 11, 0.2)' }} />
            </div>

            <div className="col-span-full pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full h-10 text-[11px] rounded-[5px] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Confirm Configuration Matrix
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Employee Salary History ───────────────────────────────────────────
const EmployeeSalaryHistory = ({ user, onBack }: { user: any, onBack: () => void }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await salaryApi.getHistory(user.user?.id || user.id);
        if (res.code === 1) setHistory(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [user]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await salaryApi.updateStatus(id, status);
      if (res.code === 1) {
        toast.success(`Disbursement Node: ${status}`);
        const fresh = await salaryApi.getHistory(user.user?.id || user.id);
        if (fresh.code === 1) setHistory(fresh.data);
      }
    } catch (err) { toast.error("Sync Failure"); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-[4px] transition-colors"><ArrowLeft size={14} /></button>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Ledger: {user.user?.fullName}</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Commercial Disbursement Log Engine</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Temporal Cycle</th>
              <th>Attendance Unit</th>
              <th>Base Value</th>
              <th className="text-emerald-600">Incentive (+)</th>
              <th className="text-red-500">Deductions (-)</th>
              <th>Net Yield</th>
              <th className="text-center">Protocol Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-24 text-center text-[10px] font-black uppercase opacity-40">Polling Ledger History...</td></tr>
            ) : history.length === 0 ? (
               <tr><td colSpan={7} className="py-24 text-center text-[10px] font-black uppercase opacity-20">No commercial logs detected</td></tr>
            ) : history.map((rec, idx) => (
              <tr key={idx}>
                <td className="font-black text-slate-900 text-[11px] uppercase italic">{rec.month}</td>
                <td className="font-bold text-slate-500 text-[10.5px]">{rec.daysPresent || 0} Units</td>
                <td className="font-bold text-slate-800 text-[11px]">₹{(rec.baseSalary || 0).toLocaleString()}</td>
                <td className="font-black text-emerald-600 text-[11px] underline decoration-emerald-100">+₹{(rec.incentive || 0).toLocaleString()}</td>
                <td className="font-black text-red-500 text-[11px]">-₹{(rec.deductions || 0).toLocaleString()}</td>
                <td className="font-black text-slate-900 text-[12px] italic tracking-tighter">₹{(rec.netSalary || 0).toLocaleString()}</td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    {rec.status !== 'PAID' ? (
                       <button onClick={() => handleUpdateStatus(rec.id, 'PAID')} className="btn-primary h-6 px-3 text-[8px] rounded-[3px]">Disburse Funds</button>
                    ) : (
                      <span className="badge badge-success px-3 py-0.5 text-[8.5px] font-black rounded-[3px]">Verified & Settled</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Salary Management View ───────────────────────────────────────────────
export const SalaryManagement = () => {
  const [view, setView] = useState<'list' | 'config' | 'overview'>('list');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [editUserId, setEditUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayroll = async () => {
    setIsLoading(true);
    try {
      const res = await salaryApi.getConfigs();
      if (res.code === 1) setPayrollRecords(res.data);
    } catch (err: any) { 
      if (err.response?.status === 403) toast.error('Security Protocol: Forbidden Request');
      else toast.error('Sync Failure'); 
    }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPayroll(); }, [view]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const monthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
    try {
      const response = await salaryApi.generatePayroll(monthStr);
      if (response.code === 1) {
        toast.success(`Payroll Generated for ${monthStr}`);
        fetchPayroll();
      }
    } catch (error) { toast.error('Execution Failed'); }
    finally { setIsGenerating(false); }
  };

  if (view === 'config') return <SalaryConfigForm onBack={() => { setView('list'); setEditUserId(undefined); }} initialUserId={editUserId} />;
  if (view === 'overview' && selectedRecord) return <EmployeeSalaryHistory user={selectedRecord} onBack={() => setView('list')} />;

  const filtered = payrollRecords.filter(p =>
    p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) || p.user?.username?.includes(search)
  );

  const stats = {
    totalPayout: filtered.reduce((acc, curr) => acc + (curr.baseSalary + (curr.incentive || 0)), 0),
    avgBase: filtered.length > 0 ? (filtered.reduce((acc, curr) => acc + curr.baseSalary, 0) / filtered.length) : 0,
    deductionPotential: filtered.reduce((acc, curr) => acc + (curr.extraLeavePenaltyPerDay || 0), 0)
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-[5px] w-8 h-8">
            <IndianRupee size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Salary Disbursement Engine</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Commercial Node Payroll Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('config')} className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
            <Settings size={12} /> Configure Protocols
          </button>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <ChevronRight size={14} />} 
            Generate Fiscal Cycle
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Fiscal Liability</p>
          <p className="text-[14px] font-black text-emerald-600 italic">₹{stats.totalPayout.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Mean Base Value</p>
          <p className="text-[14px] font-black text-slate-900">₹{Math.round(stats.avgBase).toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Personnel Nodes</p>
          <p className="text-[14px] font-black text-slate-900">{filtered.length} <span className="text-[9px] text-slate-400 font-bold">UNITS</span></p>
        </div>
        <div className="ml-auto">
           <div className="search-bar w-56">
             <Search size={11} className="text-slate-400" />
             <input placeholder="Filter Personnel..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" />
           </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Personnel</th>
              <th className="w-[100px]">Temporal Unit</th>
              <th>Base Compensation</th>
              <th>Variable Node</th>
              <th>Shift Window</th>
              <th className="text-center">Commercial History</th>
              <th className="w-[120px] text-center">Operations</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={7} className="py-24 text-center text-[10px] font-black uppercase opacity-40 animate-pulse">Syncing Payroll Matrix...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={7} className="py-24 text-center opacity-20"><History size={32} className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase">No commercial records detected</p></td></tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[5px] bg-slate-900 flex items-center justify-center font-black text-white text-[10px] shadow-lg">
                      {row.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="cursor-pointer" onClick={() => { setSelectedRecord(row); setView('overview'); }}>
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1 group-hover:text-primary">{row.user?.fullName}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{row.user?.username}</p>
                    </div>
                  </div>
                </td>
                <td className="text-[10px] font-black text-slate-500 uppercase">{row.workingDaysPerMonth || 26} DAYS</td>
                <td className="font-mono text-[11px] font-black italic">₹{(row.baseSalary || 0).toLocaleString()}</td>
                <td>
                   <span className={cn("text-[10px] font-black italic", row.incentive > 0 ? "text-emerald-600 underline decoration-emerald-100" : "text-slate-300")}>
                      {row.incentive > 0 ? `+₹${row.incentive.toLocaleString()}` : '--'}
                   </span>
                </td>
                <td className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                   {row.shiftStart?.substring(0, 5)} - {row.shiftEnd?.substring(0, 5)}
                </td>
                <td className="text-center">
                   <button onClick={() => { setSelectedRecord(row); setView('overview'); }} className="h-6 px-3 bg-slate-50 border border-slate-200 text-[8.5px] font-black uppercase rounded-[3px] hover:bg-slate-900 hover:text-white transition-all">VIEW LEDGER</button>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditUserId(row.user?.id?.toString()); setView('config'); }} className="w-7 h-7 flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-200 rounded-[5px] hover:bg-slate-900 hover:text-white shadow-sm transition-all"><Settings size={12} /></button>
                    <button className="w-7 h-7 flex items-center justify-center bg-primary text-white border border-primary rounded-[5px] shadow-md shadow-primary/10 hover:bg-primary/90 transition-all"><FileText size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Commercial Ledger — Verified Nodes: {filtered.length}</p>
        <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
           <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none">FISCAL SYNC ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
