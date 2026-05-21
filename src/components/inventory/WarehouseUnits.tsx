import React from 'react';
import { 
  Warehouse, 
  Box, 
  MapPin, 
  Thermometer, 
  Droplets, 
  ArrowUpRight, 
  Activity,
  MoreVertical,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* Header */}
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Warehouse className="w-5 h-5 text-primary" />
             </div>
             Warehouse Master
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-[52px]">Multi-location Storage & Environmental Control</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Search className="w-4 h-4" /> Global Search
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             <Plus className="w-4 h-4" /> Add New Unit
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:border-primary/20 transition-all">
               {/* WH Header */}
               <div className="p-6 border-b border-slate-50 flex items-start justify-between">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{wh.type}</span>
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{wh.name}</h3>
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{wh.location}</span>
                     </div>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               {/* Capacity & Environment */}
               <div className="p-6 space-y-6">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Occupancy Level</span>
                        <span className={cn(
                          wh.capacity > 80 ? "text-rose-500" : "text-emerald-500"
                        )}>{wh.capacity}% Full</span>
                     </div>
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            wh.capacity > 80 ? "bg-rose-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${wh.capacity}%` }} 
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase">Temp</p>
                           <p className="text-xs font-black text-slate-900">{wh.temp}</p>
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase">Humidity</p>
                           <p className="text-xs font-black text-slate-900">{wh.humidity}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className={cn(
                        "w-2 h-2 rounded-full",
                        wh.status === 'Operational' ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                     )} />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{wh.status}</span>
                  </div>
                  <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1 group">
                     Explore Stocks <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
