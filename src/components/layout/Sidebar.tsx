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
  Layers,
  LayoutDashboard,
  CreditCard,
  Building,
  BookOpen,
  Banknote,
  Repeat,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
  
  { id: 'inventory', label: 'Inventory Master', icon: Package, group: 'Operations' },
  { id: 'sales', label: 'Sales & POS', icon: ShoppingCart, group: 'Operations' },
  { id: 'manufacturing', label: 'Manufacturing', icon: Building, group: 'Operations' },
  
  { id: 'accounts', label: 'Accounts', icon: Wallet, group: 'Accounting' },
  { id: 'ledger', label: 'Ledger Registry', icon: BookOpen, group: 'Accounting' },
  { id: 'cashbook', label: 'Cash Book', icon: Banknote, group: 'Accounting' },
  { id: 'daybook', label: 'Day Book', icon: History, group: 'Accounting' },
  { id: 'vouchers', label: 'Voucher Entry', icon: Repeat, group: 'Accounting' },
  
  { id: 'expenses', label: 'Expenses', icon: ArrowDownCircle, group: 'Financial Ops' },
  { id: 'income', label: 'Income', icon: ArrowUpCircle, group: 'Financial Ops' },
  { id: 'billing', label: 'Invoice & Billing', icon: FileText, group: 'Financial Ops' },
  
  { id: 'employees', label: 'Employee Roll', icon: Users, group: 'HR Management' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, group: 'HR Management' },
  { id: 'payroll', label: 'Payroll', icon: CreditCard, group: 'HR Management' },
  { id: 'routes', label: 'Route Tracking', icon: MapIcon, group: 'HR Management' },
  
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, group: 'Insights' },
  
  { id: 'notifications', label: 'Notifications', icon: Bell, group: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const groups = Array.from(new Set(navItems.map(item => item.group)));
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main', 'Accounting', 'HR Management', 'Operations']);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg shadow-md">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-gray-900 leading-none">Helixion</h1>
          <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Financial ERP</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto no-scrollbar">
        {groups.map((group) => {
          const isExpanded = expandedGroups.includes(group);
          const items = navItems.filter((item) => item.group === group);
          const hasActiveItem = items.some(item => item.id === activeTab);

          return (
            <div key={group} className="space-y-1">
              <button 
                onClick={() => toggleGroup(group)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 transition-all rounded-lg group",
                  hasActiveItem && "bg-slate-50/50"
                )}
              >
                <h3 className={cn(
                  "text-[9px] font-bold uppercase tracking-widest transition-colors",
                  isExpanded || hasActiveItem ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                )}>
                  {group}
                </h3>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-300" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                )}
              </button>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="overflow-hidden space-y-0.5"
                  >
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-1.5 transition-all group relative rounded-lg",
                          activeTab === item.id
                            ? "bg-red-50 text-primary font-bold"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                        )}
                      >
                        <item.icon className={cn(
                          "w-3.5 h-3.5 transition-colors shrink-0",
                          activeTab === item.id ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                        <span className="text-[11px] font-medium tracking-tight whitespace-nowrap truncate">{item.label}</span>
                        {activeTab === item.id && (
                          <div className="absolute left-0 w-0.5 h-3 bg-primary rounded-r-full" />
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
      <div className="p-4 border-t border-gray-50 bg-gray-50/20">
        <div className="flex items-center gap-3 p-2 bg-white border border-gray-100 shadow-sm rounded-lg mb-2 group cursor-pointer hover:border-primary/20 transition-all">
          <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-gray-900 truncate leading-none mb-1">Admin User</p>
            <p className="text-[8px] text-primary font-bold uppercase tracking-tighter">Super Admin</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('userToken');
            window.location.reload();
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-3 h-3 group-hover:text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
