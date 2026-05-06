import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  Filter,
  History,
  Package
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from '../../types';
import { toast } from 'sonner';
import { cn } from "@/src/lib/utils";
import api from '@/src/lib/api';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/inventory');
      setProducts(response.data);
    } catch (error) {
      // Mock data in case of error
      setProducts([
        {
          id: '1',
          name: 'Solar Panel 400W',
          sku: 'SP-400W-01',
          category: 'Hardware',
          quantity: 45,
          unit: 'pcs',
          purchasePrice: 12000,
          salePrice: 15000,
          minStockLevel: 10,
          warrantyMonths: 24
        }
      ]);
      toast.error('MATRIX SYNC FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (isAdding) {
    return (
      <AddProduct 
        onBack={() => setIsAdding(false)} 
        onSuccess={() => {
          setIsAdding(false);
          fetchInventory();
        }} 
      />
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search within asset catalog..." 
            className="pl-10 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest italic h-12 px-6 rounded-xl shadow-lg shadow-slate-900/10 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ingest Asset
        </Button>
      </div>

      <Card className="rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Product Name</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-wider">SKU Code</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Stock Status</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Price</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Warranty</TableHead>
                <TableHead className="h-12 px-6 text-right text-[10px] font-bold uppercase text-slate-500 tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id} className="group hover:bg-slate-50/80 border-b border-slate-50 transition-all">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm leading-none mb-1">{p.name}</p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase italic tracking-tighter">{p.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <code className="text-[10px] font-semibold text-slate-500 font-mono italic bg-slate-50 px-2 py-1 rounded-md border border-slate-100">[{p.sku}]</code>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                      <div className="flex justify-between text-[8px] font-semibold uppercase italic">
                        <span className="text-slate-900">{p.quantity} Units</span>
                        <span className={p.quantity <= p.minStockLevel ? "text-primary animate-pulse" : "text-slate-400"}>CRITICAL AT: {p.minStockLevel}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000", 
                            p.quantity <= p.minStockLevel ? "bg-primary" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min((p.quantity / (p.minStockLevel * 4)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">₹{p.salePrice.toLocaleString()}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[8px] font-semibold border-slate-200 bg-white">
                      {p.warrantyMonths} Months
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-primary shadow-sm"><History className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-emerald-500 shadow-sm"><ArrowUpRight className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

