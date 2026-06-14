import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export default function EditProductModal() {
  const { products, editingProductId, setEditingProductId, handleSaveProductEdit, handleDeleteProduct } = useApp();

  const product = products.find(p => p.id === editingProductId);

  const [editProdName, setEditProdName] = useState(product?.name || '');
  const [editProdCost, setEditProdCost] = useState(product?.cost.toString() || '');
  const [editProdPrice, setEditProdPrice] = useState(product?.price.toString() || '');
  const [editProdCategory, setEditProdCategory] = useState<Product['category']>(product?.category || 'Candy');
  const [editProdStock, setEditProdStock] = useState(product?.stock.toString() || '0');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (product) {
      setEditProdName(product.name);
      setEditProdCost(product.cost.toString());
      setEditProdPrice(product.price.toString());
      setEditProdCategory(product.category);
      setEditProdStock(product.stock.toString());
      setErrors({});
      setTouched(false);
    }
  }, [editingProductId]);

  if (!product) return null;

  function validate() {
    const errs: Record<string, string> = {};
    const name = editProdName.trim();
    if (!name) {
      errs.name = 'Product name is required';
    } else if (name.length > 100) {
      errs.name = 'Name must be under 100 characters';
    } else if (products.some(p => p.id !== editingProductId && p.name.trim().toLowerCase() === name.toLowerCase())) {
      errs.name = 'Another product already has this name';
    }
    const cost = parseFloat(editProdCost);
    if (isNaN(cost) || cost < 0) errs.cost = 'Must be 0 or more';
    const price = parseFloat(editProdPrice);
    if (isNaN(price) || price <= 0) errs.price = 'Must be greater than 0';
    const stock = parseInt(editProdStock);
    if (isNaN(stock) || stock < 0) errs.stock = 'Must be 0 or more';
    return errs;
  }

  function handleSave() {
    setTouched(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const costNum = Math.max(0, parseFloat(editProdCost) || 0);
    const priceNum = Math.max(0, parseFloat(editProdPrice) || 0);
    const stockNum = Math.max(0, parseInt(editProdStock) || 0);
    handleSaveProductEdit(product.id, editProdName.trim(), costNum, priceNum, editProdCategory, stockNum);
  }

  const fieldClass = (field: string) =>
    `w-full bg-white border-2 rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000] ${
      touched && errors[field] ? 'border-rose-500' : 'border-black'
    }`;

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-white">Edit Sweet Product</h3>
          </div>
          <button onClick={() => setEditingProductId(null)} className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 space-y-4 select-none bg-[#9BE9FB]/5 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-black pl-1">Sweet Name</label>
            <input
              type="text"
              id="edit-prod-name-val"
              placeholder="e.g. Candy Belt"
              className={fieldClass('name')}
              value={editProdName}
              onChange={(e) => { setEditProdName(e.target.value); if (touched) setErrors(validate()); }}
            />
            {touched && errors.name && <p className="text-[10px] text-rose-600 font-black pl-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-black pl-1">Cost Price ($)</label>
              <input
                type="number"
                id="edit-prod-cost-val"
                step="0.01"
                placeholder="e.g. 1.10"
                className={fieldClass('cost')}
                value={editProdCost}
                onChange={(e) => { setEditProdCost(e.target.value); if (touched) setErrors(validate()); }}
              />
              {touched && errors.cost && <p className="text-[10px] text-rose-600 font-black pl-1">{errors.cost}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-black pl-1">Selling Price ($)</label>
              <input
                type="number"
                id="edit-prod-price-val"
                step="0.01"
                placeholder="e.g. 2.50"
                className={fieldClass('price')}
                value={editProdPrice}
                onChange={(e) => { setEditProdPrice(e.target.value); if (touched) setErrors(validate()); }}
              />
              {touched && errors.price && <p className="text-[10px] text-rose-600 font-black pl-1">{errors.price}</p>}
            </div>
          </div>

          {/* Warn when selling at a loss */}
          {!errors.cost && !errors.price && editProdCost && editProdPrice &&
            parseFloat(editProdPrice) > 0 && parseFloat(editProdCost) >= parseFloat(editProdPrice) && (
            <p className="text-[10px] text-amber-700 font-black bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Cost ≥ selling price — you would sell at a loss.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-black pl-1">Category</label>
              <select
                id="edit-prod-category-val"
                className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={editProdCategory}
                onChange={(e) => setEditProdCategory(e.target.value as Product['category'])}
              >
                <option value="Candy">Candy</option>
                <option value="Cookies">Cookies</option>
                <option value="Cakes">Cakes</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-black pl-1">Stock Count</label>
              <input
                type="number"
                id="edit-prod-stock-val"
                placeholder="e.g. 30"
                className={fieldClass('stock')}
                value={editProdStock}
                onChange={(e) => { setEditProdStock(e.target.value); if (touched) setErrors(validate()); }}
              />
              {touched && errors.stock && <p className="text-[10px] text-rose-600 font-black pl-1">{errors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              id="cancel-edit-prod-btn"
              onClick={() => setEditingProductId(null)}
              className="py-3 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-xl font-black text-xs shadow-[2.5px_2.5px_0px_#000000] active:scale-95 duration-150 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              id="save-edit-prod-btn"
              onClick={handleSave}
              className="py-3 bg-black text-white hover:bg-[#9BE9FB] hover:text-black rounded-xl font-black text-xs border-2 border-black shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>

          <button
            onClick={() => handleDeleteProduct(product.id)}
            className="w-full py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border-2 border-rose-200 rounded-xl font-black text-xs duration-150 transition-all cursor-pointer text-center"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
