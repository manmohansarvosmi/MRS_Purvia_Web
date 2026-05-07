import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Download,
  Activity,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { attendanceApi, userApi } from '../../lib/api';

// Mock attendance generator
const generateAttendance = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;
    let status = 'present';
    if (isWeekend) status = 'weekend';
    else if (day === 10) status = 'absent';
    else if (day === 15) status = 'half-day';
    else if (day === 20) status = 'late';
    return {
      day,
      status,
      in: status === 'present' || status === 'late' ? '09:05 AM' : '--:--',
      out: status === 'present' ? '06:15 PM' : '--:--',
      location: 'Main Corporate Hub',
      hours: status === 'present' ? '9h 12m' : status === 'half-day' ? '4h 0m' : '0h'
    };
  });
};

const statusConfig: Record<string, { bg: string, text: string, dot: string, label: string, badge: string }> = {
  present:   { bg: 'bg-emerald-500', text: 'text-white',     dot: 'bg-emerald-500', label: 'Present',  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  absent:    { bg: 'bg-rose-500',    text: 'text-white',     dot: 'bg-rose-500',    label: 'Absent',   badge: 'bg-rose-50 text-rose-700 border-rose-200'       },
  late:      { bg: 'bg-amber-500',   text: 'text-white',     dot: 'bg-amber-500',   label: 'Late',     badge: 'bg-amber-50 text-amber-700 border-amber-200'     },
  half_day:  { bg: 'bg-orange-500',  text: 'text-white',     dot: 'bg-orange-500',  label: 'Half Day', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  weekend:   { bg: 'bg-slate-50',    text: 'text-slate-400', dot: 'bg-slate-200',   label: 'Weekend',  badge: 'bg-slate-50 text-slate-400 border-slate-200' },
  pending:   { bg: 'bg-slate-50',    text: 'text-slate-400', dot: 'bg-slate-200',   label: 'Scheduled',badge: 'bg-slate-50 text-slate-400 border-slate-200' },
};

// Utility to format IST time
const formatIST = (dateStr: string | null) => {
  if (!dateStr) return '--:--';
  try {
    const date = new Date(dateStr);
    // If date is invalid or year is 1970 (placeholder), return empty
    if (isNaN(date.getTime()) || date.getFullYear() < 2000) return '--:--';
    
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  } catch (e) {
    return '--:--';
  }
};

export const AttendanceView = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [summary, setSummary] = useState<any>({ present: 0, absent: 0, late: 0, efficiencyScore: 0 });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getAllUsers();
        if (res.code === 1) {
          setEmployees(res.data);
          if (res.data.length > 0 && !selectedEmpId) {
            setSelectedEmpId(res.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEmpId) return;
      
      const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      try {
        const [calResponse, sumResponse] = await Promise.all([
          attendanceApi.getCalendar(selectedEmpId, monthStr),
          attendanceApi.getSummary(selectedEmpId, monthStr)
        ]);

        if (calResponse.code === 1) {
          setAttendanceData(calResponse.data);
          const today = new Date().getDate();
          setSelectedDay(calResponse.data.find((d: any) => d.day === today) || calResponse.data[0]);
        }
        
        if (sumResponse.code === 1) {
          setSummary(sumResponse.data);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchData();
  }, [currentDate, selectedEmpId]);

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1));

  const dayStatus = selectedDay ? (statusConfig[selectedDay.status.toLowerCase()] || statusConfig.present) : statusConfig.present;

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Ledger</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Monitor workforce punch-in/out records</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Simple & Clean Personnel Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Staff</label>
            <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
              <SelectTrigger className="w-[280px] h-12 bg-white border border-slate-200 rounded-xl px-4 font-bold text-sm text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span className="truncate">
                    {employees.find((e: any) => e.id.toString() === selectedEmpId)?.fullName || "Choose Employee"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
                {employees.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id.toString()} className="rounded-lg py-2.5 px-4 focus:bg-slate-50 transition-colors">
                    <span className="font-bold text-slate-800">{emp.fullName}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-transparent uppercase tracking-widest">Action</label>
            <Button variant="outline" className="h-12 px-6 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 gap-3 transition-all">
              <Download className="w-4 h-4" />
              EXPORT LEDGER
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Present', value: summary.present, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Absences', value: summary.absent, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Late', value: summary.late, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Score', value: `${summary.efficiencyScore}%`, icon: Activity, color: 'text-slate-900', bg: 'bg-slate-100' },
        ].map(s => (
          <Card key={s.label} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.bg)}>
                  <s.icon className={cn('w-4 h-4', s.color)} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MTD</span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-slate-900">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Calendar */}
        <Card className="xl:col-span-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Select a date to audit punch-in details</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 p-0"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </Button>
              <Button
                variant="ghost"
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 p-0"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-7 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => <div key={`pad-${i}`} />)}

              {attendanceData.map((data) => {
                const cfg = statusConfig[data.status.toLowerCase()] || statusConfig.present;
                const isSelected = selectedDay?.day === data.day;
                const isToday = new Date().getDate() === data.day && new Date().getMonth() === currentDate.getMonth();
                
                return (
                  <motion.button
                    key={data.day}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDay(data)}
                    className={cn(
                      'h-20 flex flex-col items-center justify-center rounded-xl transition-all relative border border-transparent',
                      isSelected
                        ? 'bg-slate-900 text-white shadow-lg ring-2 ring-slate-900 ring-offset-2'
                        : data.status.toLowerCase() === 'weekend'
                        ? 'bg-slate-50 text-slate-400 cursor-default'
                        : `${cfg.bg} ${cfg.text} shadow-sm hover:opacity-90`
                    )}
                  >
                    {isToday && !isSelected && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                    <span className="text-base font-bold">
                      {data.day}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap gap-5">
              {Object.entries(statusConfig).filter(([k]) => k !== 'weekend').map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={cn('w-4 h-4 rounded-md', val.bg)} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{val.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Audit Panel */}
        <div className="xl:col-span-4 space-y-4">
          {selectedDay && (
            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Audit Log</p>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedDay.day} {currentDate.toLocaleString('default', { month: 'short' })} {currentDate.getFullYear()}
                    </h3>
                  </div>
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider border rounded-lg px-2.5 py-1', dayStatus.badge)}>
                    {dayStatus.label}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { Icon: Clock,    value: selectedDay.inTime, label: 'PUNCH IN TIME', color: 'text-emerald-700' },
                    { Icon: Clock,    value: selectedDay.outTime, label: 'PUNCH OUT TIME', color: 'text-rose-700' },
                    { Icon: MapPin,   value: selectedDay.location || 'Verified Office', label: 'LAST KNOWN LOCATION', color: 'text-slate-900' },
                    { Icon: Activity, value: selectedDay.hours || '0h 0m', label: 'ACTIVE HOURS', color: 'text-slate-900' },
                  ].map(({ Icon, value, label, color }) => (
                    <div key={label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className={cn('text-sm font-bold truncate', color)}>{value}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-2 transition-all">
                  VIEW AUDIT DETAILS
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Efficiency Metric */}
          <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly Discipline</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                   <Activity className="w-3 h-3" />
                   <span>+2.4%</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{summary.efficiencyScore || 0}</h3>
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>Target: 95%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.efficiencyScore || 0}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-slate-900 rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
