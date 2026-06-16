import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Zap, Package, TrendingUp, Loader2, CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { inventoryApi, accountsApi } from '@/src/lib/api';
import { toast } from 'sonner';

interface CartItem {
  id: string;
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

  // Accounting States
  const [accounts, setAccounts] = useState<any[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(''); // For Bank/Cash
  const [selectedLedgerId, setSelectedLedgerId] = useState<string>(''); // For Sales Ledger

  useEffect(() => { 
    fetchProducts();
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    try {
      const [accres, ledres] = await Promise.all([
        accountsApi.getAllAccounts(),
        accountsApi.getAllLedgers()
      ]);
      if (accres.status === 1) setAccounts(accres.data || []);
      if (ledres.status === 1) setLedgers(ledres.data || []);
    } catch (e) {
      console.error("Accounting load failed");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) setProducts(res.data);
    } catch { toast.error("Stock load failed"); }
    finally { setLoading(false); }
  };

  const filteredProducts = useMemo(() => 
    products.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))), [search, products]);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? {...item, qty: item.qty + 1} : item));
    } else {
      const price = product.sellingPrice || 0;
      const cost = product.purchasePrice || 0;
      setCart([...cart, { id: Math.random().toString(36).substr(2, 9), productId: product.id, name: product.productName, price, cost, qty: 1, margin: 0, marginType: 'percentage', unit: product.unit || 'PCS' }]);
    }
  };

  const updateQty = (id: string, delta: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const res = await inventoryApi.saveSale({ 
        customerName: "Walk-in", 
        customerPhone: "0000000000", 
        items: cart.map(item => ({ product: { id: item.productId }, quantity: item.qty, unitPrice: item.price, totalPrice: item.price * item.qty })), 
        totalAmount: total, 
        paymentStatus: 'PAID', 
        paymentMethod,
        financialAccountId: selectedAccountId ? Number(selectedAccountId) : null,
        salesLedgerId: selectedLedgerId ? Number(selectedLedgerId) : null,
        isPos: true 
      });
      if (res.status === 1) { 
        toast.success('CHECKOUT SUCCESSFUL'); 
        setCart([]); 
        setSelectedAccountId('');
        setSelectedLedgerId('');
        fetchProducts(); 
      }
    } catch { toast.error("Checkout failed"); }
    finally { setIsProcessing(false); }
  };

  const filteredAccounts = useMemo(() => {
    if (paymentMethod === 'CASH') {
      return accounts.filter(a => a.category === 'CASH_IN_HAND');
    }
    return accounts.filter(a => a.category !== 'CASH_IN_HAND');
  }, [accounts, paymentMethod]);

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full font-['Poppins'] select-none" style={{ background: '#F8FAFC' }}>
      
      {/* ── Transaction Core (Left) ── */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">
         
         {/* Top Command Bar */}
         <div className="h-[52px] px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-4 flex-1">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-900 rounded-[5px] flex items-center justify-center shadow-lg">
                    <Zap size={14} className="text-white animate-pulse" />
                 </div>
                 <div>
                    <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">POS Terminal</h2>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Direct Sales Node v1.2</p>
                 </div>
               </div>
               <div className="h-6 w-[1px] bg-slate-200 mx-2" />
               <div className="flex-1 max-w-md relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500 transition-colors" />
                  <input 
                    placeholder="SCAN BARCODE OR SEARCH PRODUCT..." 
                    className="w-full h-8 pl-10 pr-4 bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white text-[11px] font-bold text-slate-800 placeholder:text-slate-300 rounded-[5px] outline-none transition-all" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                  />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="btn-secondary h-8 px-4 text-[10px] rounded-[5px]" onClick={fetchProducts}>
                  Refresh Stock
               </button>
               <div className="h-6 w-[1px] bg-slate-200 mx-2" />
               <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">LIVE DATA</span>
               </div>
            </div>
         </div>

         {/* Product Catalog Grid */}
         <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 custom-scrollbar content-start">
            {loading ? (
              <div className="col-span-full py-32 flex flex-col items-center opacity-30">
                <Loader2 size={32} className="animate-spin mb-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Synchronizing Catalog...</p>
              </div>
            ) : filteredProducts.map(p => (
               <button 
                  key={p.id} 
                  onClick={() => addToCart(p)} 
                  className="bg-white p-2 rounded-[5px] border border-slate-100 hover:border-[#C8102E]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between h-[75px] group relative shadow-sm"
               >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-6 h-6 rounded-[3px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#C8102E] group-hover:bg-[#C8102E]/5 transition-all outline outline-1 outline-slate-100">
                      <Package size={11} />
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                       <span className="text-[9.5px] font-black text-slate-900 tracking-tight font-mono leading-none">₹{p.sellingPrice?.toLocaleString()}</span>
                       <span className={cn("text-[6.5px] font-black uppercase tracking-widest mt-1", p.stockQuantity > 0 ? "text-emerald-500" : "text-red-500")}>
                          {p.stockQuantity > 0 ? `${p.stockQuantity} IN` : 'OUT'}
                       </span>
                    </div>
                  </div>
                  
                  <div className="mt-1">
                     <h4 className="text-[9.5px] font-bold text-slate-800 uppercase leading-[1.2] line-clamp-2 group-hover:text-[#C8102E] transition-colors">{p.productName}</h4>
                     <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5 opacity-60">ID: {p.sku || p.id?.toString().slice(0, 5)}</p>
                  </div>

                  {/* Add action indicator */}
                  <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                     <div className="w-4 h-4 bg-[#C8102E] rounded-full flex items-center justify-center text-white shadow-lg">
                        <Plus size={10} strokeWidth={4} />
                     </div>
                  </div>
               </button>
            ))}
         </div>
      </div>

      {/* ── Transaction Terminal (Right) ── */}
      <div className="w-full md:w-[380px] bg-white flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.06)] z-20 overflow-hidden relative border-l border-slate-200">
         
         {/* Terminal Header */}
         <div className="h-[42px] px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 relative z-30">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 bg-[#C8102E] rounded-[2px] flex items-center justify-center">
                  <ShoppingCart size={11} className="text-white" />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  ACTIVE BASKET
               </h3>
            </div>
            <div className="flex items-center gap-2">
               <span className="bg-white/10 text-white/60 text-[8px] font-bold px-2 py-0.5 rounded-[3px] border border-white/10 tracking-widest uppercase">
                 {cart.length} SKU ENTRIES
               </span>
            </div>
         </div>

         {/* Active Basket Items Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 custom-scrollbar relative">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center space-y-4 animate-fade-in relative z-10">
                 <div className="w-16 h-16 border border-dashed border-slate-300 rounded-full flex items-center justify-center bg-white shadow-inner">
                    <ShoppingCart size={24} className="text-slate-300" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Scanner Ready</p>
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest max-w-[180px] leading-relaxed">System awaiting product selection or barcode input</p>
                 </div>
               </div>
            ) : cart.map(item => (
              <div key={item.id} className="bg-white p-2 rounded-[3px] border border-slate-200 shadow-sm relative group hover:border-[#C8102E]/30 transition-all flex flex-col gap-1.5">
                 <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                       <h5 className="text-[9.5px] font-black text-slate-800 uppercase truncate leading-none tracking-tight">{item.name}</h5>
                       <p className="text-[7.5px] font-bold text-slate-400 uppercase mt-1 font-mono tracking-tighter">@ ₹{item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-0.5 text-slate-200 hover:text-[#C8102E] transition-all">
                      <Trash2 size={11} />
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 rounded-[3px] h-[22px] overflow-hidden border border-slate-200">
                       <button onClick={() => updateQty(item.id, -1)} className="w-6 h-full flex items-center justify-center hover:bg-slate-200 text-slate-400 border-r border-slate-200"><Minus size={9} /></button>
                       <span className="text-[10px] font-bold text-slate-900 w-8 text-center font-mono">{item.qty}</span>
                       <button onClick={() => updateQty(item.id, 1)} className="w-6 h-full flex items-center justify-center hover:bg-slate-200 text-slate-400 border-l border-slate-200"><Plus size={9} /></button>
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] font-black text-slate-900 italic font-mono leading-none">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         {/* Settlement Engine */}
         <div className="p-2.5 bg-white flex flex-col gap-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] shrink-0 z-10 relative border-t border-slate-200">
            <div className="space-y-2 relative z-10 font-['Poppins']">
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center group">
                     <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Gross Transaction</span>
                     <span className="text-[10px] font-black text-slate-900 font-mono">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                     <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Tax Agg. (18%)</span>
                     <span className="text-[10px] font-black text-slate-900 font-mono">₹{Math.round(gst).toLocaleString()}</span>
                  </div>
               </div>
               
               <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-1 h-2 bg-[#C8102E] rounded-full shadow-[0_0_8px_rgba(200,16,46,0.3)]" />
                        <span className="text-[8.5px] font-black text-[#C8102E] uppercase tracking-[0.2em] leading-none">Net Payable</span>
                     </div>
                     <span className="text-[26px] font-black leading-none tracking-tighter italic font-mono text-slate-900">₹{Math.round(total).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end pt-1">
                     <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded-[2px] border border-emerald-100">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[6.5px] font-black text-emerald-600 uppercase tracking-widest leading-none">SECURE</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-3 relative z-10">
               <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'CASH', icon: <Banknote size={10} />, label: 'Cash' },
                    { id: 'UPI', icon: <Smartphone size={10} />, label: 'UPI' },
                    { id: 'CARD', icon: <CreditCard size={10} />, label: 'Card' }
                  ].map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => {
                        setPaymentMethod(m.id as any);
                        setSelectedAccountId(''); // Reset account when changing method
                      }} 
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 py-1.5 border transition-all rounded-[3px]", 
                        paymentMethod === m.id 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md active:scale-95" 
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      )}
                    >
                      {React.cloneElement(m.icon as React.ReactElement, { strokeWidth: paymentMethod === m.id ? 3 : 2 })}
                      <span className="text-[6.5px] font-black uppercase tracking-widest">{m.label}</span>
                    </button>
                  ))}
               </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1">
                     <label className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">Deposit Account*</label>
                     <select 
                        value={selectedAccountId} 
                        onChange={e => setSelectedAccountId(e.target.value)}
                        className="w-full h-7 bg-slate-50 border border-slate-200 rounded-[3px] px-1 text-[8px] font-bold text-slate-800 outline-none focus:border-primary"
                     >
                        <option value="">Select Account...</option>
                        {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                     </select>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isProcessing || cart.length === 0} 
              className={cn(
                "w-full h-9 text-white rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 relative group overflow-hidden border-b-2 border-black/20",
                cart.length === 0 ? "bg-slate-100 text-slate-300 border-none" : "bg-[#C8102E] hover:bg-[#B00E26] shadow-[0_10px_25px_rgba(200,16,46,0.1)]"
              )}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine transition-transform duration-700" />
               {isProcessing ? (
                 <Loader2 size={12} className="animate-spin" />
               ) : (
                 <>
                   <CheckCircle2 size={12} strokeWidth={3} className={cn(cart.length === 0 && "opacity-20")} /> 
                   <span>FINALIZE BILL</span>
                 </>
               )}
            </button>
            <div className="flex flex-col items-center gap-0.5 opacity-10">
               <p className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest">Helixion Kernel v4.0</p>
               <div className="w-8 h-0.5 bg-slate-400 rounded-full" />
            </div>
         </div>
      </div>
    </div>
  );
};
