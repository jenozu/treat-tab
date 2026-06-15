import { useState } from 'react';
import { X, ShoppingBag, Search, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AddSaleModal() {
  const { customers, products, handleRecordSale, setActiveModal } = useApp();

  const [saleCustomerId, setSaleCustomerId] = useState('');
  const [saleCart, setSaleCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [saleIsTab, setSaleIsTab] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');

  const selectedCustomer = customers.find(c => c.id === saleCustomerId);
  const saleCustomerDiscount = selectedCustomer ? selectedCustomer.discount : 0;
  const originalSubtotal = saleCart.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);
  const saleDiscountAmount = originalSubtotal * (saleCustomerDiscount / 100);
  const saleSubtotal = Math.max(0, originalSubtotal - saleDiscountAmount);

  const handleCartAdd = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod || prod.stock <= 0) return;
    setSaleCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        if (existing.quantity >= prod.stock) return prev;
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleCartDelta = (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setSaleCart(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > prod.stock) return item;
          return { ...item, quantity: nextQty };
        }
        return item;
      }).filter(Boolean) as { productId: string; quantity: number }[]
    );
  };

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black h-[94%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white flex justify-between items-center shrink-0 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-white">Record Sweet Purchase</h3>
          </div>
          <button onClick={() => setActiveModal('none')} className="p-1.5 hover:bg-white/10 text-white rounded-full">
            <X className="w-6 h-6" />
          </button>
        </header>

        {saleSuccess && (
          <div className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4 text-black animate-bounce" />
            <p>{saleSuccess}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5">
          {/* Product Search Catalog Select */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-black pl-1">Choose Candies/Cookies</label>
            <div className="relative">
              <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter treats catalog..."
                className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2 text-xs text-black focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-3 overflow-x-auto py-2.5 scrollbar-hide">
              {products
                .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                .map((prod) => {
                  const inCartCount = saleCart.find(i => i.productId === prod.id)?.quantity || 0;
                  const outOfStock = prod.stock === 0;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => !outOfStock && handleCartAdd(prod.id)}
                      className={`p-2.5 rounded-xl border-2 shrink-0 w-[125px] flex flex-col justify-between h-[105px] transition-all select-none cursor-pointer ${
                        outOfStock
                          ? 'bg-[#f1f1f1] border-slate-300 cursor-not-allowed opacity-55 shadow-none'
                          : inCartCount > 0
                            ? 'border-black bg-[#FFD8E8] shadow-[2px_2px_0px_#000000] translate-y-[1px]'
                            : 'border-black bg-white hover:border-black hover:shadow-[3px_3px_0px_#000000] hover:-translate-y-[1.5px] shadow-[2.5px_2.5px_0px_#000000]'
                      }`}
                    >
                      <div className="line-clamp-2 text-[11px] font-black text-black leading-tight">{prod.name}</div>
                      <div className="flex justify-between items-baseline mt-1.5">
                        <span className="text-black font-black font-numeral-lg text-xs">${prod.price.toFixed(2)}</span>
                        {inCartCount > 0 ? (
                          <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000000]">{inCartCount}x</span>
                        ) : (
                          <span className="text-[9px] text-black font-black bg-[#9BE9FB] px-1.5 py-0.5 rounded-md border border-black shadow-[0.8px_0.8px_0px_#000000]">+{prod.stock}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ACTIVE Checkout list */}
          {saleCart.length > 0 && (
            <div className="space-y-2 bg-[#9BE9FB]/10 p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
              <p className="text-[10px] font-black text-black uppercase">Active checkout snacks list</p>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {saleCart.map(item => {
                  const prod = products.find(p => p.id === item.productId)!;
                  return (
                    <div key={item.productId} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
                      <span className="font-extrabold text-black line-clamp-1 flex-1 pr-2">{prod.name}</span>
                      <div className="flex items-center gap-2.5 mr-3 shrink-0">
                        <button type="button" onClick={() => handleCartDelta(item.productId, -1)} className="bg-white border border-black w-5.5 h-5.5 rounded-full flex items-center justify-center text-rose-600 font-extrabold hover:bg-[#FFD8E8] transition-all cursor-pointer shadow-[1px_1px_0px_#000000]">-</button>
                        <span className="font-black text-black min-w-[14px] text-center">{item.quantity}</span>
                        <button type="button" onClick={() => handleCartDelta(item.productId, 1)} className="bg-white border border-black w-5.5 h-5.5 rounded-full flex items-center justify-center text-emerald-600 font-extrabold hover:bg-[#9BE9FB] transition-all cursor-pointer shadow-[1px_1px_0px_#000000]">+</button>
                      </div>
                      <span className="font-black text-black min-w-[50px] text-right">${(prod.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specify Customer state */}
          <div className="space-y-2 select-none">
            <label className="text-[11px] font-black uppercase text-black pl-1">Assign Client tab</label>
            <select
              id="add-sale-customer-select"
              className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-black shadow-[2.5px_2.5px_0px_#000000]"
              value={saleCustomerId}
              onChange={(e) => {
                setSaleCustomerId(e.target.value);
                if (!e.target.value) setSaleIsTab(false);
              }}
            >
              <option value="" disabled>-- Choose Customer (Required) --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.discount > 0 ? `(${c.discount}% discount)` : ''} {c.outstandingBalance > 0 ? `• owes $${c.outstandingBalance.toFixed(2)}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Term status */}
          {saleCustomerId && (
            <div className="space-y-2 select-none">
              <label className="text-[11px] font-black uppercase text-black pl-1">Settlement terms</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSaleIsTab(false)}
                  className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${!saleIsTab ? 'bg-[#9BE9FB] text-black border-black' : 'bg-white border-black hover:bg-slate-50'}`}
                >
                  Paid immediately
                </button>
                <button
                  type="button"
                  onClick={() => setSaleIsTab(true)}
                  className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${saleIsTab ? 'bg-[#FFD8E8] text-black border-black' : 'bg-white border-black hover:bg-slate-50'}`}
                >
                  Record as pending tab
                </button>
              </div>
            </div>
          )}

          {/* Subtotal preview card */}
          {saleCart.length > 0 && (
            <div className="space-y-2 select-none">
              {saleCustomerDiscount > 0 ? (
                <div className="p-3 bg-white rounded-xl border-2 border-black border-dashed flex flex-col gap-1 text-[11px] font-black text-black">
                  <div className="flex justify-between text-black/60">
                    <span>Basket Sum:</span>
                    <span className="font-numeral-sm">${originalSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>{selectedCustomer?.name} Savings ({saleCustomerDiscount}%):</span>
                    <span className="font-numeral-sm">-${saleDiscountAmount.toFixed(2)}</span>
                  </div>
                </div>
              ) : null}
              <div className="p-3.5 bg-white rounded-xl border-2 border-black flex justify-between items-center shadow-[3.5px_3.5px_0px_#000000]">
                <span className="font-extrabold text-xs text-black/60 uppercase">Checkout total amount</span>
                <span id="add-sale-total-preview" className="font-black text-lg text-black font-numeral-lg">${saleSubtotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Checkout buttons */}
        {saleCart.length > 0 && (
          <footer className="p-4 bg-white border-t-2 border-black shrink-0">
            <button
              disabled={!saleCustomerId}
              onClick={() => {
                if (!saleCustomerId) return;
                handleRecordSale(saleCustomerId, saleCart, saleSubtotal, saleIsTab);
                setSaleSuccess(`Purchase registered!`);
                setSaleCart([]);
                setSaleCustomerId('');
                setSaleIsTab(false);
                setTimeout(() => {
                  setSaleSuccess(null);
                  setActiveModal('none');
                }, 2000);
              }}
              className={`w-full border-2 border-black py-4 rounded-xl font-black text-sm duration-150 transition-all ${
                !saleCustomerId
                  ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-black text-white hover:bg-[#9BE9FB] hover:text-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] cursor-pointer'
              }`}
            >
              {!saleCustomerId ? 'Please select a Customer' : `Confirm register - $${saleSubtotal.toFixed(2)}`}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
