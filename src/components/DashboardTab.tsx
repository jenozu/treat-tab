import { useMemo } from 'react';
import { TrendingUp, AlertCircle, Coins, Percent, ShoppingBag, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardTab() {
  const {
    customers,
    products,
    sales,
    weeklyGoal,
    setActiveTab,
    setActiveModal,
  } = useApp();

  const totalSalesVal = useMemo(() => sales.reduce((sum, s) => sum + s.totalAmount, 0), [sales]);
  const totalOutstandingVal = useMemo(() => customers.reduce((sum, c) => sum + c.outstandingBalance, 0), [customers]);
  const cashCollectedVal = totalSalesVal - totalOutstandingVal;

  const { averageMarginPercent, breakEvenProgressPercent } = useMemo(() => {
    let calculatedCost = 0;
    sales.forEach(s => {
      s.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          calculatedCost += (item.quantity * prod.cost);
        } else {
          calculatedCost += (item.quantity * (item.priceAtSale * 0.5));
        }
      });
    });
    const totalProductProfits = totalSalesVal - calculatedCost;
    const averageMarginPercent = totalSalesVal > 0 ? Math.round((totalProductProfits / totalSalesVal) * 100) : 0;
    const breakEvenProgressPercent = Math.min(Math.round((totalSalesVal / weeklyGoal) * 100), 100);
    return { averageMarginPercent, breakEvenProgressPercent };
  }, [sales, products, totalSalesVal, weeklyGoal]);

  return (
    <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
      {/* SUMMARY CARDS GRID with Neo-Brutalist pop colors and black outlines */}
      <section className="grid grid-cols-2 gap-3">
        {/* CARD 1: Outstanding Debt */}
        <div
          id="dash-card-debts"
          onClick={() => {
            setActiveModal('outstanding');
          }}
          className="bg-white rounded-2xl p-3 border-2 border-[#000000] shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000000] transition-all cursor-pointer text-left flex flex-col justify-between h-[96px] relative group"
        >
          <div className="flex justify-between items-start">
            <span className="p-1 bg-[#FFD8E8] text-black border border-black rounded-lg group-hover:bg-white transition-colors">
              <AlertCircle className="w-4 h-4" />
            </span>
            <span className="text-[8px] uppercase font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 border border-black rounded-full leading-none">
              Tabs Owed
            </span>
          </div>
          <div>
            <p className="text-[10px] text-black/70 font-bold leading-none mt-1">Outstanding Tab</p>
            <h3 className="text-sm font-black text-black leading-none mt-1">
              ${totalOutstandingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* CARD 2: Total Sales Ledger */}
        <div
          id="dash-card-sales"
          onClick={() => {
            setActiveTab('sales');
          }}
          className="bg-[#9BE9FB] rounded-2xl p-3 border-2 border-[#000000] shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000000] transition-all cursor-pointer text-left flex flex-col justify-between h-[96px] relative group"
        >
          <div className="flex justify-between items-start">
            <span className="p-1 bg-white text-black border border-black rounded-lg group-hover:bg-[#9BE9FB] transition-colors">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[8px] uppercase font-black text-black bg-white px-1.5 py-0.2 border border-black rounded-full leading-none">
              All Sales
            </span>
          </div>
          <div>
            <p className="text-[10px] text-black/70 font-bold leading-none mt-1">Cumulative Sales</p>
            <h3 className="text-sm font-black text-black leading-none mt-1">
              ${totalSalesVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* CARD 3: Total Liquid Cash */}
        <div
          id="dash-card-liquid-cash"
          onClick={() => {
            setActiveTab('sales');
          }}
          className="bg-[#FFD8E8] rounded-2xl p-3 border-2 border-[#000000] shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000000] transition-all cursor-pointer text-left flex flex-col justify-between h-[96px] relative group"
        >
          <div className="flex justify-between items-start">
            <span className="p-1 bg-white text-black border border-black rounded-lg group-hover:bg-[#FFD8E8] transition-colors">
              <Coins className="w-4 h-4" />
            </span>
            <span className="text-[8px] uppercase font-black text-black bg-white px-1.5 py-0.2 border border-black rounded-full leading-none">
              Liquid Cash
            </span>
          </div>
          <div>
            <p className="text-[10px] text-black/70 font-bold leading-none mt-1">Total Liquid Cash</p>
            <h3 className="text-sm font-black text-black leading-none mt-1">
              ${cashCollectedVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* CARD 4: Average Markup */}
        <div
          id="dash-card-markup"
          onClick={() => {
            setActiveTab('products');
          }}
          className="bg-white rounded-2xl p-3 border-2 border-[#000000] shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000000] transition-all cursor-pointer text-left flex flex-col justify-between h-[96px] relative group"
        >
          <div className="flex justify-between items-start">
            <span className="p-1 bg-[#9BE9FB] text-black border border-black rounded-lg group-hover:bg-white transition-colors">
              <Percent className="w-4 h-4" />
            </span>
            <span className="text-[8px] uppercase font-black text-black bg-white px-1.5 py-0.2 border border-black rounded-full leading-none">
              Profit Mark
            </span>
          </div>
          <div>
            <p className="text-[10px] text-black/70 font-bold leading-none mt-1">Average Markup</p>
            <h3 className="text-sm font-black text-black leading-none mt-1">
              +{averageMarginPercent}% Margin
            </h3>
          </div>
        </div>
      </section>

      {/* TARGET BREAK-EVEN HIGHLIGHT - High Contrast Pink / Cyan loading */}
      <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-1 text-left">
        <div className="flex justify-between items-center text-xs">
          <span className="font-extrabold text-[#000000] uppercase tracking-wider text-[10px]">Cover COGS Milestone</span>
          <span className="text-black font-black bg-[#9BE9FB] border border-black px-1.5 py-0.2 rounded text-[8px]">{breakEvenProgressPercent}% Met</span>
        </div>
        <div className="w-full bg-slate-100 border-2 border-black h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#FFD8E8] h-full rounded-full transition-all duration-1000 ease-out border-r border-black"
            style={{ width: `${breakEvenProgressPercent}%` }}
          ></div>
        </div>
        <p className="text-[10px] font-semibold text-black/80">
          Goal: ${weeklyGoal.toLocaleString()} target. {weeklyGoal - totalSalesVal > 0 ? `$${(weeklyGoal - totalSalesVal).toFixed(2)} to cover.` : "Break-even solved!"}
        </p>
      </div>

      {/* PRIMARY TRANSACTION TRIGGER BAR */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-[10px] font-black text-black uppercase tracking-wider pl-1 text-left">Record Live Transactions</h3>

        <div className="grid grid-cols-2 gap-3 pb-1">
          {/* Add Sale Transaction Card - Themed Accent Cyan */}
          <button
            id="quick-add-sale-btn"
            onClick={() => {
              setActiveModal('add-sale');
            }}
            className="bg-[#9BE9FB] py-3 px-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000000] active:scale-[0.98] transition-all text-center flex flex-col items-center justify-center gap-1.5 group select-none cursor-pointer"
          >
            <div className="w-8 h-8 bg-white border-2 border-black text-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-[11px] text-black block">Record Sale</span>
              <span className="text-[8px] text-black/75 font-semibold">Tap & Add Sweets</span>
            </div>
          </button>

          {/* Add Payment Transaction Card - Themed Background Pink */}
          <button
            id="quick-add-payment-btn"
            onClick={() => {
              setActiveModal('add-payment');
            }}
            className="bg-[#FFD8E8] py-3 px-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000000] active:scale-[0.98] transition-all text-center flex flex-col items-center justify-center gap-1.5 group select-none cursor-pointer"
          >
            <div className="w-8 h-8 bg-white border-2 border-[#000000] text-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-[11px] text-black block">Log Payment</span>
              <span className="text-[8px] text-black/75 font-semibold">Clear Tab Debts</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
