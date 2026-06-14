import { useState, useEffect } from 'react';
import { 
  Customer, 
  Product, 
  Sale, 
  Payment 
} from './types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_PAYMENTS 
} from './sampleData';
import { databaseService } from './supabaseService';
import { 
  TrendingUp, 
  PiggyBank, 
  AlertCircle, 
  Coins, 
  Cookie, 
  Cake as CakeIcon, 
  Search, 
  Plus, 
  Minus, 
  X, 
  CreditCard, 
  History, 
  Sparkles, 
  Trash2, 
  Pencil,
  User, 
  Clock, 
  ShoppingBag, 
  UserPlus, 
  Bell, 
  Percent, 
  ArrowLeft,
  ChevronRight,
  Store,
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Calculator,
  BarChart3,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function App() {
  // Global State Engines
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);

  // Supabase states
  const [dbActive, setDbActive] = useState<boolean>(false);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initData() {
      try {
        setDbLoading(true);
        const data = await databaseService.loadAllData();
        setCustomers(data.customers);
        setProducts(data.products);
        setSales(data.sales);
        setPayments(data.payments);
        setDbActive(data.supabaseActive);
      } catch (e) {
        console.error("Initialization error", e);
      } finally {
        setDbLoading(false);
      }
    }
    initData();
  }, []);

  // Mobile drawer navigation state
  // Can be 'none' | 'outstanding' | 'sales' | 'inventory' | 'customers' | 'add-sale' | 'add-payment' | 'add-customer'
  const [activeModal, setActiveModal] = useState<string>('none');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'customers' | 'products'>('dashboard');
  const [salesSubTab, setSalesSubTab] = useState<'analytics' | 'estimator'>('analytics');
  
  // Profit Estimator inputs state
  const [estTotalItems, setEstTotalItems] = useState<string>('120');
  const [estCostPerItem, setEstCostPerItem] = useState<string>('1.50');
  const [estSellingPrice, setEstSellingPrice] = useState<string>('3.50');
  const [estDiscountPercent, setEstDiscountPercent] = useState<string>('10');
  const [estSellThroughPercent, setEstSellThroughPercent] = useState<string>('90');
  
  // Auxiliary UI States
  const [selectedCustomerIdForPayment, setSelectedCustomerIdForPayment] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'E-transfer'>('Cash');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Database Fresh start state triggers
  const [resetConfirmationText, setResetConfirmationText] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // New Sale UI states
  const [saleCustomerId, setSaleCustomerId] = useState<string>('');
  const [saleCart, setSaleCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [saleIsTab, setSaleIsTab] = useState<boolean>(false);
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState<string>('');

  // New Customer Register States
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustDiscount, setNewCustDiscount] = useState<string>('0');
  const [newCustSuccess, setNewCustSuccess] = useState<string | null>(null);

  // Edit Customer States
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editCustName, setEditCustName] = useState<string>('');
  const [editCustDiscount, setEditCustDiscount] = useState<string>('0');

  // Edit Product States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdName, setEditProdName] = useState<string>('');
  const [editProdCost, setEditProdCost] = useState<string>('');
  const [editProdPrice, setEditProdPrice] = useState<string>('');
  const [editProdCategory, setEditProdCategory] = useState<Product['category']>('Candy');
  const [editProdStock, setEditProdStock] = useState<string>('0');

  // New Product Register States
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdCost, setNewProdCost] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<string>('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Candy');
  const [newProdStock, setNewProdStock] = useState<string>('0');
  const [newProdSuccess, setNewProdSuccess] = useState<string | null>(null);

  // Delete confirmation states
  const [confirmDeleteCustomerId, setConfirmDeleteCustomerId] = useState<string | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);

  // Search filter terms inside modals
  const [searchOutstandingQuery, setSearchOutstandingQuery] = useState('');
  const [searchSalesQuery, setSearchSalesQuery] = useState('');
  const [searchInventoryQuery, setSearchInventoryQuery] = useState('');
  const [searchCustomerQuery, setSearchCustomerQuery] = useState('');

  // Selected customer for history view inside the customer drawer
  const [viewedCustomerHistoryId, setViewedCustomerHistoryId] = useState<string | null>(null);

  // Notification Buzz states (for simulated WhatsApp / SMS gentle tab reminder)
  const [buzzStatus, setBuzzStatus] = useState<string | null>(null);

  // Extra detailed interactive view states for Sales page
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);
  const [showProfitBreakdown, setShowProfitBreakdown] = useState<boolean>(false);
  const [showAverageOrderDetails, setShowAverageOrderDetails] = useState<boolean>(false);

  // Sales Graph visual states
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [isChartFullScreen, setIsChartFullScreen] = useState<boolean>(false);
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  const getDiscountStyle = (discount: number) => {
    if (discount >= 20) return 'bg-purple-100 text-purple-900 border border-purple-200';
    if (discount >= 10) return 'bg-amber-100 text-amber-900 border border-amber-200';
    if (discount > 0) return 'bg-cyan-100 text-cyan-900 border border-cyan-200';
    return 'bg-slate-100 text-slate-500 border border-slate-200';
  };

  // --------------------------------------------------------
  // METRICS COMPUTATIONS (Calculated dynamically of state)
  // --------------------------------------------------------
  const totalSalesVal = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalOutstandingVal = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const cashCollectedVal = totalSalesVal - totalOutstandingVal;
  
  // Calculate profits based on cost of items sold
  let calculatedCost = 0;
  sales.forEach(s => {
    s.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        calculatedCost += (item.quantity * prod.cost);
      } else {
        calculatedCost += (item.quantity * (item.priceAtSale * 0.5)); // 50% margin fallback
      }
    });
  });
  const totalProductProfits = totalSalesVal - calculatedCost;
  const averageMarginPercent = totalSalesVal > 0 ? Math.round((totalProductProfits / totalSalesVal) * 100) : 0;

  // Target values
  const currentWeekGoal = 1500;
  const breakEvenProgressPercent = Math.min(Math.round((totalSalesVal / currentWeekGoal) * 100), 100);

  // --------------------------------------------------------
  // EXTRA ANALYTICS & PROFIT ESTIMATOR COMPUTATIONS
  // --------------------------------------------------------
  const ordersCountComputed = sales.length;
  const avgOrderValueComputed = ordersCountComputed > 0 ? (totalSalesVal / ordersCountComputed) : 0;

  // --------------------------------------------------------
  // GENERATE CHART DATA DYNAMICALLY FROM SALES STATE
  // --------------------------------------------------------
  const numDaysToGenerate = chartPeriod === 'week' ? 7 : 30;
  const computedChartData: {
    label: string;
    dateStr: string;
    revenue: number;
    profit: number;
    txCount: number;
  }[] = [];

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
        const sDateStr = new Date(s.date).toISOString().split('T')[0];
        return sDateStr === dateStr;
      } catch {
        return false;
      }
    });

    const dayRevenue = salesOnDay.reduce((sum, s) => sum + s.totalAmount, 0);
    const dayProfit = salesOnDay.reduce((sum, s) => {
      let dayCost = 0;
      s.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          dayCost += (item.quantity * prod.cost);
        } else {
          dayCost += (item.quantity * (item.priceAtSale * 0.5));
        }
      });
      return sum + (s.totalAmount - dayCost);
    }, 0);

    computedChartData.push({
      label,
      dateStr,
      revenue: parseFloat(dayRevenue.toFixed(2)),
      profit: parseFloat(dayProfit.toFixed(2)),
      txCount: salesOnDay.length
    });
  }

  // Calculate high level analytics for full-screen insights view
  const chartMaxRevenue = Math.max(...computedChartData.map(d => d.revenue), 10);
  const chartMaxProfit = Math.max(...computedChartData.map(d => d.profit), 10);
  const overallPeriodRevenue = computedChartData.reduce((sum, d) => sum + d.revenue, 0);
  const overallPeriodProfit = computedChartData.reduce((sum, d) => sum + d.profit, 0);
  const overallPeriodOrders = computedChartData.reduce((sum, d) => sum + d.txCount, 0);

  // Peak sales day finder
  const peakSalesDayPoint = computedChartData.reduce(
    (peak, current) => (current.revenue > peak.revenue ? current : peak),
    { label: 'None', dateStr: '', revenue: 0, profit: 0, txCount: 0 }
  );

  // Categorical sales breakdown for current chart period
  const computedCategorySales: { [cat: string]: number } = {};
  computedChartData.forEach(day => {
    const salesOnDay = sales.filter(s => {
      try {
        const sDateStr = new Date(s.date).toISOString().split('T')[0];
        return sDateStr === day.dateStr;
      } catch {
        return false;
      }
    });
    salesOnDay.forEach(s => {
      s.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod ? prod.category : 'Other';
        const saleVal = item.quantity * item.priceAtSale;
        computedCategorySales[cat] = (computedCategorySales[cat] || 0) + saleVal;
      });
    });
  });

  // Paid vs Tab pending mix over current period
  let periodPaidSalesTotal = 0;
  let periodTabSalesTotal = 0;
  computedChartData.forEach(day => {
    const salesOnDay = sales.filter(s => {
      try {
        const sDateStr = new Date(s.date).toISOString().split('T')[0];
        return sDateStr === day.dateStr;
      } catch {
        return false;
      }
    });
    salesOnDay.forEach(s => {
      if (s.status === 'Paid') {
        periodPaidSalesTotal += s.totalAmount;
      } else {
        periodTabSalesTotal += s.totalAmount;
      }
    });
  });

  // Build top-selling catalog item counts dynamically from state
  const topSellersMap: { [productId: string]: number } = {};
  sales.forEach(s => {
    s.items.forEach(item => {
      topSellersMap[item.productId] = (topSellersMap[item.productId] || 0) + item.quantity;
    });
  });

  const computedTopSellers = Object.entries(topSellersMap)
    .map(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      return {
        id,
        name: prod ? prod.name : 'Unknown Candies',
        category: prod ? prod.category : 'Sweets',
        quantity: qty,
        revenue: qty * (prod ? prod.price : 0),
        cost: qty * (prod ? prod.cost : 0),
        profit: qty * ((prod ? prod.price : 0) - (prod ? prod.cost : 0)),
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  // Sanitized & Clamp Validated Profit Estimator Numbers
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

  // --------------------------------------------------------
  // WRITE OPERATIONS (Dynamic State Reducers)
  // --------------------------------------------------------
  
  // 1. ADD NEW CUSTOMER PROFILE
  const handleAddCustomer = async (name: string, discount: number) => {
    const avatarId = Math.floor(Math.random() * 70) + 1;
    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name: name,
      discount: discount,
      avatar: `https://i.pravatar.cc/150?img=${avatarId}`,
      purchaseCount: 0,
      totalSpent: 0,
      outstandingBalance: 0
    };
    await databaseService.saveCustomer(newCust, true, [...customers, newCust]);
    setCustomers(prev => {
      if (prev.some(c => c.id === newCust.id)) {
        return prev;
      }
      return [...prev, newCust];
    });
    setNewCustSuccess(`Profile saved for ${name}!`);
    setTimeout(() => setNewCustSuccess(null), 3000);
  };

  // 1b. ADD NEW PRODUCT PROFILE
  const handleAddProduct = async (name: string, cost: number, price: number, category: Product['category'], stock: number) => {
    const status = stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';
    const newProd: Product = {
      id: `p_${Date.now()}`,
      name,
      cost,
      price,
      category,
      stock,
      icon: 'Cookie',
      status
    };
    await databaseService.saveProduct(newProd, true, [...products, newProd]);
    setProducts(prev => {
      if (prev.some(p => p.id === newProd.id)) {
        return prev;
      }
      return [...prev, newProd];
    });
    setNewProdSuccess(`Product saved for ${name}!`);
    setTimeout(() => setNewProdSuccess(null), 3000);
  };

  // 2. ADD NEW SALE
  const handleRecordSale = (customerId: string, cartItems: { productId: string; quantity: number }[], totalAmount: number, payTypeTab: boolean) => {
    const isTab = payTypeTab && customerId !== '';
    const finalCustId = customerId;

    // Verify stock and reduce state
    let nextSavedProducts: Product[] = [];
    setProducts(prevProducts => {
      const updated = prevProducts.map(p => {
        const cartItem = cartItems.find(item => item.productId === p.id);
        if (cartItem) {
          const nextStock = Math.max(0, p.stock - cartItem.quantity);
          const status = nextStock === 0 ? 'Out of Stock' : nextStock <= 5 ? 'Low Stock' : 'In Stock';
          const nextProd = { ...p, stock: nextStock, status };
          databaseService.saveProduct(nextProd, false);
          return nextProd;
        }
        return p;
      });
      nextSavedProducts = updated;
      localStorage.setItem('treat_tab_products', JSON.stringify(updated));
      return updated;
    });

    // Increase purchase count & optionally tab balance
    setCustomers(prevCusts => {
      const updated = prevCusts.map(c => {
        if (c.id === finalCustId) {
          const nextCust = {
            ...c,
            purchaseCount: c.purchaseCount + 1,
            totalSpent: c.totalSpent + totalAmount,
            outstandingBalance: isTab ? c.outstandingBalance + totalAmount : c.outstandingBalance
          };
          databaseService.saveCustomer(nextCust, false);
          return nextCust;
        }
        return c;
      });
      localStorage.setItem('treat_tab_customers', JSON.stringify(updated));
      return updated;
    });

    // Add sale entry
    const newSaleItem: Sale = {
      id: `s_${Date.now()}`,
      customerId: finalCustId,
      items: cartItems.map(item => {
        const prod = nextSavedProducts.find(p => p.id === item.productId)!;
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: prod ? prod.price : 0
        };
      }),
      totalAmount: totalAmount,
      status: isTab ? 'Pending' : 'Paid',
      date: new Date().toISOString()
    };

    setSales(prevSales => {
      const nextSales = [newSaleItem, ...prevSales];
      databaseService.saveSale(newSaleItem, nextSavedProducts, nextSales);
      return nextSales;
    });
  };

  // 3. ADD PAYMENT
  const handleRecordPayment = (customerId: string, amount: number, method: 'Cash' | 'E-transfer', notes: string) => {
    if (!customerId || amount <= 0) return;

    // Reduce customer tab balance
    setCustomers(prevCusts => {
      const updated = prevCusts.map(c => {
        if (c.id === customerId) {
          const resolvedNewBalance = Math.max(0, c.outstandingBalance - amount);
          const nextCust = {
            ...c,
            outstandingBalance: resolvedNewBalance
          };
          databaseService.saveCustomer(nextCust, false);
          return nextCust;
        }
        return c;
      });
      localStorage.setItem('treat_tab_customers', JSON.stringify(updated));
      return updated;
    });

    // Create payment entry
    const newPayment: Payment = {
      id: `p_${Date.now()}`,
      customerId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      notes
    };

    setPayments(prevPayments => {
      const nextPayments = [newPayment, ...prevPayments];
      databaseService.savePayment(newPayment, nextPayments);
      return nextPayments;
    });
  };

  // 4. INCREMENT / ADJUST AD-HOC STOCK
  const handleQuickAdjustStock = (productId: string, nextStock: number) => {
    setProducts(prevProds => {
      const updated = prevProds.map(p => {
        if (p.id === productId) {
          const status = nextStock === 0 ? 'Out of Stock' : nextStock <= 5 ? 'Low Stock' : 'In Stock';
          const nextProd = { ...p, stock: nextStock, status };
          databaseService.saveProduct(nextProd, false);
          return nextProd;
        }
        return p;
      });
      localStorage.setItem('treat_tab_products', JSON.stringify(updated));
      return updated;
    });
  };

  // 5. EDIT AND DELETE - PRODUCTS & CUSTOMERS
  const handleStartEditCustomer = (cust: Customer) => {
    setEditingCustomerId(cust.id);
    setEditCustName(cust.name);
    setEditCustDiscount(cust.discount.toString());
  };

  const handleSaveCustomerEdit = () => {
    if (!editingCustomerId) return;
    const discountNum = Math.max(0, Math.min(100, parseFloat(editCustDiscount) || 0));
    setCustomers(prev => {
      const updated = prev.map(c => {
        if (c.id === editingCustomerId) {
          const nextCust = {
            ...c,
            name: editCustName,
            discount: discountNum
          };
          databaseService.saveCustomer(nextCust, false);
          return nextCust;
        }
        return c;
      });
      localStorage.setItem('treat_tab_customers', JSON.stringify(updated));
      return updated;
    });
    setEditingCustomerId(null);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => {
      const updated = prev.filter(c => c.id !== id);
      databaseService.deleteCustomer(id, updated);
      return updated;
    });
    // Remove from viewed history view if currently opened
    if (viewedCustomerHistoryId === id) {
      setViewedCustomerHistoryId(null);
    }
    setEditingCustomerId(null);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditProdName(prod.name);
    setEditProdCost(prod.cost.toString());
    setEditProdPrice(prod.price.toString());
    setEditProdCategory(prod.category);
    setEditProdStock(prod.stock.toString());
  };

  const handleSaveProductEdit = () => {
    if (!editingProductId) return;
    const costNum = Math.max(0, parseFloat(editProdCost) || 0);
    const priceNum = Math.max(0, parseFloat(editProdPrice) || 0);
    const stockNum = Math.max(0, parseInt(editProdStock) || 0);
    const resolvedStatus = stockNum === 0 ? 'Out of Stock' : stockNum <= 5 ? 'Low Stock' : 'In Stock';

    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === editingProductId) {
          const nextProd = {
            ...p,
            name: editProdName,
            cost: costNum,
            price: priceNum,
            category: editProdCategory,
            stock: stockNum,
            status: resolvedStatus
          };
          databaseService.saveProduct(nextProd, false);
          return nextProd;
        }
        return p;
      });
      localStorage.setItem('treat_tab_products', JSON.stringify(updated));
      return updated;
    });
    setEditingProductId(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      databaseService.deleteProduct(id, updated);
      return updated;
    });
    // Clear product from cart if it was in the cart
    setSaleCart(prev => prev.filter(item => item.productId !== id));
    setEditingProductId(null);
  };

  // 5b. RESET SALES HISTORY / SECURE FRESH START
  const handleResetDatabase = async () => {
    if (resetConfirmationText.trim().toUpperCase() !== 'RESET') return;
    setDbLoading(true);
    try {
      await databaseService.clearAllSalesAndHistory();
      
      // Reload freshly cleaned records
      const freshData = await databaseService.loadAllData();
      setCustomers(freshData.customers);
      // Products might not have changed, but reload is safe
      setProducts(freshData.products);
      setSales(freshData.sales);
      setPayments(freshData.payments);
      setDbActive(freshData.supabaseActive);
      
      setResetSuccess("Clean start initiated! Past history cleared successfully.");
      setResetConfirmationText('');
      setTimeout(() => {
        setResetSuccess(null);
        setActiveModal('none');
      }, 2500);
    } catch (e) {
      console.error("Failed to clear database logs", e);
    } finally {
      setDbLoading(false);
    }
  };

  // --------------------------------------------------------
  // CART HELPERS TO COMPUTE DYNAMIC SALE PRICE
  // --------------------------------------------------------
  const selectedCustomer = customers.find(c => c.id === saleCustomerId);
  const saleCustomerDiscount = selectedCustomer ? selectedCustomer.discount : 0;
  const originalSubtotal = saleCart.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);
  const saleDiscountAmount = originalSubtotal * (saleCustomerDiscount / 100);
  const saleSubtotal = Math.max(0, originalSubtotal - saleDiscountAmount);

  const handleCartAdd = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod || prod.stock <= 0) return;

    setSaleCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        if (existing.quantity >= prod.stock) return prev; // Limit stock
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleCartDelta = (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    setSaleCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > prod.stock) return item; // Guard
          return { ...item, quantity: nextQty };
        }
        return item;
      }).filter(Boolean) as { productId: string; quantity: number }[];
    });
  };

  // Trigger simulated reminder
  const triggerBuzzReminder = (customerName: string) => {
    setBuzzStatus(`Friendly WhatsApp reminder triggered for ${customerName}!`);
    setTimeout(() => setBuzzStatus(null), 3000);
  };

  return (
    <div className="h-dvh bg-[#FFD8E8] flex items-center justify-center font-sans antialiased p-0 md:py-8 md:px-4">
      {/* Immersive Mobile Device Shell Frame - Neo-Brutalist Black Border Frame */}
      <div className="w-full max-w-md bg-white h-full max-h-full md:h-[850px] md:max-h-[850px] md:min-h-[850px] md:rounded-3xl border-4 border-[#000000] shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col relative">
        
        {/* Compact Mobile Top Header Status Bar - Solid Black with White Font */}
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
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 bg-[#FFFFFF]/10 px-3 py-1 rounded-full border border-[#FFFFFF]/25 select-none">
              <span className={`w-2 h-2 rounded-full ${dbLoading ? 'bg-slate-400 animate-pulse' : dbActive ? 'bg-emerald-400 animate-[pulse_1.5s_infinite]' : 'bg-amber-400'}`}></span>
              <span className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-wider">
                {dbLoading ? 'Connecting...' : dbActive ? 'Cloud Live' : 'Sandbox (Offline)'}
              </span>
            </div>
          </div>
        </header>

        {/* --- MAIN MOBILE COCKPIT VIEW --- */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 space-y-4 bg-[#FFD8E8]/10 relative">
          
          {/* DYNAMIC BUZZ REMINDER NOTIFICATION BANNER */}
          {buzzStatus && (
            <div className="p-3.5 bg-[#9BE9FB] text-black rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-2 mb-2 select-none z-30 animate-bounce">
              <Sparkles className="w-5 h-5 text-black" />
              <p className="text-xs font-black">{buzzStatus}</p>
            </div>
          )}

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
              {/* SUMMARY CARDS GRID with Neo-Brutalist pop colors and black outlines */}
              <section className="grid grid-cols-2 gap-3">
                {/* CARD 1: Outstanding Debt */}
                <div 
                  id="dash-card-debts"
                  onClick={() => {
                    setSearchOutstandingQuery('');
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
                  Goal: ${currentWeekGoal} target. {currentWeekGoal - totalSalesVal > 0 ? `$${(currentWeekGoal - totalSalesVal).toFixed(2)} to cover.` : "Break-even solved!"}
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
                      setSaleCart([]);
                      setSaleCustomerId('');
                      setSaleIsTab(false);
                      setSaleSuccess(null);
                      setProductSearch('');
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
                      setSelectedCustomerIdForPayment('');
                      setPaymentAmount('');
                      setPaymentNotes('');
                      setPaymentSuccess(null);
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
          )}

          {/* 2. SALES LEDGER HISTORY VIEW (INLINE) */}
          {activeTab === 'sales' && (
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
                // SUBTAB 1: Shopify/Etsy Style Analytics and History Logs
                <div className="space-y-4 animate-[fadeIn_0.1s_ease-out]">
                  {/* Shopify/Etsy style bold stats grid */}
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
                      onClick={() => {
                        setShowProfitBreakdown(true);
                      }}
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
                      onClick={() => {
                        setShowAverageOrderDetails(true);
                      }}
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
                      onClick={() => {
                        setSearchOutstandingQuery('');
                        setActiveModal('outstanding');
                      }}
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
                        {/* Period selector pill */}
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

                        {/* Full Screen button */}
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
                      {/* Responsive Styled Grouped Bar Chart */}
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
                                {/* Grouped bars */}
                                <div className="w-full flex items-end justify-center gap-[1px] h-full pb-1">
                                  {/* Revenue Bar */}
                                  <div 
                                    style={{ height: `${Math.max(4, revHeightPercent)}%` }}
                                    className={`w-2.5 sm:w-3.5 border border-black rounded-t-sm transition-all duration-200 ${
                                      hoveredPointIdx === idx ? 'bg-[#9BE9FB] translate-y-[-2px]' : 'bg-[#9BE9FB]/80'
                                    }`}
                                  />
                                  {/* Profit Bar */}
                                  <div 
                                    style={{ height: `${Math.max(2, profHeightPercent)}%` }}
                                    className={`w-2.5 sm:w-3.5 border border-black rounded-t-sm transition-all duration-200 ${
                                      hoveredPointIdx === idx ? 'bg-[#FFD8E8] translate-y-[-2px]' : 'bg-[#FFD8E8]/80'
                                    }`}
                                  />
                                </div>
                                
                                {/* Labels */}
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

                    {/* Scrollable list of sales inside the tab */}
                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-0.5 scrollbar-hide">
                      {[...sales]
                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

                  {/* Danger Zone: Fresh Start & Clean History */}
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
                      onClick={() => {
                        setResetConfirmationText('');
                        setActiveModal('reset-confirm');
                      }}
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

                  {/* Real-time Validation Banner Warnings */}
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

                  {/* INPUT FORM PANEL with quick click increments */}
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
                          <button
                            type="button"
                            onClick={() => setEstTotalItems(Math.max(0, estTotalItemsNum - 10).toString())}
                            className="p-1 px-2 border border-black rounded-lg font-black hover:bg-slate-100 bg-white"
                          >
                            -10
                          </button>
                          <button
                            type="button"
                            onClick={() => setEstTotalItems((estTotalItemsNum + 10).toString())}
                            className="p-1 px-2 border border-black rounded-lg font-black hover:bg-slate-100 bg-white"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => setEstTotalItems('100')}
                            className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white text-[9px] uppercase"
                          >
                            Reset
                          </button>
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
                          <input
                            type="number"
                            step="0.10"
                            placeholder="e.g. 1.20"
                            min="0"
                            className="w-full bg-white border-2 border-black rounded-lg pl-6 pr-2 py-1 font-bold text-xs"
                            value={estCostPerItem}
                            onChange={(e) => setEstCostPerItem(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEstCostPerItem(Math.max(0, estCostPerItemNum - 0.10).toFixed(2))}
                            className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white"
                          >
                            -$0.1
                          </button>
                          <button
                            type="button"
                            onClick={() => setEstCostPerItem((estCostPerItemNum + 0.10).toFixed(2))}
                            className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white"
                          >
                            +$0.1
                          </button>
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
                          <input
                            type="number"
                            step="0.10"
                            placeholder="e.g. 2.50"
                            min="0"
                            className="w-full bg-white border-2 border-black rounded-lg pl-6 pr-2 py-1 font-bold text-xs"
                            value={estSellingPrice}
                            onChange={(e) => setEstSellingPrice(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEstSellingPrice(Math.max(0, estSellingPriceNum - 0.25).toFixed(2))}
                            className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white"
                          >
                            -$0.25
                          </button>
                          <button
                            type="button"
                            onClick={() => setEstSellingPrice((estSellingPriceNum + 0.25).toFixed(2))}
                            className="p-1 px-1.5 border border-black rounded-lg font-black hover:bg-slate-100 bg-white"
                          >
                            +$0.25
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dual sliders/mini columns: Optional Discount & Expected Sell-Through */}
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      {/* Discount % */}
                      <div className="space-y-1">
                        <label className="font-extrabold text-black uppercase tracking-wider text-[9px] block">Comp Discount %</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-xs"
                            value={estDiscountPercent}
                            onChange={(e) => setEstDiscountPercent(e.target.value)}
                          />
                          <div className="flex flex-col gap-0.5 text-[8px]">
                            <button
                              type="button"
                              onClick={() => setEstDiscountPercent(Math.max(0, estDiscountPercentNum - 5).toString())}
                              className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold"
                            >
                              -5%
                            </button>
                            <button
                              type="button"
                              onClick={() => setEstDiscountPercent(Math.min(100, estDiscountPercentNum + 5).toString())}
                              className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold"
                            >
                              +5%
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sell-Through % */}
                      <div className="space-y-1">
                        <label className="font-extrabold text-black uppercase tracking-wider text-[9px] block">Sell-Through %</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full bg-white border-2 border-black rounded-lg px-2 py-1 font-bold text-xs"
                            value={estSellThroughPercent}
                            onChange={(e) => setEstSellThroughPercent(e.target.value)}
                          />
                          <div className="flex flex-col gap-0.5 text-[8px]">
                            <button
                              type="button"
                              onClick={() => setEstSellThroughPercent(Math.max(0, estSellThroughPercentNum - 5).toString())}
                              className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold"
                            >
                              -5%
                            </button>
                            <button
                              type="button"
                              onClick={() => setEstSellThroughPercent(Math.min(100, estSellThroughPercentNum + 5).toString())}
                              className="px-1 py-0.2 border border-black rounded hover:bg-slate-100 bg-white font-bold"
                            >
                              +5%
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CALCULATED OUTPUT METRICS PANEL */}
                  <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_#000000] space-y-3">
                    <h4 className="text-[11px] font-black uppercase text-black">📊 Projections Breakdown</h4>
                    
                    <div className="grid grid-cols-2 gap-3.5 text-left">
                      {/* Metric 1: Total Batch Cost */}
                      <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                        <span className="text-[8px] uppercase font-black text-black/60 leading-none">Capital Batches Cost</span>
                        <p className="font-black text-xs text-black font-numeral-lg mt-0.5">${calculatedTotalCost.toFixed(2)}</p>
                      </div>

                      {/* Metric 2: Net potential profit */}
                      <div className={`p-2 border rounded-lg ${calculatedProfit >= 0 ? 'bg-[#FFD8E8]/70 border-rose-400' : 'bg-rose-50 border-rose-500'}`}>
                        <span className="text-[8px] uppercase font-black text-[#000000]/60 leading-none">Net Potential Profit</span>
                        <p className={`font-black text-xs font-numeral-lg mt-0.5 ${calculatedProfit >= 0 ? 'text-black' : 'text-red-700 font-extrabold'}`}>
                          ${calculatedProfit.toFixed(2)}
                        </p>
                      </div>

                      {/* Metric 3: Profit Margin % */}
                      <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                        <span className="text-[8px] uppercase font-black text-black/60 leading-none">Projected Margin</span>
                        <p className="font-black text-xs text-black font-numeral-lg mt-0.5">{calculatedProfitMarginPercent.toFixed(1)}%</p>
                      </div>

                      {/* Metric 4: Projected Unit profit */}
                      <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                        <span className="text-[8px] uppercase font-black text-black/60 leading-none">Net profit / Swt</span>
                        <p className="font-black text-xs text-black font-numeral-lg mt-0.5">${calculatedProfitPerItem.toFixed(2)}</p>
                      </div>

                      {/* Metric 5: Estimated Sell Through count */}
                      <div className="p-2 border border-black/50 bg-slate-50 rounded-lg">
                        <span className="text-[8px] uppercase font-black text-black/60 leading-none">Expected Units Sold</span>
                        <p className="font-black text-xs text-black font-numeral-lg mt-0.5">{calculatedSellThroughUnits.toFixed(0)} of {estTotalItemsNum}</p>
                      </div>

                      {/* Metric 6: Break Even Sweets qty */}
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
            </div>
          )}

          {/* 3. CUSTOMER BASE & LEDGER VIEW (INLINE) */}
          {activeTab === 'customers' && (
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
                              .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                        setNewCustName('');
                        setNewCustDiscount('0');
                        setNewCustSuccess(null);
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
          )}

          {/* 4. PRODUCTS / INVENTORY CATALOG VIEW (INLINE) */}
          {activeTab === 'products' && (
            <div className="flex flex-col h-full animate-[fadeIn_0.15s_ease-out] text-left">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <div>
                  <h3 className="font-extrabold text-sm text-black">Sweet stock catalog</h3>
                  <p className="text-[10px] text-black/60 font-black">{products.length} registered profiles</p>
                </div>
                <button 
                  onClick={() => {
                    setNewProdName('');
                    setNewProdCost('');
                    setNewProdPrice('');
                    setNewProdCategory('Candy');
                    setNewProdStock('0');
                    setNewProdSuccess(null);
                    setActiveModal('add-product');
                  }}
                  className="p-1 px-2.5 bg-[#9BE9FB] text-black rounded-lg flex items-center justify-center border-2 border-black font-black text-[10px] shadow-[1.5px_1.5px_0px_#000000] hover:bg-white active:scale-95 transition-all cursor-pointer gap-1"
                  title="Add product profile"
                >
                  <Plus className="w-3.5 h-3.5" /> Product
                </button>
              </div>

              <div className="mb-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search treats catalog..."
                    className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
                    value={searchInventoryQuery}
                    onChange={(e) => setSearchInventoryQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Scrollable list of products inside tab */}
              <div className="space-y-2 overflow-y-auto max-h-[480px] mb-2 pr-0.5 scrollbar-hide">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchInventoryQuery.toLowerCase()) || p.category.toLowerCase().includes(searchInventoryQuery.toLowerCase()))
                  .map((prod) => {
                    const profitMargin = Math.round(((prod.price - prod.cost) / prod.price) * 100);
                    const outOfStock = prod.stock === 0;
                    return (
                      <div key={prod.id} className="p-2 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border-2 border-black shadow-[1px_1px_0px_#000000] shrink-0 ${
                            prod.category === 'Candy' ? 'bg-[#FFD8E8] text-black' : 'bg-[#9BE9FB] text-black'
                          }`}>
                            {prod.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-[11px] text-black truncate">{prod.name}</p>
                            <p className="text-[9px] text-black/70 font-semibold mt-0.5">
                              Cost: <span>${prod.cost.toFixed(2)}</span> • Price: <span className="font-black text-black">${prod.price.toFixed(2)}</span>
                            </p>
                            <span className="text-[8px] uppercase font-black text-black bg-[#9BE9FB]/60 border border-black px-1 py-0.2 rounded mt-0.5 inline-block shadow-[0.5px_0.5px_0px_#000000]">
                              {prod.category} • {profitMargin}% margin
                            </span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              {confirmDeleteProductId === prod.id ? (
                                <>
                                  <button
                                    onClick={() => setConfirmDeleteProductId(null)}
                                    className="text-[8px] font-black text-black bg-white border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-slate-50 transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    id={`delete-prod-btn-${prod.id}`}
                                    onClick={() => {
                                      handleDeleteProduct(prod.id);
                                      setConfirmDeleteProductId(null);
                                    }}
                                    className="text-[8px] font-black text-white bg-rose-600 border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-rose-700 transition-all cursor-pointer animate-pulse"
                                  >
                                    Confirm?
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    id={`edit-prod-btn-${prod.id}`}
                                    onClick={() => handleStartEditProduct(prod)}
                                    className="text-[8px] font-extrabold text-blue-700 bg-blue-50 border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-white active:scale-95 transition-all flex items-center gap-0.5 cursor-pointer"
                                  >
                                    Edit Product
                                  </button>
                                  <button
                                    id={`delete-prod-btn-${prod.id}`}
                                    onClick={() => setConfirmDeleteProductId(prod.id)}
                                    className="text-[8px] font-extrabold text-rose-700 bg-rose-50 border border-black px-1.5 py-0.5 rounded shadow-[0.5px_0.5px_0px_#000000] hover:bg-white active:scale-95 transition-all flex items-center gap-0.5 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Adjust Stock Panel */}
                        <div className="text-right shrink-0 ml-1">
                          <p className={`font-numeral-lg text-[10px] font-black ${outOfStock ? 'text-rose-600 bg-rose-50 px-1 border border-rose-300 rounded' : 'text-black'}`}>
                            {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units`}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-0.5">
                            <button 
                              onClick={() => handleQuickAdjustStock(prod.id, Math.max(0, prod.stock - 1))}
                              className="p-1 hover:bg-[#FFD8E8] hover:text-black hover:border-black text-rose-600 border border-slate-300 bg-white rounded-full transition-all cursor-pointer"
                              title="Decrease count"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <button 
                              onClick={() => handleQuickAdjustStock(prod.id, prod.stock + 1)}
                              className="p-1 hover:bg-[#9BE9FB] hover:text-black hover:border-black text-emerald-600 border border-slate-300 bg-white rounded-full transition-all cursor-pointer"
                              title="Increase count"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </main>

        {/* --- BOTTOM MOBILE TAB BAR navigation containing 4 tabs --- */}
        <nav className="bg-black border-t-4 border-black px-2 py-2.5 flex justify-around items-center shrink-0 z-20 select-none text-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)]">
          <button 
            id="tab-dashboard"
            onClick={() => {
              setActiveModal('none');
              setActiveTab('dashboard');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#9BE9FB] text-black border-2 border-black shadow-[2px_2px_0px_#000000] scale-105'
                : 'text-white hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <Store className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">Dashboard</span>
          </button>

          <button 
            id="tab-sales"
            onClick={() => {
              setActiveModal('none');
              setActiveTab('sales');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-[#FFD8E8] text-black border-2 border-black shadow-[2px_2px_0px_#000000] scale-105'
                : 'text-white hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <History className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">Sales</span>
          </button>

          <button 
            id="tab-customers"
            onClick={() => {
              setActiveModal('none');
              setActiveTab('customers');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#9BE9FB] text-black border-2 border-black shadow-[2px_2px_0px_#000000] scale-105'
                : 'text-white hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">Customers</span>
          </button>

          <button 
            id="tab-products"
            onClick={() => {
              setActiveModal('none');
              setActiveTab('products');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#FFD8E8] text-black border-2 border-black shadow-[2px_2px_0px_#000000] scale-105'
                : 'text-white hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <Cookie className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">Products</span>
          </button>
        </nav>

        {/* ======================================================== */}
        {/* -- DRAWER / DETAIL OVERLAY MODALS -- (Zero-Scroll Pattern) */}
        {/* ======================================================== */}

        {/* 1. OUTSTANDING BALANCES LEDGER DRAWER */}
        {activeModal === 'outstanding' && (
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
                              {/* Buzz button - Cyan Accent */}
                              <button 
                                onClick={() => triggerBuzzReminder(cust.name)}
                                className="p-2.5 bg-[#9BE9FB] rounded-xl text-black border-2 border-black hover:bg-white active:scale-95 shadow-[1.5px_1.5px_0px_#000000] transition-all cursor-pointer"
                                title="Buzz customer code reminder"
                              >
                                <Bell className="w-4 h-4" />
                              </button>
                              {/* Log Payment button - Pink Accent */}
                              <button 
                                onClick={() => {
                                  setSelectedCustomerIdForPayment(cust.id);
                                  setPaymentAmount(cust.outstandingBalance.toString());
                                  setPaymentNotes(`Cleared tab via Outstanding list`);
                                  setPaymentSuccess(null);
                                  setActiveModal('add-payment');
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
        )}

        {/* 5. RECORD PURCHASE (NEW SALE) TRANSACTION DRAWER */}
        {activeModal === 'add-sale' && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black h-[94%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white flex justify-between items-center shrink-0 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#9BE9FB]" />
                  <h3 className="font-extrabold text-md text-white">Record Sweet Purchase</h3>
                </div>
                <button 
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 hover:bg-white/10 text-white rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              {/* Nested success alert banner */}
              {saleSuccess && (
                <div className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2 shrink-0">
                  <Sparkles className="w-4 h-4 text-black animate-bounce" />
                  <p>{saleSuccess}</p>
                </div>
              )}

              {/* Checkout layout scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5">
                
                {/* Product Search Catalog Select */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Choose Candies/Cookies</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Filter treats catalog..."
                      className="w-full bg-white border-2 border-black rounded-lg pl-9 pr-3 py-2 text-xs text-black focus:ring-1 focus:ring-black font-semibold placeholder-black/50"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>

                  {/* Horizontal Scroll list of items inside Sale form */}
                  <div className="flex gap-3 overflow-x-auto py-2.5 scrollbar-hide">
                    {products
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((prod) => {
                        const inCartCount = saleCart.find(i => i.productId === prod.id)?.quantity || 0;
                        const outOfStock = prod.stock === 0;
                        return (
                          <div 
                            key={prod.id}
                            onClick={() => !outOfStock && handleCartAdd(prod.id)}
                            className={`p-2.5 rounded-xl border-2 shrink-0 w-[125px] flex flex-col justify-between h-[105px] transition-all select-none cursor-pointer ${
                              outOfStock 
                                ? 'bg-[#f1f1f1] border-slate-300 cursor-not-allowed opacity-55 shadow-none' 
                                : inCartCount > 0 
                                  ? 'border-black bg-[#FFD8E8] shadow-[2px_2px_0px_#000000] translate-y-[1px]' 
                                  : 'border-black bg-white hover:border-black hover:shadow-[3px_3px_0px_#000000] hover:-translate-y-[1.5px] shadow-[2.5px_2.5px_0px_#000000]'
                            }`}
                          >
                            <div className="line-clamp-2 text-[11px] font-black text-black leading-tight">{prod.name}</div>
                            <div className="flex justify-between items-baseline mt-1.5">
                              <span className="text-black font-black font-numeral-lg text-xs">${prod.price.toFixed(2)}</span>
                              {inCartCount > 0 ? (
                                <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000000]">{inCartCount}x</span>
                              ) : (
                                <span className="text-[9px] text-black font-black bg-[#9BE9FB] px-1.5 py-0.5 rounded-md border border-black shadow-[0.8px_0.8px_0px_#000000]">+{prod.stock}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* ACTIVE Checkout list */}
                {saleCart.length > 0 && (
                  <div className="space-y-2 bg-[#9BE9FB]/10 p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
                    <p className="text-[10px] font-black text-black uppercase">Active checkout snacks list</p>
                    
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                      {saleCart.map(item => {
                        const prod = products.find(p => p.id === item.productId)!;
                        return (
                          <div key={item.productId} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
                            <span className="font-extrabold text-black line-clamp-1 flex-1 pr-2">{prod.name}</span>
                            <div className="flex items-center gap-2.5 mr-3 shrink-0">
                              <button 
                                type="button" 
                                onClick={() => handleCartDelta(item.productId, -1)}
                                className="bg-white border border-black w-5.5 h-5.5 rounded-full flex items-center justify-center text-rose-600 font-extrabold hover:bg-[#FFD8E8] transition-all cursor-pointer shadow-[1px_1px_0px_#000000]"
                              >
                                -
                              </button>
                              <span className="font-black text-black min-w-[14px] text-center">{item.quantity}</span>
                              <button 
                                type="button" 
                                onClick={() => handleCartDelta(item.productId, 1)}
                                className="bg-white border border-black w-5.5 h-5.5 rounded-full flex items-center justify-center text-emerald-600 font-extrabold hover:bg-[#9BE9FB] transition-all cursor-pointer shadow-[1px_1px_0px_#000000]"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-black text-black min-w-[50px] text-right">${(prod.price * item.quantity).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Specify Customer state */}
                <div className="space-y-2 select-none">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Assign Client tab</label>
                  <select 
                    id="add-sale-customer-select"
                    className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-black shadow-[2.5px_2.5px_0px_#000000]"
                    value={saleCustomerId}
                    onChange={(e) => {
                      setSaleCustomerId(e.target.value);
                      if (!e.target.value) setSaleIsTab(false);
                    }}
                  >
                    <option value="" disabled>-- Choose Customer (Required) --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.discount > 0 ? `(${c.discount}% discount)` : ''} {c.outstandingBalance > 0 ? `• owes $${c.outstandingBalance.toFixed(2)}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Term status inside Sale Drawer */}
                {saleCustomerId && (
                  <div className="space-y-2 select-none">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Settlement terms</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setSaleIsTab(false)}
                        className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${
                          !saleIsTab ? 'bg-[#9BE9FB] text-black border-black' : 'bg-white border-black hover:bg-slate-50'
                        }`}
                      >
                        Paid immediately
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSaleIsTab(true)}
                        className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${
                          saleIsTab ? 'bg-[#FFD8E8] text-black border-black' : 'bg-white border-black hover:bg-slate-50'
                        }`}
                      >
                        Record as pending tab
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtotal preview card */}
                {saleCart.length > 0 && (
                  <div className="space-y-2 select-none">
                    {saleCustomerDiscount > 0 ? (
                      <div className="p-3 bg-white rounded-xl border-2 border-black border-dashed flex flex-col gap-1 text-[11px] font-black text-black">
                        <div className="flex justify-between text-black/60">
                          <span>Basket Sum:</span>
                          <span className="font-numeral-sm">${originalSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                          <span>{selectedCustomer?.name} Savings ({saleCustomerDiscount}%):</span>
                          <span className="font-numeral-sm">-${saleDiscountAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ) : null}
                    <div className="p-3.5 bg-white rounded-xl border-2 border-black flex justify-between items-center shadow-[3.5px_3.5px_0px_#000000]">
                      <span className="font-extrabold text-xs text-black/60 uppercase">Checkout total amount</span>
                      <span id="add-sale-total-preview" className="font-black text-lg text-black font-numeral-lg">${saleSubtotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Checkout buttons */}
              {saleCart.length > 0 && (
                <footer className="p-4 bg-white border-t-2 border-black shrink-0">
                  <button 
                    disabled={!saleCustomerId}
                    onClick={() => {
                      if (!saleCustomerId) return;
                      handleRecordSale(saleCustomerId, saleCart, saleSubtotal, saleIsTab);
                      setSaleSuccess(`Purchase registered!`);
                      setSaleCart([]);
                      setSaleCustomerId('');
                      setSaleIsTab(false);
                      setTimeout(() => {
                        setSaleSuccess(null);
                        setActiveModal('none');
                      }, 2000);
                    }}
                    className={`w-full border-2 border-black py-4 rounded-xl font-black text-sm duration-150 transition-all ${
                      !saleCustomerId 
                        ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none' 
                        : 'bg-black text-white hover:bg-[#9BE9FB] hover:text-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] cursor-pointer'
                    }`}
                  >
                    {!saleCustomerId ? 'Please select a Customer' : `Confirm register - $${saleSubtotal.toFixed(2)}`}
                  </button>
                </footer>
              )}
            </div>
          </div>
        )}

        {/* 6. LOG TAB PAYMENT RECOVERY DRAWER */}
        {activeModal === 'add-payment' && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#9BE9FB]" />
                  <h3 className="font-extrabold text-md text-[#FFFFFF]">Record Customer Payment</h3>
                </div>
                <button 
                  onClick={() => setActiveModal('none')}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              {/* Nested success notify */}
              {paymentSuccess && (
                <div className="p-3 bg-[#9BE9FB] text-black text-xs font-black shrink-0 border-b-2 border-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black" />
                  <p>{paymentSuccess}</p>
                </div>
              )}

              {/* Scrollable checkout container form */}
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

                    {/* Quick action chips inside Payment Form */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button 
                        type="button" 
                        onClick={() => setPaymentAmount('5.00')}
                        className="bg-white border-2 border-black hover:bg-[#FFD8E8] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        $5.00
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentAmount('10.00')}
                        className="bg-white border-2 border-black hover:bg-[#FFD8E8] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        $10.00
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          const limit = customers.find(c => c.id === selectedCustomerIdForPayment)?.outstandingBalance || 0;
                          setPaymentAmount(limit.toString());
                        }}
                        className="bg-white border-2 border-black hover:bg-[#9BE9FB] px-3.5 py-1.5 rounded-full text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000000] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Clear Full Debt
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                {selectedCustomerIdForPayment && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod('Cash')}
                        className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${
                          paymentMethod === 'Cash' ? 'bg-[#9BE9FB] text-black border-black' : 'bg-white border-black hover:bg-[#9BE9FB]/20'
                        }`}
                      >
                        Cash Collected
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod('E-transfer')}
                        className={`py-3 rounded-lg border-2 text-center font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[2.5px_2.5px_0px_#000000] ${
                          paymentMethod === 'E-transfer' ? 'bg-[#FFD8E8] text-black border-black' : 'bg-white border-black hover:bg-[#FFD8E8]/20'
                        }`}
                      >
                        E-transfer
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes details */}
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
        )}

         {/* SECURE DATABASE RESET CONFIRMATION MODAL */}
        {activeModal === 'reset-confirm' && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-[60] flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                  <h3 className="font-extrabold text-sm text-white">Reset Store History</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveModal('none');
                    setResetConfirmationText('');
                  }}
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
                  onClick={() => {
                    setActiveModal('none');
                    setResetConfirmationText('');
                  }}
                  className="flex-1 bg-slate-100 text-black hover:bg-slate-200 py-3 rounded-xl font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  disabled={resetConfirmationText.trim().toUpperCase() !== 'RESET' || dbLoading}
                  onClick={handleResetDatabase}
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
        )}

        {/* 7. REGISTER CUSTOMER DETAILS DRAWER */}
        {activeModal === 'add-customer' && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#9BE9FB]" />
                  <h3 className="font-extrabold text-md text-white">Register Customer</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveModal('none');
                    setActiveTab('customers');
                  }}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              {/* Nested success message block banner */}
              {newCustSuccess && (
                <div className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black animate-bounce" />
                  <p>{newCustSuccess}</p>
                </div>
              )}

              {/* form body info */}
              <div className="p-4 space-y-4 select-none bg-[#FFD8E8]/5 pb-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Client Full Name</label>
                  <input 
                    type="text" 
                    id="reg-cust-name-val"
                    placeholder="e.g. Thomas Carlyle"
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Savings Discount (%)</label>
                  <input 
                    type="number" 
                    id="reg-cust-discount-val"
                    placeholder="e.g. 10 (for 10% automatically applied at checkout)"
                    min="0"
                    max="100"
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                    value={newCustDiscount}
                    onChange={(e) => setNewCustDiscount(e.target.value)}
                  />
                </div>

                <button 
                  onClick={() => {
                    const discountValue = Math.max(0, Math.min(100, parseFloat(newCustDiscount) || 0));
                    handleAddCustomer(newCustName, discountValue);
                    setTimeout(() => {
                      setNewCustName('');
                      setNewCustDiscount('0');
                      setActiveModal('none');
                      setActiveTab('customers');
                    }, 2000);
                  }}
                  disabled={!newCustName.trim()}
                  className="w-full bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer mt-4"
                >
                  Save Profile Base
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7b. REGISTER SWEET PRODUCT DETAILS DRAWER */}
        {activeModal === 'add-product' && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-[#9BE9FB]" />
                  <h3 className="font-extrabold text-md text-white">Register Sweet Product</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveModal('none');
                    setActiveTab('products');
                  }}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              {newProdSuccess && (
                <div className="p-3 bg-[#9BE9FB] text-black border-b-2 border-black text-xs font-black flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-black" />
                  <p>{newProdSuccess}</p>
                </div>
              )}

              <div className="p-4 space-y-4 select-none bg-[#9BE9FB]/5 pb-6 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Sweet Name</label>
                  <input 
                    type="text" 
                    id="reg-prod-name-val"
                    placeholder="e.g. Candy Belt"
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Cost Price ($)</label>
                    <input 
                      type="number" 
                      id="reg-prod-cost-val"
                      step="0.01"
                      placeholder="e.g. 1.10"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={newProdCost}
                      onChange={(e) => setNewProdCost(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Selling Price ($)</label>
                    <input 
                      type="number" 
                      id="reg-prod-price-val"
                      step="0.01"
                      placeholder="e.g. 2.50"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Category</label>
                    <select 
                      id="reg-prod-category-val"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as Product['category'])}
                    >
                      <option value="Candy">Candy</option>
                      <option value="Ice Cream">Ice Cream</option>
                      <option value="Cookies">Cookies</option>
                      <option value="Cakes">Cakes</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      id="reg-prod-stock-val"
                      placeholder="e.g. 20"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const costVal = Math.max(0, parseFloat(newProdCost) || 0);
                    const priceVal = Math.max(0, parseFloat(newProdPrice) || 0);
                    const stockVal = Math.max(0, parseInt(newProdStock) || 0);
                    handleAddProduct(newProdName, costVal, priceVal, newProdCategory, stockVal);
                    setTimeout(() => {
                      setNewProdName('');
                      setNewProdCost('');
                      setNewProdPrice('');
                      setNewProdCategory('Candy');
                      setNewProdStock('0');
                      setActiveModal('none');
                      setActiveTab('products');
                    }, 2000);
                  }}
                  disabled={!newProdName.trim()}
                  className="w-full bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[1.5px_1.5px_0px_#000000] duration-150 transition-all cursor-pointer mt-4"
                >
                  Save Sweet Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. EDIT CUSTOMER DETAILS DRAWER */}
        {editingCustomerId !== null && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#9BE9FB]" />
                  <h3 className="font-extrabold text-md text-white">Edit Customer Profile</h3>
                </div>
                <button 
                  onClick={() => setEditingCustomerId(null)}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              <div className="p-4 space-y-4 select-none bg-[#FFD8E8]/5 pb-6 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Client Full Name</label>
                  <input 
                    type="text" 
                    id="edit-cust-name-val"
                    placeholder="e.g. Thomas Carlyle"
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Savings Discount (%)</label>
                  <input 
                    type="number" 
                    id="edit-cust-discount-val"
                    placeholder="e.g. 10 (for 10% automatically applied at checkout)"
                    min="0"
                    max="100"
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                    value={editCustDiscount}
                    onChange={(e) => setEditCustDiscount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button 
                    id="cancel-edit-cust-btn"
                    onClick={() => setEditingCustomerId(null)}
                    className="py-3 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-xl font-black text-xs shadow-[2.5px_2.5px_0px_#000000] active:scale-95 duration-150 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    id="save-edit-cust-btn"
                    onClick={handleSaveCustomerEdit}
                    disabled={!editCustName.trim()}
                    className="py-3 bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black rounded-xl font-black text-xs border-2 border-black shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. EDIT PRODUCT DETAILS DRAWER */}
        {editingProductId !== null && (
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-t-[2rem] border-t-4 border-x-4 border-black max-h-[92%] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
              <header className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-[#9BE9FB]" />
                  <h3 className="font-extrabold text-md text-white">Edit Sweet Product</h3>
                </div>
                <button 
                  onClick={() => setEditingProductId(null)}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              <div className="p-4 space-y-4 select-none bg-[#9BE9FB]/5 pb-6 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-black pl-1">Sweet Name</label>
                  <input 
                    type="text" 
                    id="edit-prod-name-val"
                    placeholder="e.g. Candy Belt"
                    className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Cost Price ($)</label>
                    <input 
                      type="number" 
                      id="edit-prod-cost-val"
                      step="0.01"
                      placeholder="e.g. 1.10"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={editProdCost}
                      onChange={(e) => setEditProdCost(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Selling Price ($)</label>
                    <input 
                      type="number" 
                      id="edit-prod-price-val"
                      step="0.01"
                      placeholder="e.g. 2.50"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Category</label>
                    <select 
                      id="edit-prod-category-val"
                      className="w-full bg-white border-2 border-black rounded-lg px-2.5 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={editProdCategory}
                      onChange={(e) => setEditProdCategory(e.target.value as any)}
                    >
                      <option value="Candy">Candy</option>
                      <option value="Cookies">Cookies</option>
                      <option value="Cakes">Cakes</option>
                      <option value="Ice Cream">Ice Cream</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-black pl-1">Stock Count</label>
                    <input 
                      type="number" 
                      id="edit-prod-stock-val"
                      placeholder="e.g. 30"
                      className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                      value={editProdStock}
                      onChange={(e) => setEditProdStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button 
                    id="cancel-edit-prod-btn"
                    onClick={() => setEditingProductId(null)}
                    className="py-3 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-xl font-black text-xs shadow-[2.5px_2.5px_0px_#000000] active:scale-95 duration-150 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    id="save-edit-prod-btn"
                    onClick={handleSaveProductEdit}
                    disabled={!editProdName.trim()}
                    className="py-3 bg-black disabled:opacity-40 text-white hover:bg-[#9BE9FB] hover:text-black rounded-xl font-black text-xs border-2 border-black shadow-[2.5px_2.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULLSCREEN ANALYTICS & DEEP INSIGHTS DISPLAY OVERLAY */}
        {isChartFullScreen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
            <div className="bg-white border-4 border-black w-full max-w-4xl rounded-2xl shadow-[6px_6px_0px_#000000] p-4 sm:p-6 flex flex-col gap-5 text-left max-h-[96%] overflow-y-auto my-auto animate-[fadeIn_0.2s_ease-out]">
              
              {/* Header inside fullscreen view */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-4 border-black pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-lg text-black uppercase tracking-tight">Deep Sales & Profit Analytics</h3>
                  </div>
                  <p className="text-[10px] text-black/60 font-bold mt-1 uppercase">Detailed operation metrics and sales breakdowns for the period</p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Period selection toggle pills */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border-2 border-black text-xs font-black shadow-[1.5px_1.5px_0px_#000000]">
                    <button
                      type="button"
                      onClick={() => setChartPeriod('week')}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartPeriod === 'week' ? 'bg-black text-white shadow-[1px_1px_0px_#000000]' : 'text-black/60 hover:text-black'}`}
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartPeriod('month')}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartPeriod === 'month' ? 'bg-black text-white shadow-[1px_1px_0px_#000000]' : 'text-black/60 hover:text-black'}`}
                    >
                      30 Days
                    </button>
                  </div>

                  <button
                    onClick={() => setIsChartFullScreen(false)}
                    className="p-2 border-2 border-black bg-[#FFD8E8] hover:bg-white text-black font-black rounded-lg shadow-[2px_2px_0px_#000000] cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 text-xs uppercase"
                  >
                    <Minimize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Minimize</span>
                  </button>
                </div>
              </div>

              {/* Grid split columns: Graph on left, insights on right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Column Left: Giant interactive SVG visualization */}
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

                    {/* High-detail SVG chart viewport */}
                    <div className="h-48 w-full bg-white border-2 border-black rounded-lg p-2 relative flex flex-col justify-end select-none">
                      {/* Grid helper guidelines */}
                      <div className="absolute inset-x-2 top-4 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                        <div className="border-t border-dashed border-slate-100 flex justify-between text-[7px] text-slate-400 font-extrabold font-mono">
                          <span>${chartMaxRevenue.toFixed(2)}</span>
                          <span>Max level</span>
                        </div>
                        <div className="border-t border-dashed border-slate-100 flex justify-between text-[7px] text-slate-400 font-extrabold font-mono">
                          <span>${(chartMaxRevenue * 0.66).toFixed(2)}</span>
                          <span>66%</span>
                        </div>
                        <div className="border-t border-dashed border-slate-100 flex justify-between text-[7px] text-slate-400 font-extrabold font-mono">
                          <span>${(chartMaxRevenue * 0.33).toFixed(2)}</span>
                          <span>33%</span>
                        </div>
                      </div>

                      {/* Interactive bars */}
                      <div className="flex items-end justify-between h-40 px-1 gap-1 z-10 pt-2">
                        {computedChartData.map((data, idx) => {
                          const revHeightPercent = chartMaxRevenue > 0 ? (data.revenue / chartMaxRevenue) * 80 : 0;
                          const profHeightPercent = chartMaxRevenue > 0 ? (data.profit / chartMaxRevenue) * 80 : 0;

                          return (
                            <div
                              key={idx}
                              className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                              onClick={() => setHoveredPointIdx(hoveredPointIdx === idx ? null : idx)}
                              onMouseEnter={() => setHoveredPointIdx(idx)}
                              onMouseLeave={() => setHoveredPointIdx(null)}
                            >
                              <div className="w-full flex items-end justify-center gap-[1px] h-full pb-1">
                                {/* Large Revenue Bar */}
                                <div 
                                  style={{ height: `${Math.max(4, revHeightPercent)}%` }}
                                  className={`w-3 sm:w-4 border-2 border-black rounded-t-sm transition-all duration-200 ${
                                    hoveredPointIdx === idx ? 'bg-[#9BE9FB] translate-y-[-2px] scale-x-[1.1] shadow-[1.5px_1.5px_0px_#000000]' : 'bg-[#9BE9FB]/90 shadow-[0.5px_0.5px_0px_#000000]'
                                  }`}
                                />
                                {/* Large Profit Bar */}
                                <div 
                                  style={{ height: `${Math.max(2, profHeightPercent)}%` }}
                                  className={`w-3 sm:w-4 border-2 border-black rounded-t-sm transition-all duration-200 ${
                                    hoveredPointIdx === idx ? 'bg-[#FFD8E8] translate-y-[-2px] scale-x-[1.1] shadow-[1.5px_1.5px_0px_#000000]' : 'bg-[#FFD8E8]/90 shadow-[0.5px_0.5px_0px_#000000]'
                                  }`}
                                />
                              </div>
                              
                              {/* Bottom labels */}
                              {(chartPeriod === 'week' || idx % 4 === 0 || idx === computedChartData.length - 1) && (
                                <span className="text-[7.5px] text-black font-black truncate max-w-full mt-1 bg-slate-150 px-1 py-0.2 rounded">
                                  {data.label}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Day Detail Card */}
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

                {/* Column Right: Insights Analysis, category breakdown, cash ratio */}
                <div className="md:col-span-5 space-y-4">
                  {/* Period Stats Grid */}
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
                        <span className="text-xs font-black text-black font-numeral-lg block mt-1">
                          ${overallPeriodOrders > 0 ? (overallPeriodRevenue / overallPeriodOrders).toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-black">
                        <span className="text-[8px] text-black/50 font-black block leading-none uppercase">Avg Profit Margin</span>
                        <span className="text-xs font-black text-purple-700 font-numeral-lg block mt-1">
                          {overallPeriodRevenue > 0 ? Math.round((overallPeriodProfit / overallPeriodRevenue) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Peak Sales Day Widget */}
                  <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h5 className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 inline-block">🚀 Sales Spike Peak</h5>
                      <p className="text-[10px] font-semibold text-black/80 mt-1 leading-normal">
                        Your absolute peak sales day of the period was <strong className="font-extrabold text-black">{peakSalesDayPoint.label} ({peakSalesDayPoint.dateStr})</strong> netting a gross of <strong className="font-black text-black">${peakSalesDayPoint.revenue.toFixed(2)}</strong>!
                      </p>
                    </div>
                    <div className="bg-[#9BE9FB] font-black text-[13px] p-2.5 border-2 border-black rounded-lg shrink-0 font-numeral-lg select-none">
                      ${peakSalesDayPoint.revenue.toFixed(0)}
                    </div>
                  </div>

                  {/* Categorical Sales Share (Horizontal progress bars) */}
                  <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2.5">
                    <h4 className="text-[10px] font-black uppercase text-black">🍬 Category Distribution Share</h4>
                    
                    {Object.keys(computedCategorySales).length === 0 ? (
                      <p className="text-[9px] text-black/60 font-semibold text-center py-1">No sales data distributed to category buckets yet.</p>
                    ) : (
                      <div className="space-y-1.5 pt-0.5 select-none">
                        {Object.entries(computedCategorySales)
                          .sort((a, b) => b[1] - a[1])
                          .map(([cat, val]) => {
                            const sharePercent = overallPeriodRevenue > 0 ? Math.round((val / overallPeriodRevenue) * 100) : 0;
                            return (
                              <div key={cat} className="text-[10px] space-y-0.5">
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                  <span className="font-extrabold text-black">{cat} ({sharePercent}%)</span>
                                  <span className="text-black/60 font-numeral-sm">${val.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 border border-black rounded-full overflow-hidden flex">
                                  <div 
                                    style={{ width: `${sharePercent}%` }}
                                    className={`h-full border-r border-black font-semibold 
                                      ${cat === 'Candy' ? 'bg-[#9BE9FB]' : ''}
                                      ${cat === 'Ice Cream' ? 'bg-[#FFD8E8]' : ''}
                                      ${cat === 'Cakes' ? 'bg-amber-300' : ''}
                                      ${cat === 'Cookies' ? 'bg-purple-300' : ''}
                                      ${cat === 'Other' ? 'bg-emerald-300' : 'bg-slate-400'}
                                    `}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Immediate Paid Checkout vs Tab Ratio */}
                  <div className="bg-white rounded-xl p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2 select-none">
                    <h4 className="text-[10px] font-black uppercase text-black">💳 Transactions Settlement Mix</h4>
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="font-extrabold text-blue-700">Immediate Payments (${periodPaidSalesTotal.toFixed(1)})</span>
                      <span className="font-extrabold text-red-600">Logged on tab (${periodTabSalesTotal.toFixed(1)})</span>
                    </div>

                    {/* Progress Bar of settlement mix */}
                    { (periodPaidSalesTotal + periodTabSalesTotal) > 0 ? (
                      <div>
                        <div className="w-full bg-slate-100 h-2.5 border border-black rounded-full overflow-hidden flex">
                          <div 
                            style={{ width: `${(periodPaidSalesTotal / (periodPaidSalesTotal + periodTabSalesTotal)) * 100}%` }}
                            className="bg-sky-400 h-full border-r border-black"
                          />
                          <div 
                            style={{ width: `${(periodTabSalesTotal / (periodPaidSalesTotal + periodTabSalesTotal)) * 100}%` }}
                            className="bg-rose-400 h-full"
                          />
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

        {/* ======================================================== */}
        {/* -- EXTRA DETAILED ANALYTICS OVERLAYS & DRILLDOWNS -- */}
        {/* ======================================================== */}

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
                <button 
                  onClick={() => setSelectedSaleDetail(null)}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-transform duration-100 active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5 select-none scrollbar-hide text-left">
                {/* Customer Row Details */}
                <div className="bg-white p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-between gap-3">
                  {(() => {
                    const cust = customers.find(c => String(c.id).trim().toLowerCase() === String(selectedSaleDetail.customerId).trim().toLowerCase());
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <img 
                            alt={cust ? cust.name : 'Guest'} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-black" 
                            src={cust?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'} 
                          />
                          <div>
                            <p className="font-black text-xs text-black">{cust ? cust.name : 'Unknown Customer'}</p>
                            <span className="text-[9px] text-black/60 font-semibold block mt-0.5">
                              {cust ? `Personal Discount: ${cust.discount}% off` : 'No custom profile savings'}
                            </span>
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

                {/* Items listing table/card */}
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
                            <span className="text-[9px] text-black/60 font-bold block mt-0.5">
                              {saleItem.quantity} unit{saleItem.quantity > 1 ? 's' : ''} × ${saleItem.priceAtSale.toFixed(2)}
                            </span>
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

                {/* Totals and Profits Dashboard */}
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
                      <span className="text-black font-semibold">
                        {new Date(selectedSaleDetail.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm/Close Button */}
                <button 
                  onClick={() => setSelectedSaleDetail(null)}
                  className="w-full bg-black hover:bg-[#9BE9FB] text-white hover:text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3.5px_3.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer"
                >
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
                <button 
                  onClick={() => setShowProfitBreakdown(false)}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-all duration-100 active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5 select-none scrollbar-hide text-left">
                <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[2.5px_2.5px_0px_#000000] text-[10px] space-y-1">
                  <h4 className="font-extrabold uppercase text-[9px] text-black">💡 Marginal Cost Breakdown Summary</h4>
                  <p className="text-black/75 font-semibold leading-relaxed">
                    Visual cost analysis of sales versus sweet batch wholesale acquisition cost to determine pure net savings.
                  </p>
                </div>

                {/* Categories listings card */}
                {(() => {
                  const categories: ('Candy' | 'Ice Cream' | 'Cookies' | 'Cakes' | 'Other')[] = ['Candy', 'Ice Cream', 'Cookies', 'Cakes', 'Other'];
                  return (
                    <div className="space-y-3">
                      {categories.map(cat => {
                        let catSales = 0;
                        let catCost = 0;
                        let catUnits = 0;

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
                                <span className={`w-2.5 h-2.5 rounded-full border border-black ${
                                  cat === 'Candy' ? 'bg-[#9BE9FB]' :
                                  cat === 'Ice Cream' ? 'bg-[#FFD8E8]' :
                                  cat === 'Cakes' ? 'bg-amber-300' :
                                  cat === 'Cookies' ? 'bg-purple-300' : 'bg-emerald-300'
                                }`} />
                                <span className="font-black text-xs text-black">{cat} Class</span>
                              </div>
                              <span className="text-[9px] font-black text-black/60">{catUnits} unit{catUnits > 1 ? 's' : ''} sold</span>
                            </div>

                            <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-bold">
                              <div>
                                <p className="text-black/50 text-[7px] uppercase leading-none">Gross Rev</p>
                                <p className="text-black font-extrabold font-numeral-sm mt-0.5">${catSales.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-black/50 text-[7px] uppercase leading-none">Stock Expense</p>
                                <p className="text-black font-semibold font-numeral-sm mt-0.5">${catCost.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-emerald-600 text-[7px] uppercase font-bold leading-none">Net Profit</p>
                                <p className="text-emerald-600 font-extrabold font-numeral-sm mt-0.5">${catProfit.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Margin bar */}
                            <div className="pt-0.5">
                              <div className="flex justify-between items-center text-slate-500 text-[8px] font-extrabold mb-0.5">
                                <span>NET PROFIT MARGIN RATE</span>
                                <span className="text-black font-black font-mono">{catMargin}% efficiency</span>
                              </div>
                              <div className="w-full bg-slate-150 h-1.5 border border-black rounded-full overflow-hidden">
                                <div 
                                  style={{ width: `${Math.max(0, Math.min(100, catMargin))}%` }}
                                  className={`h-full border-r border-black ${
                                    cat === 'Candy' ? 'bg-[#9BE9FB]' :
                                    cat === 'Ice Cream' ? 'bg-[#FFD8E8]' :
                                    cat === 'Cakes' ? 'bg-amber-300' :
                                    cat === 'Cookies' ? 'bg-purple-400' : 'bg-emerald-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Top Performing Sweet Items List */}
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
                          const rev = item.quantity * item.priceAtSale;
                          const profit = rev - (item.quantity * prodCost);

                          if (treatProfitMap[prodName]) {
                            treatProfitMap[prodName].profit += profit;
                          } else {
                            treatProfitMap[prodName] = { name: prodName, profit };
                          }
                        });
                      });

                      const sortedTreats = Object.values(treatProfitMap)
                        .sort((a,b) => b.profit - a.profit)
                        .slice(0, 3);

                      if (sortedTreats.length === 0) {
                        return <p className="text-[10px] text-black/50 font-bold text-center">No sales registered.</p>;
                      }

                      return sortedTreats.map((treat, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5">
                          <span className="font-extrabold text-black truncate flex-1 pr-1">{idx + 1}. {treat.name}</span>
                          <span className="font-black text-emerald-650 font-numeral-sm shrink-0">+${treat.profit.toFixed(2)}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <button 
                  onClick={() => setShowProfitBreakdown(false)}
                  className="w-full bg-black text-white hover:bg-[#FFD8E8] hover:text-black py-4 rounded-xl font-black text-xs uppercase border-2 border-black shadow-[3.5px_3.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer"
                >
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
                <button 
                  onClick={() => setShowAverageOrderDetails(false)}
                  className="p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer transition-all duration-100 active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFD8E8]/5 select-none scrollbar-hide text-left">
                {/* Checkout benchmarks */}
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
                  <p className="text-black/80 font-semibold">
                    The Average Order Value (AOV) assists in choosing sweet bundling tactics. Selling pre-packed candy bags typically increases this baseline count.
                  </p>
                </div>

                {/* Highly Active Clients chart */}
                <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000000] space-y-2.5">
                  <h4 className="font-extrabold uppercase text-[9px] text-black border-b border-black/5 pb-1 leading-none">👥 High Frequency customers</h4>
                  <div className="space-y-2 text-xs">
                    {(() => {
                      const clientSalesMap: Record<string, { name: string; avatar: string; count: number; spent: number }> = {};
                      sales.forEach(s => {
                        const cust = customers.find(c => String(c.id).trim().toLowerCase() === String(s.customerId).trim().toLowerCase());
                        const name = cust ? cust.name : 'Guest';
                        const avatar = cust ? cust.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80';
                        if (clientSalesMap[name]) {
                          clientSalesMap[name].count += 1;
                          clientSalesMap[name].spent += s.totalAmount;
                        } else {
                          clientSalesMap[name] = { name, avatar, count: 1, spent: s.totalAmount };
                        }
                      });

                      const activeClients = Object.values(clientSalesMap)
                        .sort((a,b) => b.count - a.count)
                        .slice(0, 3);

                      if (activeClients.length === 0) {
                        return <p className="text-[10px] text-black/50 font-bold text-center py-1">No transactions generated.</p>;
                      }

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

                <button 
                  onClick={() => setShowAverageOrderDetails(false)}
                  className="w-full bg-black text-white hover:bg-[#9BE9FB] hover:text-black py-4 rounded-xl font-black text-xs uppercase border-2 border-black shadow-[3.5px_3.5px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer"
                >
                  Back to Sales Ledger
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
