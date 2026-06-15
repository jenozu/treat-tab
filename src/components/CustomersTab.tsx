import { useState } from 'react';
import { Search, UserPlus, ArrowLeft, ChevronRight, Pencil, Trash2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const getDiscountStyle = (discount: number) => {
  if (discount >= 20) return 'bg-purple-100 text-purple-900 border border-purple-200';
  if (discount >= 10) return 'bg-amber-100 text-amber-900 border border-amber-200';
  if (discount > 0) return 'bg-cyan-100 text-cyan-900 border border-cyan-200';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
};

export default function CustomersTab() {
  const {
    customers,
    sales,
    payments,
    handleStartEditCustomer,
    handleDeleteCustomer,
    openPaymentModal,
    setActiveModal,
  } = useApp();

  const [searchCustomerQuery, setSearchCustomerQuery] = useState('');
  const [viewedCustomerHistoryId, setViewedCustomerHistoryId] = useState<string | null>(null);
  const [confirmDeleteCustomerId, setConfirmDeleteCustomerId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.15s_ease-out] text-left">
      {viewedCustomerHistoryId ? (
        // Single Customer Ledger History View
        <div className="flex flex-col h-full text-left">
          {(() => {
            const targetClient = customers.find(c => c.id === viewedCustomerHistoryId);
            if (!targetClient) return null;
            const clientSales = sales.filter(s => s.customerId === viewedCustomerHistoryId);
            const clientPayments = payments.filter(p => p.customerId === viewedCustomerHistoryId);

            return (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2 bg-[#9BE9FB]/5 p-2 rounded-xl border border-black/20 shrink-0">
                  <button
                    onClick={() => setViewedCustomerHistoryId(null)}
                    className="p-1 px-2.5 bg-[#9BE9FB] border-2 border-black hover:bg-white rounded-lg text-black font-black text-xs shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" /> Back
                  </button>
                  <img alt={targetClient.name} className="w-8 h-8 rounded-full object-cover border-2 border-black ml-1" src={targetClient.avatar} />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-[11px] text-black truncate">{targetClient.name}</h4>
                    <p className="text-[9px] text-emerald-600 font-extrabold truncate">Store Discount: {targetClient.discount}% savings</p>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-2.5 shrink-0">
                  {confirmDeleteCustomerId === targetClient.id ? (
                    <>
                      <button
                        onClick={() => setConfirmDeleteCustomerId(null)}
                        className="py-1.5 px-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg text-black font-black text-[10px] shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        Cancel
                      </button>
                      <button
                        id={`delete-customer-${targetClient.id}`}
                        onClick={() => {
                          handleDeleteCustomer(targetClient.id);
                          setConfirmDeleteCustomerId(null);
                          setViewedCustomerHistoryId(null);
                        }}
                        className="py-1.5 px-2 bg-rose-600 hover:bg-rose-700 border-2 border-black text-white font-black text-[10px] shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1 animate-pulse"
                      >
                        Confirm Delete!
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        id={`edit-customer-${targetClient.id}`}
                        onClick={() => handleStartEditCustomer(targetClient)}
                        className="py-1.5 px-2 bg-white hover:bg-[#9BE9FB] border-2 border-black rounded-lg text-black font-black text-[10px] shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer flex items-center justify-center gap-1 hover:text-black"
                      >
                        Edit Profile
                      </button>
                      <button
                        id={`delete-customer-${targetClient.id}`}
                        onClick={() => setConfirmDeleteCustomerId(targetClient.id)}
                        className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 border-2 border-rose-600 rounded-lg text-rose-700 font-black text-[10px] shadow-[1.5px_1.5px_0px_#cc0000] transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        Delete Client
                      </button>
                    </>
                  )}
                </div>

                {/* Summary ledger stat block */}
                <div className="grid grid-cols-2 gap-2.5 mb-3 shrink-0">
                  <div className="bg-white p-2 rounded-xl border-2 border-black text-center shadow-[2px_2px_0px_#000000]">
                    <span className="text-[9px] tracking-tight uppercase font-bold text-black/60">Total Spent</span>
                    <p className="font-black text-xs text-[#000000] font-numeral-lg">${targetClient.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border-2 border-black text-center shadow-[2px_2px_0px_#000000]">
                    <span className="text-[9px] tracking-tight uppercase font-bold text-black/60">Current Tab</span>
                    <p className="font-black text-xs text-red-600 font-numeral-lg">${targetClient.outstandingBalance.toFixed(2)}</p>
                  </div>
                </div>

                {/* Transaction List scroll */}
                <div className="space-y-1.5 overflow-y-auto max-h-[340px] pr-0.5 scrollbar-hide">
                  <p className="text-[9px] uppercase font-black text-black pl-0.5 mb-1">Ledger balance details</p>
                  {clientSales.length === 0 && clientPayments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-black/60 font-bold">No ledger entries registered.</p>
                    </div>
                  ) : (
                    [
                      ...clientSales.map(sold => ({
                        type: 'sale' as const,
                        detail: sold.status === 'Paid' ? 'Sweets Purchase' : 'Added to Tab',
                        date: sold.date,
                        status: sold.status,
                        amount: sold.totalAmount
                      })),
                      ...clientPayments.map(paid => ({
                        type: 'payment' as const,
                        detail: `Paid tab balance (${paid.method})`,
                        date: paid.date + 'T12:00:00Z',
                        status: 'Paid',
                        amount: paid.amount
                      }))
                    ]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry, index) => {
                        const resolvedSign = entry.type === 'payment' ? '-' : '+';
                        return (
                          <div key={index} className="p-2 bg-white border-2 border-black rounded-xl flex justify-between items-center shadow-[1.5px_1.5px_0px_#000000]">
                            <div className="text-left py-0.5">
                              <p className="font-extrabold text-[11px] text-black">{entry.detail}</p>
                              <p className="text-[9px] text-black/60 font-bold">
                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`font-numeral-lg text-xs font-black ${entry.type === 'payment' ? 'text-emerald-700 font-extrabold' : 'text-black'}`}>
                                {resolvedSign}${entry.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        // Customer List Directory
        <div className="flex flex-col h-full text-left">
          {/* Customer search bar and Add Trigger */}
          <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
            <div>
              <h3 className="font-extrabold text-sm text-black">Clients Directory</h3>
              <p className="text-[10px] text-black/60 font-black">{customers.length} registered accounts</p>
            </div>
            <button
              onClick={() => {
                setActiveModal('add-customer');
              }}
              className="p-1 px-2.5 bg-[#FFD8E8] text-black rounded-lg flex items-center justify-center border-2 border-black font-black text-[10px] shadow-[1.5px_1.5px_0px_#000000] hover:bg-white active:scale-95 transition-all cursor-pointer gap-1"
              title="Add user profile"
            >
              <UserPlus className="w-3.5 h-3.5" /> Client
            </button>
          </div>

          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
                value={searchCustomerQuery}
                onChange={(e) => setSearchCustomerQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Scrollable directories list */}
          <div className="space-y-2 overflow-y-auto max-h-[480px] mb-2 pr-0.5 scrollbar-hide">
            {customers
              .filter(c => c.name.toLowerCase().includes(searchCustomerQuery.toLowerCase()))
              .map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => setViewedCustomerHistoryId(cust.id)}
                  className="p-2 bg-white rounded-xl border-2 border-black hover:border-black transition-all cursor-pointer flex items-center justify-between shadow-[2px_2px_0px_#000000] hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] hover:shadow-[3px_3px_0px_#000000]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img alt={cust.name} className="w-8 h-8 rounded-full object-cover border-2 border-black shrink-0" src={cust.avatar} />
                    <div className="min-w-0">
                      <p className="font-extrabold text-[11px] text-black truncate">{cust.name}</p>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 select-none mt-0.5 inline-block rounded ${getDiscountStyle(cust.discount)}`}>
                        {cust.discount > 0 ? `${cust.discount}% savings` : 'Standard rates'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <div className="text-right">
                      <p className="font-extrabold text-[10px] text-black font-numeral-lg">${cust.totalSpent.toFixed(2)} spent</p>
                      {cust.outstandingBalance > 0 && (
                        <p className="text-[8px] text-red-600 font-black border border-black bg-rose-50 px-1 py-0.2 rounded inline-block mt-0.5 shadow-[0.5px_0.5px_0px_#000000] font-numeral-lg">${cust.outstandingBalance.toFixed(2)} tab</p>
                      )}
                    </div>

                    {/* Direct Action Buttons - Edit / Delete */}
                    <div className="flex items-center gap-1 border-l border-black/15 pl-1.5 ml-0.5">
                      {confirmDeleteCustomerId === cust.id ? (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomer(cust.id);
                              setConfirmDeleteCustomerId(null);
                            }}
                            className="p-1 px-1.5 bg-rose-600 text-white rounded border border-black font-black text-[8px] uppercase tracking-wider hover:bg-rose-700 hover:text-white transition-all scale-95 duration-100 cursor-pointer"
                            title="Confirm Delete"
                          >
                            Yes
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteCustomerId(null);
                            }}
                            className="p-1 px-1.5 bg-slate-200 text-black rounded border border-black font-black text-[8px] uppercase tracking-wider hover:bg-slate-300 transition-all scale-95 duration-100 cursor-pointer"
                            title="Cancel"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditCustomer(cust);
                            }}
                            className="p-1 bg-white hover:bg-[#9BE9FB] text-black rounded-md border border-black/30 hover:border-black font-medium text-[9px] shadow-[0.5px_0.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] active:scale-95 duration-100 transition-all cursor-pointer flex items-center justify-center shrink-0"
                            title="Edit Profile"
                          >
                            <Pencil className="w-2.5 h-2.5 stroke-[3]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteCustomerId(cust.id);
                            }}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md border border-rose-600/30 hover:border-rose-600 font-medium text-[9px] shadow-[0.5px_0.5px_0px_rgba(224,36,36,0.2)] hover:shadow-[1px_1px_0px_rgba(224,36,36,0.3)] active:scale-95 duration-100 transition-all cursor-pointer flex items-center justify-center shrink-0"
                            title="Delete Client"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-black stroke-[3] shrink-0 ml-0.5" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
