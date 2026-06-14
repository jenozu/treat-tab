import { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Search,
  X,
  Sparkles,
  ShoppingBag,
  Clock,
  Trash2,
  BarChart3,
  Calculator,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sale } from '../types';

export default function SalesTab() {
  const { customers, products, sales, setActiveModal, dbLoading } = useApp();

  const [salesSubTab, setSalesSubTab] = useState<'analytics' | 'estimator'>('analytics');

  // Profit Estimator inputs state
  const [estTotalItems, setEstTotalItems] = useState<string>('120');
  const [estCostPerItem, setEstCostPerItem] = useState<string>('1.50');
  const [estSellingPrice, setEstSellingPrice] = useState<string>('3.50');
  const [estDiscountPercent, setEstDiscountPercent] = useState<string>('10');
  const [estSellThroughPercent, setEstSellThroughPercent] = useState<string>('90');

  const [showProfitBreakdown, setShowProfitBreakdown] = useState<boolean>(false);
  const [showAverageOrderDetails, setShowAverageOrderDetails] = useState<boolean>(false);
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [isChartFullScreen, setIsChartFullScreen] = useState<boolean>(false);
  const [searchSalesQuery, setSearchSalesQuery] = useState('');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  // Metrics
  const totalSalesVal = useMemo(() => sales.reduce((sum, s) => sum + s.totalAmount, 0), [sales]);
  const ordersCountComputed = sales.length;
  const avgOrderValueComputed = ordersCountComputed > 0 ? (totalSalesVal / ordersCountComputed) : 0;

  const { calculatedCost, totalProductProfits, averageMarginPercent } = useMemo(() => {
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
    return { calculatedCost, totalProductProfits, averageMarginPercent };
  }, [sales, products, totalSalesVal]);

  // Chart data
  const numDaysToGenerate = chartPeriod === 'week' ? 7 : 30;
  const computedChartData = useMemo(() => {
    const result: { label: string; dateStr: string; revenue: number; profit: number; txCount: number }[] = [];
    for (let i = numDaysToGenerate - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      let label = '';
      if (chartPeriod === 'week') {
        label = d.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      const salesOnDay = sales.filter(s => {
        try {
          return new Date(s.date).toISOString().split('T')[0] === dateStr;
        } catch { return false; }
      });
      const dayRevenue = salesOnDay.reduce((sum, s) => sum + s.totalAmount, 0);
      const dayProfit = salesOnDay.reduce((sum, s) => {
        let dayCost = 0;
        s.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          if (prod) { dayCost += (item.quantity * prod.cost); }
          else { dayCost += (item.quantity * (item.priceAtSale * 0.5)); }
        });
        return sum + (s.totalAmount - dayCost);
      }, 0);
      result.push({ label, dateStr, revenue: parseFloat(dayRevenue.toFixed(2)), profit: parseFloat(dayProfit.toFixed(2)), txCount: salesOnDay.length });
    }
    return result;
  }, [sales, products, chartPeriod, numDaysToGenerate]);

  const chartMaxRevenue = Math.max(...computedChartData.map(d => d.revenue), 10);
  const overallPeriodRevenue = computedChartData.reduce((sum, d) => sum + d.revenue, 0);
  const overallPeriodProfit = computedChartData.reduce((sum, d) => sum + d.profit, 0);
  const overallPeriodOrders = computedChartData.reduce((sum, d) => sum + d.txCount, 0);

  const peakSalesDayPoint = computedChartData.reduce(
    (peak, current) => (current.revenue > peak.revenue ? current : peak),
    { label: 'None', dateStr: '', revenue: 0, profit: 0, txCount: 0 }
  );

  const computedCategorySales = useMemo<{ [cat: string]: number }>(() => {
    const result: { [cat: string]: number } = {};
    computedChartData.forEach(day => {
      const salesOnDay = sales.filter(s => {
        try { return new Date(s.date).toISOString().split('T')[0] === day.dateStr; }
        catch { return false; }
      });
      salesOnDay.forEach(s => {
        s.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          const cat = prod ? prod.category : 'Other';
          const saleVal = item.quantity * item.priceAtSale;
          result[cat] = (result[cat] || 0) + saleVal;
        });
      });
    });
    return result;
  }, [computedChartData, sales, products]);

  const { periodPaidSalesTotal, periodTabSalesTotal } = useMemo(() => {
    let paid = 0;
    let tab = 0;
    computedChartData.forEach(day => {
      const salesOnDay = sales.filter(s => {
        try { return new Date(s.date).toISOString().split('T')[0] === day.dateStr; }
        catch { return false; }
      });
      salesOnDay.forEach(s => {
        if (s.status === 'Paid') { paid += s.totalAmount; }
        else { tab += s.totalAmount; }
      });
    });
    return { periodPaidSalesTotal: paid, periodTabSalesTotal: tab };
  }, [computedChartData, sales]);

  // Profit estimator computations
  const estTotalItemsNum = Math.max(0, parseInt(estTotalItems) || 0);
  const estCostPerItemNum = Math.max(0, parseFloat(estCostPerItem) || 0);
  const estSellingPriceNum = Math.max(0, parseFloat(estSellingPrice) || 0);
  const estDiscountPercentNum = Math.max(0, Math.min(100, parseFloat(estDiscountPercent) || 0));
  const estSellThroughPercentNum = Math.max(0, Math.min(100, parseFloat(estSellThroughPercent) || 0));
  const calculatedTotalCost = estTotalItemsNum * estCostPerItemNum;
  const calculatedDiscountedPrice = Math.max(0, estSellingPriceNum - (estSellingPriceNum * (estDiscountPercentNum / 100)));
  const calculatedSellThroughUnits = estTotalItemsNum * (estSellThroughPercentNum / 100);
  const calculatedRevenue = calculatedSellThroughUnits * calculatedDiscountedPrice;
  const calculatedProfit = calculatedRevenue - calculatedTotalCost;
  const calculatedProfitPerItem = calculatedDiscountedPrice - estCostPerItemNum;
  const calculatedProfitMarginPercent = calculatedRevenue > 0 ? (calculatedProfit / calculatedRevenue) * 100 : 0;
  const calculatedBreakEvenUnits = calculatedDiscountedPrice > 0 ? calculatedTotalCost / calculatedDiscountedPrice : 0;

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.15s_ease-out] text-left space-y-4">
      {/* Tab Navigation Controls */}
      <div className="flex bg-black p-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
        <button
          type="button"
          onClick={() => setSalesSubTab('analytics')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
            salesSubTab === 'analytics'
              ? 'bg-[#9BE9FB] text-black border border-black shadow-[1.5px_1.5px_0px_#000000]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics
        </button>
        <button
          type="button"
          onClick={() => setSalesSubTab('estimator')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
            salesSubTab === 'estimator'
              ? 'bg-[#FFD8E8] text-black border border-black shadow-[1.5px_1.5px_0px_#000000]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          Profit Estimator
        </button>
      </div>

      {salesSubTab === 'analytics' ? (
        // SUBTAB 1: Analytics
        <div className="space-y-4 animate-[fadeIn_0.1s_ease-out]">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 select-none">
            {/* Stat 1: Total Revenue */}
            <div
              onClick={() => {
                setSearchSalesQuery('');
                setTimeout(() => {
                  const el = document.getElementById('past-transaction-logs-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    el.classList.add('animate-pulse');
                    setTimeout(() => el.classList.remove('animate-pulse'), 1000);
                  }
                }, 50);
              }}
              className="bg-[#9BE9FB] rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] cursor-pointer hover:bg-[#83dfef] transition-all hover:scale-[1.02] hover:shadow-[4px_4px_0px_#000000] active:scale-[0.97]"
              title="Click to view all past transactions"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] uppercase font-black text-black/60 leading-none block">Total Revenue</span>
                <ChevronRight className="w-2.5 h-2.5 text-black/40 stroke-[3]" />
              </div>
              <h3 className="text-sm font-black text-black font-numeral-lg mt-1">${totalSalesVal.toFixed(2)}</h3>
              <p className="text-[8px] text-black/80 font-bold mt-0.5">{ordersCountComputed} transactions logged</p>
              <span className="text-[7px] text-black/50 font-black tracking-wide uppercase mt-1.5 block">View all logs →</span>
            </div>

            {/* Stat 2: Total Net Profit */}
            <div
              onClick={() => { setShowProfitBreakdown(true); }}
              className="bg-[#FFD8E8] rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] cursor-pointer hover:bg-[#f6bed5] transition-all hover:scale-[1.02] hover:shadow-[4px_4px_0px_#000000] active:scale-[0.97]"
              title="Click to view category-wise profit breakdown"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] uppercase font-black text-black/60 leading-none block">Total Profit</span>
                <ChevronRight className="w-2.5 h-2.5 text-black/40 stroke-[3]" />
              </div>
              <h3 className="text-sm font-black text-black font-numeral-lg mt-1">${totalProductProfits.toFixed(2)}</h3>
              <p className="text-[8px] text-black/80 font-black mt-0.5">~{averageMarginPercent}% margin avg</p>
              <span className="text-[7px] text-black/50 font-black tracking-wide uppercase mt-1.5 block">Category split →</span>
            </div>

            {/* Stat 3: Average Order Value */}
            <div
              onClick={() => { setShowAverageOrderDetails(true); }}
              className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] cursor-pointer hover:bg-[#fbfbfb] hover:border-black transition-all hover:scale-[1.02] hover:shadow-[4px_4px_0px_#000000] active:scale-[0.97]"
              title="Click to view order metrics and checkout sizes"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] uppercase font-black text-black/50 leading-none block">Avg Order Value</span>
                <ChevronRight className="w-2.5 h-2.5 text-black/30 stroke-[3]" />
              </div>
              <h3 className="text-sm font-black text-black font-numeral-lg mt-1">${avgOrderValueComputed.toFixed(2)}</h3>
              <p className="text-[8px] text-black/60 font-bold mt-0.5">Average checkout total</p>
              <span className="text-[7px] text-black/40 font-black tracking-wide uppercase mt-1.5 block">Checkout stats →</span>
            </div>

            {/* Stat 4: Transaction Orders */}
            <div
              onClick={() => { setActiveModal('outstanding'); }}
              className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] cursor-pointer hover:bg-[#fbfbfb] hover:border-black transition-all hover:scale-[1.02] hover:shadow-[4px_4px_0px_#000000] active:scale-[0.97]"
              title="Click to see pending client tabs table"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] uppercase font-black text-black/50 leading-none block">Ledger Count</span>
                <ChevronRight className="w-2.5 h-2.5 text-black/30 stroke-[3]" />
              </div>
              <h3 className="text-sm font-black text-black font-numeral-lg mt-1">{ordersCountComputed} Orders</h3>
              <p className="text-[8px] text-black/60 font-bold mt-0.5">Including outstanding tabs</p>
              <span className="text-[7px] text-[#e02424]/90 font-black tracking-wide uppercase mt-1.5 block">Pending Tabs List →</span>
            </div>
          </div>

          {/* Premium Interactive Sales & Profit Graph */}
          <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-3">
            <div className="flex justify-between items-center select-none">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="text-[11px] font-black uppercase text-black">Sales & Profit Trends</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-black text-[9px] font-extrabold">
                  <button
                    type="button"
                    onClick={() => setChartPeriod('week')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${chartPeriod === 'week' ? 'bg-black text-white shadow-[1px_1px_0px_#000000]' : 'text-black/60 hover:text-black'}`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartPeriod('month')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${chartPeriod === 'month' ? 'bg-black text-white shadow-[1px_1px_0px_#000000]' : 'text-black/60 hover:text-black'}`}
                  >
                    Month
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChartFullScreen(true)}
                  title="Open Fullscreen Detailed Analytics"
                  className="p-1 bg-[#9BE9FB] hover:bg-white text-black border border-black rounded shadow-[1px_1px_0px_#000000] active:scale-[0.95] cursor-pointer transition-all"
                >
                  <Maximize2 className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Chart Visualization Area */}
            <div className="relative">
              <div className="h-28 w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 relative overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-x-2 top-2 flex justify-between text-[8px] text-black/40 font-bold border-b border-dashed border-slate-100 pb-0.5 select-none">
                  <span>Max: ${chartMaxRevenue.toFixed(0)}</span>
                  <span className="flex gap-2">
                    <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#9BE9FB] border border-black rounded-sm"></span>Revenue</span>
                    <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#FFD8E8] border border-black rounded-sm"></span>Profit</span>
                  </span>
                </div>

                <div className="flex items-end justify-between h-20 px-1 gap-1 pt-3">
                  {computedChartData.map((data, idx) => {
                    const revHeightPercent = chartMaxRevenue > 0 ? (data.revenue / chartMaxRevenue) * 100 : 0;
                    const profHeightPercent = chartMaxRevenue > 0 ? (data.profit / chartMaxRevenue) * 100 : 0;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                        onClick={() => setHoveredPointIdx(hoveredPointIdx === idx ? null : idx)}
                        onMouseEnter={() => setHoveredPointIdx(idx)}
                        onMouseLeave={() => setHoveredPointIdx(null)}
                      >
                        <div className="w-full flex items-end justify-center gap-[1px] h-full pb-1">
                          <div
                            style={{ height: `${Math.max(4, revHeightPercent)}%` }}
                            className={`w-2.5 sm:w-3.5 border border-black rounded-t-sm transition-all duration-200 ${hoveredPointIdx === idx ? 'bg-[#9BE9FB] translate-y-[-2px]' : 'bg-[#9BE9FB]/80'}`}
                          />
                          <div
                            style={{ height: `${Math.max(2, profHeightPercent)}%` }}
                            className={`w-2.5 sm:w-3.5 border border-black rounded-t-sm transition-all duration-200 ${hoveredPointIdx === idx ? 'bg-[#FFD8E8] translate-y-[-2px]' : 'bg-[#FFD8E8]/80'}`}
                          />
                        </div>
                        {(chartPeriod === 'week' || idx % 5 === 0 || idx === computedChartData.length - 1) && (
                          <span className="text-[7.5px] text-black/60 font-black truncate max-w-full select-none mt-0.5">
                            {data.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating hover metrics text block */}
              <div className="mt-2 p-1.5 bg-slate-50 border border-black rounded-lg text-[9px] flex items-center justify-between font-bold">
                {hoveredPointIdx !== null ? (
                  <>
                    <div className="flex gap-2">
                      <span className="text-black/50">{computedChartData[hoveredPointIdx].label}:</span>
                      <span className="text-black">Rev <span className="font-numeral-sm text-black font-extrabold">${computedChartData[hoveredPointIdx].revenue.toFixed(2)}</span></span>
                      <span className="text-emerald-700">Profit <span className="font-numeral-sm font-extrabold">${computedChartData[hoveredPointIdx].profit.toFixed(2)}</span></span>
                    </div>
                    <span className="text-black/60">({computedChartData[hoveredPointIdx].txCount} orders)</span>
                  </>
                ) : (
                  <>
                    <span className="text-black/50">Totals ({chartPeriod === 'week' ? '7 Days' : '30 Days'}):</span>
                    <div className="flex gap-2">
                      <span className="text-black col-span-1">Rev <span className="font-numeral-sm text-black font-extrabold">${overallPeriodRevenue.toFixed(2)}</span></span>
                      <span className="text-emerald-750">Profit <span className="font-numeral-sm font-extrabold">${overallPeriodProfit.toFixed(2)}</span></span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Detailed search & past entries log */}
          <div className="space-y-2.5">
            <div>
              <h4 id="past-transaction-logs-section" className="text-[11px] font-black uppercase text-black pl-0.5 transition-all">📜 Past Transaction Logs</h4>
            </div>

            <div className="relative border-b-0">
              <Search className="w-3.5 h-3.5 text-black absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter transactions by treat, status, client..."
                className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
                value={searchSalesQuery}
                onChange={(e) => setSearchSalesQuery(e.target.value)}
              />
            </div>

            {/* Scrollable list of sales */}
            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-0.5 scrollbar-hide">
              {[...sales]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .filter(s => {
                  const cust = customers.find(c => String(c.id).trim().toLowerCase() === String(s.customerId).trim().toLowerCase());
                  const clientName = cust ? cust.name : 'Unknown Customer';
                  return s.items.some(item => {
                    const prod = products.find(p => String(p.id).trim().toLowerCase() === String(item.productId).trim().toLowerCase());
                    return prod?.name.toLowerCase().includes(searchSalesQuery.toLowerCase());
                  }) || clientName.toLowerCase().includes(searchSalesQuery.toLowerCase()) || s.status.toLowerCase().includes(searchSalesQuery.toLowerCase());
                })
                .length === 0 ? (
                  <div className="text-center py-8 bg-white border-2 border-black rounded-xl">
                    <p className="text-xs text-black/60 font-bold">No sales transaction records found.</p>
                  </div>
                ) : (
                  [...sales]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .filter(s => {
                      const cust = customers.find(c => String(c.id).trim().toLowerCase() === String(s.customerId).trim().toLowerCase());
                      const clientName = cust ? cust.name : 'Unknown Customer';
                      return s.items.some(item => {
                        const prod = products.find(p => String(p.id).trim().toLowerCase() === String(item.productId).trim().toLowerCase());
                        return prod?.name.toLowerCase().includes(searchSalesQuery.toLowerCase());
                      }) || clientName.toLowerCase().includes(searchSalesQuery.toLowerCase()) || s.status.toLowerCase().includes(searchSalesQuery.toLowerCase());
                    })
                    .map((sale) => {
                      const customer = customers.find(c => String(c.id).trim().toLowerCase() === String(sale.customerId).trim().toLowerCase());
                      const itemsSummary = sale.items.map(saleItem => {
                        const prod = products.find(p => String(p.id).trim().toLowerCase() === String(saleItem.productId).trim().toLowerCase());
                        return `${saleItem.quantity}x ${prod ? prod.name : 'Unknown'}`;
                      }).join(', ');

                      return (
                        <div
                          key={sale.id}
                          onClick={() => setSelectedSaleDetail(sale)}
                          className="p-2.5 bg-white border-2 border-black rounded-xl flex justify-between items-center shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:bg-[#9BE9FB]/5 hover:border-black active:scale-[0.98] duration-100 transition-all cursor-pointer gap-2 group"
                          title="Click to view detailed receipt"
                        >
                          <div className="flex-1 min-w-0 text-left">
                            <p className="font-extrabold text-[11px] text-black truncate group-hover:text-black transition-colors">{itemsSummary}</p>
                            <div className="flex flex-wrap items-center gap-1 mt-0.5 text-[9px] text-black/60 font-semibold leading-none">
                              <span className="text-black font-extrabold bg-[#9BE9FB]/70 px-1 py-0.2 rounded hover:bg-[#9BE9FB] transition-colors">{customer ? customer.name : 'Unknown Customer'}</span>
                              <span>|</span>
                              <span className="inline-flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-1.5">
                            <div>
                              <p className="font-black text-[#000000] text-xs font-numeral-lg">${sale.totalAmount.toFixed(2)}</p>
                              <span className={`text-[8px] uppercase font-black px-1.5 py-[1px] mt-0.5 inline-block border border-black shadow-[0.5px_0.5px_0px_#000000] rounded ${sale.status === 'Paid' ? 'bg-[#9BE9FB] text-black' : 'bg-[#FFD8E8] text-black'}`}>
                                {sale.status === 'Paid' ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-black stroke-[3.5] shrink-0 group-hover:translate-x-0.5 duration-100 transition-transform" />
                          </div>
                        </div>
                      );
                    })
                )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-3.5 bg-rose-50 border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_#000000] space-y-2 select-none">
            <div className="flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <h4 className="text-[10px] font-black uppercase text-rose-800 tracking-wider">Store Reset & Fresh Start</h4>
            </div>
            <p className="text-[9.5px] text-rose-950 border-l-2 border-rose-400 pl-2 leading-relaxed font-semibold">
              Clear out all historical sales statistics, cumulative revenue tracker, receipts history list, and payment records to start clean for your fresh sweet product batch.
            </p>
            <button
              type="button"
              onClick={() => { setActiveModal('reset-confirm'); }}
              className="w-full bg-[#fae8ff] hover:bg-[#ebf8ff] text-purple-950 font-black py-2.5 rounded-lg text-[9px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-center"
            >
              Clear Sales History & Start Fresh →
            </button>
          </div>
        </div>
      ) : (
        // SUBTAB 2: Profit Estimator Simulator
        <div className="space-y-4 animate-[fadeIn_0.1s_ease-out]">
          <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2.5px_2.5px_0px_#000000]">
            <h3 className="text-xs font-extrabold text-black uppercase tracking-wide">💡 Profit Margin Estimator</h3>
            <p className="text-[10px] text-black/75 mt-0.5 font-semibold leading-relaxed">
              Simulate the profit potential before scaling up or buying candy lots. Keep calculations safe with valid positive entries.
            </p>
          </div>

          {estSellingPriceNum > 0 && estCostPerItemNum >= estSellingPriceNum && (
            <div className="p-2.5 bg-amber-50 border-2 border-amber-500 rounded-xl text-[10px] font-black text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Unit cost is equal to or higher than store price! You will sell at a financial loss.</span>
            </div>
          )}

          {estSellingPriceNum > 0 && calculatedDiscountedPrice < estCostPerItemNum && estCostPerItemNum < estSellingPriceNum && (
            <div className="p-2.5 bg-rose-50 border-2 border-rose-500 rounded-xl text-[10px] font-black text-rose-950 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Discount offsets price below purchase cost. Discounted price: ${calculatedDiscountedPrice.toFixed(2)} vs Cost: ${estCostPerItemNum.toFixed(2)}!</span>
            </div>
          )}

          {/* INPUT FORM PANEL */}
          <div className="bg-white rounded-xl p-3.5 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-3.5 text-xs">
            {/* Input 1: Total items count */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center">
                <label className="font-extrabold text-black uppercase tracking-wider text-[9px]">Total Treat Candies Count</label>
                <span className="font-mono text-[9px] text-black bg-slate-100 border border-slate-300 px-1.5 rounded">{estTotalItemsNum} units</span>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  placeholder="e.g. 100"
                  min="0"
                  className="flex-1 bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-xs"
                  value={estTotalItems}
                  onChange={(e) => setEstTotalItems(e.target.value)}
                />
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => setEstTotalItems(Math.max(0, estTotalItemsNum - 10).toString())} className="p-1 px-2 border border-black rounded-lg font-black hover:bg-slate-100 bg-white">-10</button>
                  <button type="button" onClick={() => setEstTotalItems((estTotalItemsNum + 10).toString())} className="p-1 px-2 border border-black rounded-lg font-black hover:bg-slate-100 bg-white">+10</button>
                  <button type="button" onClick={() => setEstTotalItems('100')} className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white text-[9px] uppercase">Reset</button>
                </div>
              </div>
            </div>

            {/* Input 2: Cost Per Item */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center">
                <label className="font-extrabold text-black uppercase tracking-wider text-[9px]">Unit Cost (Buy Price)</label>
                <span className="font-mono text-[9px] text-black bg-slate-100 border border-slate-300 px-1.5 rounded">${estCostPerItemNum.toFixed(2)}</span>
              </div>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-black text-xs">$</span>
                  <input type="number" step="0.10" placeholder="e.g. 1.20" min="0" className="w-full bg-white border-2 border-black rounded-lg pl-6 pr-2 py-1 font-bold text-xs" value={estCostPerItem} onChange={(e) => setEstCostPerItem(e.target.value)} />
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => setEstCostPerItem(Math.max(0, estCostPerItemNum - 0.10).toFixed(2))} className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white">-$0.1</button>
                  <button type="button" onClick={() => setEstCostPerItem((estCostPerItemNum + 0.10).toFixed(2))} className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white">+$0.1</button>
                </div>
              </div>
            </div>

            {/* Input 3: Store Selling Price */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center">
                <label className="font-extrabold text-black uppercase tracking-wider text-[9px]">Retail Store Price</label>
                <span className="font-mono text-[9px] text-black bg-slate-100 border border-slate-300 px-1.5 rounded">${estSellingPriceNum.toFixed(2)}</span>
              </div>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-black text-xs">$</span>
                  <input type="number" step="0.10" placeholder="e.g. 2.50" min="0" className="w-full bg-white border-2 border-black rounded-lg pl-6 pr-2 py-1 font-bold text-xs" value={estSellingPrice} onChange={(e) => setEstSellingPrice(e.target.value)} />
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => setEstSellingPrice(Math.max(0, estSellingPriceNum - 0.25).toFixed(2))} className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white">-$0.25</button>
                  <button type="button" onClick={() => setEstSellingPrice((estSellingPriceNum + 0.25).toFixed(2))} className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white">+$0.25</button>
                </div>
              </div>
            </div>

            {/* Dual sliders: Discount & Sell-Through */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1">
                <label className="font-extrabold text-black uppercase tracking-wider text-[9px] block">Comp Discount %</label>
                <div className="flex gap-1">
                  <input type="number" min="0" max="100" className="w-full bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-xs" value={estDiscountPercent} onChange={(e) => setEstDiscountPercent(e.target.value)} />
                  <div className="flex flex-col gap-0.5 text-[8px]">
                    <button type="button" onClick={() => setEstDiscountPercent(Math.max(0, estDiscountPercentNum - 5).toString())} className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold">-5%</button>
                    <button type="button" onClick={() => setEstDiscountPercent(Math.min(100, estDiscountPercentNum + 5).toString())} className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold">+5%</button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-extrabold text-black uppercase tracking-wider text-[9px] block">Sell-Through %</label>
                <div className="flex gap-1">
                  <input type="number" min="0" max="100" className="w-full bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-xs" value={estSellThroughPercent} onChange={(e) => setEstSellThroughPercent(e.target.value)} />
                  <div className="flex flex-col gap-0.5 text-[8px]">
                    <button type="button" onClick={() => setEstSellThroughPercent(Math.max(0, estSellThroughPercentNum - 5).toString())} className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold">-5%</button>
                    <button type="button" onClick={() => setEstSellThroughPercent(Math.min(100, estSellThroughPercentNum + 5).toString())} className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold">+5%</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CALCULATED OUTPUT METRICS PANEL */}
          <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_#000000] space-y-3">
            <h4 className="text-[11px] font-black uppercase text-black">📊 Projections Breakdown</h4>
            <div className="grid grid-cols-2 gap-3.5 text-left">
              <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                <span className="text-[8px] uppercase font-black text-black/60 leading-none">Capital Batches Cost</span>
                <p className="font-black text-xs text-black font-numeral-lg mt-0.5">${calculatedTotalCost.toFixed(2)}</p>
              </div>
              <div className={`p-2 border rounded-lg ${calculatedProfit >= 0 ? 'bg-[#FFD8E8]/70 border-rose-400' : 'bg-rose-50 border-rose-500'}`}>
                <span className="text-[8px] uppercase font-black text-[#000000]/60 leading-none">Net Potential Profit</span>
                <p className={`font-black text-xs font-numeral-lg mt-0.5 ${calculatedProfit >= 0 ? 'text-black' : 'text-red-700 font-extrabold'}`}>${calculatedProfit.toFixed(2)}</p>
              </div>
              <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                <span className="text-[8px] uppercase font-black text-black/60 leading-none">Projected Margin</span>
                <p className="font-black text-xs text-black font-numeral-lg mt-0.5">{calculatedProfitMarginPercent.toFixed(1)}%</p>
              </div>
              <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                <span className="text-[8px] uppercase font-black text-black/60 leading-none">Net profit / Swt</span>
                <p className="font-black text-xs text-black font-numeral-lg mt-0.5">${calculatedProfitPerItem.toFixed(2)}</p>
              </div>
              <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                <span className="text-[8px] uppercase font-black text-black/60 leading-none">Expected Units Sold</span>
                <p className="font-black text-xs text-black font-numeral-lg mt-0.5">{calculatedSellThroughUnits.toFixed(0)} of {estTotalItemsNum}</p>
              </div>
              <div className="p-2 border border-[#000000]/30 bg-[#9BE9FB]/40 rounded-lg">
                <span className="text-[8px] uppercase font-black text-black/80 leading-none">Cost Break-even</span>
                <p className="font-black text-xs text-black font-numeral-lg mt-0.5">
                  {calculatedDiscountedPrice > 0 ? `${Math.ceil(calculatedBreakEvenUnits)} units` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-[10px] text-black/75 space-y-1">
              <p>• **Potential batch revenue**: ${calculatedRevenue.toFixed(2)}</p>
              <p>• **Discount price per unit**: ${calculatedDiscountedPrice.toFixed(2)} {estDiscountPercentNum > 0 && `(after -${estDiscountPercentNum}% discount)`}</p>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN ANALYTICS OVERLAY */}
      {isChartFullScreen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
          <div className="bg-white border-4 border-black w-full max-w-4xl rounded-2xl shadow-[6px_6px_0px_#000000] p-4 sm:p-6 flex flex-col gap-5 text-left max-h-[96%] overflow-y-auto my-auto animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-4 border-black pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-lg text-black uppercase tracking-tight">Deep Sales & Profit Analytics</h3>
                </div>
                <p className="text-[10px] text-black/60 font-bold mt-1 uppercase">Detailed operation metrics and sales breakdowns for the period</p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border-2 border-black text-xs font-black shadow-[1.5px_1.5px_0px_#000000]">
                  <button type="button" onClick={() => setChartPeriod('week')} className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartPeriod === 'week' ? 'bg-black text-white shadow-[1px_1px_0px_#000000]' : 'text-black/60 hover:text-black'}`}>7 Days</button>
                  <button type="button" onClick={() => setChartPeriod('month')} className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartPeriod === 'month' ? 'bg-black text-white shadow-[1px_1px_0px_#000000]' : 'text-black/60 hover:text-black'}`}>30 Days</button>
                </div>
                <button onClick={() => setIsChartFullScreen(false)} className="p-2 border-2 border-black bg-[#FFD8E8] hover:bg-white text-black font-black rounded-lg shadow-[2px_2px_0px_#000000] cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 text-xs uppercase">
                  <Minimize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Minimize</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 space-y-4">
                <div className="p-3 bg-slate-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000000]">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-[9px] uppercase font-black text-black/40">Aggregated Sales Graphic</span>
                      <h4 className="text-xs font-extrabold text-black">Interactive Period Bar Chart</h4>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-extrabold text-black/70">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#9BE9FB] border border-black rounded-sm"></span>Revenue</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#FFD8E8] border border-black rounded-sm"></span>Net Profit</span>
                    </div>
                  </div>
                  <div className="h-48 w-full bg-white border-2 border-black rounded-lg p-2 relative flex flex-col justify-end select-none">
                    <div className="absolute inset-x-2 top-4 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                      <div className="border-t border-dashed border-slate-100 flex justify-between text-[7px] text-slate-400 font-extrabold font-mono">
                        <span>${chartMaxRevenue.toFixed(2)}</span><span>Max level</span>
                      </div>
                      <div className="border-t border-dashed border-slate-100 flex justify-between text-[7px] text-slate-400 font-extrabold font-mono">
                        <span>${(chartMaxRevenue * 0.66).toFixed(2)}</span><span>66%</span>
                      </div>
                      <div className="border-t border-dashed border-slate-100 flex justify-between text-[7px] text-slate-400 font-extrabold font-mono">
                        <span>${(chartMaxRevenue * 0.33).toFixed(2)}</span><span>33%</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-40 px-1 gap-1 z-10 pt-2">
                      {computedChartData.map((data, idx) => {
                        const revHeightPercent = chartMaxRevenue > 0 ? (data.revenue / chartMaxRevenue) * 80 : 0;
                        const profHeightPercent = chartMaxRevenue > 0 ? (data.profit / chartMaxRevenue) * 80 : 0;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                            onClick={() => setHoveredPointIdx(hoveredPointIdx === idx ? null : idx)}
                            onMouseEnter={() => setHoveredPointIdx(idx)}
                            onMouseLeave={() => setHoveredPointIdx(null)}
                          >
                            <div className="w-full flex items-end justify-center gap-[1px] h-full pb-1">
                              <div style={{ height: `${Math.max(4, revHeightPercent)}%` }} className={`w-3 sm:w-4 border-2 border-black rounded-t-sm transition-all duration-200 ${hoveredPointIdx === idx ? 'bg-[#9BE9FB] translate-y-[-2px] scale-x-[1.1] shadow-[1.5px_1.5px_0px_#000000]' : 'bg-[#9BE9FB]/90 shadow-[0.5px_0.5px_0px_#000000]'}`} />
                              <div style={{ height: `${Math.max(2, profHeightPercent)}%` }} className={`w-3 sm:w-4 border-2 border-black rounded-t-sm transition-all duration-200 ${hoveredPointIdx === idx ? 'bg-[#FFD8E8] translate-y-[-2px] scale-x-[1.1] shadow-[1.5px_1.5px_0px_#000000]' : 'bg-[#FFD8E8]/90 shadow-[0.5px_0.5px_0px_#000000]'}`} />
                            </div>
                            {(chartPeriod === 'week' || idx % 4 === 0 || idx === computedChartData.length - 1) && (
                              <span className="text-[7.5px] text-black font-black truncate max-w-full mt-1 bg-slate-150 px-1 py-0.2 rounded">{data.label}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-[#9BE9FB]/10 rounded-xl p-3.5 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] text-xs">
                  {hoveredPointIdx !== null ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b-2 border-dashed border-black/10 pb-1.5">
                        <h5 className="font-extrabold text-black uppercase">Detailed Stats ({computedChartData[hoveredPointIdx].label})</h5>
                        <span className="text-[8px] uppercase font-black px-1.5 py-0.2 bg-black text-white rounded font-mono">{computedChartData[hoveredPointIdx].dateStr}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-0.5 select-none">
                        <div className="bg-white p-1.5 rounded-lg border border-black">
                          <span className="text-[8px] text-black/50 font-bold block uppercase leading-none">Gross Sales</span>
                          <span className="font-black text-sm text-black font-numeral-md">${computedChartData[hoveredPointIdx].revenue.toFixed(2)}</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-black">
                          <span className="text-[8px] text-black/50 font-bold block uppercase leading-none">Net Profit</span>
                          <span className="font-black text-sm text-emerald-700 font-numeral-md">${computedChartData[hoveredPointIdx].profit.toFixed(2)}</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-black">
                          <span className="text-[8px] text-black/50 font-bold block uppercase leading-none">Transactions</span>
                          <span className="font-black text-sm text-black font-numeral-md">{computedChartData[hoveredPointIdx].txCount}</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-black/70 font-semibold italic text-center pt-1 animate-[fadeIn_0.1s_ease-out]">
                        Margin of this day is roughly {computedChartData[hoveredPointIdx].revenue > 0 ? Math.round((computedChartData[hoveredPointIdx].profit / computedChartData[hoveredPointIdx].revenue) * 100) : 0}% of gross receipts.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-4 select-none">
                      <Sparkles className="w-5 h-5 text-[#9BE9FB] mb-1.5 animate-pulse" />
                      <p className="font-black text-black">Hover over any graph columns</p>
                      <p className="text-[9px] text-black/60 font-semibold mt-0.5">To inspect that day's individual transactions, profits, and margin breakdowns.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-5 space-y-4">
                <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-black">📈 Period Summary</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2 rounded-lg border border-black">
                      <span className="text-[8px] text-black/50 font-black block leading-none uppercase">Cumulative Sales</span>
                      <span className="text-xs font-black text-black font-numeral-lg block mt-1">${overallPeriodRevenue.toFixed(2)}</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg border border-black">
                      <span className="text-[8px] text-emerald-800/60 font-black block leading-none uppercase">Cumulative Profit</span>
                      <span className="text-xs font-black text-emerald-700 font-numeral-lg block mt-1">${overallPeriodProfit.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-black">
                      <span className="text-[8px] text-black/50 font-black block leading-none uppercase">Average Order Size</span>
                      <span className="text-xs font-black text-black font-numeral-lg block mt-1">${overallPeriodOrders > 0 ? (overallPeriodRevenue / overallPeriodOrders).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-black">
                      <span className="text-[8px] text-black/50 font-black block leading-none uppercase">Avg Profit Margin</span>
                      <span className="text-xs font-black text-purple-700 font-numeral-lg block mt-1">{overallPeriodRevenue > 0 ? Math.round((overallPeriodProfit / overallPeriodRevenue) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h5 className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 inline-block">🚀 Sales Spike Peak</h5>
                    <p className="text-[10px] font-semibold text-black/80 mt-1 leading-normal">
                      Your absolute peak sales day of the period was <strong className="font-extrabold text-black">{peakSalesDayPoint.label} ({peakSalesDayPoint.dateStr})</strong> netting a gross of <strong className="font-black text-black">${peakSalesDayPoint.revenue.toFixed(2)}</strong>!
                    </p>
                  </div>
                  <div className="bg-[#9BE9FB] font-black text-[13px] p-2.5 border-2 border-black rounded-lg shrink-0 font-numeral-lg select-none">${peakSalesDayPoint.revenue.toFixed(0)}</div>
                </div>

                <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2.5">
                  <h4 className="text-[10px] font-black uppercase text-black">🍬 Category Distribution Share</h4>
                  {Object.keys(computedCategorySales).length === 0 ? (
                    <p className="text-[9px] text-black/60 font-semibold text-center py-1">No sales data distributed to category buckets yet.</p>
                  ) : (
                    <div className="space-y-1.5 pt-0.5 select-none">
                      {Object.entries(computedCategorySales).sort((a, b) => b[1] - a[1]).map(([cat, val]) => {
                        const sharePercent = overallPeriodRevenue > 0 ? Math.round((val / overallPeriodRevenue) * 100) : 0;
                        return (
                          <div key={cat} className="text-[10px] space-y-0.5">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="font-extrabold text-black">{cat} ({sharePercent}%)</span>
                              <span className="text-black/60 font-numeral-sm">${val.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 border border-black rounded-full overflow-hidden flex">
                              <div style={{ width: `${sharePercent}%` }} className={`h-full border-r border-black font-semibold ${cat === 'Candy' ? 'bg-[#9BE9FB]' : ''} ${cat === 'Ice Cream' ? 'bg-[#FFD8E8]' : ''} ${cat === 'Cakes' ? 'bg-amber-300' : ''} ${cat === 'Cookies' ? 'bg-purple-300' : ''} ${cat === 'Other' ? 'bg-emerald-300' : 'bg-slate-400'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2 select-none">
                  <h4 className="text-[10px] font-black uppercase text-black">💳 Transactions Settlement Mix</h4>
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="font-extrabold text-blue-700">Immediate Payments (${periodPaidSalesTotal.toFixed(1)})</span>
                    <span className="font-extrabold text-red-600">Logged on tab (${periodTabSalesTotal.toFixed(1)})</span>
                  </div>
                  {(periodPaidSalesTotal + periodTabSalesTotal) > 0 ? (
                    <div>
                      <div className="w-full bg-slate-100 h-2.5 border border-black rounded-full overflow-hidden flex">
                        <div style={{ width: `${(periodPaidSalesTotal / (periodPaidSalesTotal + periodTabSalesTotal)) * 100}%` }} className="bg-sky-400 h-full border-r border-black" />
                        <div style={{ width: `${(periodTabSalesTotal / (periodPaidSalesTotal + periodTabSalesTotal)) * 100}%` }} className="bg-rose-400 h-full" />
                      </div>
                      <div className="flex justify-between text-[8px] font-semibold text-black/50 mt-1">
                        <span>{Math.round((periodPaidSalesTotal / (periodPaidSalesTotal + periodTabSalesTotal)) * 100)}% Paid Cash</span>
                        <span>{Math.round((periodTabSalesTotal / (periodPaidSalesTotal + periodTabSalesTotal)) * 100)}% Registered on tabs</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[9px] text-black/60 font-semibold text-center py-1">No settled operations split counted.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal A: Past Transaction Receipt Detail Drawer */}
      {selectedSaleDetail !== null && (
        <div className="absolute inset-0 bg-[#000000]/65 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
            <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#9BE9FB]" />
                <div className="text-left">
                  <h3 className="font-extrabold text-sm text-white">Transaction Receipt</h3>
                  <p className="text-[9px] text-[#FFD8E8] font-black uppercase tracking-widest font-mono">Invoice #{selectedSaleDetail.id.substring(0, 8)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSaleDetail(null)} className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-transform duration-100 active:scale-95">
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5 select-none scrollbar-hide text-left">
              <div className="bg-white p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-between gap-3">
                {(() => {
                  const cust = customers.find(c => String(c.id).trim().toLowerCase() === String(selectedSaleDetail.customerId).trim().toLowerCase());
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <img alt={cust ? cust.name : 'Guest'} className="w-10 h-10 rounded-full object-cover border-2 border-black" src={cust?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'} />
                        <div>
                          <p className="font-black text-xs text-black">{cust ? cust.name : 'Unknown Customer'}</p>
                          <span className="text-[9px] text-black/60 font-semibold block mt-0.5">{cust ? `Personal Discount: ${cust.discount}% off` : 'No custom profile savings'}</span>
                        </div>
                      </div>
                      {cust && cust.outstandingBalance > 0 && (
                        <div className="text-right bg-rose-50 border border-black p-1 px-2 rounded shadow-[1px_1px_0px_#000000]">
                          <p className="text-[7px] uppercase text-red-650 font-black tracking-wide leading-tight">Tab Debt</p>
                          <p className="text-[11px] font-black text-red-700 font-numeral-md leading-none">${cust.outstandingBalance.toFixed(2)}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] space-y-2.5">
                <p className="text-[10px] font-black uppercase text-black border-b border-black/10 pb-1.5 leading-none">🍬 Items Ledger list</p>
                <div className="space-y-2">
                  {selectedSaleDetail.items.map((saleItem, index) => {
                    const prod = products.find(p => String(p.id).trim().toLowerCase() === String(saleItem.productId).trim().toLowerCase());
                    const itemTotal = saleItem.quantity * saleItem.priceAtSale;
                    const originalCost = prod ? prod.cost : (saleItem.priceAtSale * 0.5);
                    const itemProfit = itemTotal - (saleItem.quantity * originalCost);
                    return (
                      <div key={index} className="flex justify-between items-center text-xs p-1 pb-1.5 border-b border-dashed border-black/10 last:border-0 last:pb-0">
                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold text-black block truncate">{prod ? prod.name : 'Unknown Product'}</span>
                          <span className="text-[9px] text-black/60 font-bold block mt-0.5">{saleItem.quantity} unit{saleItem.quantity > 1 ? 's' : ''} × ${saleItem.priceAtSale.toFixed(2)}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-black font-numeral-sm">${itemTotal.toFixed(2)}</p>
                          <p className="text-[8.5px] text-emerald-650 font-black">+${itemProfit.toFixed(2)} profit</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#9BE9FB]/15 p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center select-none">
                  <div className="bg-white p-2 text-center rounded-lg border border-black shadow-[1px_1px_0px_#000000]">
                    <span className="text-[8px] uppercase text-black/60 font-black block leading-none">Total Paid</span>
                    <h4 className="text-xs font-black text-black font-numeral-md mt-0.5">${selectedSaleDetail.totalAmount.toFixed(2)}</h4>
                  </div>
                  <div className="bg-white p-2 text-center rounded-lg border border-black shadow-[1px_1px_0px_#000000]">
                    <span className="text-[8px] uppercase text-emerald-600 font-extrabold block leading-none">Net Profit</span>
                    <h4 className="text-xs font-black text-emerald-600 font-numeral-md mt-0.5">
                      ${(() => {
                        let cost = 0;
                        selectedSaleDetail.items.forEach(saleItem => {
                          const prod = products.find(p => String(p.id).trim().toLowerCase() === String(saleItem.productId).trim().toLowerCase());
                          const c = prod ? prod.cost : (saleItem.priceAtSale * 0.5);
                          cost += (saleItem.quantity * c);
                        });
                        return (selectedSaleDetail.totalAmount - cost).toFixed(2);
                      })()}
                    </h4>
                  </div>
                </div>
                <div className="bg-white/90 p-2 rounded-lg border border-black text-left text-[9.5px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-black/50">Settlement Code:</span>
                    <span className={`text-[8.5px] font-black uppercase rounded px-1.5 py-0.2 ${selectedSaleDetail.status === 'Paid' ? 'bg-[#9BE9FB]' : 'bg-[#FFD8E8] text-rose-700'}`}>
                      {selectedSaleDetail.status === 'Paid' ? 'Paid in full' : 'Unpaid tab'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-dashed border-black/10 pt-1 mt-1">
                    <span className="text-black/50">Checkout Time:</span>
                    <span className="text-black font-semibold">{new Date(selectedSaleDetail.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedSaleDetail(null)} className="w-full bg-black hover:bg-[#9BE9FB] text-white hover:text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3.5px_3.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer">
                Close Receipt Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal B: Profit Split & Margins Category Details */}
      {showProfitBreakdown && (
        <div className="absolute inset-0 bg-[#000000]/65 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
            <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-left">
                <TrendingUp className="w-5 h-5 text-[#9BE9FB]" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">Candy Profit Split Details</h3>
                  <p className="text-[9px] text-[#FFD8E8] font-black uppercase tracking-widest font-mono">Real margins breakdown</p>
                </div>
              </div>
              <button onClick={() => setShowProfitBreakdown(false)} className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-all duration-100 active:scale-95">
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5 select-none scrollbar-hide text-left">
              <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[2.5px_2.5px_0px_#000000] text-[10px] space-y-1">
                <h4 className="font-extrabold uppercase text-[9px] text-black">💡 Marginal Cost Breakdown Summary</h4>
                <p className="text-black/75 font-semibold leading-relaxed">Visual cost analysis of sales versus sweet batch wholesale acquisition cost to determine pure net savings.</p>
              </div>

              {(() => {
                const categories: ('Candy' | 'Ice Cream' | 'Cookies' | 'Cakes' | 'Other')[] = ['Candy', 'Ice Cream', 'Cookies', 'Cakes', 'Other'];
                return (
                  <div className="space-y-3">
                    {categories.map(cat => {
                      let catSales = 0, catCost = 0, catUnits = 0;
                      sales.forEach(s => {
                        s.items.forEach(item => {
                          const p = products.find(prod => String(prod.id).trim().toLowerCase() === String(item.productId).trim().toLowerCase());
                          if (p && p.category === cat) {
                            catSales += (item.quantity * item.priceAtSale);
                            catCost += (item.quantity * p.cost);
                            catUnits += item.quantity;
                          } else if (!p && cat === 'Other') {
                            catSales += (item.quantity * item.priceAtSale);
                            catCost += (item.quantity * (item.priceAtSale * 0.5));
                            catUnits += item.quantity;
                          }
                        });
                      });
                      const catProfit = catSales - catCost;
                      const catMargin = catSales > 0 ? Math.round((catProfit / catSales) * 100) : 0;
                      return (
                        <div key={cat} className="bg-white p-3 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2">
                          <div className="flex justify-between items-center border-b border-black/5 pb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full border border-black ${cat === 'Candy' ? 'bg-[#9BE9FB]' : cat === 'Ice Cream' ? 'bg-[#FFD8E8]' : cat === 'Cakes' ? 'bg-amber-300' : cat === 'Cookies' ? 'bg-purple-300' : 'bg-emerald-300'}`} />
                              <span className="font-black text-xs text-black">{cat} Class</span>
                            </div>
                            <span className="text-[9px] font-black text-black/60">{catUnits} unit{catUnits > 1 ? 's' : ''} sold</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-bold">
                            <div><p className="text-black/50 text-[7px] uppercase leading-none">Gross Rev</p><p className="text-black font-extrabold font-numeral-sm mt-0.5">${catSales.toFixed(2)}</p></div>
                            <div><p className="text-black/50 text-[7px] uppercase leading-none">Stock Expense</p><p className="text-black font-semibold font-numeral-sm mt-0.5">${catCost.toFixed(2)}</p></div>
                            <div><p className="text-emerald-600 text-[7px] uppercase font-bold leading-none">Net Profit</p><p className="text-emerald-600 font-extrabold font-numeral-sm mt-0.5">${catProfit.toFixed(2)}</p></div>
                          </div>
                          <div className="pt-0.5">
                            <div className="flex justify-between items-center text-slate-500 text-[8px] font-extrabold mb-0.5">
                              <span>NET PROFIT MARGIN RATE</span>
                              <span className="text-black font-black font-mono">{catMargin}% efficiency</span>
                            </div>
                            <div className="w-full bg-slate-150 h-1.5 border border-black rounded-full overflow-hidden">
                              <div style={{ width: `${Math.max(0, Math.min(100, catMargin))}%` }} className={`h-full border-r border-black ${cat === 'Candy' ? 'bg-[#9BE9FB]' : cat === 'Ice Cream' ? 'bg-[#FFD8E8]' : cat === 'Cakes' ? 'bg-amber-300' : cat === 'Cookies' ? 'bg-purple-400' : 'bg-emerald-400'}`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="bg-white p-3 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-1.5">
                <h4 className="font-extrabold uppercase text-[9px] text-black border-b border-black/5 pb-1 leading-none">🏆 Highest Yielding treats catalog</h4>
                <div className="space-y-1 text-xs pt-0.5">
                  {(() => {
                    const treatProfitMap: Record<string, { name: string; profit: number }> = {};
                    sales.forEach(s => {
                      s.items.forEach(item => {
                        const p = products.find(prod => String(prod.id).trim().toLowerCase() === String(item.productId).trim().toLowerCase());
                        const prodName = p ? p.name : 'Unknown Product';
                        const prodCost = p ? p.cost : (item.priceAtSale * 0.5);
                        const profit = (item.quantity * item.priceAtSale) - (item.quantity * prodCost);
                        if (treatProfitMap[prodName]) { treatProfitMap[prodName].profit += profit; }
                        else { treatProfitMap[prodName] = { name: prodName, profit }; }
                      });
                    });
                    const sortedTreats = Object.values(treatProfitMap).sort((a, b) => b.profit - a.profit).slice(0, 3);
                    if (sortedTreats.length === 0) return <p className="text-[10px] text-black/50 font-bold text-center">No sales registered.</p>;
                    return sortedTreats.map((treat, idx) => (
                      <div key={idx} className="flex justify-between items-center py-0.5">
                        <span className="font-extrabold text-black truncate flex-1 pr-1">{idx + 1}. {treat.name}</span>
                        <span className="font-black text-emerald-650 font-numeral-sm shrink-0">+${treat.profit.toFixed(2)}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <button onClick={() => setShowProfitBreakdown(false)} className="w-full bg-black text-white hover:bg-[#FFD8E8] hover:text-black py-4 rounded-xl font-black text-xs uppercase border-2 border-black shadow-[3.5px_3.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer">
                Back to Sales Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal C: Average Order Value / Volumetric Statistics */}
      {showAverageOrderDetails && (
        <div className="absolute inset-0 bg-black/65 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
            <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-left">
                <Calculator className="w-5 h-5 text-[#9BE9FB]" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">Average Checkout Analytics</h3>
                  <p className="text-[9px] text-[#FFD8E8] font-black uppercase tracking-widest font-mono font-numeral-sm">Volumetric Stats</p>
                </div>
              </div>
              <button onClick={() => setShowAverageOrderDetails(false)} className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-all duration-100 active:scale-95">
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5 select-none scrollbar-hide text-left">
              <div className="grid grid-cols-3 gap-2 text-center select-none">
                {(() => {
                  const amounts = sales.map(s => s.totalAmount);
                  const minOrder = amounts.length > 0 ? Math.min(...amounts) : 0;
                  const maxOrder = amounts.length > 0 ? Math.max(...amounts) : 0;
                  return (
                    <>
                      <div className="bg-white p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
                        <span className="text-[8px] uppercase text-black/55 font-bold block leading-none">Min Spend</span>
                        <h4 className="text-[11px] font-black text-black font-numeral-md mt-1">${minOrder.toFixed(2)}</h4>
                      </div>
                      <div className="bg-[#9BE9FB] p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
                        <span className="text-[8px] uppercase text-black/75 font-black block leading-none">Average</span>
                        <h4 className="text-[11px] font-black text-black font-numeral-md mt-1">${avgOrderValueComputed.toFixed(2)}</h4>
                      </div>
                      <div className="bg-[#FFD8E8] p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
                        <span className="text-[8px] uppercase text-black/75 font-black block leading-none">Max Spend</span>
                        <h4 className="text-[11px] font-black text-black font-numeral-md mt-1">${maxOrder.toFixed(2)}</h4>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="bg-white rounded-xl p-3.5 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] text-[10px] space-y-1.5 leading-relaxed">
                <h4 className="font-extrabold uppercase text-[9px] text-black">🍬 Checkout Volume distribution</h4>
                <p className="text-black/80 font-semibold">The Average Order Value (AOV) assists in choosing sweet bundling tactics. Selling pre-packed candy bags typically increases this baseline count.</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2.5">
                <h4 className="font-extrabold uppercase text-[9px] text-black border-b border-black/5 pb-1 leading-none">👥 High Frequency customers</h4>
                <div className="space-y-2 text-xs">
                  {(() => {
                    const clientSalesMap: Record<string, { name: string; avatar: string; count: number; spent: number }> = {};
                    sales.forEach(s => {
                      const cust = customers.find(c => String(c.id).trim().toLowerCase() === String(s.customerId).trim().toLowerCase());
                      const name = cust ? cust.name : 'Guest';
                      const avatar = cust ? cust.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80';
                      if (clientSalesMap[name]) { clientSalesMap[name].count += 1; clientSalesMap[name].spent += s.totalAmount; }
                      else { clientSalesMap[name] = { name, avatar, count: 1, spent: s.totalAmount }; }
                    });
                    const activeClients = Object.values(clientSalesMap).sort((a, b) => b.count - a.count).slice(0, 3);
                    if (activeClients.length === 0) return <p className="text-[10px] text-black/50 font-bold text-center py-1">No transactions generated.</p>;
                    return activeClients.map((cl, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <img src={cl.avatar} alt={cl.name} className="w-6 h-6 rounded-full border border-black object-cover" />
                          <span className="font-extrabold text-black text-xs">{cl.name}</span>
                        </div>
                        <div className="text-right leading-none">
                          <p className="font-black text-black font-numeral-sm text-xs">{cl.count} purchase{cl.count > 1 ? 's' : ''}</p>
                          <p className="text-[9px] text-[#000000]/50 font-medium font-numeral-sm mt-0.5">Sum: ${cl.spent.toFixed(2)}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <button onClick={() => setShowAverageOrderDetails(false)} className="w-full bg-black text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-xs uppercase border-2 border-black shadow-[3.5px_3.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer">
                Back to Sales Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
