import { useState } from 'react';
import { X, Cookie, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export default function AddProductModal() {
  const { handleAddProduct, setActiveModal, setActiveTab } = useApp();

  const [newProdName, setNewProdName] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Candy');
  const [newProdStock, setNewProdStock] = useState('0');
  const [newProdSuccess, setNewProdSuccess] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-white">Register Sweet Product</h3>
          </div>
          <button
            onClick={() => { setActiveModal('none'); setActiveTab('products'); }}
            className="p-1.5 text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {newProdSuccess && (
          <div className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-black" />
            <p>{newProdSuccess}</p>
          </div>
        )}

        <div className="p-4 space-y-4 select-none bg-[#9BE9FB]/5 pb-6 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-black pl-1">Sweet Name</label>
            <input
              type="text"
              id="reg-prod-name-val"
              placeholder="e.g. Candy Belt"
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Cost Price ($)</label>
              <input
                type="number"
                id="reg-prod-cost-val"
                step="0.01"
                placeholder="e.g. 1.10"
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={newProdCost}
                onChange={(e) => setNewProdCost(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Selling Price ($)</label>
              <input
                type="number"
                id="reg-prod-price-val"
                step="0.01"
                placeholder="e.g. 2.50"
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Category</label>
              <select
                id="reg-prod-category-val"
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value as Product['category'])}
              >
                <option value="Candy">Candy</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Cookies">Cookies</option>
                <option value="Cakes">Cakes</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Stock Quantity</label>
              <input
                type="number"
                id="reg-prod-stock-val"
                placeholder="e.g. 20"
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={newProdStock}
                onChange={(e) => setNewProdStock(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={() => {
              const costVal = Math.max(0, parseFloat(newProdCost) || 0);
              const priceVal = Math.max(0, parseFloat(newProdPrice) || 0);
              const stockVal = Math.max(0, parseInt(newProdStock) || 0);
              handleAddProduct(newProdName, costVal, priceVal, newProdCategory, stockVal).then(() => {
                setNewProdSuccess(`Product saved for ${newProdName}!`);
                setTimeout(() => {
                  setNewProdName('');
                  setNewProdCost('');
                  setNewProdPrice('');
                  setNewProdCategory('Candy');
                  setNewProdStock('0');
                  setActiveModal('none');
                  setActiveTab('products');
                }, 2000);
              });
            }}
            disabled={!newProdName.trim()}
            className="w-full bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer mt-4"
          >
            Save Sweet Product
          </button>
        </div>
      </div>
    </div>
  );
}
