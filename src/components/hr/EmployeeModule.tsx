import React from 'react';
import { EmployeeList } from './EmployeeList';
import { AttendanceView } from './AttendanceView';
import { SalaryManagement } from './SalaryManagement';
import { cn } from '@/src/lib/utils';
import { Users, UserCheck, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeModule = () => {
  const [subTab, setSubTab] = React.useState('list');

  const renderHRContent = () => {
    switch (subTab) {
      case 'list':
        return <EmployeeList />;
      case 'attendance':
        return <AttendanceView />;
      case 'salary':
        return <SalaryManagement />;
      default:
        return <EmployeeList />;
    }
  };

  const tabs = [
    { id: 'list', label: 'Employee Inventory', icon: Users },
    { id: 'attendance', label: 'Attendance Ledger', icon: UserCheck },
    { id: 'salary', label: 'Salary Disbursement', icon: IndianRupee },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F8FAFC' }}>
      <div className="h-[42px] px-6 bg-white border-b border-slate-200 flex items-center gap-6 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(tab => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={cn(
                "h-full flex items-center gap-2.5 px-1 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wider transition-all relative group",
                isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "flex items-center justify-center p-1 rounded-md transition-all duration-300",
                isActive ? "bg-primary/5 shadow-[0_0_0_1px_rgba(200,16,46,0.1)]" : "group-hover:bg-slate-50"
              )}>
                <tab.icon className={cn(
                  "w-3.5 h-3.5 transition-colors", 
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-500"
                )} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className="relative">
                {tab.label}
              </span>

              {isActive && (
                <motion.div 
                  layoutId="active-hr-tab-indicator" 
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(200,16,46,0.3)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderHRContent()}
      </div>
    </div>
  );
};
