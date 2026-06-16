import React, { useState } from 'react';
import {
  BarChart3, Users, Package, ShoppingCart, Settings, LogOut,
  Calendar, Wallet, History, Bell, ChevronDown, ChevronRight,
  Map as MapIcon, LayoutDashboard, CreditCard, Building,
  BookOpen, Banknote, Repeat, FileText, ArrowDownCircle, ArrowUpCircle,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',        icon: LayoutDashboard, group: 'Main' },
  { id: 'inventory',   label: 'Inventory Control', icon: Package,         group: 'Ops' },
  { id: 'sales',       label: 'Sales & POS',       icon: ShoppingCart,    group: 'Ops' },
  { id: 'vendors',       label: 'Vendor Master',     icon: Users,           group: 'Ops' },
  { id: 'accounts',   label: 'Bank Accounts',      icon: Wallet,          group: 'Fin' },
  { id: 'ledger',     label: 'General Ledger',     icon: BookOpen,        group: 'Fin' },
  { id: 'cashbook',   label: 'Cash Book',          icon: Banknote,        group: 'Fin' },
  { id: 'daybook',    label: 'Daily Journal',      icon: History,         group: 'Fin' },
  { id: 'vouchers',   label: 'Voucher Registry',   icon: Repeat,          group: 'Fin' },
  { id: 'employees',  label: 'HR Personnel',       icon: Users,           group: 'HR' },
  { id: 'attendance', label: 'Attendance',         icon: Calendar,        group: 'HR' },
  { id: 'payroll',    label: 'Payroll Engine',     icon: CreditCard,      group: 'HR' },
  { id: 'routes',     label: 'Route Map',          icon: MapIcon,         group: 'HR' },
  { id: 'reports',    label: 'Business BI',        icon: BarChart3,       group: 'Insights' },
  { id: 'notifications', label: 'Alert Center',    icon: Bell,            group: 'Core' },
  { id: 'settings',  label: 'Global Settings',     icon: Settings,        group: 'Core' },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const groups = Array.from(new Set(navItems.map(i => i.group)));
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main', 'Fin', 'Ops', 'HR']);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  return (
    <div
      className="w-[180px] h-screen flex flex-col fixed left-0 top-0 z-50 overflow-hidden shadow-lg shadow-slate-200/60"
      style={{ background: '#FFFFFF', borderRight: '1px solid #E2E8F0' }}
    >
      {/* ── Brand ── */}
      <div className="flex items-center gap-2 px-3 py-3 shrink-0" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div
          className="w-5 h-5 flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: '#C8102E', borderRadius: '2px' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="font-bold leading-none" style={{ fontSize: '10px', letterSpacing: '0.01em', color: '#1E2330' }}>HELIXION</p>
          <p style={{ fontSize: '7px', color: '#C8102E', fontWeight: 900, letterSpacing: '0.1em', marginTop: '2px' }}>ULTRA CORE</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
        {groups.map(group => {
          const isExpanded = expandedGroups.includes(group);
          const items = navItems.filter(i => i.group === group);
          const hasActive = items.some(i => i.id === activeTab);

          return (
            <div key={group} className="mb-0.5">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-3 py-1 opacity-50 hover:opacity-100 transition-opacity"
              >
                <span style={{ fontSize: '7.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8' }}>
                  {group}
                </span>
                {isExpanded ? <ChevronDown size={7} color="#CBD5E1" /> : <ChevronRight size={7} color="#CBD5E1" />}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="overflow-hidden"
                  >
                    {items.map(item => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className="w-full flex items-center gap-2 px-3 py-1 relative transition-all"
                          style={{
                            background: isActive ? 'rgba(200,16,46,0.07)' : 'transparent',
                            borderLeft: isActive ? '2px solid #C8102E' : '2px solid transparent',
                          }}
                        >
                          <item.icon size={11} color={isActive ? '#C8102E' : '#94A3B8'} strokeWidth={isActive ? 2.5 : 1.5} className="shrink-0" />
                          <span style={{ fontSize: '10.5px', fontWeight: isActive ? 600 : 400, color: isActive ? '#C8102E' : '#475569', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* ── Profile Footer ── */}
      <div className="shrink-0 px-3 py-2" style={{ borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 flex items-center justify-center shrink-0 rounded-[2px]" style={{ fontSize: '7px', fontWeight: 800, color: '#FFF', background: '#C8102E', border: '1px solid #C8102E' }}>AD</div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#1E2330', lineHeight: 1 }}>Admin</p>
            <p style={{ fontSize: '7px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Super</p>
          </div>
          <button onClick={() => { localStorage.removeItem('userToken'); window.location.reload(); }} className="text-slate-500 hover:text-red-500 transition-colors">
            <LogOut size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};
