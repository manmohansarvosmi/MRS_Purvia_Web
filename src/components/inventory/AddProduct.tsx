import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PackagePlus, 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  Layers, 
  BarChart, 
  CreditCard,
  CheckCircle2,
  Box,
  Hash
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

import api from '@/src/lib/api';

interface AddProductProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AddProduct = ({ onBack, onSuccess }: AddProductProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await api.post('/inventory', payload);
      
      toast.success('ASSET REGISTERED', {
        description: 'Product added to inventory ledger.',
        className: 'bg-emerald-500 text-white font-black italic border-none'
      });
      onSuccess();
    } catch (error) {
      toast.error('REGISTRATION FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm hover:text-primary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Asset Registration</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Expanding Inventory Matrix</p>
          </div>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar Info */}
            <div className="bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <PackagePlus className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Asset Protocol</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Initialize new product units into the ledger. Ensure SKU uniqueness for proper matrix tracking.
                  </p>
                </div>
                <div className="space-y-4 pt-4">
                  {[
                    "Categorical sorting",
                    "Stock level initialization",
                    "Valuation matrix",
                    "Warranty protocol"
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div className="w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                        {i + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Box className="w-3 h-3" /> Product Name
                    </label>
                    <Input name="name" placeholder="Matrix Unit 01" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Hash className="w-3 h-3" /> SKU / Model
                    </label>
                    <Input name="sku" placeholder="PRV-0001" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Layers className="w-3 h-3" /> Category
                    </label>
                    <select name="category" className="w-full h-14 px-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all hover:bg-white">
                      <option value="hardware">Hardware</option>
                      <option value="accessories">Accessories</option>
                      <option value="networking">Networking</option>
                      <option value="software">Software</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <BarChart className="w-3 h-3" /> Initial Stock
                    </label>
                    <Input name="quantity" type="number" placeholder="100" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <CreditCard className="w-3 h-3" /> Purchase Price (₹)
                    </label>
                    <Input name="purchasePrice" type="number" placeholder="1200" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Sale Price (₹)
                    </label>
                    <Input name="salePrice" type="number" placeholder="1800" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary font-bold" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    disabled={isLoading}
                    className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black italic uppercase tracking-[0.15em] shadow-xl shadow-slate-900/10 group overflow-hidden relative"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Register Asset <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={false}
                    />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
