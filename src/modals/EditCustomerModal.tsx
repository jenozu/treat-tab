import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EditCustomerModal() {
  const { customers, editingCustomerId, setEditingCustomerId, handleSaveCustomerEdit, handleDeleteCustomer } = useApp();

  const customer = customers.find(c => c.id === editingCustomerId);

  const [editCustName, setEditCustName] = useState(customer?.name || '');
  const [editCustDiscount, setEditCustDiscount] = useState(customer?.discount.toString() || '0');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (customer) {
      setEditCustName(customer.name);
      setEditCustDiscount(customer.discount.toString());
      setErrors({});
      setTouched(false);
    }
  }, [editingCustomerId]);

  if (!customer) return null;

  function validate() {
    const errs: Record<string, string> = {};
    const name = editCustName.trim();
    if (!name) {
      errs.name = 'Name is required';
    } else if (name.length > 100) {
      errs.name = 'Name must be under 100 characters';
    } else if (
      customers.some(c => c.id !== editingCustomerId && c.name.trim().toLowerCase() === name.toLowerCase())
    ) {
      errs.name = 'Another customer already has this name';
    }
    const disc = parseFloat(editCustDiscount);
    if (isNaN(disc) || disc < 0 || disc > 100) errs.discount = 'Must be between 0 and 100';
    return errs;
  }

  function handleSave() {
    setTouched(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const discountNum = Math.max(0, Math.min(100, parseFloat(editCustDiscount) || 0));
    handleSaveCustomerEdit(customer.id, editCustName.trim(), discountNum);
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
            <User className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-white">Edit Customer Profile</h3>
          </div>
          <button onClick={() => setEditingCustomerId(null)} className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 space-y-4 select-none bg-[#FFD8E8]/5 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-black pl-1">Client Full Name</label>
            <input
              type="text"
              id="edit-cust-name-val"
              placeholder="e.g. Thomas Carlyle"
              className={fieldClass('name')}
              value={editCustName}
              onChange={(e) => { setEditCustName(e.target.value); if (touched) setErrors(validate()); }}
            />
            {touched && errors.name && <p className="text-[10px] text-rose-600 font-black pl-1">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-black pl-1">Savings Discount (%)</label>
            <input
              type="number"
              id="edit-cust-discount-val"
              placeholder="e.g. 10"
              min="0"
              max="100"
              className={fieldClass('discount')}
              value={editCustDiscount}
              onChange={(e) => { setEditCustDiscount(e.target.value); if (touched) setErrors(validate()); }}
            />
            {touched && errors.discount && <p className="text-[10px] text-rose-600 font-black pl-1">{errors.discount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              id="cancel-edit-cust-btn"
              onClick={() => setEditingCustomerId(null)}
              className="py-3 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-xl font-black text-xs shadow-[2.5px_2.5px_0px_#000000] active:scale-95 duration-150 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              id="save-edit-cust-btn"
              onClick={handleSave}
              className="py-3 bg-black text-white hover:bg-[#9BE9FB] hover:text-black rounded-xl font-black text-xs border-2 border-black shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>

          <button
            onClick={() => handleDeleteCustomer(customer.id)}
            className="w-full py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border-2 border-rose-200 rounded-xl font-black text-xs duration-150 transition-all cursor-pointer text-center"
          >
            Delete Customer
          </button>
        </div>
      </div>
    </div>
  );
}
