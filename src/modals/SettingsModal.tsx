import { useState } from 'react';
import { X, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../supabase';

export default function SettingsModal() {
  const { weeklyGoal, setWeeklyGoal, setActiveModal } = useApp();
  const { user, signOut } = useAuth();

  const [goalInput, setGoalInput] = useState(weeklyGoal.toString());
  const [goalError, setGoalError] = useState('');

  function validate(raw: string): string {
    const val = parseFloat(raw);
    if (!raw || isNaN(val)) return 'Enter a valid amount';
    if (val <= 0) return 'Goal must be greater than $0';
    if (val > 1_000_000) return 'That seems too high — max $1,000,000';
    return '';
  }

  function handleSave() {
    const err = validate(goalInput);
    setGoalError(err);
    if (err) return;
    setWeeklyGoal(parseFloat(goalInput));
    setActiveModal('none');
  }

  const fieldClass = `w-full bg-white border-2 rounded-lg pl-7 pr-3 py-3 text-xs focus:ring-1 focus:ring-black font-black shadow-[2.5px_2.5px_0px_#000000] ${goalError ? 'border-rose-500' : 'border-black'}`;

  return (
    <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#9BE9FB]" />
            <h3 className="font-extrabold text-md text-white">App Settings</h3>
          </div>
          <button onClick={() => setActiveModal('none')} className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 space-y-4 select-none bg-[#9BE9FB]/5 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-black pl-1">Weekly Revenue Goal ($)</label>
            <p className="text-[10px] text-black/60 font-semibold pl-1">Sets the break-even milestone tracker on the dashboard.</p>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black text-xs">$</span>
              <input
                type="number"
                step="1"
                min="1"
                className={fieldClass}
                value={goalInput}
                onChange={(e) => {
                  setGoalInput(e.target.value);
                  setGoalError(validate(e.target.value));
                }}
              />
            </div>
            {goalError && <p className="text-[10px] text-rose-600 font-black pl-1">{goalError}</p>}

            <div className="flex flex-wrap gap-2 pt-1">
              {[500, 1000, 1500, 2000, 3000].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => { setGoalInput(v.toString()); setGoalError(''); }}
                  className="bg-white border-2 border-black hover:bg-[#9BE9FB] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer"
                >
                  ${v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => setActiveModal('none')}
              className="py-3 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-xl font-black text-xs shadow-[2.5px_2.5px_0px_#000000] active:scale-95 duration-150 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-3 bg-black text-white hover:bg-[#9BE9FB] hover:text-black rounded-xl font-black text-xs border-2 border-black shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer text-center"
            >
              Save Settings
            </button>
          </div>

          {isSupabaseConfigured && user && (
            <div className="border-t-2 border-black/10 pt-4 space-y-2">
              <p className="text-[10px] text-black/50 font-semibold pl-1">
                Signed in as <span className="font-black text-black">{user.email}</span>
              </p>
              <button
                onClick={async () => { setActiveModal('none'); await signOut(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border-2 border-rose-200 rounded-xl font-black text-xs duration-150 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
