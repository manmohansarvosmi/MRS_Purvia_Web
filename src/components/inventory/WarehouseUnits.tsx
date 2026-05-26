import React from 'react';
import { 
  Warehouse, 
  MapPin, 
  Thermometer, 
  Droplets, 
  ArrowUpRight, 
  MoreVertical,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const warehouses = [
  { 
    id: '1', 
    name: 'Main Central Hub', 
    location: 'Bhiwandi, Maharashtra', 
    capacity: 85, 
    temp: '24°C', 
    humidity: '45%', 
    status: 'Operational',
    type: 'Finished Goods'
  },
  { 
    id: '2', 
    name: 'North Delhi Depot', 
    location: 'Okhla Phase III', 
    capacity: 42, 
    temp: '22°C', 
    humidity: '40%', 
    status: 'Operational',
    type: 'Raw Materials'
  },
  { 
    id: '3', 
    name: 'Bangalore Tech Park', 
    location: 'Electronic City', 
    capacity: 92, 
    temp: '20°C', 
    humidity: '50%', 
    status: 'Full Capacity',
    type: 'High Value'
  },
];

export const WarehouseUnits = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-100/40 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 uppercase tracking-tight">Warehouse Units</h2>
            <p className="text-[10px] font-normal text-slate-400 mt-0.5 uppercase tracking-widest">Multi-location storage management</p>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-primary text-white text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Unit
        </button>
      </div>

      {/* Content with Margin */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
               <div className="p-6 border-b border-slate-50 flex items-start justify-between bg-slate-50/30">
                  <div>
                     <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{wh.type}</span>
                     <h3 className="text-base font-bold text-slate-800 uppercase mt-1 tracking-tight">{wh.name}</h3>
                     <div className="flex items-center gap-2 text-slate-400 mt-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium uppercase tracking-tight">{wh.location}</span>
                     </div>
                  </div>
                  <button className="p-2 hover:bg-white rounded-xl text-slate-300 transition-all">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               <div className="p-6 space-y-8 flex-1">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Inventory Load</span>
                        <span className={wh.capacity > 80 ? "text-rose-500" : "text-emerald-500"}>{wh.capacity}% Full</span>
                     </div>
                     <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", wh.capacity > 80 ? "bg-rose-500" : "bg-emerald-500")} 
                          style={{ width: `${wh.capacity}%` }} 
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-200 flex items-center gap-4 group-hover:bg-white transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                           <Thermometer className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Temp</p>
                           <p className="text-sm font-bold text-slate-700">{wh.temp}</p>
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-200 flex items-center gap-4 group-hover:bg-white transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                           <Droplets className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Humidity</p>
                           <p className="text-sm font-bold text-slate-700">{wh.humidity}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                     <div className={cn("w-2 h-2 rounded-full", wh.status === 'Operational' ? "bg-emerald-400 animate-pulse" : "bg-rose-400")} />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{wh.status}</span>
                  </div>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-1.5 group/btn">
                     Manage Stocks <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
