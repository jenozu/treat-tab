import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Product, Sale, Payment } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_PAYMENTS } from '../sampleData';
import { databaseService } from '../supabaseService';
import { TabType, ModalType } from '../constants';

interface AppContextValue {
  // Data
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  payments: Payment[];
  // DB status
  dbActive: boolean;
  dbLoading: boolean;
  // Navigation
  activeTab: TabType;
  activeModal: ModalType;
  setActiveTab: (tab: TabType) => void;
  setActiveModal: (modal: ModalType) => void;
  // Edit overlay state (driven by context so modals can open from any tab)
  editingCustomerId: string | null;
  editingProductId: string | null;
  setEditingCustomerId: (id: string | null) => void;
  setEditingProductId: (id: string | null) => void;
  // Pre-filled payment modal state
  prefilledPaymentCustomerId: string;
  prefilledPaymentAmount: string;
  openPaymentModal: (customerId: string, amount: string) => void;
  // Buzz
  buzzStatus: string | null;
  triggerBuzzReminder: (customerName: string) => void;
  // Mutation handlers
  handleAddCustomer: (name: string, discount: number) => Promise<void>;
  handleAddProduct: (name: string, cost: number, price: number, category: Product['category'], stock: number) => Promise<void>;
  handleRecordSale: (customerId: string, cartItems: { productId: string; quantity: number }[], totalAmount: number, payTypeTab: boolean) => void;
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
      } finally {
        setDbLoading(false);
      }
    }
    initData();
  }, []);

  const triggerBuzzReminder = (customerName: string) => {
    setBuzzStatus(`Friendly WhatsApp reminder triggered for ${customerName}!`);
    setTimeout(() => setBuzzStatus(null), 3000);
  };

  const openPaymentModal = (customerId: string, amount: string) => {
    setPrefilledPaymentCustomerId(customerId);
    setPrefilledPaymentAmount(amount);
    setActiveModal('add-payment');
  };

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
    await databaseService.saveCustomer(newCust, true, [...customers, newCust]);
    setCustomers(prev => prev.some(c => c.id === newCust.id) ? prev : [...prev, newCust]);
  };

  const handleAddProduct = async (name: string, cost: number, price: number, category: Product['category'], stock: number) => {
    const status = stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';
    const newProd: Product = { id: `p_${Date.now()}`, name, cost, price, category, stock, icon: 'Cookie', status };
    await databaseService.saveProduct(newProd, true, [...products, newProd]);
    setProducts(prev => prev.some(p => p.id === newProd.id) ? prev : [...prev, newProd]);
  };

  const handleRecordSale = (customerId: string, cartItems: { productId: string; quantity: number }[], totalAmount: number, payTypeTab: boolean) => {
    const isTab = payTypeTab && customerId !== '';
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

    setCustomers(prevCusts => {
      const updated = prevCusts.map(c => {
        if (c.id === customerId) {
          const nextCust = {
            ...c,
            purchaseCount: c.purchaseCount + 1,
            totalSpent: c.totalSpent + totalAmount,
            outstandingBalance: isTab ? c.outstandingBalance + totalAmount : c.outstandingBalance,
          };
          databaseService.saveCustomer(nextCust, false);
          return nextCust;
        }
        return c;
      });
      localStorage.setItem('treat_tab_customers', JSON.stringify(updated));
      return updated;
    });

    const newSaleItem: Sale = {
      id: `s_${Date.now()}`,
      customerId,
      items: cartItems.map(item => {
        const prod = nextSavedProducts.find(p => p.id === item.productId)!;
        return { productId: item.productId, quantity: item.quantity, priceAtSale: prod ? prod.price : 0 };
      }),
      totalAmount,
      status: isTab ? 'Pending' : 'Paid',
      date: new Date().toISOString(),
    };

    setSales(prevSales => {
      const nextSales = [newSaleItem, ...prevSales];
      databaseService.saveSale(newSaleItem, nextSavedProducts, nextSales);
      return nextSales;
    });
  };

  const handleRecordPayment = (customerId: string, amount: number, method: 'Cash' | 'E-transfer', notes: string) => {
    if (!customerId || amount <= 0) return;

    setCustomers(prevCusts => {
      const updated = prevCusts.map(c => {
        if (c.id === customerId) {
          const nextCust = { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - amount) };
          databaseService.saveCustomer(nextCust, false);
          return nextCust;
        }
        return c;
      });
      localStorage.setItem('treat_tab_customers', JSON.stringify(updated));
      return updated;
    });

    const newPayment: Payment = {
      id: `p_${Date.now()}`,
      customerId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      notes,
    };

    setPayments(prevPayments => {
      const nextPayments = [newPayment, ...prevPayments];
      databaseService.savePayment(newPayment, nextPayments);
      return nextPayments;
    });
  };

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

  const handleStartEditCustomer = (cust: Customer) => {
    setEditingCustomerId(cust.id);
  };

  const handleSaveCustomerEdit = (id: string, name: string, discount: number) => {
    setCustomers(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          const nextCust = { ...c, name, discount };
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
    setEditingCustomerId(null);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
  };

  const handleSaveProductEdit = (id: string, name: string, cost: number, price: number, category: Product['category'], stock: number) => {
    const status = stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const nextProd = { ...p, name, cost, price, category, stock, status };
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
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      customers, products, sales, payments,
      dbActive, dbLoading,
      activeTab, activeModal, setActiveTab, setActiveModal,
      editingCustomerId, editingProductId, setEditingCustomerId, setEditingProductId,
      prefilledPaymentCustomerId, prefilledPaymentAmount, openPaymentModal,
      buzzStatus, triggerBuzzReminder,
      handleAddCustomer, handleAddProduct, handleRecordSale, handleRecordPayment,
      handleQuickAdjustStock, handleStartEditCustomer, handleSaveCustomerEdit, handleDeleteCustomer,
      handleStartEditProduct, handleSaveProductEdit, handleDeleteProduct, handleResetDatabase,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
