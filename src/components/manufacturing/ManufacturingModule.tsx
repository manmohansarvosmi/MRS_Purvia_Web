import React from 'react';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Activity,
  AlertTriangle,
  Layers,
  Box,
  MoreVertical,
  Plus,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const machines = [
  { id: '1', name: 'Unit A: Assembly Line', status: 'Running', load: 85, health: 'Good', output: '450/hr' },
  { id: '2', name: 'Unit B: PCB SMT Line', status: 'Maintenance', load: 0, health: 'Critical', output: '0/hr' },
  { id: '3', name: 'Unit C: Quality Control', status: 'Running', load: 62, health: 'Good', output: '120/hr' },
];

export const ManufacturingModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Settings className="w-5 h-5 text-primary" />
             </div>
             Production & Manufacturing
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Shop Floor Automation & Machine Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Activity className="w-4 h-4" /> Live Monitoring
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> New Job Order
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Machine Status */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Production Lines</h3>
                  <button className="text-[10px] font-black text-primary uppercase">View Logs</button>
               </div>
               <div className="divide-y divide-slate-50">
                  {machines.map((m) => (
                     <div key={m.id} className="p-8 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                 "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                 m.status === 'Running' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                              )}>
                                 <Zap className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{m.name}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", m.status === 'Running' ? "bg-emerald-500" : "bg-rose-500")} />
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.status}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-slate-900 tracking-tighter italic">{m.output}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Real-time Yield</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                              <span>Load Factor</span>
                              <span>{m.load}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${m.load}%` }} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Production Queue */}
            <div className="space-y-8">
               <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary opacity-20 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Production Summary</p>
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h4 className="text-3xl font-black italic tracking-tighter text-white">1,248</h4>
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-1">Units Completed Today</p>
                     </div>
                     <div>
                        <h4 className="text-3xl font-black italic tracking-tighter text-primary">₹12.4L</h4>
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-1">Work-in-Progress Value</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Pending Job Orders</h3>
                  <div className="space-y-4">
                     {[
                        { id: 'JO-442', item: 'Solar Inverter Case', qty: 100, due: '24 May' },
                        { id: 'JO-443', item: 'Battery Terminal Kit', qty: 500, due: '26 May' },
                     ].map(jo => (
                        <div key={jo.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-primary/20 transition-all cursor-pointer group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 group-hover:text-primary">
                                 {jo.id.split('-')[1]}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-900 uppercase">{jo.item}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{jo.qty} Units • Due {jo.due}</p>
                              </div>
                           </div>
                           <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
