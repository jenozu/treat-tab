import { Store, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { dbLoading, dbActive, setActiveModal } = useApp();
  return (
    <header className="px-6 py-4.5 bg-[#000000] text-[#FFFFFF] flex justify-between items-center shrink-0 border-b-2 border-[#000000]">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-[#9BE9FB] border border-[#000000] rounded-lg">
          <Store className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="font-black text-lg tracking-tight select-none text-[#FFFFFF]">Treat Tab</h1>
          <p className="text-[10px] text-[#9BE9FB] uppercase font-extrabold tracking-wider">Mobile Register</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 bg-[#FFFFFF]/10 px-3 py-1 rounded-full border border-[#FFFFFF]/25 select-none">
          <span className={`w-2 h-2 rounded-full ${dbLoading ? 'bg-slate-400 animate-pulse' : dbActive ? 'bg-emerald-400 animate-[pulse_1.5s_infinite]' : 'bg-amber-400'}`}></span>
          <span className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-wider">
            {dbLoading ? 'Connecting...' : dbActive ? 'Cloud Live' : 'Sandbox (Offline)'}
          </span>
        </div>
        <button
          onClick={() => setActiveModal('settings')}
          className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
