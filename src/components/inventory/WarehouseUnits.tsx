import React from 'react';
import { 
  Warehouse, MapPin, Thermometer, Droplets, ArrowUpRight, MoreVertical, Plus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const warehouses = [
  { 
    id: '1', name: 'Main Central Hub', location: 'Bhiwandi, Maharashtra', 
    capacity: 85, temp: '24°C', humidity: '45%', status: 'Operational', type: 'Finished Goods'
  },
  { 
    id: '2', name: 'North Delhi Depot', location: 'Okhla Phase III', 
    capacity: 42, temp: '22°C', humidity: '40%', status: 'Operational', type: 'Raw Materials'
  },
  { 
    id: '3', name: 'Bangalore Tech Park', location: 'Electronic City', 
    capacity: 92, temp: '20°C', humidity: '50%', status: 'Full Capacity', type: 'High Value'
  },
];

export const WarehouseUnits = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: '#fff' }}>
      
      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div>
          <h2>Warehouse Logistics</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Multi-location Inventory Distribution</p>
        </div>
        <button className="btn-primary">
          <Plus size={13} /> New Warehouse
        </button>
      </div>

      {/* ── Content Grid ── */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((wh) => (
            <div 
              key={wh.id} 
              className="group overflow-hidden border border-slate-200" 
              style={{ borderRadius: 6, background: '#fff' }}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between" style={{ background: '#F9FAFB' }}>
                <div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {wh.type}
                  </span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginTop: 4 }}>{wh.name}</p>
                </div>
                <button className="btn-ghost !p-1"><MoreVertical size={14} /></button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="erp-label !mb-0">Operating Capacity</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: wh.capacity > 80 ? '#DC2626' : '#059669' }}>
                      {wh.capacity}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${wh.capacity}%`, 
                        background: wh.capacity > 80 ? '#DC2626' : '#059669',
                        transition: 'width 0.8s ease'
                      }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-slate-100" style={{ borderRadius: 4, background: '#F9FAFB' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer size={12} color="#9CA3AF" />
                      <p className="erp-label !mb-0">Temp</p>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{wh.temp}</p>
                  </div>
                  <div className="p-3 border border-slate-100" style={{ borderRadius: 4, background: '#F9FAFB' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets size={12} color="#9CA3AF" />
                      <p className="erp-label !mb-0">Humidity</p>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{wh.humidity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-slate-400" />
                  <p style={{ fontSize: 11, color: '#6B7280' }}>Bhiwandi, Maharashtra</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className={cn("badge", wh.status === 'Operational' ? 'badge-success' : 'badge-warning')}>
                   {wh.status}
                </span>
                <button 
                  style={{ fontSize: 10, fontWeight: 700, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  className="flex items-center gap-1 hover:underline decoration-red-200"
                >
                  Manage Stocks <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
