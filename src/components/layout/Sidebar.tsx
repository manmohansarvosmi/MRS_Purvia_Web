import React, { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  Map as MapIcon,
  Sparkles,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Operations' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Operations' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, group: 'Operations' },
  
  { id: 'sales', label: 'Sales & Billing', icon: ShoppingCart, group: 'Sales & CRM' },
  { id: 'crm', label: 'CRM / Leads', icon: Users, group: 'Sales & CRM' },
  { id: 'quotations', label: 'Quotations', icon: History, group: 'Sales & CRM' },
  { id: 'projects', label: 'Projects', icon: Package, group: 'Sales & CRM' },
  { id: 'tasks', label: 'Tasks', icon: Calendar, group: 'Sales & CRM' },
  
  { id: 'inventory', label: 'Stock Master', icon: Package, group: 'Inventory & Supply' },
  { id: 'purchases', label: 'Purchases', icon: Layers, group: 'Inventory & Supply' },
  { id: 'warehouse', label: 'Warehouses', icon: Building, group: 'Inventory & Supply' },
  { id: 'manufacturing', label: 'Manufacturing', icon: Settings, group: 'Inventory & Supply' },
  
  { id: 'accounting', label: 'Accounting', icon: Wallet, group: 'Finance & Accounts' },
  { id: 'finance', label: 'Finance & Assets', icon: CreditCard, group: 'Finance & Accounts' },
  { id: 'gst', label: 'GST Compliance', icon: ShieldCheck, group: 'Finance & Accounts' },
  
  { id: 'employees', label: 'HR / Payroll', icon: Users, group: 'Organization' },
  { id: 'routes', label: 'Tracking', icon: MapIcon, group: 'Organization' },
  { id: 'reports', label: 'All Reports', icon: History, group: 'Organization' },
  { id: 'notifications', label: 'Notifications', icon: Bell, group: 'Organization' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const groups = Array.from(new Set(navItems.map(item => item.group)));
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Operations', 'Sales & CRM']);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      {/* Brand Header */}
      <div className="p-7 pb-8 flex items-center gap-4">
        <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-red-50">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">Helixion</h1>
          <p className="text-[9px] font-semibold text-primary uppercase tracking-[0.2em] mt-1.5">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto custom-scrollbar">
        {groups.map((group) => {
          const isExpanded = expandedGroups.includes(group);
          const items = navItems.filter((item) => item.group === group);
          const hasActiveItem = items.some(item => item.id === activeTab);

          return (
            <div key={group} className="space-y-1">
              <button 
                onClick={() => toggleGroup(group)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-all rounded-lg group flex-nowrap",
                  hasActiveItem && !isExpanded && "bg-red-50/50"
                )}
              >
                <h3 className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap truncate mr-2",
                  isExpanded || hasActiveItem ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                )}>
                  {group}
                </h3>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                )}
              </button>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden space-y-0.5 ml-1"
                  >
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2 transition-all group relative rounded-lg",
                          activeTab === item.id
                            ? "bg-red-50 text-primary font-semibold"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80"
                        )}
                      >
                        <item.icon className={cn(
                          "w-4 h-4 transition-colors shrink-0",
                          activeTab === item.id ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                        <span className="text-[12px] tracking-tight whitespace-nowrap truncate">{item.label}</span>
                        {activeTab === item.id && (
                          <div className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User Session */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg mb-3 group cursor-pointer hover:border-primary/20 transition-all">
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 truncate">Administrator</p>
            <p className="text-[10px] text-gray-400">Super User</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('userToken');
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
