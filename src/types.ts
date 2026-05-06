export type SalaryType = 'monthly' | 'per-day' | 'per-hour';
export type AttendanceStatus = 'present' | 'half-day' | 'absent' | 'leave';
export type LeaveType = 'full' | 'half' | 'none';
export type UserRole = 'admin' | 'hr' | 'manager' | 'staff';

export interface Employee {
  id: string;
  name: string;
  empId: string;
  designation: string;
  phone: string;
  email: string;
  salaryType: SalaryType;
  baseRate: number;
  joiningDate: string;
  status: 'active' | 'inactive';
  role: UserRole;
  photoURL?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  punchInTime?: string;
  punchOutTime?: string;
  punchInLocation?: { lat: number; lng: number };
  punchOutLocation?: { lat: number; lng: number };
  status: AttendanceStatus;
  leaveType: LeaveType;
}

export interface RouteLog {
  id: string;
  employeeId: string;
  date: string;
  points: { lat: number; lng: number; timestamp: string }[];
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  deductions: number;
  allowances: number;
  netSalary: number;
  status: 'draft' | 'paid';
  generatedAt: string;
  payslipId?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  minStockLevel: number;
  warrantyMonths: number;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: 'in' | 'out';
  qty: number;
  reason: string;
  date: string;
  performedBy: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  warrantyExpiry: string;
}

export interface Sale {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  totalAmount: number;
  gstAmount: number;
  discount: number;
  netAmount: number;
  items: SaleItem[];
  invoiceNumber: string;
}

export interface ReturnReplacement {
  id: string;
  saleId: string;
  productId: string;
  type: 'return' | 'replacement';
  reason: string;
  date: string;
  status: 'pending' | 'completed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'low-stock' | 'salary' | 'warranty';
  isRead: boolean;
  createdAt: string;
}
