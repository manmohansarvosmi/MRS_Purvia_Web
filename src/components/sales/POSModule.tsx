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
  Package,
  TrendingUp,
  X,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  cost: number;
  qty: number;
  margin: number;
  marginType: 'percentage' | 'amount';
}

const products = [
  { id: '1', name: 'Solar Panel 450W', price: 12500, cost: 10500, category: 'Panels' },
  { id: '2', name: 'Lithium Battery 100Ah', price: 35000, cost: 28000, category: 'Storage' },
  { id: '3', name: 'Hybrid Inverter 5kVA', price: 42000, cost: 36000, category: 'Electronics' },
  { id: '4', name: 'MC4 Connector', price: 150, cost: 80, category: 'Accessories' },
  { id: '5', name: 'DC Wire 4sqmm', price: 45, cost: 30, category: 'Accessories' },
  { id: '6', name: 'Roof Mount Kit', price: 2500, cost: 1800, category: 'Structure' },
  { id: '7', name: 'Earthing Rod', price: 1200, cost: 800, category: 'Accessories' },
  { id: '8', name: 'ACDB 1-In 1-Out', price: 4500, cost: 3200, category: 'Electronics' },
];

export const POSModule = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMargin, setShowMargin] = useState(false);
  const [ledgerAccount, setLedgerAccount] = useState('pos_cash');

  const ledgerAccounts = [
    { id: 'pos_cash', name: 'POS Cash Counter', type: 'Cash' },
    { id: 'pos_upi',  name: 'UPI / Digital Sales', type: 'Bank' },
    { id: 'main_sales', name: 'Main Sales Ledger', type: 'Sales' },
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item));
    } else {
      const margin = ((product.price - product.cost) / product.cost) * 100;
      setCart([...cart, {
        ...product, 
        qty: 1, 
        margin: Number(margin.toFixed(2)), 
        marginType: 'percentage' 
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
        const margin = item.marginType === 'percentage'
          ? ((newPrice / item.cost) - 1) * 100
          : newPrice - item.cost;
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

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden h-full text-slate-800">
      
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-100">
         <div className="p-3 border-b border-slate-100 bg-white flex items-center gap-3 shrink-0">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
               <input type="text" placeholder="Scan barcode or search..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-semibold outline-none focus:border-primary/20" />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
               {['All', 'Panels', 'Electronics', 'Storage'].map(cat => (
                  <button key={cat} className="px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 hover:bg-primary/5 hover:text-primary transition-all whitespace-nowrap">{cat}</button>
               ))}
            </div>
         </div>

          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 custom-scrollbar content-start">
            {products.map(p => (
               <button 
                 key={p.id} 
                 onClick={() => addToCart(p)}
                 className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow transition-all text-left flex flex-col justify-between group h-24"
               >
                  <div className="flex items-start justify-between">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[7px] font-black uppercase text-slate-300 group-hover:text-primary/40">Stock</span>
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black text-slate-800 uppercase leading-tight line-clamp-1">{p.name}</h4>
                     <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs font-black text-primary italic">₹{p.price.toLocaleString()}</p>
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
               <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                  <ShoppingCart className="w-8 h-8 mb-2" />
                  <p className="text-[8px] font-black uppercase tracking-widest">Empty</p>
               </div>
            ) : (
               cart.map(item => {
                 const marginPct = ((item.price - item.cost) / item.cost) * 100;
                 return (
                  <div key={item.id} className="bg-white p-2.5 border border-slate-100 rounded-lg shadow-sm hover:border-slate-200 transition-all">
                     <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                           <h5 className="text-[10px] font-black text-slate-800 uppercase truncate leading-[1]">{item.name}</h5>
                           <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Cost: ₹{item.cost.toLocaleString()}</p>
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
                  <span className="font-black text-slate-600">₹{total.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  <span>GST (18%)</span>
                  <span className="font-black text-slate-600">₹{(total * 0.18).toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Total Bill</span>
                  <span className="text-xl font-black text-primary italic tracking-tighter">₹{(total * 1.18).toLocaleString()}</span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
               <button className="flex flex-col items-center gap-1 p-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary group">
                  <Banknote className="w-3.5 h-3.5 transition-transform group-active:scale-95" />
                  <span className="text-[7px] font-black uppercase">Cash</span>
               </button>
               <button className="flex flex-col items-center gap-1 p-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary group">
                  <Smartphone className="w-3.5 h-3.5 transition-transform group-active:scale-95" />
                  <span className="text-[7px] font-black uppercase">UPI</span>
               </button>
               <button className="flex flex-col items-center gap-1 p-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary group">
                  <CreditCard className="w-3.5 h-3.5 transition-transform group-active:scale-95" />
                  <span className="text-[7px] font-black uppercase">Card</span>
               </button>
            </div>

            <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2">
               <Zap className="w-3.5 h-3.5 text-white fill-white" /> Complete
            </button>
         </div>
      </div>

    </div>
  );
};
