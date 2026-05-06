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
import { 
  Menu, 
  LayoutDashboard, 
  Calendar, 
  Map as MapIcon, 
  User as UserIcon,
  Bell,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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
      case 'employees':
      case 'attendance':
      case 'salary':
        return <EmployeeModule activeTab={activeTab} />;
      case 'inventory':
      case 'sales':
      case 'returns':
        return <InventoryModule activeTab={activeTab} />;
      case 'routes':
        return <RouteTracking />;
      default:
        return <Overview />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'employees': return 'Employee Management';
      case 'inventory': return 'Inventory Management';
      case 'routes': return 'Route Tracking';
      default: return 'Dashboard';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'attendance', label: 'CALENDAR', icon: Calendar },
    { id: 'routes', label: 'ROUTES', icon: MapIcon },
    { id: 'employees', label: 'PROFILE', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 bg-white border-b border-slate-100 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-primary tracking-tighter italic">M.R.S. PURVIA</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-primary transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

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

      <main className={cn(
        "min-h-screen transition-all duration-300 pb-24 lg:pb-0 flex flex-col",
        "lg:pl-64"
      )}>
        <div className="flex-1 px-2 lg:px-4 py-6 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between z-40 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all rounded-xl",
              activeTab === item.id ? "text-primary bg-primary/5" : "text-slate-400"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id && "fill-primary/20")} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      <Toaster />
    </div>
  );
}

