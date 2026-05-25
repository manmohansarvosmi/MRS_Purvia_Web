import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  User, 
  Clock, 
  Search,
  Filter,
  History,
  Activity,
  Box,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/src/lib/utils";

const MOCK_MOVEMENTS = [
  { id: 'MOV-001', product: 'Solar Panel 400W', type: 'in', qty: 24, person: 'Rajesh Kumar', date: '2026-05-13', time: '14:22', reason: 'Stock Replenishment' },
  { id: 'MOV-002', product: 'Inverter 5KVA', type: 'out', qty: 2, person: 'Sunil Verma', date: '2026-05-13', time: '13:45', reason: 'Customer Sale (INV-1024)' },
  { id: 'MOV-003', product: 'AC Cable 10mm', type: 'out', qty: 50, person: 'Amit Singh', date: '2026-05-13', time: '11:10', reason: 'Project Allocation (PRJ-88)' },
  { id: 'MOV-004', product: 'Battery 150Ah', type: 'in', qty: 15, person: 'System Auto', date: '2026-05-12', time: '17:30', reason: 'Inter-warehouse Transfer' },
  { id: 'MOV-005', product: 'Solar Controller 60A', type: 'out', qty: 5, person: 'Rahul Gupta', date: '2026-05-12', time: '15:20', reason: 'Warranty Replacement' },
];

export const StockMovement = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100/40">
      {/* Header & Controls */}
      <div className="p-6 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 bg-white">
        <div>
          <h2 className="text-xl font-normal uppercase tracking-tight text-slate-900 flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            Asset Movement Log
          </h2>
          <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mt-1">Real-time Stock Displacement Archives</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search movement ID, asset or person..." 
              className="pl-9 h-10 w-64 bg-slate-50 border-none text-xs font-normal rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Button variant="outline" className="h-10 rounded-lg border-slate-200 text-[10px] font-normal uppercase tracking-widest px-4 hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5 mr-2" />
            Filter Data
          </Button>
        </div>
      </div>

      {/* Movement Timeline */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-6 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[21px] top-4 bottom-4 w-px bg-slate-200" />

            <div className="space-y-8">
              {MOCK_MOVEMENTS.map((mov, index) => (
                <motion.div
                  key={mov.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Icon Node */}
                  <div className={cn(
                    "absolute left-0 top-0 w-11 h-11 rounded-2xl flex items-center justify-center border-4 border-[#F8FAFC] z-10 transition-transform hover:scale-110",
                    mov.type === 'in' ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-primary shadow-lg shadow-primary/20"
                  )}>
                    {mov.type === 'in' ? (
                      <ArrowDownRight className="w-5 h-5 text-white" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Card Content */}
                  <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden bg-white group">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Status Strip */}
                        <div className={cn(
                          "w-full md:w-1 h-1 md:h-auto",
                          mov.type === 'in' ? "bg-emerald-500" : "bg-primary"
                        )} />
                        
                        <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all">
                              <Box className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-normal text-slate-900 uppercase tracking-tight">{mov.product}</h4>
                                <Badge variant="outline" className={cn(
                                  "text-[8px] font-normal uppercase tracking-tighter rounded-md",
                                  mov.type === 'in' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-primary border-red-100"
                                )}>
                                  {mov.type === 'in' ? 'INFLOW' : 'OUTFLOW'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                  <Clock className="w-3 h-3" /> {mov.time}
                                </span>
                                <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                  <User className="w-3 h-3" /> {mov.person}
                                </span>
                                <span className="text-[10px] font-mono font-normal text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-200">
                                  {mov.id}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end gap-1">
                            <div className="flex items-baseline gap-2">
                              <span className={cn(
                                "text-xl font-normal tracking-tight",
                                mov.type === 'in' ? "text-emerald-600" : "text-primary"
                              )}>
                                {mov.type === 'in' ? '+' : '-'}{mov.qty}
                              </span>
                              <span className="text-[9px] font-normal text-slate-400 uppercase">Units</span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 max-w-[200px] md:text-right leading-tight">
                              {mov.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
