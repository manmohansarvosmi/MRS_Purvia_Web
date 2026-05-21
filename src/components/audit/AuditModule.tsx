import React from 'react';
import { 
  History, 
  ShieldCheck, 
  Eye, 
  Search, 
  Filter, 
  Download,
  AlertTriangle,
  User,
  Activity,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const auditLogs = [
  { id: '1', action: 'Login Success', user: 'Admin User', module: 'System', time: '10 mins ago', ip: '192.168.1.42' },
  { id: '2', action: 'Price Changed: SP-450-MO', user: 'Manager: Rajesh', module: 'Inventory', time: '45 mins ago', ip: '192.168.1.102' },
  { id: '3', action: 'Bulk Export: Ledger', user: 'Admin User', module: 'Accounts', time: '2 hours ago', ip: '192.168.1.42' },
  { id: '4', action: 'Failed Login Attempt', user: 'Unknown', module: 'Auth', time: '3 hours ago', ip: '202.45.12.9' },
];

export const AuditModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
             </div>
             System Audit Logs
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Security Compliance & Integrity Matrix</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Lock className="w-4 h-4" /> Security Policy
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
             <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input type="text" placeholder="Search by user, action, or module..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" />
               </div>
               <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><Filter className="w-5 h-5" /></button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Detail</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IP Address</th>
                        <th className="px-8 py-5 w-12"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {auditLogs.map((log) => (
                        <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6 text-xs font-bold text-slate-500">{log.time}</td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><User className="w-4 h-4" /></div>
                                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.user}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="space-y-1">
                                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.action}</p>
                                 <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{log.module} Module</p>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-xs font-mono text-slate-400">{log.ip}</td>
                           <td className="px-8 py-6"><button className="text-slate-300"><Eye className="w-5 h-5" /></button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
};
