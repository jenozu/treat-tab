import { useState } from 'react';
import { X, Cookie, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { validateProductName, validateCost, validatePrice, validateStock } from '../utils/validation';
import { Product } from '../types';

export default function AddProductModal() {
  const { products, handleAddProduct, setActiveModal, setActiveTab } = useApp();
  const close = () => { setActiveModal('none'); setActiveTab('products'); };
  useEscapeKey(close);

  const [newProdName, setNewProdName] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Candy');
  const [newProdStock, setNewProdStock] = useState('0');
  const [newProdSuccess, setNewProdSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    const nameErr = validateProductName(newProdName, products);
    if (nameErr) errs.name = nameErr;
    const costErr = validateCost(newProdCost);
    if (costErr) errs.cost = costErr;
    const priceErr = validatePrice(newProdPrice);
    if (priceErr) errs.price = priceErr;
    const stockErr = validateStock(newProdStock);
    if (stockErr) errs.stock = stockErr;
    return errs;
  }

  async function handleSubmit() {
    setTouched(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const costVal = Math.max(0, parseFloat(newProdCost) || 0);
    const priceVal = Math.max(0, parseFloat(newProdPrice) || 0);
    const stockVal = Math.max(0, parseInt(newProdStock) || 0);
    await handleAddProduct(newProdName.trim(), costVal, priceVal, newProdCategory, stockVal);
    setNewProdSuccess(`"${newProdName.trim()}" added to catalog!`);
    setTimeout(() => {
      setNewProdName('');
      setNewProdCost('');
      setNewProdPrice('');
      setNewProdCategory('Candy');
      setNewProdStock('0');
      setErrors({});
      setTouched(false);
      setNewProdSuccess(null);
      setActiveModal('none');
      setActiveTab('products');
    }, 2000);
  }

  const fieldClass = (field: string) =>
    `w-full bg-white border-2 rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000] ${
      touched && errors[field] ? 'border-rose-500' : 'border-black'
    }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-prod-title"
      className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]"
    >
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#9BE9FB]" />
            <h3 id="add-prod-title" className="font-extrabold text-md text-white">Register Sweet Product</h3>
          </div>
          <button onClick={close} aria-label="Close" className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        {newProdSuccess && (
          <div role="status" aria-live="polite" className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black animate-bounce" />
            <p>{newProdSuccess}</p>
          </div>
        )}

        <div className="p-4 space-y-4 select-none bg-[#9BE9FB]/5 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <label htmlFor="reg-prod-name-val" className="text-[11px] font-black uppercase text-black pl-1">Sweet Name</label>
            <input
              type="text"
              id="reg-prod-name-val"
              autoFocus
              placeholder="e.g. Candy Belt"
              className={fieldClass('name')}
              value={newProdName}
              onChange={(e) => { setNewProdName(e.target.value); if (touched) setErrors(validate()); }}
              aria-describedby={touched && errors.name ? 'reg-prod-name-err' : undefined}
              aria-invalid={touched && !!errors.name}
            />
            {touched && errors.name && <p id="reg-prod-name-err" role="alert" className="text-[10px] text-rose-600 font-black pl-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="reg-prod-cost-val" className="text-[11px] font-black uppercase text-black pl-1">Cost Price ($)</label>
              <input
                type="number"
                id="reg-prod-cost-val"
                step="0.01"
                placeholder="e.g. 1.10"
                className={fieldClass('cost')}
                value={newProdCost}
                onChange={(e) => { setNewProdCost(e.target.value); if (touched) setErrors(validate()); }}
                aria-invalid={touched && !!errors.cost}
              />
              {touched && errors.cost && <p role="alert" className="text-[10px] text-rose-600 font-black pl-1">{errors.cost}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="reg-prod-price-val" className="text-[11px] font-black uppercase text-black pl-1">Selling Price ($)</label>
              <input
                type="number"
                id="reg-prod-price-val"
                step="0.01"
                placeholder="e.g. 2.50"
                className={fieldClass('price')}
                value={newProdPrice}
                onChange={(e) => { setNewProdPrice(e.target.value); if (touched) setErrors(validate()); }}
                aria-invalid={touched && !!errors.price}
              />
              {touched && errors.price && <p role="alert" className="text-[10px] text-rose-600 font-black pl-1">{errors.price}</p>}
            </div>
          </div>

          {!errors.cost && !errors.price && newProdCost && newProdPrice &&
            parseFloat(newProdPrice) > 0 && parseFloat(newProdCost) >= parseFloat(newProdPrice) && (
            <p role="alert" className="text-[10px] text-amber-700 font-black bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Cost ≥ selling price — you would sell at a loss.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="reg-prod-category-val" className="text-[11px] font-black uppercase text-black pl-1">Category</label>
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
            <div className="space-y-1">
              <label htmlFor="reg-prod-stock-val" className="text-[11px] font-black uppercase text-black pl-1">Stock Quantity</label>
              <input
                type="number"
                id="reg-prod-stock-val"
                placeholder="e.g. 20"
                className={fieldClass('stock')}
                value={newProdStock}
                onChange={(e) => { setNewProdStock(e.target.value); if (touched) setErrors(validate()); }}
                aria-invalid={touched && !!errors.stock}
              />
              {touched && errors.stock && <p role="alert" className="text-[10px] text-rose-600 font-black pl-1">{errors.stock}</p>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer mt-4"
          >
            Save Sweet Product
          </button>
        </div>
      </div>
    </div>
  );
}
