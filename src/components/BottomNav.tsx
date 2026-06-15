import { Store, History, User, Cookie } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../constants';

const tabs: { id: TabType; label: string; icon: React.ReactNode; activeColor: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Store className="w-5 h-5 shrink-0" />, activeColor: 'bg-[#9BE9FB]' },
  { id: 'sales', label: 'Sales', icon: <History className="w-5 h-5 shrink-0" />, activeColor: 'bg-[#FFD8E8]' },
  { id: 'customers', label: 'Customers', icon: <User className="w-5 h-5 shrink-0" />, activeColor: 'bg-[#9BE9FB]' },
  { id: 'products', label: 'Products', icon: <Cookie className="w-5 h-5 shrink-0" />, activeColor: 'bg-[#FFD8E8]' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, setActiveModal } = useApp();
  return (
    <nav className="bg-black border-t-4 border-black px-2 py-2.5 flex justify-around items-center shrink-0 z-20 select-none text-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          onClick={() => { setActiveModal('none'); setActiveTab(tab.id); }}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          aria-label={tab.label}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === tab.id
              ? `${tab.activeColor} text-black border-2 border-black shadow-[2px_2px_0px_#000000] scale-105`
              : 'text-white hover:bg-white/10 border-2 border-transparent'
          }`}
        >
          {tab.icon}
          <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
