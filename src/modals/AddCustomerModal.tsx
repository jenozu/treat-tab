import { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AddCustomerModal() {
  const { customers, handleAddCustomer, setActiveModal, setActiveTab } = useApp();

  const [newCustName, setNewCustName] = useState('');
  const [newCustDiscount, setNewCustDiscount] = useState('0');
  const [newCustSuccess, setNewCustSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    const name = newCustName.trim();
    if (!name) {
      errs.name = 'Name is required';
    } else if (name.length > 100) {
      errs.name = 'Name must be under 100 characters';
    } else if (customers.some(c => c.name.trim().toLowerCase() === name.toLowerCase())) {
      errs.name = 'A customer with this name already exists';
    }
    const disc = parseFloat(newCustDiscount);
    if (isNaN(disc) || disc < 0 || disc > 100) {
      errs.discount = 'Must be between 0 and 100';
    }
    return errs;
  }

  async function handleSubmit() {
    setTouched(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const discountValue = Math.max(0, Math.min(100, parseFloat(newCustDiscount) || 0));
    await handleAddCustomer(newCustName.trim(), discountValue);
    setNewCustSuccess(`Profile saved for ${newCustName.trim()}!`);
    setTimeout(() => {
      setNewCustName('');
      setNewCustDiscount('0');
      setErrors({});
      setTouched(false);
      setNewCustSuccess(null);
      setActiveModal('none');
      setActiveTab('customers');
    }, 2000);
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
            <UserPlus className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-white">Register Customer</h3>
          </div>
          <button
            onClick={() => { setActiveModal('none'); setActiveTab('customers'); }}
            className="p-1.5 text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {newCustSuccess && (
          <div className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black animate-bounce" />
            <p>{newCustSuccess}</p>
          </div>
        )}

        <div className="p-4 space-y-4 select-none bg-[#FFD8E8]/5 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-black pl-1">Client Full Name</label>
            <input
              type="text"
              id="reg-cust-name-val"
              placeholder="e.g. Thomas Carlyle"
              className={fieldClass('name')}
              value={newCustName}
              onChange={(e) => {
                setNewCustName(e.target.value);
                if (touched) setErrors(validate());
              }}
            />
            {touched && errors.name && (
              <p className="text-[10px] text-rose-600 font-black pl-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-black pl-1">Savings Discount (%)</label>
            <input
              type="number"
              id="reg-cust-discount-val"
              placeholder="e.g. 10"
              min="0"
              max="100"
              className={fieldClass('discount')}
              value={newCustDiscount}
              onChange={(e) => {
                setNewCustDiscount(e.target.value);
                if (touched) setErrors(validate());
              }}
            />
            {touched && errors.discount && (
              <p className="text-[10px] text-rose-600 font-black pl-1">{errors.discount}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer mt-4"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
