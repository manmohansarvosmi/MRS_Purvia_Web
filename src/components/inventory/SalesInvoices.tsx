import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  FileText, 
  Download, 
  Search, 
  Plus, 
  Calendar,
  ShieldCheck,
  ShieldAlert,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { inventoryApi } from '../../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const SalesInvoices = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllSales();
      if (res.status === 1) {
        setSales(res.data);
      } else {
        toast.error(res.message || "Failed to fetch sales");
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("An error occurred while fetching sales");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const activeWarranties = sales.length; // Simplified

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight italic uppercase">Sales Acquisition</h1>
          <p className="text-sm font-normal text-slate-400 uppercase tracking-widest italic">Revenue Extraction & Warranty Matrix</p>
        </div>
        <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white font-medium uppercase tracking-widest italic h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95" />}>
            <Plus className="w-5 h-5 mr-1" />
            New Sale Invoice
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] rounded-xl border-none shadow-2xl">
             <DialogHeader>
               <DialogTitle className="text-xl font-medium italic uppercase tracking-tighter">Acquisition Entry</DialogTitle>
             </DialogHeader>
             <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest px-1">Customer Identifier</label>
                  <Input placeholder="Enter Full Name" className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest px-1">Contact Protocol</label>
                  <Input placeholder="+91 9123456789" className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-primary h-12" />
                </div>
                <div className="col-span-2 space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-400 italic">Billable Assets</h4>
                    <Button variant="ghost" size="sm" className="text-primary font-medium uppercase tracking-widest italic hover:bg-primary/5">+ Add Asset</Button>
                  </div>
                  <div className="border border-slate-50 rounded-2xl p-6 bg-slate-100/40 space-y-4">
                     <div className="flex items-center justify-between text-sm">
                       <span className="font-normal text-slate-600">Solar Panel 400W (x3)</span>
                       <span className="font-medium italic text-slate-900 tracking-tighter">₹45,000</span>
                     </div>
                     <div className="border-t border-slate-200 pt-4 flex justify-between">
                       <span className="text-xs font-normal text-slate-400 uppercase tracking-widest">Aggregate Valuation</span>
                       <span className="text-xl font-medium italic text-slate-900 tracking-tighter">₹45,000</span>
                     </div>
                  </div>
                </div>
                <div className="col-span-2 pt-4">
                   <Button className="w-full h-14 rounded-2xl bg-slate-900 font-medium italic uppercase tracking-widest transition-transform active:scale-95" onClick={() => setIsNewSaleOpen(false)}>Execute Transaction & Sync</Button>
                </div>
             </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-none shadow-xl shadow-primary/10 bg-primary group hover:scale-[1.02] transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
          <CardContent className="p-6 relative z-10">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/60 italic mb-4">Total Revenue Acquisition (MTD)</p>
            <h3 className="text-4xl font-medium italic tracking-tighter text-white">₹{totalRevenue.toLocaleString()}</h3>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-md shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-all overflow-hidden relative">
          <CardContent className="p-6">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 italic mb-4">Active Warranty Matrix</p>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-medium italic tracking-tighter text-emerald-600">84</h3>
              <ShieldCheck className="w-10 h-10 text-emerald-600 opacity-20" />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-normal text-emerald-600 uppercase italic">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Assets under protection
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-all overflow-hidden relative">
          <CardContent className="p-6">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 italic mb-4">Termination Alerts (30d)</p>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-medium italic tracking-tighter text-primary">12</h3>
              <ShieldAlert className="w-10 h-10 text-primary opacity-20" />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-normal text-primary uppercase italic">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
               Approaching Expiry
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input placeholder="Search invoice, customer or contact protocol..." className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-primary" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-none bg-white shadow-sm font-normal uppercase text-xs text-slate-400 hover:text-primary group">
            <Calendar className="w-4 h-4 mr-2" />
            Date Scope
          </Button>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-none bg-white shadow-sm font-normal uppercase text-xs text-slate-400 hover:text-primary group">
            <Download className="w-4 h-4 mr-2" />
            Extract Data
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-100/40">
            <TableRow className="hover:bg-transparent border-b border-slate-50">
              <TableHead className="h-16 px-8 text-[11px] font-medium uppercase text-slate-400 tracking-widest italic">Invoice Identifier</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-medium uppercase text-slate-400 tracking-widest italic">Asset Occupant</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-medium uppercase text-slate-400 tracking-widest italic">Registry Date</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-medium uppercase text-slate-400 tracking-widest italic">Acquisition Value</TableHead>
              <TableHead className="h-16 px-8 text-[11px] font-medium uppercase text-slate-400 tracking-widest italic">Protection Index</TableHead>
              <TableHead className="h-16 px-8 text-right text-[11px] font-medium uppercase text-slate-400 tracking-widest italic">Ops</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-slate-400 uppercase tracking-widest text-[10px] italic">
                   Extracting acquisition records...
                 </TableCell>
               </TableRow>
             ) : sales.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-slate-400 uppercase tracking-widest text-[10px] italic">
                   No transactions recorded in current matrix
                 </TableCell>
               </TableRow>
             ) : sales.map((sale) => (
               <TableRow key={sale.id} className="group hover:bg-slate-100/40 border-b border-slate-50/50 transition-all">
                 <TableCell className="px-8 py-6 font-mono font-medium italic text-primary tracking-tighter">[{sale.id}]</TableCell>
                 <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-inner">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-normal text-slate-900">{sale.customerName}</p>
                        <p className="text-[10px] font-normal text-slate-400 uppercase italic tracking-tighter">{sale.customerPhone}</p>
                      </div>
                    </div>
                 </TableCell>
                 <TableCell className="px-8 py-6 text-xs font-normal text-slate-500 italic">
                   {sale.createdOn ? format(new Date(sale.createdOn), 'dd MMM yyyy') : 'N/A'}
                 </TableCell>
                 <TableCell className="px-8 py-6">
                    <p className="text-lg font-medium italic tracking-tighter text-slate-900">₹{sale.totalAmount?.toLocaleString()}</p>
                    <p className="text-[10px] font-normal text-slate-400 uppercase italic tracking-widest">{sale.items?.length || 0} Assets</p>
                 </TableCell>
                 <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-1.5">
                      {sale.paymentStatus === 'PAID' ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium uppercase italic">Secured</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-400 rounded-lg border border-slate-200">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium uppercase italic">Pending</span>
                        </div>
                      )}
                    </div>
                 </TableCell>
                 <TableCell className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-white hover:text-primary transition-all border border-transparent hover:border-slate-200"><Download className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-white hover:text-primary transition-all border border-transparent hover:border-slate-200"><ArrowRight className="w-4 h-4" /></Button>
                    </div>
                 </TableCell>
               </TableRow>
             ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
