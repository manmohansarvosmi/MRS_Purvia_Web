import React from 'react';
import { EmployeeList } from './EmployeeList';
import { AttendanceView } from './AttendanceView';
import { SalaryManagement } from './SalaryManagement';

export const EmployeeModule = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case 'employees':
      return <EmployeeList />;
    case 'attendance':
      return <AttendanceView />;
    case 'salary':
      return <SalaryManagement />;
    default:
      return <EmployeeList />;
  }
};
