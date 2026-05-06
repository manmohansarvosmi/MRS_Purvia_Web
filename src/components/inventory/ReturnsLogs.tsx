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
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Reversal Protocols</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Asset Returns & Replacement Logistics</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest italic h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
          <RotateCcw className="w-5 h-5 mr-1" />
          Log New Return
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-md shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-all overflow-hidden relative">
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-4">Pending Replacement Matrix</p>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">04</h3>
              <RefreshCw className="w-10 h-10 text-primary opacity-20" />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase italic">
               <Clock className="w-3.5 h-3.5" />
               Awaiting triage completion
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[2.5rem] border-none shadow-md shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-all overflow-hidden relative">
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-4">Cycle Aggregate (MTD)</p>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">12</h3>
              <RotateCcw className="w-10 h-10 text-primary opacity-20" />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase italic">
               <CheckCircle2 className="w-3.5 h-3.5" />
               Current month reverse logistics
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input placeholder="Identify via request ID, invoice or nomad label..." className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-primary" />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl border-none bg-white shadow-sm font-bold uppercase text-xs text-slate-400 hover:text-primary group">
          <Clock className="w-4 h-4 mr-2" />
          Temporal Filter
        </Button>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-50">
              <TableHead className="h-16 px-8 text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Request SID</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Asset Origin</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Protocol Type</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Deviation Reason</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Status Node</TableHead>
              <TableHead className="h-16 px-8 text-right text-[11px] font-black uppercase text-slate-400 tracking-widest italic">Ops</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {mockReturnData.map((ret) => (
               <TableRow key={ret.id} className="group hover:bg-slate-50/50 border-b border-slate-50/50 transition-all">
                 <TableCell className="px-8 py-6 font-mono font-black italic text-slate-400 tracking-tighter">[{ret.id}]</TableCell>
                 <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                        <AlertCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{ret.product}</p>
                        <p className="text-[10px] font-black italic text-primary uppercase tracking-tighter">{ret.inv}</p>
                      </div>
                    </div>
                 </TableCell>
                 <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shadow-sm",
                        ret.type === 'Replacement' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {ret.type === 'Replacement' ? <RefreshCw className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-[10px] font-black uppercase italic text-slate-600 tracking-widest">{ret.type}</span>
                    </div>
                 </TableCell>
                 <TableCell className="px-8 py-6">
                   <p className="text-xs font-bold text-slate-400 italic max-w-[180px] break-words">{ret.reason}</p>
                 </TableCell>
                 <TableCell className="px-8 py-6">
                    <Badge variant="outline" className={cn(
                      "rounded-lg px-3 py-1 text-[10px] font-black uppercase italic border transition-all",
                      ret.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary/5 text-primary border-primary/10'
                    )}>
                      {ret.status}
                    </Badge>
                 </TableCell>
                 <TableCell className="px-8 py-6 text-right">
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-white hover:text-primary transition-all border border-transparent hover:border-slate-100">
                      <Eye className="w-4 h-4" />
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
