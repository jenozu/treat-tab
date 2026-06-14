import { useState, useEffect } from 'react';
import { X, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LogPaymentModal() {
  const { customers, handleRecordPayment, setActiveModal, prefilledPaymentCustomerId, prefilledPaymentAmount } = useApp();

  const [selectedCustomerIdForPayment, setSelectedCustomerIdForPayment] = useState(prefilledPaymentCustomerId);
  const [paymentAmount, setPaymentAmount] = useState(prefilledPaymentAmount);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'E-transfer'>('Cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCustomerIdForPayment(prefilledPaymentCustomerId);
    setPaymentAmount(prefilledPaymentAmount);
  }, [prefilledPaymentCustomerId, prefilledPaymentAmount]);

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-[#FFFFFF]">Record Customer Payment</h3>
          </div>
          <button onClick={() => setActiveModal('none')} className="p-1.5 text-white hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </header>

        {paymentSuccess && (
          <div className="p-3 bg-[#9BE9FB] text-black text-xs font-black shrink-0 border-b-2 border-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <p>{paymentSuccess}</p>
          </div>
        )}

        <div className="p-4 space-y-4 overflow-y-auto flex-1 select-none bg-[#FFD8E8]/5">
          {/* Choose Client */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-black pl-1">Under Account</label>
            <select
              id="add-payment-customer-select"
              className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={selectedCustomerIdForPayment}
              onChange={(e) => {
                setSelectedCustomerIdForPayment(e.target.value);
                const targetCust = customers.find(c => c.id === e.target.value);
                if (targetCust) {
                  setPaymentAmount(targetCust.outstandingBalance.toString());
                }
              }}
            >
              <option value="">Choose debt holder profile...</option>
              {customers
                .filter(c => c.outstandingBalance > 0)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.discount > 0 ? `(${c.discount}% savings)` : ''} • owing ${c.outstandingBalance.toFixed(2)}
                  </option>
                ))}
            </select>
          </div>

          {/* Amount input */}
          {selectedCustomerIdForPayment && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Payment Amount ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black text-xs">$</span>
                <input
                  type="number"
                  id="add-payment-amount-input"
                  step="0.01"
                  className="w-full bg-white border-2 border-black rounded-lg pl-7 pr-3 py-3 text-xs focus:ring-1 focus:ring-black font-black shadow-[2.5px_2.5px_0px_#000000]"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => setPaymentAmount('5.00')} className="bg-white border-2 border-black hover:bg-[#FFD8E8] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer">$5.00</button>
                <button type="button" onClick={() => setPaymentAmount('10.00')} className="bg-white border-2 border-black hover:bg-[#FFD8E8] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer">$10.00</button>
                <button type="button" onClick={() => {
                  const limit = customers.find(c => c.id === selectedCustomerIdForPayment)?.outstandingBalance || 0;
                  setPaymentAmount(limit.toString());
                }} className="bg-white border-2 border-black hover:bg-[#9BE9FB] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer">Clear Full Debt</button>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {selectedCustomerIdForPayment && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Payment Method</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={() => setPaymentMethod('Cash')} className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${paymentMethod === 'Cash' ? 'bg-[#9BE9FB] text-black border-black' : 'bg-white border-black hover:bg-[#9BE9FB]/20'}`}>Cash Collected</button>
                <button type="button" onClick={() => setPaymentMethod('E-transfer')} className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${paymentMethod === 'E-transfer' ? 'bg-[#FFD8E8] text-black border-black' : 'bg-white border-black hover:bg-[#FFD8E8]/20'}`}>E-transfer</button>
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedCustomerIdForPayment && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-black pl-1">Payment memo notes</label>
              <textarea
                placeholder="e.g. Paid via digital cash transfer during checkout"
                className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                rows={2}
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Submit footer */}
        {selectedCustomerIdForPayment && parseFloat(paymentAmount) > 0 && (
          <footer className="p-4 bg-white border-t-2 border-black shrink-0">
            <button
              onClick={() => {
                const resolvedAmount = parseFloat(paymentAmount);
                handleRecordPayment(selectedCustomerIdForPayment, resolvedAmount, paymentMethod, paymentNotes);
                setPaymentSuccess(`Logged payment of $${resolvedAmount.toFixed(2)} successfully!`);
                setPaymentAmount('');
                setSelectedCustomerIdForPayment('');
                setPaymentNotes('');
                setTimeout(() => {
                  setPaymentSuccess(null);
                  setActiveModal('none');
                }, 2000);
              }}
              className="w-full bg-black text-white hover:bg-[#FFD8E8] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer"
            >
              Confirm Log payment
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
