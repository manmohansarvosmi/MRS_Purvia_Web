import React from 'react';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  Search,
  Filter,
  BarChart3,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
  { id: '1', name: 'Solar Farm Setup - Pune', client: 'Reliance Green', progress: 65, budget: '₹45L', deadline: 'Jun 15', status: 'Active' },
  { id: '2', name: 'Smart City Lighting', client: 'BMC Mumbai', progress: 92, budget: '₹1.2Cr', deadline: 'May 30', status: 'Critical' },
  { id: '3', name: 'Warehouse Automation', client: 'Self-Project', progress: 30, budget: '₹12L', deadline: 'Aug 10', status: 'Active' },
];

export const ProjectModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Briefcase className="w-5 h-5 text-primary" />
             </div>
             Project Management
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Advanced Delivery & Milestone Tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <BarChart3 className="w-4 h-4" /> Reports
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
               <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:border-primary/20 transition-all group">
                  <div className="p-8 space-y-6">
                     <div className="flex items-start justify-between">
                        <div className="space-y-1">
                           <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{p.client}</span>
                           <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{p.name}</h3>
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300"><MoreVertical className="w-5 h-5" /></button>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Budget</p>
                           <p className="text-sm font-black text-slate-900">{p.budget}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Deadline</p>
                           <p className="text-sm font-black text-slate-900">{p.deadline}</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-400">Project Progress</span>
                           <span className="text-slate-900">{p.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${p.progress}%` }} />
                        </div>
                     </div>
                  </div>

                  <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black">U{i}</div>
                        ))}
                     </div>
                     <span className={cn(
                        "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                        p.status === 'Critical' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                     )}>{p.status}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};
