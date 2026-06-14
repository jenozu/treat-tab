import { useState } from 'react';
import { X, Search, Bell, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

const getDiscountStyle = (discount: number) => {
  if (discount >= 20) return 'bg-purple-100 text-purple-900 border border-purple-200';
  if (discount >= 10) return 'bg-amber-100 text-amber-900 border border-amber-200';
  if (discount > 0) return 'bg-cyan-100 text-cyan-900 border border-cyan-200';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
};

export default function OutstandingBalancesModal() {
  const { customers, openPaymentModal, triggerBuzzReminder, setActiveModal } = useApp();
  const [searchOutstandingQuery, setSearchOutstandingQuery] = useState('');

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-extrabold text-md text-[#FFFFFF]">Outstanding Balances</h3>
            <p className="text-xs text-[#9BE9FB] font-bold">{customers.filter(c => c.outstandingBalance > 0).length} accounts with pending tabs</p>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-white hover:bg-white/10 rounded-full active:scale-90 transition-transform"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 border-b-2 border-black bg-[#FFD8E8]/10 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search debtor name/group..."
              className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
              value={searchOutstandingQuery}
              onChange={(e) => setSearchOutstandingQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFD8E8]/5">
          {customers
            .filter(c => c.outstandingBalance > 0)
            .filter(c => c.name.toLowerCase().includes(searchOutstandingQuery.toLowerCase()))
            .length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-black/60 font-bold">No outstanding balances matching search.</p>
              </div>
            ) : (
              customers
                .filter(c => c.outstandingBalance > 0)
                .filter(c => c.name.toLowerCase().includes(searchOutstandingQuery.toLowerCase()))
                .map((cust) => (
                  <div key={cust.id} className="p-3 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img alt={cust.name} className="w-10 h-10 rounded-full object-cover border-2 border-black" src={cust.avatar} />
                      <div>
                        <p className="font-black text-xs text-black">{cust.name}</p>
                        <span className={`text-[9px] font-black px-2 py-0.5 mt-1 inline-block rounded ${getDiscountStyle(cust.discount)}`}>
                          {cust.discount > 0 ? `${cust.discount}% off` : 'Standard rate'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3.5">
                      <div>
                        <p className="font-black text-sm text-red-600 font-numeral-lg">${cust.outstandingBalance.toFixed(2)}</p>
                        <p className="text-[9px] text-black/60 font-bold">Pending tab</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Buzz button */}
                        <button
                          onClick={() => triggerBuzzReminder(cust.name)}
                          className="p-2.5 bg-[#9BE9FB] rounded-xl text-black border-2 border-black hover:bg-white active:scale-95 shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer"
                          title="Buzz customer code reminder"
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        {/* Log Payment button */}
                        <button
                          onClick={() => {
                            openPaymentModal(cust.id, cust.outstandingBalance.toString());
                          }}
                          className="p-2.5 bg-[#FFD8E8] rounded-xl text-black border-2 border-black hover:bg-white active:scale-95 shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer"
                          title="Log immediate tab payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
