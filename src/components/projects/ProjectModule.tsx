import React, { useState } from 'react';
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
  Layers,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Target,
  Activity,
  DollarSign,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  budget: number;
  cost: number;
  deadline: string;
  status: 'Active' | 'Critical' | 'Completed' | 'Planning';
  tasks: Task[];
  milestones: Milestone[];
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Done' | 'In Progress' | 'Pending';
  dueDate: string;
}

interface Milestone {
  id: string;
  title: string;
  status: 'Completed' | 'Current' | 'Upcoming';
}

const mockProjects: Project[] = [
  { 
    id: '1', 
    name: 'Solar Farm Setup - Pune', 
    client: 'Reliance Green', 
    progress: 65, 
    budget: 4500000, 
    cost: 3200000, 
    deadline: '2026-06-15', 
    status: 'Active',
    tasks: [
      { id: '101', title: 'Site Survey & Mapping', assignee: 'Sunil Kumar', priority: 'High', status: 'Done', dueDate: 'May 10' },
      { id: '102', title: 'Foundation Civil Work', assignee: 'Rajesh P.', priority: 'Medium', status: 'In Progress', dueDate: 'May 25' },
      { id: '103', title: 'Solar Panel Installation', assignee: 'Vikram S.', priority: 'High', status: 'Pending', dueDate: 'Jun 05' },
    ],
    milestones: [
      { id: 'm1', title: 'Design Finalization', status: 'Completed' },
      { id: 'm2', title: 'Civil Works', status: 'Current' },
      { id: 'm3', title: 'Panel Mounting', status: 'Upcoming' },
      { id: 'm4', title: 'Grid Connection', status: 'Upcoming' },
    ]
  },
  { 
    id: '2', 
    name: 'Smart City Lighting', 
    client: 'BMC Mumbai', 
    progress: 92, 
    budget: 12000000, 
    cost: 8500000, 
    deadline: '2026-05-30', 
    status: 'Critical',
    tasks: [],
    milestones: []
  },
];

const thCls = "px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100 text-left";
const tdCls = "px-6 py-4 text-[11px] font-bold text-slate-700 border-b border-slate-50";

