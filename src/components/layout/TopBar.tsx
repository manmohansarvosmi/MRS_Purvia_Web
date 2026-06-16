import React from 'react';
import { Bell, Settings, Search, Menu, LogOut } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const TopBar = ({ title, onMenuClick, onLogout }: TopBarProps) => {
  const date = new Date();
  
  return (
    <div
      className="h-[42px] flex items-center justify-between px-3 shrink-0 sticky top-0 z-40 bg-white"
      style={{ borderBottom: '1px solid #F1F5F9' }}
    >
      {/* Left Area */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-1 text-slate-400"><Menu size={14} /></button>
        )}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: '10px', color: '#0F172A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
            {title === 'Route Map' ? 'ROUTES' : title}
          </span>
          <span className="text-slate-300 font-bold">•</span>
          <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()} • {date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-2">
        <div className="search-bar" style={{ width: '180px', height: '26px' }}>
          <Search size={11} />
          <input placeholder="Global Search..." style={{ fontSize: '10px' }} />
        </div>

        <div className="flex gap-1">
          {[Bell, Settings].map((Icon, i) => (
            <button key={i} className="w-7 h-7 flex items-center justify-center border border-slate-200 text-slate-400 hover:text-red-600 rounded-[2px] transition-all">
              <Icon size={12} />
            </button>
          ))}
        </div>

        <div className="w-[1px] h-3 bg-slate-200 mx-1" />

        <button onClick={onLogout} className="flex items-center gap-2 pl-1 pr-2 py-0.5 bg-slate-50 border border-slate-200 hover:border-red-200 rounded-[2px] group">
          <LogOut size={11} className="text-slate-400 group-hover:text-red-600" />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#1E293B' }} className="group-hover:text-red-600 transition-colors uppercase tracking-widest">Exit</span>
        </button>

        <div className="w-6 h-6 rounded-full bg-amber-300 border border-amber-400 flex items-center justify-center text-[10px] font-black text-amber-800 shadow-sm ml-1">
          A
        </div>
      </div>
    </div>
  );
};
