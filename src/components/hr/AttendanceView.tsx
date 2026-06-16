import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Clock, MapPin,
  CheckCircle2, Download, Activity, ArrowRight, UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { attendanceApi, userApi } from '../../lib/api';

const statusConfig: Record<string, { bg: string, text: string, label: string, badgeCls: string }> = {
  present:  { bg: '#D1FAE5', text: '#065F46', label: 'Present',   badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  absent:   { bg: '#FEE2E2', text: '#991B1B', label: 'Absent',    badgeCls: 'bg-red-50 text-red-700 border-red-200' },
  late:     { bg: '#FEF3C7', text: '#92400E', label: 'Late',      badgeCls: 'bg-amber-50 text-amber-700 border-amber-200' },
  half_day: { bg: '#FFEDD5', text: '#9A3412', label: 'Half Day',  badgeCls: 'bg-orange-50 text-orange-700 border-orange-200' },
  weekend:  { bg: '#F8FAFC', text: '#94A3B8', label: 'Weekend',   badgeCls: 'bg-slate-50 text-slate-400 border-slate-200' },
  pending:  { bg: '#F8FAFC', text: '#94A3B8', label: 'Scheduled', badgeCls: 'bg-slate-50 text-slate-400 border-slate-200' },
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
          if (res.data.length > 0 && !selectedEmpId) setSelectedEmpId(res.data[0].id.toString());
        }
      } catch (err) { console.error('Failed to fetch users', err); }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEmpId) return;
      const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      try {
        const [calRes, sumRes] = await Promise.all([
          attendanceApi.getCalendar(selectedEmpId, monthStr),
          attendanceApi.getSummary(selectedEmpId, monthStr),
        ]);
        if (calRes.code === 1) {
          setAttendanceData(calRes.data);
          const today = new Date().getDate();
          setSelectedDay(calRes.data.find((d: any) => d.day === today) || calRes.data[0]);
        }
        if (sumRes.code === 1) setSummary(sumRes.data);
      } catch (err) { console.error('Error fetching attendance:', err); }
    };
    fetchData();
  }, [currentDate, selectedEmpId]);

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1));
  const dayStatus = selectedDay ? (statusConfig[selectedDay.status?.toLowerCase()] || statusConfig.present) : statusConfig.present;

  const firstDayOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">

      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-[4px] w-8 h-8">
            <UserCheck size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Attendance Ledger</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.1em]">Monitor Workforce Punch-In / Out Records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Employee Selector */}
          <select
            value={selectedEmpId}
            onChange={e => setSelectedEmpId(e.target.value)}
            className="h-8 px-3 text-[10.5px] font-medium text-slate-700 bg-white border border-slate-200 rounded-[5px] outline-none hover:border-slate-400 transition-colors"
            style={{ minWidth: 200 }}
          >
            {employees.map((emp: any) => (
              <option key={emp.id} value={emp.id.toString()}>{emp.fullName}</option>
            ))}
          </select>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
            <Download size={11} /> Export Ledger
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        {[
          { label: 'Present Days', value: summary.present, color: '#059669' },
          { label: 'Absences', value: summary.absent, color: '#DC2626' },
          { label: 'Late Arrivals', value: summary.late, color: '#D97706' },
          { label: 'Efficiency Score', value: `${summary.efficiencyScore || 0}%`, color: '#1E2330' },
        ].map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && <div className="w-px h-6 bg-slate-200" />}
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
              <p className="text-[14px] font-black italic" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </React.Fragment>
        ))}
        <div className="ml-auto">
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">HR Server Online</span>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 flex gap-0 overflow-hidden">

        {/* Calendar Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-200 overflow-hidden">
          {/* Month Nav */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white shrink-0">
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Select a date to audit records</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-[4px] hover:bg-slate-900 hover:text-white transition-all"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-[4px] hover:bg-slate-900 hover:text-white transition-all"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest py-1">{d}</div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`pad-${i}`} />)}
              {attendanceData.map((data) => {
                const cfg = statusConfig[data.status?.toLowerCase()] || statusConfig.present;
                const isSelected = selectedDay?.day === data.day;
                const isToday = new Date().getDate() === data.day && new Date().getMonth() === currentDate.getMonth();
                return (
                  <motion.button
                    key={data.day}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedDay(data)}
                    className={cn('h-14 flex flex-col items-center justify-center transition-all relative border rounded-[4px]')}
                    style={{
                      background: isSelected ? '#1E2330' : cfg.bg,
                      color: isSelected ? '#fff' : cfg.text,
                      borderColor: isSelected ? '#1E2330' : 'transparent',
                      boxShadow: isSelected ? '0 2px 8px rgba(30,35,48,0.18)' : undefined,
                    }}
                  >
                    {isToday && !isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-primary" />
                    )}
                    <span className="text-[13px] font-black">{data.day}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap gap-4">
              {Object.entries(statusConfig).filter(([k]) => k !== 'weekend').map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-[2px]" style={{ background: val.bg, border: `1px solid ${val.text}30` }} />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Panel */}
        <div className="w-[280px] flex flex-col overflow-hidden shrink-0">
          {selectedDay && (
            <div className="flex-1 overflow-auto">
              {/* Day header */}
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 shrink-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Audit Log</p>
                <p className="text-[13px] font-black text-slate-900">
                  {selectedDay.day} {currentDate.toLocaleString('default', { month: 'short' })} {currentDate.getFullYear()}
                </p>
                <span className={cn('text-[8px] font-black uppercase tracking-wider border rounded-[3px] px-2 py-0.5 mt-1 inline-block', dayStatus.badgeCls)}>
                  {dayStatus.label}
                </span>
              </div>

              {/* Detail rows */}
              <div className="p-3 space-y-2">
                {[
                  { Icon: Clock,    value: selectedDay.inTime,            label: 'Punch In Time',      color: '#059669' },
                  { Icon: Clock,    value: selectedDay.outTime,           label: 'Punch Out Time',     color: '#DC2626' },
                  { Icon: MapPin,   value: selectedDay.location || 'Verified Office', label: 'Last Known Location', color: '#1E2330' },
                  { Icon: Activity, value: selectedDay.hours || '0h 0m',  label: 'Active Hours',       color: '#1E2330' },
                ].map(({ Icon, value, label, color }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-[4px]">
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-[3px] shrink-0">
                      <Icon size={13} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold truncate" style={{ color }}>{value || '--:--'}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-3 pb-3">
                <button className="btn-primary w-full h-8 text-[9.5px] rounded-[5px] flex items-center justify-center gap-2">
                  View Audit Details <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Efficiency */}
          <div className="border-t border-slate-200 p-4 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Discipline</p>
              <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600">
                <Activity size={10} /><span>+2.4%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-[28px] font-black text-slate-900 leading-none">{summary.efficiencyScore || 0}</span>
              <span className="text-[14px] font-black text-slate-400">%</span>
            </div>
            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
              <span>Progress</span><span>Target: 95%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${summary.efficiencyScore || 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: '#C8102E' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="h-[38px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Attendance Matrix — {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Present: <strong className="text-slate-700">{summary.present}</strong> &nbsp;|&nbsp; Absent: <strong className="text-red-500">{summary.absent}</strong>
        </p>
      </div>
    </div>
  );
};
