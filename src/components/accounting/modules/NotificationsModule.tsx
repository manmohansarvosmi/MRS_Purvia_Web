import React from 'react';
import { 
  Bell, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowRight,
  Search,
  Filter,
  Trash2,
  Inbox,
  Clock,
  Zap,
  Tag,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const notifications = [
  { id: '1', type: 'alert', title: 'Invoice Overdue', desc: 'Global Tech Solutions invoice INV-2026-9281 is 3 days past due.', time: '12m ago', read: false },
  { id: '2', type: 'success', title: 'Payment Received', desc: '₹4,25,000 received from Amazon Web Services.', time: '1h ago', read: false },
  { id: '3', type: 'info', title: 'New Sales Goal', desc: 'Team has achieved 85% of May revenue target.', time: '4h ago', read: true },
  { id: '4', type: 'alert', title: 'Low Stock Alert', desc: 'Solar Panel 450W Mono is below reorder level (5 PCS left).', time: 'Yesterday', read: true },
];

export const NotificationsModule = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-xl relative">
              <Bell className="w-7 h-7 text-primary fill-primary" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary border-4 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white">2</div>
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Intelligence Feed</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Actionable alerts & system telemetry</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             Mark all as Read
           </button>
           <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
             <SettingsIcon className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* ── Action Bar ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm flex items-center gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input type="text" placeholder="Search alerts..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary transition-all" />
         </div>
         <div className="flex items-center gap-2">
            <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all self-stretch">
               <Filter className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* ── Categories ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
         {[
           { label: 'All Activity', icon: Inbox, count: 12, active: true },
           { label: 'Critical Alerts', icon: AlertCircle, count: 2, active: false },
           { label: 'Financials', icon: Zap, count: 5, active: false },
           { label: 'System Logs', icon: Clock, count: 5, active: false },
         ].map((cat, i) => (
            <button key={i} className={cn(
               "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
               cat.active ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20" : "bg-white text-slate-400 border-slate-50 hover:border-slate-200"
            )}>
               <cat.icon className="w-4 h-4" />
               {cat.label}
               <span className={cn("ml-2 px-2 py-0.5 rounded-full text-[8px]", cat.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400")}>{cat.count}</span>
            </button>
         ))}
      </div>

      {/* ── Notification List ────────────────────────────────────────── */}
      <div className="space-y-4">
         {notifications.map((notif) => (
            <motion.div 
               key={notif.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className={cn(
                  "bg-white p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden",
                  notif.read ? "border-slate-50 opacity-70" : "border-slate-100 shadow-xl border-l-8 border-l-primary"
               )}
            >
               <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-start gap-6">
                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", 
                       notif.type === 'alert' ? "bg-rose-50 text-rose-600" : 
                       notif.type === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                     )}>
                        {notif.type === 'alert' ? <AlertCircle className="w-7 h-7" /> : 
                         notif.type === 'success' ? <CheckCircle2 className="w-7 h-7" /> : <Info className="w-7 h-7" />}
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{notif.title}</h4>
                           {!notif.read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">{notif.desc}</p>
                        <div className="flex items-center gap-4 mt-4">
                           <span className="text-[8px] font-black text-slate-300 uppercase flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {notif.time}
                           </span>
                           <span className="text-[8px] font-black text-slate-300 uppercase flex items-center gap-1">
                              <Tag className="w-3 h-3" /> CATEGORY: FINANCIAL
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                     </button>
                     <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               {/* Subtle background element */}
               <div className="absolute top-0 right-0 w-32 h-32 text-slate-50/50 -mr-8 -mt-8 pointer-events-none group-hover:text-primary/5 transition-colors">
                  <MessageSquare className="w-full h-full" />
               </div>
            </motion.div>
         ))}
      </div>
      
      <div className="flex justify-center">
         <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-600 transition-all italic underline underline-offset-8">Load previous alerts</button>
      </div>
    </div>
  );
};
