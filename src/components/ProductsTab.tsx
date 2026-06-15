import { useState } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductsTab() {
  const {
    products,
    handleStartEditProduct,
    handleDeleteProduct,
    handleQuickAdjustStock,
    setActiveModal,
  } = useApp();

  const [searchInventoryQuery, setSearchInventoryQuery] = useState('');
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.15s_ease-out] text-left">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <h3 className="font-extrabold text-sm text-black">Sweet stock catalog</h3>
          <p className="text-[10px] text-black/60 font-black">{products.length} registered profiles</p>
        </div>
        <button
          onClick={() => {
            setActiveModal('add-product');
          }}
          className="p-1 px-2.5 bg-[#9BE9FB] text-black rounded-lg flex items-center justify-center border-2 border-black font-black text-[10px] shadow-[1.5px_1.5px_0px_#000000] hover:bg-white active:scale-95 transition-all cursor-pointer gap-1"
          title="Add product profile"
        >
          <Plus className="w-3.5 h-3.5" /> Product
        </button>
      </div>

      <div className="mb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search treats catalog..."
            className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
            value={searchInventoryQuery}
            onChange={(e) => setSearchInventoryQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable list of products inside tab */}
      <div className="space-y-2 overflow-y-auto max-h-[480px] mb-2 pr-0.5 scrollbar-hide">
        {products
          .filter(p => p.name.toLowerCase().includes(searchInventoryQuery.toLowerCase()) || p.category.toLowerCase().includes(searchInventoryQuery.toLowerCase()))
          .map((prod) => {
            const profitMargin = Math.round(((prod.price - prod.cost) / prod.price) * 100);
            const outOfStock = prod.stock === 0;
            return (
              <div key={prod.id} className="p-2 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-between gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border-2 border-black shadow-[1px_1px_0px_#000000] shrink-0 ${
                    prod.category === 'Candy' ? 'bg-[#FFD8E8] text-black' : 'bg-[#9BE9FB] text-black'
                  }`}>
                    {prod.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-[11px] text-black truncate">{prod.name}</p>
                    <p className="text-[9px] text-black/70 font-semibold mt-0.5">
                      Cost: <span>${prod.cost.toFixed(2)}</span> • Price: <span className="font-black text-black">${prod.price.toFixed(2)}</span>
                    </p>
                    <span className="text-[8px] uppercase font-black text-black bg-[#9BE9FB]/60 border border-black px-1 py-0.2 rounded mt-0.5 inline-block shadow-[0.5px_0.5px_0px_#000000]">
                      {prod.category} • {profitMargin}% margin
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {confirmDeleteProductId === prod.id ? (
                        <>
                          <button
                            onClick={() => setConfirmDeleteProductId(null)}
                            className="text-[8px] font-black text-black bg-white border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            id={`delete-prod-btn-${prod.id}`}
                            onClick={() => {
                              handleDeleteProduct(prod.id);
                              setConfirmDeleteProductId(null);
                            }}
                            className="text-[8px] font-black text-white bg-rose-600 border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-rose-700 transition-all cursor-pointer animate-pulse"
                          >
                            Confirm?
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id={`edit-prod-btn-${prod.id}`}
                            onClick={() => handleStartEditProduct(prod)}
                            className="text-[8px] font-extrabold text-blue-700 bg-blue-50 border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-white active:scale-95 transition-all flex items-center gap-0.5 cursor-pointer"
                          >
                            Edit Product
                          </button>
                          <button
                            id={`delete-prod-btn-${prod.id}`}
                            onClick={() => setConfirmDeleteProductId(prod.id)}
                            className="text-[8px] font-extrabold text-rose-700 bg-rose-50 border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-white active:scale-95 transition-all flex items-center gap-0.5 cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adjust Stock Panel */}
                <div className="text-right shrink-0 ml-1">
                  <p className={`font-numeral-lg text-[10px] font-black ${outOfStock ? 'text-rose-600 bg-rose-50 px-1 border border-rose-300 rounded' : 'text-black'}`}>
                    {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units`}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <button
                      onClick={() => handleQuickAdjustStock(prod.id, Math.max(0, prod.stock - 1))}
                      className="p-1 hover:bg-[#FFD8E8] hover:text-black hover:border-black text-rose-600 border border-slate-300 bg-white rounded-full transition-all cursor-pointer"
                      title="Decrease count"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => handleQuickAdjustStock(prod.id, prod.stock + 1)}
                      className="p-1 hover:bg-[#9BE9FB] hover:text-black hover:border-black text-emerald-600 border border-slate-300 bg-white rounded-full transition-all cursor-pointer"
                      title="Increase count"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
