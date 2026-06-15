import { useState, useEffect } from 'react';
import { X, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { validatePaymentAmount } from '../utils/validation';

export default function LogPaymentModal() {
  const { customers, handleRecordPayment, setActiveModal, prefilledPaymentCustomerId, prefilledPaymentAmount } = useApp();
  useEscapeKey(() => setActiveModal('none'));

  const [selectedCustomerIdForPayment, setSelectedCustomerIdForPayment] = useState(prefilledPaymentCustomerId);
  const [paymentAmount, setPaymentAmount] = useState(prefilledPaymentAmount);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'E-transfer'>('Cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    setSelectedCustomerIdForPayment(prefilledPaymentCustomerId);
    setPaymentAmount(prefilledPaymentAmount);
    setAmountError('');
  }, [prefilledPaymentCustomerId, prefilledPaymentAmount]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerIdForPayment);
  const outstanding = selectedCustomer?.outstandingBalance ?? 0;

  function handleSubmit() {
    const err = validatePaymentAmount(paymentAmount, outstanding);
    setAmountError(err);
    if (err || !selectedCustomerIdForPayment) return;

    const resolvedAmount = parseFloat(paymentAmount);
    handleRecordPayment(selectedCustomerIdForPayment, resolvedAmount, paymentMethod, paymentNotes);
    setPaymentSuccess(`Logged payment of $${resolvedAmount.toFixed(2)} successfully!`);
    setPaymentAmount('');
    setSelectedCustomerIdForPayment('');
    setPaymentNotes('');
    setAmountError('');
    setTimeout(() => {
      setPaymentSuccess(null);
      setActiveModal('none');
    }, 2000);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-payment-title"
      className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]"
    >
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#9BE9FB]" />
            <h3 id="log-payment-title" className="font-extrabold text-md text-[#FFFFFF]">Record Customer Payment</h3>
          </div>
          <button onClick={() => setActiveModal('none')} aria-label="Close" className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        {paymentSuccess && (
          <div role="status" aria-live="polite" className="p-3 bg-[#9BE9FB] text-black text-xs font-black shrink-0 border-b-2 border-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <p>{paymentSuccess}</p>
          </div>
        )}

        <div className="p-4 space-y-4 overflow-y-auto flex-1 select-none bg-[#FFD8E8]/5">
          <div className="space-y-1.5">
            <label htmlFor="add-payment-customer-select" className="text-[11px] font-black uppercase text-black pl-1">Under Account</label>
            <select
              id="add-payment-customer-select"
              className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
              value={selectedCustomerIdForPayment}
              onChange={(e) => {
                setSelectedCustomerIdForPayment(e.target.value);
                const target = customers.find(c => c.id === e.target.value);
                if (target) setPaymentAmount(target.outstandingBalance.toString());
                setAmountError('');
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

          {selectedCustomerIdForPayment && (
            <>
              <div className="space-y-1">
                <label htmlFor="add-payment-amount-input" className="text-[11px] font-black uppercase text-black pl-1">Payment Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black text-xs" aria-hidden="true">$</span>
                  <input
                    type="number"
                    id="add-payment-amount-input"
                    step="0.01"
                    className={`w-full bg-white border-2 rounded-lg pl-7 pr-3 py-3 text-xs focus:ring-1 focus:ring-black font-black shadow-[2.5px_2.5px_0px_#000000] ${amountError ? 'border-rose-500' : 'border-black'}`}
                    value={paymentAmount}
                    onChange={(e) => {
                      setPaymentAmount(e.target.value);
                      setAmountError(validatePaymentAmount(e.target.value, outstanding));
                    }}
                    aria-invalid={!!amountError}
                  />
                </div>
                {amountError && <p role="alert" className="text-[10px] text-rose-600 font-black pl-1">{amountError}</p>}

                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="button" onClick={() => { setPaymentAmount('5.00'); setAmountError(validatePaymentAmount('5.00', outstanding)); }} className="bg-white border-2 border-black hover:bg-[#FFD8E8] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer">$5.00</button>
                  <button type="button" onClick={() => { setPaymentAmount('10.00'); setAmountError(validatePaymentAmount('10.00', outstanding)); }} className="bg-white border-2 border-black hover:bg-[#FFD8E8] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer">$10.00</button>
                  <button type="button" onClick={() => { const v = outstanding.toString(); setPaymentAmount(v); setAmountError(validatePaymentAmount(v, outstanding)); }} className="bg-white border-2 border-black hover:bg-[#9BE9FB] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer">Clear Full Debt</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-black uppercase text-black pl-1" id="payment-method-label">Payment Method</p>
                <div role="group" aria-labelledby="payment-method-label" className="grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={() => setPaymentMethod('Cash')} aria-pressed={paymentMethod === 'Cash'} className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${paymentMethod === 'Cash' ? 'bg-[#9BE9FB] text-black border-black' : 'bg-white border-black hover:bg-[#9BE9FB]/20'}`}>Cash Collected</button>
                  <button type="button" onClick={() => setPaymentMethod('E-transfer')} aria-pressed={paymentMethod === 'E-transfer'} className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${paymentMethod === 'E-transfer' ? 'bg-[#FFD8E8] text-black border-black' : 'bg-white border-black hover:bg-[#FFD8E8]/20'}`}>E-transfer</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="payment-notes" className="text-[11px] font-black uppercase text-black pl-1">Payment memo notes</label>
                <textarea
                  id="payment-notes"
                  placeholder="e.g. Paid via digital cash transfer during checkout"
                  className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {selectedCustomerIdForPayment && (
          <footer className="p-4 bg-white border-t-2 border-black shrink-0">
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white hover:bg-[#FFD8E8] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer"
            >
              Confirm Log Payment
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
