import React from 'react';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Settings, 
  ShieldAlert,
  ArrowRight,
  Clock,
  Zap,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const notifications = [
  { id: 1, title: 'Compliance Verification', msg: 'GSTR-1 Filing completed for the month of May.', type: 'success', time: '2h ago' },
  { id: 2, title: 'Low Inventory Alert', msg: 'Stock level for "TMT Saria 12mm" is below 15%.', type: 'warning', time: '5h ago' },
  { id: 3, title: 'System Security', msg: 'Unauthorized login attempt detected from 192.168.1.104.', type: 'critical', time: 'Yesterday' },
  { id: 4, title: 'Payroll Node', msg: 'June salary disbursement matrix is ready for verification.', type: 'info', time: 'Yesterday' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle2 className="w-14 h-14 text-emerald-500/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />;
    case 'warning': return <AlertCircle className="w-14 h-14 text-amber-500/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />;
    case 'critical': return <ShieldAlert className="w-14 h-14 text-primary/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />;
    default: return <Info className="w-14 h-14 text-blue-500/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />;
  }
};

export const NotificationsModule = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white h-full">
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-[5px] w-8 h-8">
            <Bell size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Notification Command Center</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Signal Priority & System Alert Repository</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="search-bar w-48">
             <Search size={11} className="text-slate-400" />
             <input placeholder="Search signals..." className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium" />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
            <Settings size={11} /> Config
          </button>
          <button className="btn-primary h-8 px-6 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20">
            Clear Matrix
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Active Signals</p>
          <p className="text-[14px] font-black text-slate-900 italic leading-none">{notifications.length}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Critical Priority</p>
          <p className="text-[14px] font-black text-primary italic leading-none">01</p>
        </div>
        <div className="ml-auto">
           <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2">
              <Zap size={10} className="text-amber-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none italic">Listener Status: Real-time</span>
           </div>
        </div>
      </div>

      {/* ── Signals Feed ── */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-slate-50/20">
         <div className="max-w-4xl mx-auto space-y-4">
            {notifications.map((n, i) => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white border border-slate-200 rounded-[5px] p-5 shadow-sm hover:border-primary/20 hover:shadow-md transition-all overflow-hidden flex items-start gap-4"
              >
                 <div className={cn(
                   "w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0 border",
                   n.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                   n.type === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" :
                   n.type === 'critical' ? "bg-red-50 text-primary border-red-100" :
                   "bg-blue-50 text-blue-600 border-blue-100"
                 )}>
                    {n.type === 'success' && <CheckCircle2 size={18} />}
                    {n.type === 'warning' && <AlertCircle size={18} />}
                    {n.type === 'critical' && <ShieldAlert size={18} />}
                    {n.type === 'info' && <Info size={18} />}
                 </div>

                 <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{n.title}</h3>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-[10.5px] font-medium text-slate-500 leading-relaxed max-w-2xl">{n.msg}</p>
                    <div className="mt-4 flex items-center gap-4">
                       <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                          Action Required <ArrowRight size={10} />
                       </button>
                       <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Discard</button>
                    </div>
                 </div>

                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={14} className="text-slate-300 cursor-pointer" />
                 </div>

                 {getIcon(n.type)}
              </motion.div>
            ))}

            <div className="pt-6 flex justify-center">
               <button className="h-8 px-8 border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-[5px] hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  View Signal Archive
               </button>
            </div>
         </div>
      </div>

      {/* ── Fixed Footer ── */}
      <div className="h-[38px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">
          Communication Ledger — Signal Latency: 42ms
        </p>
        <div className="flex items-center gap-2">
           <Clock size={12} className="text-slate-300" />
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Last Sync: Just now</span>
        </div>
      </div>
    </div>
  );
};
