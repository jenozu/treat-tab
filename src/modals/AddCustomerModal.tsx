import { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AddCustomerModal() {
  const { handleAddCustomer, setActiveModal, setActiveTab } = useApp();

  const [newCustName, setNewCustName] = useState('');
  const [newCustDiscount, setNewCustDiscount] = useState('0');
  const [newCustSuccess, setNewCustSuccess] = useState<string | null>(null);

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

        <div className="p-4 space-y-4 select-none bg-[#FFD8E8]/5 pb-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-black pl-1">Client Full Name</label>
            <input
              type="text"
              id="reg-cust-name-val"
              placeholder="e.g. Thomas Carlyle"
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-black pl-1">Savings Discount (%)</label>
            <input
              type="number"
              id="reg-cust-discount-val"
              placeholder="e.g. 10 (for 10% automatically applied at checkout)"
              min="0"
              max="100"
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={newCustDiscount}
              onChange={(e) => setNewCustDiscount(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              const discountValue = Math.max(0, Math.min(100, parseFloat(newCustDiscount) || 0));
              handleAddCustomer(newCustName, discountValue).then(() => {
                setNewCustSuccess(`Profile saved for ${newCustName}!`);
                setTimeout(() => {
                  setNewCustName('');
                  setNewCustDiscount('0');
                  setActiveModal('none');
                  setActiveTab('customers');
                }, 2000);
              });
            }}
            disabled={!newCustName.trim()}
            className="w-full bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer mt-4"
          >
            Save Profile Base
          </button>
        </div>
      </div>
    </div>
  );
}
