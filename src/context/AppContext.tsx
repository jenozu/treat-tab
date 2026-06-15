import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Product, Sale, Payment } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_PAYMENTS } from '../sampleData';
import { databaseService } from '../supabaseService';
import { TabType, ModalType } from '../constants';

interface AppContextValue {
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  payments: Payment[];
  dbActive: boolean;
  dbLoading: boolean;
  activeTab: TabType;
  activeModal: ModalType;
  setActiveTab: (tab: TabType) => void;
  setActiveModal: (modal: ModalType) => void;
  editingCustomerId: string | null;
  editingProductId: string | null;
  setEditingCustomerId: (id: string | null) => void;
  setEditingProductId: (id: string | null) => void;
  prefilledPaymentCustomerId: string;
  prefilledPaymentAmount: string;
  openPaymentModal: (customerId: string, amount: string) => void;
  weeklyGoal: number;
  setWeeklyGoal: (goal: number) => void;
  buzzStatus: string | null;
  triggerBuzzReminder: (customerName: string) => void;
  globalError: string | null;
  clearGlobalError: () => void;
  handleAddCustomer: (name: string, discount: number) => Promise<void>;
  handleAddProduct: (name: string, cost: number, price: number, category: Product['category'], stock: number) => Promise<void>;
  handleRecordSale: (customerId: string, cartItems: { productId: string; quantity: number }[], totalAmount: number, payTypeTab: boolean, saleDate?: string) => void;
  handleRecordPayment: (customerId: string, amount: number, method: 'Cash' | 'E-transfer', notes: string) => void;
  handleQuickAdjustStock: (productId: string, nextStock: number) => void;
  handleStartEditCustomer: (cust: Customer) => void;
  handleSaveCustomerEdit: (id: string, name: string, discount: number) => void;
  handleDeleteCustomer: (id: string) => void;
  handleStartEditProduct: (prod: Product) => void;
  handleSaveProductEdit: (id: string, name: string, cost: number, price: number, category: Product['category'], stock: number) => void;
  handleDeleteProduct: (id: string) => void;
  handleResetDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function stockStatus(stock: number): Product['status'] {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In Stock';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [dbActive, setDbActive] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prefilledPaymentCustomerId, setPrefilledPaymentCustomerId] = useState('');
  const [prefilledPaymentAmount, setPrefilledPaymentAmount] = useState('');
  const [buzzStatus, setBuzzStatus] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [weeklyGoal, setWeeklyGoalState] = useState<number>(() => {
    const stored = localStorage.getItem('treat_tab_weekly_goal');
    const parsed = stored ? parseFloat(stored) : NaN;
    return isNaN(parsed) || parsed <= 0 ? 1500 : parsed;
  });

  const setWeeklyGoal = (goal: number) => {
    setWeeklyGoalState(goal);
    localStorage.setItem('treat_tab_weekly_goal', goal.toString());
  };

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
        console.error('Initialization error', e);
        setGlobalError('Failed to load data. Using cached data.');
      } finally {
        setDbLoading(false);
      }
    }
    initData();
  }, []);

  const clearGlobalError = () => setGlobalError(null);

  const triggerBuzzReminder = (customerName: string) => {
    setBuzzStatus(`Friendly WhatsApp reminder triggered for ${customerName}!`);
    setTimeout(() => setBuzzStatus(null), 3000);
  };

  const openPaymentModal = (customerId: string, amount: string) => {
    setPrefilledPaymentCustomerId(customerId);
    setPrefilledPaymentAmount(amount);
    setActiveModal('add-payment');
  };

  // ─── Mutations: compute new state synchronously, then apply ───────────────

  const handleAddCustomer = async (name: string, discount: number) => {
    const avatarId = Math.floor(Math.random() * 70) + 1;
    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name,
      discount,
      avatar: `https://i.pravatar.cc/150?img=${avatarId}`,
      purchaseCount: 0,
      totalSpent: 0,
      outstandingBalance: 0,
    };
    const updated = [...customers, newCust];
    setCustomers(updated);
    try {
      await databaseService.saveCustomer(newCust, true, updated);
    } catch {
      setGlobalError('Saved locally — cloud sync failed for new customer.');
    }
  };

  const handleAddProduct = async (name: string, cost: number, price: number, category: Product['category'], stock: number) => {
    const newProd: Product = {
      id: `p_${Date.now()}`,
      name,
      cost,
      price,
      category,
      stock,
      icon: 'Cookie',
      status: stockStatus(stock),
    };
    const updated = [...products, newProd];
    setProducts(updated);
    try {
      await databaseService.saveProduct(newProd, true, updated);
    } catch {
      setGlobalError('Saved locally — cloud sync failed for new product.');
    }
  };

  const handleRecordSale = (
    customerId: string,
    cartItems: { productId: string; quantity: number }[],
    totalAmount: number,
    payTypeTab: boolean,
    saleDate?: string,
  ) => {
    const isTab = payTypeTab && customerId !== '';

    // Compute updated products from current snapshot
    const updatedProducts = products.map(p => {
      const cartItem = cartItems.find(i => i.productId === p.id);
      if (!cartItem) return p;
      const nextStock = Math.max(0, p.stock - cartItem.quantity);
      return { ...p, stock: nextStock, status: stockStatus(nextStock) };
    });

    // Compute updated customers
    const updatedCustomers = customers.map(c => {
      if (c.id !== customerId) return c;
      return {
        ...c,
        purchaseCount: c.purchaseCount + 1,
        totalSpent: c.totalSpent + totalAmount,
        outstandingBalance: isTab ? c.outstandingBalance + totalAmount : c.outstandingBalance,
      };
    });

    // Build sale record
    const newSale: Sale = {
      id: `s_${Date.now()}`,
      customerId,
      items: cartItems.map(item => {
        const prod = updatedProducts.find(p => p.id === item.productId);
        return { productId: item.productId, quantity: item.quantity, priceAtSale: prod?.price ?? 0 };
      }),
      totalAmount,
      status: isTab ? 'Pending' : 'Paid',
      // Use the chosen back-date when supplied, otherwise stamp the current time.
      date: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
    };
    const updatedSales = [newSale, ...sales];

    // Apply state
    setProducts(updatedProducts);
    setCustomers(updatedCustomers);
    setSales(updatedSales);

    // Persist (fire-and-forget with error surfacing)
    localStorage.setItem('treat_tab_products', JSON.stringify(updatedProducts));
    localStorage.setItem('treat_tab_customers', JSON.stringify(updatedCustomers));

    cartItems.forEach(cartItem => {
      const p = updatedProducts.find(pr => pr.id === cartItem.productId);
      if (p) databaseService.saveProduct(p, false).catch(() => setGlobalError('Stock sync failed — saved locally.'));
    });
    const changedCust = updatedCustomers.find(c => c.id === customerId);
    if (changedCust) {
      databaseService.saveCustomer(changedCust, false).catch(() => setGlobalError('Customer sync failed — saved locally.'));
    }
    databaseService.saveSale(newSale, updatedProducts, updatedSales).catch(() => setGlobalError('Sale sync failed — saved locally.'));
  };

  const handleRecordPayment = (customerId: string, amount: number, method: 'Cash' | 'E-transfer', notes: string) => {
    if (!customerId || amount <= 0) return;

    const updatedCustomers = customers.map(c => {
      if (c.id !== customerId) return c;
      return { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - amount) };
    });
    const changedCust = updatedCustomers.find(c => c.id === customerId);

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      customerId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      notes,
    };
    const updatedPayments = [newPayment, ...payments];

    setCustomers(updatedCustomers);
    setPayments(updatedPayments);

    localStorage.setItem('treat_tab_customers', JSON.stringify(updatedCustomers));
    if (changedCust) {
      databaseService.saveCustomer(changedCust, false).catch(() => setGlobalError('Balance sync failed — saved locally.'));
    }
    databaseService.savePayment(newPayment, updatedPayments).catch(() => setGlobalError('Payment sync failed — saved locally.'));
  };

  const handleQuickAdjustStock = (productId: string, nextStock: number) => {
    const updatedProducts = products.map(p => {
      if (p.id !== productId) return p;
      return { ...p, stock: nextStock, status: stockStatus(nextStock) };
    });
    const changed = updatedProducts.find(p => p.id === productId);
    setProducts(updatedProducts);
    localStorage.setItem('treat_tab_products', JSON.stringify(updatedProducts));
    if (changed) databaseService.saveProduct(changed, false).catch(() => setGlobalError('Stock sync failed — saved locally.'));
  };

  const handleStartEditCustomer = (cust: Customer) => setEditingCustomerId(cust.id);

  const handleSaveCustomerEdit = (id: string, name: string, discount: number) => {
    const updatedCustomers = customers.map(c => (c.id === id ? { ...c, name, discount } : c));
    const changed = updatedCustomers.find(c => c.id === id);
    setCustomers(updatedCustomers);
    localStorage.setItem('treat_tab_customers', JSON.stringify(updatedCustomers));
    if (changed) databaseService.saveCustomer(changed, false).catch(() => setGlobalError('Customer sync failed — saved locally.'));
    setEditingCustomerId(null);
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    databaseService.deleteCustomer(id, updated).catch(() => setGlobalError('Delete sync failed — removed locally.'));
    setEditingCustomerId(null);
  };

  const handleStartEditProduct = (prod: Product) => setEditingProductId(prod.id);

  const handleSaveProductEdit = (
    id: string,
    name: string,
    cost: number,
    price: number,
    category: Product['category'],
    stock: number,
  ) => {
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, name, cost, price, category, stock, status: stockStatus(stock) } : p,
    );
    const changed = updatedProducts.find(p => p.id === id);
    setProducts(updatedProducts);
    localStorage.setItem('treat_tab_products', JSON.stringify(updatedProducts));
    if (changed) databaseService.saveProduct(changed, false).catch(() => setGlobalError('Product sync failed — saved locally.'));
    setEditingProductId(null);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    databaseService.deleteProduct(id, updated).catch(() => setGlobalError('Delete sync failed — removed locally.'));
    setEditingProductId(null);
  };

  const handleResetDatabase = async () => {
    setDbLoading(true);
    try {
      await databaseService.clearAllSalesAndHistory();
      const freshData = await databaseService.loadAllData();
      setCustomers(freshData.customers);
      setProducts(freshData.products);
      setSales(freshData.sales);
      setPayments(freshData.payments);
      setDbActive(freshData.supabaseActive);
    } catch (e) {
      console.error('Failed to clear database logs', e);
      setGlobalError('Reset failed. Please try again.');
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        customers, products, sales, payments,
        dbActive, dbLoading,
        activeTab, activeModal, setActiveTab, setActiveModal,
        editingCustomerId, editingProductId, setEditingCustomerId, setEditingProductId,
        prefilledPaymentCustomerId, prefilledPaymentAmount, openPaymentModal,
        weeklyGoal, setWeeklyGoal,
        buzzStatus, triggerBuzzReminder,
        globalError, clearGlobalError,
        handleAddCustomer, handleAddProduct, handleRecordSale, handleRecordPayment,
        handleQuickAdjustStock, handleStartEditCustomer, handleSaveCustomerEdit, handleDeleteCustomer,
        handleStartEditProduct, handleSaveProductEdit, handleDeleteProduct, handleResetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
