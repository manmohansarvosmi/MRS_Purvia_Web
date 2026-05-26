import React from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  MoreVertical,
  Plus,
  Search,
  Filter,
  User,
  Tag
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const tasks = [
  { id: '1', title: 'Verify Inventory at Pune Hub', priority: 'High', due: 'Today', status: 'In Progress', owner: 'Rajesh K.' },
  { id: '2', title: 'Follow up with Reliance Green', priority: 'Medium', due: 'Tomorrow', status: 'Pending', owner: 'Priya S.' },
  { id: '3', title: 'Machine Maintenance Unit B', priority: 'Critical', due: '16 May', status: 'Scheduled', owner: 'System' },
];

export const TaskModule = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <CheckSquare className="w-5 h-5 text-primary" />
             </div>
             Task & Coordination
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Operation Workflow & Team Assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Calendar className="w-4 h-4" /> Calendar View
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="divide-y divide-slate-50">
               {tasks.map((t) => (
                  <div key={t.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-6 flex-1">
                        <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                           t.priority === 'Critical' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                           <Clock className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.title}</h4>
                           <div className="flex items-center gap-4 mt-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> {t.owner}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Due {t.due}</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-8">
                        <span className={cn(
                           "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                           t.status === 'In Progress' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-500 border-slate-100"
                        )}>{t.status}</span>
                        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-300"><MoreVertical className="w-5 h-5" /></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
};
