import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  Package,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/src/lib/utils";

type NotifType = 'low-stock' | 'salary' | 'warranty' | 'system';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

const MOCK_NOTIFS: Notif[] = [
  { id: 'N1', type: 'low-stock', title: 'Critical Stock Alert', message: 'Solar Panel 400W has dropped below minimum threshold (2 units remaining).', time: '2m ago', isRead: false, priority: 'high' },
  { id: 'N2', type: 'warranty', title: 'Warranty Expiry Warning', message: '12 customer warranties from Indore branch will expire within 30 days.', time: '18m ago', isRead: false, priority: 'high' },
  { id: 'N3', type: 'salary', title: 'Payroll Cycle Due', message: 'May 2026 salary processing is pending. 24 employees awaiting disbursement.', time: '1h ago', isRead: false, priority: 'medium' },
  { id: 'N4', type: 'system', title: 'System Backup Complete', message: 'Automated nightly backup successfully completed. All ledger data secured.', time: '3h ago', isRead: true, priority: 'low' },
  { id: 'N5', type: 'low-stock', title: 'Restock Required', message: 'Inverter 5KVA inventory at Gwalior HQ has reached minimum level (3 units).', time: '5h ago', isRead: true, priority: 'medium' },
  { id: 'N6', type: 'warranty', title: 'Warranty Expired', message: 'Customer Sunil Singh (INV-1003) warranty has expired. Follow-up required.', time: '1d ago', isRead: true, priority: 'low' },
];

const typeConfig: Record<NotifType, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  'low-stock': { icon: Package, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  'salary': { icon: IndianRupee, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  'warranty': { icon: ShieldAlert, bg: 'bg-primary/5', text: 'text-primary', border: 'border-primary/10' },
  'system': { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
};

const priorityBadge: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-100',
  medium: 'bg-orange-50 text-orange-600 border-orange-100',
  low: 'bg-slate-50 text-slate-400 border-slate-100',
};

export const NotificationCenter = () => {
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const dismiss = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'unread' ? notifs.filter(n => !n.isRead) : notifs;

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary" />
            Notification Center
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            System Alerts & Operational Updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllRead}
              className="h-10 px-4 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
            >
              <Check className="w-3.5 h-3.5 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Unread', value: unreadCount, color: 'text-primary', bg: 'bg-primary/5', icon: Bell },
          { label: 'Critical', value: notifs.filter(n => n.priority === 'high').length, color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
          { label: 'Stock Alerts', value: notifs.filter(n => n.type === 'low-stock').length, color: 'text-orange-600', bg: 'bg-orange-50', icon: Package },
          { label: 'Total', value: notifs.length, color: 'text-slate-600', bg: 'bg-slate-50', icon: Clock },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h4 className={cn("text-xl font-black italic tracking-tighter", s.color)}>{s.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification List */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center gap-4 text-slate-300"
            >
              <CheckCircle2 className="w-12 h-12" />
              <p className="text-xs font-black uppercase tracking-widest italic">All Clear — No Pending Alerts</p>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((notif, i) => {
                const config = typeConfig[notif.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "group relative flex items-start gap-6 px-8 py-6 hover:bg-slate-50/50 transition-colors cursor-pointer",
                      !notif.isRead && "bg-primary/[0.02]"
                    )}
                    onClick={() => markRead(notif.id)}
                  >
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}

                    <div className={cn("p-3 rounded-2xl border shrink-0 mt-0.5", config.bg, config.border)}>
                      <Icon className={cn("w-5 h-5", config.text)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className={cn(
                          "text-sm font-black italic uppercase tracking-tight",
                          notif.isRead ? "text-slate-500" : "text-slate-900"
                        )}>
                          {notif.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-tighter rounded-lg px-2 py-0.5 border", priorityBadge[notif.priority])}>
                            {notif.priority}
                          </Badge>
                          <button
                            onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed">{notif.message}</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 flex items-center gap-1 italic">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors shrink-0 mt-2" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