export const ProjectModule = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'financials'>('tasks');

  const profit = selectedProject ? selectedProject.budget - selectedProject.cost : 0;
  const margin = selectedProject ? (profit / selectedProject.budget) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col bg-[#F9FBFC] overflow-hidden">
      
      {/* ── Top Header ── */}
      <div className="bg-white border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Briefcase className="w-5 h-5 text-primary" />
             </div>
             MSME Project Hub
          </h2>
          <nav className="flex items-center gap-6 mt-4 ml-[52px]">
            {['Tasks & Milestones', 'Project Financials'].map((t) => (
              <button 
                key={t}
                onClick={() => setActiveTab(t.split(' ')[0].toLowerCase() as any)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1",
                  activeTab === t.split(' ')[0].toLowerCase() ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <BarChart3 className="w-4 h-4" /> Global Reporting
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> Create New MSME Project
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── Sidebar: Project List ── */}
        <div className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input type="text" placeholder="Search projects..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-primary/30" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {mockProjects.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all group",
                  selectedProject?.id === p.id 
                    ? "bg-primary border-primary shadow-lg shadow-primary/20" 
                    : "bg-white border-slate-100 hover:border-primary/20"
                )}
              >
                <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] mb-1", selectedProject?.id === p.id ? "text-white/60" : "text-primary")}>{p.client}</p>
                <h4 className={cn("text-[11px] font-black uppercase tracking-tight line-clamp-1", selectedProject?.id === p.id ? "text-white" : "text-slate-800")}>{p.name}</h4>
                <div className="flex items-center justify-between mt-3 font-black text-[9px] uppercase tracking-widest leading-none">
                  <span className={selectedProject?.id === p.id ? "text-white/80" : "text-slate-400"}>Due: {p.deadline}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px]",
                    selectedProject?.id === p.id ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"
                  )}>{p.progress}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content Area ── */}
        {selectedProject && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Project Banner Info */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
               <div className="xl:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">{selectedProject.status}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedProject.client}</span>
                     </div>
                     <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedProject.name}</h1>
                     <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-slate-500">
                           <Calendar className="w-4 h-4 text-primary" />
                           <span className="text-[10px] font-black uppercase tracking-widest">{selectedProject.deadline} Deadline</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                           <Users className="w-4 h-4 text-primary" />
                           <span className="text-[10px] font-black uppercase tracking-widest">8 Team Members</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                     <div className="w-24 h-24 rounded-full border-[8px] border-slate-50 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-[8px] border-primary border-t-transparent -rotate-45" />
                        <span className="text-xl font-black text-slate-900">{selectedProject.progress}%</span>
                     </div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall Progress</p>
                  </div>
               </div>
            </div>

            {/* Tabbed Content */}
            {activeTab === 'tasks' && (
              <div className="space-y-8">
                {/* Milestone Roadmap Integrated */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex items-center justify-between gap-12 overflow-x-auto no-scrollbar">
                   <div className="shrink-0">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 italic">Project Roadmap</h4>
                   </div>
                   <div className="flex-1 flex items-center justify-center gap-6">
                      {selectedProject.milestones.map((m, idx) => (
                        <div key={m.id} className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                               <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all shadow-lg",
                                  m.status === 'Completed' ? "bg-emerald-500 border-emerald-100 text-white" :
                                  m.status === 'Current' ? "bg-primary border-primary/20 text-white scale-110 shadow-primary/20" : "bg-white border-slate-50 text-slate-300"
                               )}>
                                  {m.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[12px] font-black">{idx+1}</span>}
                                </div>
                               <span className={cn("text-[9px] font-black uppercase tracking-widest mt-3 whitespace-nowrap", m.status === 'Upcoming' ? "text-slate-300" : "text-slate-900")}>{m.title}</span>
                            </div>
                            {idx < selectedProject.milestones.length - 1 && (
                               <ArrowRight className="w-4 h-4 text-slate-100" />
                            )}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Full Task Matrix</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                            <Plus className="w-3.5 h-3.5" /> Add Task
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={thCls}>Task Description</th>
                                    <th className={thCls}>Owner</th>
                                    <th className={thCls}>Priority</th>
                                    <th className={thCls}>Status</th>
                                    <th className={thCls}>Due Date</th>
                                    <th className={thCls}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {selectedProject.tasks.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className={tdCls}>{t.title}</td>
                                        <td className={tdCls}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black uppercase">{t.assignee.charAt(0)}</div>
                                                {t.assignee}
                                            </div>
                                        </td>
                                        <td className={tdCls}>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                                t.priority === 'High' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
                                            )}>{t.priority}</span>
                                        </td>
                                        <td className={tdCls}>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 w-fit",
                                                t.status === 'Done' ? "text-emerald-600" : "text-amber-600"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", t.status === 'Done' ? "bg-emerald-500" : "bg-amber-500")} />
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className={tdCls}>{t.dueDate}</td>
                                        <td className={tdCls}>
                                            <button className="text-slate-300 hover:text-primary"><MoreVertical className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-2 bg-emerald-50 text-emerald-600 rounded-bl-xl text-[8px] font-black">BUDGET</div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Value</p>
                      <h4 className="text-xl font-black text-slate-900 italic">₹{selectedProject.budget.toLocaleString()}</h4>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-2 bg-rose-50 text-rose-600 rounded-bl-xl text-[8px] font-black">COST</div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Costing</p>
                      <h4 className="text-xl font-black text-slate-900 italic">₹{selectedProject.cost.toLocaleString()}</h4>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-2 bg-indigo-50 text-indigo-600 rounded-bl-xl text-[8px] font-black">GROSS PROFIT</div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Savings</p>
                      <h4 className="text-xl font-black text-slate-700 italic">₹{profit.toLocaleString()}</h4>
                   </div>
                   <div className="bg-primary p-6 rounded-3xl border border-primary/10 shadow-xl shadow-primary/20 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-2 bg-white/20 text-white rounded-bl-xl text-[8px] font-black">MARGIN</div>
                      <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Net Margin</p>
                      <h4 className="text-xl font-black text-white italic">{margin.toFixed(1)}%</h4>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                         <DollarSign className="w-4 h-4 text-primary" /> Cost Distribution
                      </h3>
                      <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Link Purchase Invoices</button>
                   </div>
                   <div className="h-64 flex items-center gap-4">
                      <div className="flex-1 h-full flex flex-col justify-end gap-2">
                        <div className="w-full bg-slate-100 rounded-xl relative group">
                          <div className="absolute bottom-0 left-0 right-0 bg-primary/20 h-[60%] rounded-xl border border-primary/20" />
                          <div className="h-40 w-full" />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase text-center mt-2">Materials</p>
                      </div>
                      <div className="flex-1 h-full flex flex-col justify-end gap-2">
                        <div className="w-full bg-slate-100 rounded-xl relative group">
                          <div className="absolute bottom-0 left-0 right-0 bg-primary/20 h-[30%] rounded-xl border border-primary/20" />
                          <div className="h-40 w-full" />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase text-center mt-2">Labor</p>
                      </div>
                      <div className="flex-1 h-full flex flex-col justify-end gap-2">
                        <div className="w-full bg-slate-100 rounded-xl relative group">
                          <div className="absolute bottom-0 left-0 right-0 bg-primary/20 h-[10%] rounded-xl border border-primary/20" />
                          <div className="h-40 w-full" />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase text-center mt-2">Logistics</p>
                      </div>
                      <div className="flex-1 h-full flex flex-col justify-end gap-2">
                        <div className="w-full bg-slate-100 rounded-xl relative group">
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/20 h-[40%] rounded-xl border border-emerald-500/20" />
                          <div className="h-40 w-full" />
                        </div>
                        <p className="text-[8px] font-black text-emerald-600 uppercase text-center mt-2">Profit</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
