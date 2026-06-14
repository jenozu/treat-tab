import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EditCustomerModal() {
  const { customers, editingCustomerId, setEditingCustomerId, handleSaveCustomerEdit, handleDeleteCustomer } = useApp();

  const customer = customers.find(c => c.id === editingCustomerId);

  const [editCustName, setEditCustName] = useState(customer?.name || '');
  const [editCustDiscount, setEditCustDiscount] = useState(customer?.discount.toString() || '0');

  useEffect(() => {
    if (customer) {
      setEditCustName(customer.name);
      setEditCustDiscount(customer.discount.toString());
    }
  }, [editingCustomerId, customer]);

  if (!customer) return null;

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
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-black pl-1">Client Full Name</label>
            <input
              type="text"
              id="edit-cust-name-val"
              placeholder="e.g. Thomas Carlyle"
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={editCustName}
              onChange={(e) => setEditCustName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-black pl-1">Savings Discount (%)</label>
            <input
              type="number"
              id="edit-cust-discount-val"
              placeholder="e.g. 10 (for 10% automatically applied at checkout)"
              min="0"
              max="100"
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={editCustDiscount}
              onChange={(e) => setEditCustDiscount(e.target.value)}
            />
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
              onClick={() => {
                const discountNum = Math.max(0, Math.min(100, parseFloat(editCustDiscount) || 0));
                handleSaveCustomerEdit(customer.id, editCustName, discountNum);
              }}
              disabled={!editCustName.trim()}
              className="py-3 bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black rounded-xl font-black text-xs border-2 border-black shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
