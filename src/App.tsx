import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardTab from './components/DashboardTab';
import SalesTab from './components/SalesTab';
import CustomersTab from './components/CustomersTab';
import ProductsTab from './components/ProductsTab';
import OutstandingBalancesModal from './modals/OutstandingBalancesModal';
import AddSaleModal from './modals/AddSaleModal';
import LogPaymentModal from './modals/LogPaymentModal';
import AddCustomerModal from './modals/AddCustomerModal';
import AddProductModal from './modals/AddProductModal';
import EditCustomerModal from './modals/EditCustomerModal';
import EditProductModal from './modals/EditProductModal';
import ResetModal from './modals/ResetModal';
import { Sparkles, X } from 'lucide-react';

function AppShell() {
  const { activeTab, activeModal, editingCustomerId, editingProductId, buzzStatus, globalError, clearGlobalError } = useApp();

  return (
    <div className="h-dvh bg-[#FFD8E8] flex items-center justify-center font-sans antialiased p-0 md:py-8 md:px-4">
      <div className="w-full max-w-md bg-white h-full max-h-full md:h-[850px] md:max-h-[850px] md:min-h-[850px] md:rounded-3xl border-4 border-[#000000] shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col relative">
        <Header />

        {globalError && (
          <div className="shrink-0 bg-rose-600 text-white text-[10px] font-black flex items-center justify-between gap-2 px-4 py-2 border-b-2 border-black z-30">
            <span>{globalError}</span>
            <button onClick={clearGlobalError} className="p-0.5 hover:bg-rose-700 rounded shrink-0 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 pb-4 space-y-4 bg-[#FFD8E8]/10 relative">
          {buzzStatus && (
            <div className="p-3.5 bg-[#9BE9FB] text-black rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-2 mb-2 select-none z-30 animate-bounce">
              <Sparkles className="w-5 h-5 text-black" />
              <p className="text-xs font-black">{buzzStatus}</p>
            </div>
          )}
          {activeTab === 'dashboard' && <ErrorBoundary label="Dashboard failed to load"><DashboardTab /></ErrorBoundary>}
          {activeTab === 'sales' && <ErrorBoundary label="Sales failed to load"><SalesTab /></ErrorBoundary>}
          {activeTab === 'customers' && <ErrorBoundary label="Customers failed to load"><CustomersTab /></ErrorBoundary>}
          {activeTab === 'products' && <ErrorBoundary label="Products failed to load"><ProductsTab /></ErrorBoundary>}
        </main>

        <BottomNav />

        {activeModal === 'outstanding' && <OutstandingBalancesModal />}
        {activeModal === 'add-sale' && <AddSaleModal />}
        {activeModal === 'add-payment' && <LogPaymentModal />}
        {activeModal === 'add-customer' && <AddCustomerModal />}
        {activeModal === 'add-product' && <AddProductModal />}
        {activeModal === 'reset-confirm' && <ResetModal />}
        {editingCustomerId !== null && <EditCustomerModal />}
        {editingProductId !== null && <EditProductModal />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
