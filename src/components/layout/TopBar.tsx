import React from 'react';
import { motion } from 'motion/react';
import { FileText, PlusCircle, Bell, Settings, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
}

export const TopBar = ({ title }: TopBarProps) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  const formattedDay = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          {formattedDate} • {formattedDay} • NOIDA HQ
        </p>
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

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 px-6 rounded-full border-slate-200 bg-white shadow-sm font-semibold uppercase text-[10px] tracking-widest italic hover:text-primary transition-all text-slate-500">
            Download Report
          </Button>
          <Button className="h-10 px-6 rounded-full bg-[#A30D11] hover:bg-[#8B0B0E] text-white shadow-lg shadow-red-900/10 font-black uppercase text-[10px] tracking-widest italic transition-all active:scale-95">
            Generate Invoices
          </Button>
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
      </div>
    </div>
  );
};
