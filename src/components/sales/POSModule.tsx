import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Zap,
  Package,
  TrendingUp,
  X,
  Layers,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi } from '@/src/lib/api';
import { toast } from 'sonner';

interface CartItem {
  id: string; // Internal unique ID for cart
  productId: number;
  name: string;
  price: number;
  cost: number;
  qty: number;
  margin: number;
  marginType: 'percentage' | 'amount';
  unit: string;
}

export const POSModule = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMargin, setShowMargin] = useState(false);
  const [ledgerAccount, setLedgerAccount] = useState('pos_cash');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

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
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => 
    products.filter(p => 
      p.productName.toLowerCase().includes(search.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    ), [search, products]);

  const ledgerAccounts = [
    { id: 'pos_cash', name: 'POS Cash Counter', type: 'Cash' },
    { id: 'pos_upi',  name: 'UPI / Digital Sales', type: 'Bank' },
    { id: 'main_sales', name: 'Main Sales Ledger', type: 'Sales' },
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? {...item, qty: item.qty + 1} : item));
    } else {
      const price = product.sellingPrice || 0;
      const cost = product.purchasePrice || 0;
      const margin = cost > 0 ? ((price - cost) / cost) * 100 : 0;
      setCart([...cart, {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        name: product.productName,
        price,
        cost,
        qty: 1,
        margin: Number(margin.toFixed(2)),
        marginType: 'percentage',
        unit: product.unit || 'PCS'
      }]);
    }
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

  const updatePrice = (id: string, newPrice: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const cost = item.cost || 1;
        const margin = item.marginType === 'percentage'
          ? ((newPrice / cost) - 1) * 100
          : newPrice - cost;
        return { ...item, price: newPrice, margin: Number(margin.toFixed(2)) };
      }
      return item;
    }));
  };

  const updateMargin = (id: string, updates: Partial<Pick<CartItem, 'margin' | 'marginType'>>) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const u = { ...item, ...updates };
        const newPrice = u.marginType === 'percentage'
           ? Math.round(u.cost * (1 + u.margin / 100))
           : Math.round(u.cost + u.margin);
        return { ...u, price: newPrice };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setIsProcessing(true);
      
      const payload = {
        customerName: "Walk-in Customer",
        customerPhone: "0000000000",
        items: cart.map(item => ({
          product: { id: item.productId },
          quantity: item.qty,
          unitPrice: item.price,
          totalPrice: item.price * item.qty
        })),
        totalAmount: total,
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod,
        isPos: true
      };

      const res = await inventoryApi.saveSale(payload);
      
      if (res.status === 1) {
        toast.success('TRANSACTION SUCCESSFUL', {
          description: `Invoice: #${res.data?.id}`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        });
        setCart([]);
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
    <div className="flex-1 flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden h-full text-slate-800">
      
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-100">
         <div className="p-3 border-b border-slate-100 bg-white flex items-center gap-3 shrink-0">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
               <input 
                 type="text" 
                 placeholder="Search assets..." 
                 className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-semibold outline-none focus:border-primary/20" 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
         </div>

          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 custom-scrollbar content-start">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest">Loading Catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30">
                <Package className="w-8 h-8 mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest">No Products Found</p>
              </div>
            ) : filteredProducts.map(p => (
               <button 
                 key={p.id} 
                 onClick={() => addToCart(p)}
                 className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow transition-all text-left flex flex-col justify-between group h-24"
               >
                  <div className="flex items-start justify-between">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[7px] font-black uppercase text-slate-400">{p.stockQuantity} in stock</span>
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black text-slate-800 uppercase leading-tight line-clamp-1">{p.productName}</h4>
                     <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs font-black text-primary italic">₹{p.sellingPrice?.toLocaleString()}</p>
                        <div className="w-4 h-4 rounded-full bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all">
                           <Plus className="w-2.5 h-2.5" />
                        </div>
                     </div>
                  </div>
               </button>
            ))}
          </div>
      </div>

      {/* Cart & Checkout Area */}
      <div className="w-full md:w-[350px] bg-white flex flex-col shadow-2xl z-10 shrink-0">
         <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
               <ShoppingCart className="w-3 h-3 text-primary" /> Cart
            </h3>
            <span className="bg-primary/5 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">{cart.length} ITEMS</span>
         </div>

         <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar bg-slate-50/20">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-10">
                  <ShoppingCart className="w-8 h-8 mb-2" />
                  <p className="text-[8px] font-black uppercase tracking-widest">Cart is Empty</p>
               </div>
            ) : (
               cart.map(item => {
                 const marginPct = item.cost > 0 ? ((item.price - item.cost) / item.cost) * 100 : 0;
                 return (
                  <div key={item.id} className="bg-white p-2.5 border border-slate-100 rounded-lg shadow-sm hover:border-slate-200 transition-all">
                     <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                           <h5 className="text-[10px] font-black text-slate-800 uppercase truncate leading-[1]">{item.name}</h5>
                           <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Cost: ₹{item.cost?.toLocaleString()}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                           <Trash2 className="w-3 h-3" />
                        </button>
                     </div>

                     {showMargin && (
                        <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-md gap-2 border border-slate-100 mb-2">
                           <span className="text-[7px] font-black text-slate-500 uppercase flex items-center gap-1">
                              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" /> Margin
                           </span>
                           <div className="flex items-center bg-white border border-slate-200 rounded p-0.5">
                              <input 
                                 type="number" 
                                 value={item.margin}
                                 onChange={e => updateMargin(item.id, { margin: parseFloat(e.target.value) || 0 })}
                                 className="w-10 text-right text-[9px] font-black text-slate-700 outline-none px-1"
                              />
                              <button 
                                 onClick={() => updateMargin(item.id, { marginType: item.marginType === 'percentage' ? 'amount' : 'percentage' })}
                                 className="px-1 py-0.5 bg-slate-50 text-[7px] font-black text-slate-500 hover:bg-primary hover:text-white rounded transition-all"
                              >
                                 {item.marginType === 'percentage' ? '%' : '₹'}
                              </button>
                           </div>
                        </div>
                     )}

                     <div className="flex items-center justify-between">
                        <div className="flex items-center bg-slate-50 rounded-md p-0.5 shrink-0">
                           <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-500 transition-all"><Minus className="w-2.5 h-2.5" /></button>
                           <span className="w-6 text-center text-[9px] font-black text-slate-700">{item.qty}</span>
                           <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-500 transition-all"><Plus className="w-2.5 h-2.5" /></button>
                        </div>
                        
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                value={item.price} 
                                onChange={e => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                                className="w-16 text-right text-xs font-black text-primary bg-transparent border-b border-primary/10 focus:border-primary outline-none" 
                              />
                           </div>
                           <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={cn(
                                 "text-[7px] font-black px-1 py-0.5 rounded uppercase bg-emerald-50 text-emerald-600",
                                 marginPct < 15 && "bg-amber-50 text-amber-600"
                              )}>
                                 {marginPct.toFixed(0)}% MGN
                              </span>
                              <p className="text-[10px] font-black text-slate-900 italic tracking-tight">₹{(item.price * item.qty).toLocaleString()}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                 );
               })
            )}
         </div>

         {/* Checkout Summary */}
         <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3 shadow-[0_-10px_30px_rgb(0,0,0,0.02)]">
            
            <div className="grid grid-cols-2 gap-2">
               <button 
                  onClick={() => setShowMargin(!showMargin)}
                  className={cn(
                     "flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5",
                     showMargin ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100" : "bg-slate-900 text-white border-slate-900"
                  )}
               >
                  <TrendingUp className="w-3 h-3" /> Margin
               </button>
               <select 
                  value={ledgerAccount}
                  onChange={(e) => setLedgerAccount(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 text-[8px] font-black text-slate-700 py-2 px-1 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none rounded-lg uppercase tracking-tight"
               >
                  {ledgerAccounts.map(lac => (
                     <option key={lac.id} value={lac.id}>{lac.name}</option>
                  ))}
               </select>
            </div>

            <div className="space-y-1 text-right">
               <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-600">₹{subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  <span>GST (18%)</span>
                  <span className="font-black text-slate-600">₹{gst.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Total Bill</span>
                  <span className="text-xl font-black text-primary italic tracking-tighter">₹{total.toLocaleString()}</span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
               <button 
                 onClick={() => setPaymentMethod('CASH')}
                 className={cn(
                   "flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all",
                   paymentMethod === 'CASH' ? "bg-primary/5 border-primary/20 text-primary" : "bg-slate-50 border-slate-100 text-slate-400"
                 )}
               >
                  <Banknote className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase">Cash</span>
               </button>
               <button 
                 onClick={() => setPaymentMethod('UPI')}
                 className={cn(
                   "flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all",
                   paymentMethod === 'UPI' ? "bg-primary/5 border-primary/20 text-primary" : "bg-slate-50 border-slate-100 text-slate-400"
                 )}
               >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase">UPI</span>
               </button>
               <button 
                 onClick={() => setPaymentMethod('CARD')}
                 className={cn(
                   "flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all",
                   paymentMethod === 'CARD' ? "bg-primary/5 border-primary/20 text-primary" : "bg-slate-50 border-slate-100 text-slate-400"
                 )}
               >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase">Card</span>
               </button>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
              className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
               {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Zap className="w-3.5 h-3.5 text-white fill-white" /> Complete</>}
            </button>
         </div>
      </div>

    </div>
  );
};
