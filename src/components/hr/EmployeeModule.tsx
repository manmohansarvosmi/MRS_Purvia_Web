import React from 'react';
import { EmployeeList } from './EmployeeList';
import { AttendanceView } from './AttendanceView';
import { SalaryManagement } from './SalaryManagement';
import { cn } from '@/src/lib/utils';

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-8 py-3 bg-white border-b border-slate-100 flex items-center gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'list', label: 'Employee Directory' },
          { id: 'attendance', label: 'Attendance Terminal' },
          { id: 'salary', label: 'Payroll & Salary' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={cn(
              "whitespace-nowrap text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all",
              subTab === tab.id
                ? "text-primary border-primary"
                : "text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderHRContent()}
      </div>
    </div>
  );
};
