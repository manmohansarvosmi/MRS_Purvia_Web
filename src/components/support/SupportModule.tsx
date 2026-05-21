import React from 'react';
import { 
  Users, 
  MessageCircle, 
  PhoneCall, 
  HelpCircle, 
  Search, 
  Filter, 
  MoreVertical,
  Plus,
  Send,
  Zap,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const tickets = [
  { id: 'TIC-992', subject: 'Login issue in mobile app', priority: 'High', status: 'Open', user: 'Anil K.', time: '1 hour ago' },
  { id: 'TIC-993', subject: 'GST calculation mismatch', priority: 'Critical', status: 'In Progress', user: 'Sunita M.', time: '3 hours ago' },
  { id: 'TIC-994', subject: 'New warehouse user setup', priority: 'Low', status: 'Resolved', user: 'System', time: '1 day ago' },
];

export const SupportModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <HelpCircle className="w-5 h-5 text-primary" />
             </div>
             Help & Technical Support
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Centralized Ticketing & Knowledge Base</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <PhoneCall className="w-4 h-4" /> Priority Callback
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Tickets</h3>
                     <span className="text-[10px] font-black px-3 py-1 bg-primary/5 text-primary rounded-full">3 PENDING</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                     {tickets.map(t => (
                        <div key={t.id} className="p-8 hover:bg-slate-50 transition-colors group cursor-pointer">
                           <div className="flex items-start justify-between">
                              <div className="flex items-center gap-5">
                                 <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                    t.priority === 'Critical' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                 )}>
                                    <MessageCircle className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.subject}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.id} • {t.user}</p>
                                       <span className={cn(
                                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                          t.status === 'Open' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                       )}>{t.status}</span>
                                    </div>
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{t.time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Quick Resources</h3>
                  <div className="space-y-4">
                     {[
                        { label: 'Platform Documentation', icon: Zap },
                        { label: 'Video Tutorials', icon: PlayIcon },
                        { label: 'Security Guidelines', icon: ShieldCheck },
                     ].map((res, i) => (
                        <button key={i} className="w-full p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-4 hover:border-primary/20 transition-all group">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                              <res.icon className="w-5 h-5" />
                           </div>
                           <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{res.label}</span>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Support Status</p>
                  <h4 className="text-2xl font-black italic tracking-tighter">Live Support Active</h4>
                  <p className="text-xs font-medium text-white/60 mt-2">Current wait time: ~5 mins</p>
                  <button className="mt-8 w-full py-4 bg-white text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Start Chat</button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
