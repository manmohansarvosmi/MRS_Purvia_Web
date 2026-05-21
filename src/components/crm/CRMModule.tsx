import React from 'react';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Phone, 
  Mail, 
  MoreVertical,
  Star,
  Search,
  Filter,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const customers = [
  { id: '1', name: 'Rajesh Kumar', company: 'Kumar Electronics', level: 'VIP', lastContact: '2 hours ago', value: '₹4.5L', status: 'Hot Lead' },
  { id: '2', name: 'Priya Sharma', company: 'Global Solutions', level: 'Regular', lastContact: '1 day ago', value: '₹1.2L', status: 'Active' },
  { id: '3', name: 'Amit Singh', company: 'Singh & Sons', level: 'VIP', lastContact: '3 days ago', value: '₹8.9L', status: 'Negotiation' },
  { id: '4', name: 'Suresh Raina', company: 'Raina Trading', level: 'New', lastContact: 'Just now', value: '₹0', status: 'Prospect' },
];

const PipelineView = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full min-h-[500px]">
    {['Lead Generation', 'Negotiation', 'Closing'].map((stage, i) => (
      <div key={i} className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stage}</h4>
           <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">2</span>
        </div>
        <div className="flex-1 bg-slate-50/50 rounded-[2.5rem] p-4 border border-dashed border-slate-200 space-y-4">
           {[1, 2].map(card => (
             <div key={card} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-move group">
                <div className="flex justify-between items-start mb-3">
                   <span className="text-[8px] font-black px-2 py-0.5 bg-primary/5 text-primary rounded uppercase">High Priority</span>
                   <MoreVertical className="w-4 h-4 text-slate-300" />
                </div>
                <h5 className="text-xs font-black text-slate-900 uppercase">Project Alpha Setup</h5>
                <p className="text-[10px] font-bold text-slate-400 mt-1">₹4.5L • 12 May</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                   <div className="w-6 h-6 rounded-full bg-slate-100" />
                   <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
             </div>
           ))}
        </div>
      </div>
    ))}
  </div>
);

const FollowUpView = () => (
  <div className="space-y-4">
    {[
      { task: 'Call Rajesh regarding solar panels', due: 'In 2 hours', type: 'Call' },
      { task: 'Email proposal to Global Solutions', due: 'Tomorrow', type: 'Email' },
      { task: 'In-person meeting with Singh & Sons', due: '16 May', type: 'Meeting' },
    ].map((t, i) => (
      <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-between hover:border-primary/20 transition-all group">
         <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
               {t.type === 'Call' ? <Phone className="w-5 h-5" /> : t.type === 'Email' ? <Mail className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.task}</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Due: {t.due}</p>
            </div>
         </div>
         <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Mark Complete</button>
      </div>
    ))}
  </div>
);

import { AddCustomerForm } from './AddCustomerForm';

export const CRMModule = () => {
  const [activeView, setActiveView] = React.useState('database');
  const [isAdding, setIsAdding] = React.useState(false);

  const renderViewContent = () => {
    if (isAdding) return <AddCustomerForm onCancel={() => setIsAdding(false)} />;

    switch (activeView) {
      case 'database':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                   <Search className="w-4.5 h-4.5 text-slate-300" />
                   <input type="text" placeholder="Search by name, company, or phone..." className="flex-1 bg-transparent border-none outline-none text-sm font-semibold" />
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mr-2">
                      <UserPlus className="w-4 h-4" /> Add Customer
                   </button>
                   <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400">
                      <Filter className="w-5 h-5" />
                   </button>
                </div>
             </div>

             <div className="divide-y divide-slate-50">
                {customers.map((c) => (
                   <div key={c.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">
                            {c.name[0]}
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{c.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.company}</p>
                         </div>
                      </div>

                      <div className="hidden lg:flex items-center gap-12">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                            <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                               c.status === 'Hot Lead' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            )}>{c.status}</span>
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Deal Value</p>
                            <p className="text-xs font-black text-slate-900">{c.value}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-primary/5 hover:text-primary rounded-xl text-slate-300 transition-colors"><Phone className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-primary/5 hover:text-primary rounded-xl text-slate-300 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                         </div>
                      </div>

                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-300">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'pipeline':
        return <PipelineView />;
      case 'tasks':
        return <FollowUpView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* CRM Sub-nav */}
      <div className="px-8 bg-white border-b border-slate-100 flex items-center gap-10 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'database', label: 'Customer Database', icon: Users },
          { id: 'pipeline', label: 'Sales Pipeline', icon: Target },
          { id: 'tasks', label: 'Follow-ups', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] py-5 transition-all relative group",
              activeView === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon className={cn("w-4 h-4 transition-colors", activeView === tab.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500")} />
            {tab.label}
            {activeView === tab.id && (
              <motion.div layoutId="active-crm-tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(178,0,26,0.3)]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
               { label: 'Active Clients', value: '450', color: 'slate', icon: Users },
               { label: 'Won Deals', value: '₹1.2Cr', color: 'emerald', icon: ArrowUpRight },
               { label: 'Conversion', value: '24%', color: 'indigo', icon: Target },
               { label: 'Lost Deals', value: '₹8.4L', color: 'rose', icon: MessageSquare }
            ].map((kpi, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all cursor-pointer">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{kpi.value}</h3>
               </div>
            ))}
         </div>

         {renderViewContent()}
      </div>

    </div>
  );
};
