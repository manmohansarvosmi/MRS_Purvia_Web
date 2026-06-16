import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Mail, Phone, Edit2, Trash2, RefreshCw, Eye, Loader2, MapPin, Users, Briefcase
} from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Employee } from '../../types';
import { toast } from 'sonner';
import { userApi } from '../../lib/api';
import { AddEmployee } from './AddEmployee';
import { EmployeeDetailsView } from './EmployeeDetailsView';

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingEmpId, setViewingEmpId] = useState<number | null>(null);
  const [editingEmpId, setEditingEmpId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const result = await userApi.getAllUsers();
      if (result && result.data) {
        const mappedData = result.data.map((user: any) => ({
          id: user.id,
          name: user.fullName || user.name || 'N/A',
          empId: user.username || `EMP-${user.id}`,
          designation: user.designation || 'Staff',
          email: user.email || 'N/A',
          phone: user.mobileNumber || user.phoneNumber || 'N/A',
          status: user.status?.toLowerCase() || 'active',
          joiningDate: user.joiningDate || user.createdAt || new Date().toISOString(),
          salaryType: 'monthly',
          baseRate: user.salary || 0,
          role: user.role || 'employee',
          attendanceId: user.attendanceId || 0
        }));
        setEmployees(mappedData);
      }
    } catch (err: any) { 
      if (err.response?.status === 403) {
        toast.error('Access Forbidden: Check your permissions or token.');
      } else {
        toast.error('Sync failed'); 
      }
    }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  if (isAdding || editingEmpId) {
    return <AddEmployee 
      onBack={() => { setIsAdding(false); setEditingEmpId(null); }} 
      onSuccess={() => { setIsAdding(false); setEditingEmpId(null); fetchEmployees(); }} 
      employeeId={editingEmpId}
    />;
  }

  if (viewingEmpId) {
    return <EmployeeDetailsView employeeId={viewingEmpId} onBack={() => setViewingEmpId(null)} />;
  }

  const filtered = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.empId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-[5px] w-8 h-8">
            <Users size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Employee Directory</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Human Resource Management & Compliance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search size={12} className="text-slate-400" />
            <input 
              placeholder="Search by name or ID..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium"
            />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]" onClick={fetchEmployees} disabled={isLoading}>
            <RefreshCw size={12} className={cn(isLoading && "animate-spin")} /> Refresh
          </button>
          <button className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20" onClick={() => setIsAdding(true)}>
            <Plus size={13} /> Add Employee
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Active Workforce</p>
          <p className="text-[14px] font-black text-slate-900 italic">{employees.length} <span className="text-[9px] text-slate-400 font-bold">UNITS</span></p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Departments</p>
          <p className="text-[14px] font-black text-slate-900">{Array.from(new Set(employees.map(e => e.designation))).length}</p>
        </div>
        <div className="ml-auto">
           <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">WORKFORCE SERVER ONLINE</span>
           </div>
        </div>
      </div>

      {/* ── Main Data View ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-[100px] text-center">CODE</th>
              <th>Employee Identification</th>
              <th>Communication Node</th>
              <th>Professional Rank</th>
              <th className="w-[140px]">Deployment Date</th>
              <th className="w-[100px] text-center">Status</th>
              <th className="w-[100px] text-center">Operations</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-40">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Indexing Workforce Matrix...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-20">
                      <Users size={32} />
                      <p className="text-[11px] font-black uppercase tracking-widest">No workforce records found</p>
                   </div>
                </td>
              </tr>
            ) : filtered.map((emp) => (
              <tr key={emp.id} className="group">
                <td className="font-mono text-[10px] font-black text-primary italic text-center">
                  {emp.empId}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center text-[10px] font-black text-white rounded-[5px] shadow-lg" style={{ background: '#1E2330' }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{emp.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                       <Mail size={10} className="text-slate-300" /> {emp.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                       <Phone size={10} className="text-slate-300" /> {emp.phone}
                    </div>
                  </div>
                </td>
                <td>
                   <div className="flex items-center gap-2">
                     <Briefcase size={11} className="text-slate-300" />
                     <span className="text-[10.5px] font-black text-slate-800 uppercase italic">{emp.designation}</span>
                   </div>
                </td>
                <td className="text-[10px] font-bold text-slate-500 uppercase">
                   {new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="text-center">
                   <span className={cn(
                     "badge inline-flex items-center justify-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border min-w-[80px] rounded-[3px]",
                     emp.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                   )}>
                      {emp.status}
                   </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setViewingEmpId(Number(emp.id))} className="w-7 h-7 flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-200 rounded-[5px] hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                       <Eye size={12} />
                    </button>
                    <button onClick={() => setEditingEmpId(Number(emp.id))} className="w-7 h-7 flex items-center justify-center bg-primary text-white border border-primary rounded-[5px] hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                       <Edit2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Fixed Footer ── */}
      <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Personnel Core — Node 1-{filtered.length} of {employees.length} Verified Identities
        </p>
        <div className="flex items-center gap-1.5">
           <button className="h-6 px-3 text-[9px] font-black uppercase rounded-[5px] bg-slate-900 text-white shadow-lg shadow-slate-900/20">1</button>
        </div>
      </div>
    </div>
  );
};
