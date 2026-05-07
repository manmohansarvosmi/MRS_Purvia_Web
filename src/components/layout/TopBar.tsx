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
        <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 gap-3 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Global Matrix Search..."
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-600 placeholder:text-slate-300 w-64"
          />
        </div>



        <div className="w-px h-8 bg-slate-100 mx-2" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-slate-50" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-px h-8 bg-slate-100 mx-1" />

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-[#A30D11] transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
