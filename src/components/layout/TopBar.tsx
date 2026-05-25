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
    <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden -ml-2 text-slate-500 hover:text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">{title}</h2>
            <div className="w-1 h-1 rounded-full bg-primary" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
               {formattedDate} • {formattedDay}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 gap-2 group transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 placeholder:text-slate-300 w-48 uppercase tracking-tight h-6"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all relative border border-slate-100 shadow-sm">
            <Bell className="w-3.5 h-3.5" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-white" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all border border-slate-100 shadow-sm">
            <Settings className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-6 bg-slate-100 mx-1" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLogout}
            className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-white transition-all border border-slate-100 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-white shadow-sm overflow-hidden flex-shrink-0 relative cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
            alt="Profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};
