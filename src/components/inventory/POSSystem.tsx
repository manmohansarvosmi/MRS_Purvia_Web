import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard, 
  Banknote, 
  Wallet,
  ShoppingCart,
  Zap,
  ArrowRight,
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { cn } from "@/src/lib/utils";
import { inventoryApi } from '../../lib/api';

export const POSSystem = () => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredProducts = useMemo(() => 
    products.filter(p => 
      p.productName.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase())
    ), [search, products]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        name: product.productName,
        qty: 1,
        price: product.sellingPrice,
        unit: product.unit
      }];
    });
    toast.success(`${product.productName} added to cart`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const gst = subtotal * 0.18;
    return { subtotal, gst, total: subtotal + gst };
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!customer.name || !customer.phone) {
      toast.error('Customer details required');
      return;
    }

    try {
      setIsProcessing(true);
      
      const payload = {
        customerName: customer.name,
        customerPhone: customer.phone,
        items: cart.map(item => ({
          product: { id: item.productId },
          quantity: item.qty,
          unitPrice: item.price,
          totalPrice: item.price * item.qty
        })),
        totalAmount: totals.total,
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod.toUpperCase(),
        isPos: true
      };

      const res = await inventoryApi.saveSale(payload);
      
      if (res.status === 1) {
        toast.success('TRANSACTION SUCCESSFUL', {
          description: `Invoice generated: #${res.data?.id}`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        });
        setCart([]);
        setCustomer({ name: '', phone: '' });
        fetchProducts(); // Refresh stock
      } else {
        toast.error(res.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100/40">
      {/* Left Side: Product Matrix */}
      <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 border-r border-slate-200">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search assets or scan barcode..." 
              className="pl-10 h-12 bg-white border-none shadow-sm rounded-xl focus-visible:ring-primary font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white border-none shadow-sm text-slate-400 hover:text-primary">
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => addToCart(product)}
                className="cursor-pointer group"
              >
                <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden bg-white">
                  <CardContent className="p-4">
                    <div className="w-full aspect-square bg-slate-50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                      <Package className="w-7 h-7 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <h4 className="text-sm font-normal text-slate-900 line-clamp-1 mb-1">{product.productName}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-primary">₹{product.sellingPrice?.toLocaleString()}</p>
                      <Badge variant="outline" className="text-[8px] font-normal uppercase tracking-tighter border-slate-200 bg-slate-50 text-slate-400">
                        {product.stockQuantity} In Stock
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Checkout Terminal */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white shadow-2xl shadow-slate-200/50 z-10">
        <div className="p-6 border-b border-slate-200 bg-slate-100/40">
          <h2 className="text-lg font-normal uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Order Checkout
          </h2>
          <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mt-1">Transaction Summary & Payment</p>
        </div>

        {/* Customer Input */}
        <div className="p-6 space-y-4 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-normal uppercase tracking-widest text-slate-400 px-1">Customer Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full h-9 pl-8 pr-3 text-xs font-normal bg-slate-100 border-none rounded-lg focus:ring-1 focus:ring-primary/20 outline-none"
                  value={customer.name}
                  onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-normal uppercase tracking-widest text-slate-400 px-1">Phone Number</label>
              <input 
                type="text" 
                placeholder="9876543210"
                className="w-full h-9 px-3 text-xs font-normal bg-slate-100 border-none rounded-lg focus:ring-1 focus:ring-primary/20 outline-none"
                value={customer.phone}
                onChange={e => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 py-12">
                <ShoppingCart className="w-10 h-10 mb-3" />
                <p className="text-[10px] font-normal uppercase tracking-widest">Cart is Empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group relative bg-slate-100/40 hover:bg-slate-50 rounded-xl p-3 border border-slate-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-4">
                      <h5 className="text-[11px] font-normal text-slate-900 leading-tight uppercase">{item.name}</h5>
                      <p className="text-[10px] font-normal text-primary mt-0.5">₹{item.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-3 h-3 text-slate-600" />
                      </button>
                      <span className="w-8 text-center text-[11px] font-normal">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-slate-50 rounded-md transition-colors"
                      >
                        <Plus className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                    <p className="text-xs font-normal text-slate-900 tracking-tight">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer: Totals & Pay */}
        <div className="p-6 bg-slate-900 rounded-t-2xl">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[10px] font-normal text-slate-400 uppercase tracking-widest">
              <span>Sub-Aggregate</span>
              <span>₹{totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-normal text-slate-400 uppercase tracking-widest">
              <span>Tax Index (18%)</span>
              <span>₹{totals.gst.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-normal text-white uppercase tracking-widest">Total Amount</span>
              <span className="text-2xl font-normal text-white tracking-tight">₹{totals.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {(['cash', 'upi', 'card'] as const).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-xl transition-all border",
                  paymentMethod === method 
                    ? "bg-primary border-primary text-white" 
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                )}
              >
                {method === 'cash' && <Banknote className="w-4 h-4 mb-1" />}
                {method === 'upi' && <Wallet className="w-4 h-4 mb-1" />}
                {method === 'card' && <CreditCard className="w-4 h-4 mb-1" />}
                <span className="text-[8px] font-medium uppercase tracking-tighter">{method}</span>
              </button>
            ))}
          </div>

          <Button 
            className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-normal uppercase tracking-widest rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 group"
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Complete Sale
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
