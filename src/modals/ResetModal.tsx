import { useState } from 'react';
import { X, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ResetModal() {
  const { handleResetDatabase, setActiveModal, dbLoading } = useApp();

  const [resetConfirmationText, setResetConfirmationText] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleReset = async () => {
    if (resetConfirmationText.trim().toUpperCase() !== 'RESET') return;
    await handleResetDatabase();
    setResetSuccess("Clean start initiated! Past history cleared successfully.");
    setResetConfirmationText('');
    setTimeout(() => {
      setResetSuccess(null);
      setActiveModal('none');
    }, 2500);
  };

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-[60] flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h3 className="font-extrabold text-sm text-white">Reset Store History</h3>
          </div>
          <button
            onClick={() => { setActiveModal('none'); setResetConfirmationText(''); }}
            className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-transform duration-100 active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {resetSuccess && (
          <div className="p-3 bg-emerald-100 text-emerald-800 border-b-2 border-black text-xs font-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
            <p>{resetSuccess}</p>
          </div>
        )}

        <div className="p-4 space-y-4 select-none bg-rose-50/30 text-left overflow-y-auto">
          <div className="bg-rose-50 border-2 border-red-200 p-3 rounded-lg space-y-1">
            <p className="text-[10px] font-black text-red-700 uppercase tracking-wide">⚠️ CRITICAL LOSS WARNING</p>
            <p className="text-[9.5px] text-red-950 font-semibold leading-relaxed">
              This action will delete <strong>ALL</strong> sales logs, cash payments registers, and invoice records permanently from the record ledger.
            </p>
            <p className="text-[9.5px] text-red-950 font-semibold leading-relaxed">
              It will also instantly reset every customer's total spent history, purchase counter, and outstanding tab balance to <strong>$0.00</strong>.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-800 pl-1 block">
              Type the word <span className="text-red-700 underline font-mono font-black select-all px-1 bg-red-100/50 rounded">RESET</span> below to confirm
            </label>
            <input
              type="text"
              placeholder="Type 'RESET'"
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-mono font-black tracking-widest text-center uppercase placeholder-slate-400 shadow-[2px_2px_0px_#000000]"
              value={resetConfirmationText}
              onChange={(e) => setResetConfirmationText(e.target.value)}
            />
          </div>
        </div>

        <footer className="p-4 bg-white border-t-2 border-black shrink-0 flex gap-2.5">
          <button
            onClick={() => { setActiveModal('none'); setResetConfirmationText(''); }}
            className="flex-1 bg-slate-100 text-black hover:bg-slate-200 py-3 rounded-xl font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={resetConfirmationText.trim().toUpperCase() !== 'RESET' || dbLoading}
            onClick={handleReset}
            className={`flex-1 py-3 rounded-xl font-black text-xs border-2 border-black text-center transition-all ${
              resetConfirmationText.trim().toUpperCase() === 'RESET' && !dbLoading
                ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-y-0.5 shadow-rose-900/10'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 shadow-none'
            }`}
          >
            {dbLoading ? 'Resetting...' : 'Wipe Data & Reset'}
          </button>
        </footer>
      </div>
    </div>
  );
}
