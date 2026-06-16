import React, { useState, useEffect } from 'react';
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
  Target,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { salesApi, inventoryApi } from '@/src/lib/api';
import { AddCustomerForm } from './AddCustomerForm';

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

export const CRMModule = () => {
  const [activeView, setActiveView] = useState('database');
  const [isAdding, setIsAdding] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [custRes, salesRes, estRes] = await Promise.all([
        salesApi.getAllCustomers(),
        inventoryApi.getAllSales(),
        salesApi.getAllEstimates()
      ]);
      
      if (custRes.status === 1) setCustomers(custRes.data);
      if (salesRes.status === 1) setSales(salesRes.data || []);
      if (estRes.status === 1) setEstimates(estRes.data || []);

    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerMetrics = (customerName: string) => {
    const custSales = sales.filter(s => s.customerName === customerName);
    const custEsts = estimates.filter(e => e.customerName === customerName);
    return {
      invoices: custSales.length,
      estimates: custEsts.length,
      totalValue: custSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0)
    };
  };

  const renderViewContent = () => {
    if (isAdding) return <AddCustomerForm onCancel={() => { setIsAdding(false); fetchData(); }} />;

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
                {loading ? (
                   <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                      Synchronizing client database...
                   </div>
                ) : customers.length === 0 ? (
                   <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                      No active customer profiles found
                   </div>
                ) : customers.map((c) => {
                   const metrics = getCustomerMetrics(c.name);
                   return (
                    <div key={c.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">
                              {c.name?.[0] || 'U'}
                          </div>
                          <div>
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{c.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.phone}</p>
                          </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-12">
                          <div className="text-center">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Invoices</p>
                              <span className="px-2 py-0.5 rounded-[5px] bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100">
                                {metrics.invoices}
                              </span>
                          </div>
                          <div className="text-center">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Estimates</p>
                              <span className="px-2 py-0.5 rounded-[5px] bg-blue-50 text-blue-600 text-[10px] font-black border border-blue-100">
                                {metrics.estimates}
                              </span>
                          </div>
                          <div className="text-right min-w-[100px]">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Billing</p>
                              <p className="text-xs font-black text-slate-900 font-mono">₹{metrics.totalValue.toLocaleString()}</p>
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
                   )
                })}
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
               { label: 'Active Clients', value: customers.length.toString(), color: 'slate', icon: Users },
               { label: 'Total Revenue', value: `₹${(sales.reduce((acc,s)=>acc+(s.totalAmount||0),0)/100000).toFixed(1)}L`, color: 'emerald', icon: ArrowUpRight },
               { label: 'Invoices Issued', value: sales.length.toString(), color: 'indigo', icon: Receipt },
               { label: 'Total Estimates', value: estimates.length.toString(), color: 'rose', icon: MessageSquare }
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
