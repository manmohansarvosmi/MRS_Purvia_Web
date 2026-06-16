import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, Zap, ArrowRight, Package, Loader2
} from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { inventoryApi } from '../../lib/api';
import { toast } from 'sonner';

export const POSSystem = () => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAllProducts();
      if (res.status === 1) setProducts(res.data);
    } catch { toast.error("Stock sync failed"); }
    finally { setLoading(false); }
  };

  const filteredProducts = useMemo(() => 
    products.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())), [search, products]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) return prev.map(item => item.productId === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: Math.random().toString(36).substr(2, 9), productId: product.id, name: product.productName, qty: 1, price: product.sellingPrice, unit: product.unit }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const gst = subtotal * 0.18;
    return { subtotal, gst, total: subtotal + gst };
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0 || !customer.name || !customer.phone) {
      toast.error('Details missing'); return;
    }
    try {
      setIsProcessing(true);
      const res = await inventoryApi.saveSale({ customerName: customer.name, customerPhone: customer.phone, items: cart.map(item => ({ product: { id: item.productId }, quantity: item.qty, unitPrice: item.price, totalPrice: item.price * item.qty })), totalAmount: totals.total, paymentStatus: 'PAID', paymentMethod: paymentMethod.toUpperCase(), isPos: true });
      if (res.status === 1) { toast.success('SUCCESS'); setCart([]); setCustomer({ name: '', phone: '' }); fetchProducts(); }
      else toast.error(res.message);
    } catch { toast.error("Checkout error"); }
    finally { setIsProcessing(false); }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden animate-fade-in" style={{ background: '#F1F5F9' }}>
      
      {/* ── Left Content ── */}
      <div className="flex-1 flex flex-col min-w-0 p-3 lg:p-4 border-r border-slate-200">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="search-bar flex-1" style={{ height: '28px' }}>
            <Search size={12} />
            <input placeholder="Scan Barcode / Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: '10.5px' }} />
          </div>
          <button className="btn-secondary h-7 px-3 text-[9px]" onClick={fetchProducts}><Zap size={10} /> SYNC</button>
        </div>

        <div className="flex-1 overflow-auto pr-1 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={20} /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
              {filteredProducts.map((p) => (
                <div key={p.id} onClick={() => addToCart(p)} className="p-2 border border-slate-200 bg-white hover:border-red-400 cursor-pointer select-none rounded-[2px] transition-all">
                  <div className="aspect-square bg-slate-50 flex items-center justify-center mb-2 rounded-[1px]"><Package size={18} className="text-slate-300" /></div>
                  <h4 style={{ fontSize: '10px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', height: 26 }} className="line-clamp-2">{p.productName}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#C8102E' }}>₹{p.sellingPrice.toLocaleString()}</p>
                    <span style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700 }}>{p.stockQuantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Checkout ── */}
      <div className="w-full lg:w-[320px] flex flex-col bg-white border-l border-slate-200 shadow-xl">
        <div className="p-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2"><ShoppingCart size={14} color="#C8102E" /><span style={{ fontSize: '11px', fontWeight: 800 }}>TERMINAL</span></div>
          <span style={{ fontSize: '8px', color: '#64748B', fontWeight: 800 }}>V2.4</span>
        </div>

        <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="erp-label">CLIENT</label><input className="erp-input h-7" value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} placeholder="Walk-in" /></div>
            <div><label className="erp-label">PHONE</label><input className="erp-input h-7" value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} placeholder="+91" /></div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-2 custom-scrollbar">
           {cart.map(item => (
             <div key={item.id} className="p-2 border border-slate-100 bg-slate-50 flex flex-col gap-1 rounded-[1px]">
               <div className="flex justify-between items-start"><h5 style={{ fontSize: '10px', fontWeight: 700, color: '#1E293B' }} className="truncate pr-4">{item.name}</h5><button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={10} /></button></div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-1"><button className="btn-ghost !p-0.5 border border-slate-200 bg-white" onClick={() => updateQty(item.id, -1)}><Minus size={9} /></button><span style={{ fontSize: '11px', fontWeight: 700, width: 20, textAlign: 'center' }}>{item.qty}</span><button className="btn-ghost !p-0.5 border border-slate-200 bg-white" onClick={() => updateQty(item.id, 1)}><Plus size={9} /></button></div>
                 <p style={{ fontSize: '11px', fontWeight: 800 }}>₹{(item.price * item.qty).toLocaleString()}</p>
               </div>
             </div>
           ))}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-100/50">
          <div className="space-y-1 mb-3">
            <div className="flex justify-between"><span className="erp-label !mb-0">SUBTOTAL</span><span style={{ fontWeight: 700 }}>₹{totals.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="erp-label !mb-0">TAX (18%)</span><span style={{ fontWeight: 700 }}>₹{totals.gst.toLocaleString()}</span></div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between items-center text-[#C8102E]"><span style={{ fontSize: '10px', fontWeight: 800 }}>TOTAL</span><span style={{ fontSize: '16px', fontWeight: 900 }}>₹{totals.total.toLocaleString()}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-1 mb-3">
             {['cash', 'upi', 'card'].map(m => (
               <button key={m} onClick={() => setPaymentMethod(m as any)} className={cn("py-1 border text-[8px] font-bold uppercase transition-all rounded-[1px]", paymentMethod === m ? "bg-red-600 border-red-600 text-white" : "bg-white border-slate-200 text-slate-400")}>{m}</button>
             ))}
          </div>

          <button className="btn-primary w-full h-9 flex justify-center items-center gap-2" onClick={handleCheckout} disabled={isProcessing || cart.length === 0} style={{ fontSize: '10.5px' }}>
            {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <><ShoppingCart size={14} /> AUTHORIZE</>}
          </button>
        </div>
      </div>

    </div>
  );
};
