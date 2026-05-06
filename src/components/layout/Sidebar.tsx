import React from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Calendar, 
  Wallet, 
  History, 
  Bell,
  ChevronRight,
  Map as MapIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/src/components/Logo';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'employees', label: 'Employees', icon: Users, group: 'HR Management' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, group: 'HR Management' },
  { id: 'salary', label: 'Salary', icon: Wallet, group: 'HR Management' },
  { id: 'inventory', label: 'Inventory', icon: Package, group: 'Inventory' },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, group: 'Inventory' },
  { id: 'returns', label: 'Returns', icon: History, group: 'Inventory' },
  { id: 'routes', label: 'Live Routes', icon: MapIcon },
  { id: 'notifications', label: 'Alerts', icon: Bell },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-50">
        <Logo className="scale-90 origin-left" />
      </div>

      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
        {['General', 'HR Management', 'Inventory'].map((group) => (
          <div key={group} className="space-y-2">
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              {group}
            </h3>
            <div className="space-y-1">
              {navItems
                .filter((item) => (item.group || 'General') === group)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative",
                      activeTab === item.id
                        ? "bg-primary/5 text-primary font-semibold"
                        : "text-slate-500 hover:text-primary hover:bg-slate-50"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      activeTab === item.id ? "text-primary" : "text-slate-400 group-hover:text-primary"
                    )} />
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <motion.div 
                        layoutId="active-indicator" 
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" 
                      />
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xs font-semibold text-white shadow-lg shadow-primary/20">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Admin Terminal</p>
            <p className="text-[10px] text-primary font-medium uppercase tracking-tighter">Verified Access</p>
          </div>
          <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-primary" />
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('userToken');
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-primary hover:bg-white transition-all group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-primary" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
