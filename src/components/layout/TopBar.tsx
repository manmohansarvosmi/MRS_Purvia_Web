import React from 'react';
import { Bell, Settings, Search, Menu, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const TopBar = ({ title, onMenuClick, onLogout }: TopBarProps) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  const formattedDay = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden -ml-2 text-slate-500 hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </Button>
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {formattedDate} • {formattedDay} • GWALIOR HQ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Multi-Company / Branch Selectors */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex flex-col items-end">
            <select className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
              <option>Helixion Innovations LLP</option>
              <option>Purvia Enterprises</option>
            </select>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 rounded-md border border-primary/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-tight">MAIN BRANCH (GWL)</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center bg-slate-50/50 px-4 py-2 rounded-lg border border-slate-100 gap-3 group focus-within:ring-2 focus-within:ring-primary/5 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search anything (Alt + K)..."
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-600 placeholder:text-slate-300 w-64 uppercase tracking-tight"
          />
        </div>

        <div className="w-px h-8 bg-slate-100 mx-2" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all relative border border-slate-100/50 shadow-sm">
            <Bell className="w-4 h-4" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-white" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all border border-slate-100/50 shadow-sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-slate-100 mx-1" />

        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all border border-slate-100/50 shadow-sm group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-white shadow-sm overflow-hidden flex-shrink-0 relative group cursor-pointer hover:ring-2 hover:ring-primary/10 transition-all">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
              alt="Profile"
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

