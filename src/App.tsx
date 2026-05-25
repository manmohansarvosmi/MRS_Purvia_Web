/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { TopBar } from '@/src/components/layout/TopBar';
import { Overview } from '@/src/components/dashboard/Overview';
import { Toaster } from "@/components/ui/sonner";
import { EmployeeModule } from '@/src/components/hr/EmployeeModule';
import { InventoryModule } from '@/src/components/inventory/InventoryModule';
import { RouteTracking } from '@/src/components/routes/RouteTracking';
import { LoginPage } from '@/src/components/auth/LoginPage';
import { AnalyticsDashboard } from '@/src/components/analytics/AnalyticsDashboard';
import { NotificationCenter } from '@/src/components/notifications/NotificationCenter';
import { ManufacturingModule } from '@/src/components/manufacturing/ManufacturingModule';
import { AssetModule } from '@/src/components/assets/AssetModule';
import { AuditModule } from '@/src/components/audit/AuditModule';
import { SupportModule } from '@/src/components/support/SupportModule';
import { TaskModule } from '@/src/components/tasks/TaskModule';
import { SalesModule } from '@/src/components/sales/SalesModule';
import { LedgerEngine } from '@/src/components/accounting/LedgerEngine';
import { PayrollModule } from '@/src/components/accounting/modules/PayrollModule';
import { ReportsModule } from '@/src/components/accounting/modules/ReportsModule';
import { NotificationsModule } from '@/src/components/accounting/modules/NotificationsModule';
import { SettingsModule } from '@/src/components/accounting/modules/SettingsModule';
import { GSTModule } from '@/src/components/accounting/GSTModule';
import { 
  Sparkles,
  MessageSquare,
  Bot,
  BrainCircuit,
  Zap,
  TrendingUp,
  AlertCircle,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LayoutDashboard,
  Wallet,
  History,
  Building,
  Calendar,
  Map as MapIcon,
  ShieldCheck,
  CreditCard,
  Bell,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const ModulePlaceholder = ({ name, icon: Icon }: { name: string, icon: any }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50">
    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 relative border border-slate-100 overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
      <Icon className="w-8 h-8 text-primary relative z-10" />
    </div>
    <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">{name}</h2>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px] mt-2">Helixion ERP Core • v2.4.0</p>
  </div>
);

const AIAssistant = () => (
  <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            HELIXION AI <span className="text-[8px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase">Active</span>
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cognitive Intelligence Engine</p>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      <div className="w-full space-y-6">
        <div className="bg-primary p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">System Status: Optimal</h3>
            <p className="text-white/70 text-sm font-medium">I have analyzed your sales patterns. Everything looks great for today.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="p-6 bg-white border-t border-slate-100">
      <div className="w-full relative">
        <input 
          type="text" 
          placeholder="Ask Helixion AI anything..." 
          className="w-full h-14 pl-12 pr-20 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-sm"
        />
        <button className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group">
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => {
      setIsAuthenticated(false);
      setActiveTab('dashboard');
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Overview />;
      case 'accounts':
      case 'ledger':
      case 'cashbook':
      case 'daybook':
      case 'vouchers':
        return <LedgerEngine initialTab={activeTab} />;
      case 'expenses':
        return <LedgerEngine initialTab="expenses" />;
      case 'income':
        return <LedgerEngine initialTab="income" />;
      case 'billing':
        return <SalesModule initialSubTab="invoices" />;
      case 'reports':
        return <ReportsModule />;
      case 'payroll':
        return <PayrollModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'sales':
        return <SalesModule />;
      case 'manufacturing':
        return <ManufacturingModule />;
      case 'employees':
        return <EmployeeModule />;
      case 'routes':
        return <RouteTracking />;
      case 'attendance':
        return <EmployeeModule initialSubTab="attendance" />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <Overview />;
    }
  };

  const getPageTitle = () => {
    return activeTab.replace('-', ' ').toUpperCase();
  };

  const mobileNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'inventory', icon: Package, label: 'Inv' },
    { id: 'sales', icon: ShoppingCart, label: 'Sales' },
    { id: 'employees', icon: Users, label: 'HR' },
  ];

  return (
    <div className="h-screen bg-[#F8FAFC] overflow-hidden flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[51] lg:hidden"
            >
              <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 h-full transition-all duration-300 pb-20 lg:pb-0 flex flex-col overflow-hidden lg:pl-64">
        <TopBar 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col min-h-0">
          {renderContent()}
        </div>

        {/* Global Footer */}
        <footer className="hidden lg:flex h-10 shrink-0 items-center justify-between px-8 border-t border-slate-100 bg-white">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Helixion Innovations · Cloud ERP v2.4
          </p>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Engine</span>
             </div>
             <a href="#" className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Documentation</a>
          </div>
        </footer>
      </main>

      {/* Mobile Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-around z-40 pb-safe">
        {mobileNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all rounded-xl",
              activeTab === item.id ? "text-primary bg-primary/5" : "text-slate-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      <Toaster />
    </div>
  );
}



