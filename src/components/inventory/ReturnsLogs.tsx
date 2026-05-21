import React from 'react';
import { 
  RotateCcw, 
  RefreshCw, 
  Search, 
  Eye, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const mockReturnData = [
  { id: 'RET-001', inv: 'INV-992', product: 'Solar Inverter 5KV', date: '2026-04-20', reason: 'Defective Power Board', status: 'In Review', type: 'Replacement' },
  { id: 'RET-002', inv: 'INV-985', product: 'Li-ion Battery 150Ah', date: '2026-04-18', reason: 'Order Cancellation', status: 'Completed', type: 'Return' },
  { id: 'RET-003', inv: 'INV-970', product: 'AC Cable 10m', date: '2026-04-15', reason: 'Wrong Product Sent', status: 'Completed', type: 'Replacement' },
];

export const ReturnsLogs = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-primary" />
            Reversal Logs
          </h2>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Asset Returns & Replacement Tracking</p>
        </div>
        <Button className="bg-primary hover:bg-[#900015] text-white font-bold uppercase tracking-widest h-11 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95">
          <RotateCcw className="w-4 h-4 mr-2" />
          Log New Return
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white group hover:shadow-md transition-all overflow-hidden relative">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Pending Replacement Matrix</p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-slate-900">04</h3>
              <RefreshCw className="w-8 h-8 text-primary opacity-20" />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
               <Clock className="w-3.5 h-3.5" />
               Awaiting triage completion
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white group hover:shadow-md transition-all overflow-hidden relative">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Cycle Aggregate (MTD)</p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-slate-900">12</h3>
              <RotateCcw className="w-8 h-8 text-primary opacity-20" />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
               <CheckCircle2 className="w-3.5 h-3.5" />
               Current month reverse logistics
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input placeholder="Search request ID, invoice or item..." className="pl-10 h-11 bg-white border-slate-200 shadow-sm rounded-lg focus-visible:ring-primary/20" />
        </div>
        <Button variant="outline" className="h-11 px-5 rounded-lg border-slate-200 bg-white font-bold uppercase text-[10px] text-slate-500 hover:text-primary transition-all">
          <Clock className="w-4 h-4 mr-2" />
          Temporal Filter
        </Button>
      </div>

      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Request SID</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Asset Origin</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Protocol Type</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Deviation Reason</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Status Node</TableHead>
              <TableHead className="h-12 px-6 text-right text-[10px] font-bold uppercase text-slate-400 tracking-widest">Ops</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {mockReturnData.map((ret) => (
               <TableRow key={ret.id} className="group hover:bg-slate-50/50 border-b border-slate-50/50 transition-all">
                 <TableCell className="px-6 py-4 font-mono font-bold text-slate-400 text-xs">[{ret.id}]</TableCell>
                 <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <AlertCircle className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{ret.product}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tight">{ret.inv}</p>
                      </div>
                    </div>
                 </TableCell>
                 <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center shadow-sm",
                        ret.type === 'Replacement' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {ret.type === 'Replacement' ? <RefreshCw className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      </div>
                      <span className="text-[10px] font-bold uppercase text-slate-600 tracking-widest">{ret.type}</span>
                    </div>
                 </TableCell>
                 <TableCell className="px-6 py-4">
                   <p className="text-xs font-medium text-slate-400 max-w-[180px] break-words">{ret.reason}</p>
                 </TableCell>
                 <TableCell className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase border",
                      ret.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary/5 text-primary border-primary/10'
                    )}>
                      {ret.status}
                    </Badge>
                 </TableCell>
                 <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-white hover:text-primary transition-all border border-transparent hover:border-slate-100">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                 </TableCell>
               </TableRow>
             ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
