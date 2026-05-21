import React, { useState } from 'react';
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
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

const products = [
  { id: '1', name: 'Solar Panel 450W', price: 12500, category: 'Panels' },
  { id: '2', name: 'Lithium Battery 100Ah', price: 35000, category: 'Storage' },
  { id: '3', name: 'Hybrid Inverter 5kVA', price: 42000, category: 'Electronics' },
  { id: '4', name: 'MC4 Connector', price: 150, category: 'Accessories' },
  { id: '5', name: 'DC Wire 4sqmm', price: 45, category: 'Accessories' },
  { id: '6', name: 'Roof Mount Kit', price: 2500, category: 'Structure' },
];

export const POSModule = () => {
  const [cart, setCart] = useState<{id: string, name: string, price: number, qty: number}[]>([]);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item));
    } else {
      setCart([...cart, {...product, qty: 1}]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden h-full">
      
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-100">
         <div className="p-6 border-b border-slate-100 bg-white flex items-center gap-4 shrink-0">
            <div className="flex-1 relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
               <input type="text" placeholder="Scan barcode or search item name..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:border-primary/20" />
            </div>
            <div className="flex items-center gap-2">
               {['All', 'Panels', 'Electronics', 'Storage'].map(cat => (
                  <button key={cat} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 hover:bg-primary/5 hover:text-primary transition-all">{cat}</button>
               ))}
            </div>
         </div>

         <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar">
            {products.map(p => (
               <button 
                 key={p.id} 
                 onClick={() => addToCart(p)}
                 className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all text-left flex flex-col justify-between group"
               >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all mb-4">
                     <Package className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{p.name}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.category}</p>
                     <p className="text-sm font-black text-primary mt-3 italic">₹{p.price.toLocaleString()}</p>
                  </div>
               </button>
            ))}
         </div>
      </div>

      {/* Cart & Checkout Area */}
      <div className="w-full md:w-[400px] bg-white flex flex-col shadow-2xl z-10">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <ShoppingCart className="w-4 h-4 text-primary" /> Current Cart
            </h3>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{cart.length} ITEMS</span>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cart is empty</p>
               </div>
            ) : (
               cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 group">
                     <div className="flex-1">
                        <h5 className="text-[11px] font-black text-slate-900 uppercase truncate">{item.name}</h5>
                        <p className="text-[10px] font-bold text-slate-400">₹{item.price.toLocaleString()} x {item.qty}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        <span className="text-xs font-black text-slate-900 w-12 text-right">₹{(item.price * item.qty).toLocaleString()}</span>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Checkout Summary */}
         <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>GST (18%)</span>
                  <span>₹{(total * 0.18).toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-sm font-black text-slate-900 uppercase">Total Payable</span>
                  <span className="text-2xl font-black text-primary italic tracking-tighter">₹{(total * 1.18).toLocaleString()}</span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
               <button className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl hover:border-primary/20 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary">
                  <Banknote className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase">Cash</span>
               </button>
               <button className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl hover:border-primary/20 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase">UPI</span>
               </button>
               <button className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl hover:border-primary/20 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase">Card</span>
               </button>
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2">
               <Zap className="w-4 h-4 text-primary fill-primary" /> Complete Transaction
            </button>
         </div>
      </div>

    </div>
  );
};
