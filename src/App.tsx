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

  // Listen for token expiry event dispatched by the API interceptor
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

      <main className={cn(
        "flex-1 h-full transition-all duration-300 pb-24 lg:pb-0 flex flex-col overflow-hidden",
        "lg:pl-64"
      )}>
        <TopBar 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col min-h-0">
          {renderContent()}
        </div>

        {/* Footer Bar — Desktop only */}
        <footer className="hidden lg:flex h-10 shrink-0 items-center justify-between px-8 border-t border-slate-200 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            © 2026 Helixion Innovations LLP · All rights reserved
          </p>
          <a 
            href="https://helixioninnovations.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-all duration-300 group"
            title="Powered by Helixion Innovations LLP"
          >
            <img 
              src="https://helixioninnovations.com/favicon.ico" 
              alt="Helixion" 
              className="w-5 h-5 rounded-md shadow-sm group-hover:scale-110 transition-transform"
            />
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-transparent group-hover:border-slate-400 transition-all">
              Helixion Innovations
            </span>
          </a>
        </footer>
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

