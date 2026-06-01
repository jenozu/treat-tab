import { supabase, isSupabaseConfigured } from './supabase';
import { Customer, Product, Sale, Payment } from './types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_PAYMENTS } from './sampleData';

// Mapping: SQL snake_case <-> Application camelCase

export function mapDbToCustomer(db: any): Customer {
  return {
    id: db.id,
    name: db.name,
    discount: Number(db.discount ?? 0),
    avatar: db.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
    purchaseCount: Number(db.purchase_count ?? 0),
    totalSpent: Number(db.total_spent ?? 0),
    outstandingBalance: Number(db.outstanding_balance ?? 0),
  };
}

export function mapCustomerToDb(cust: Customer): any {
  return {
    id: cust.id,
    name: cust.name,
    discount: cust.discount,
    avatar: cust.avatar,
    purchase_count: cust.purchaseCount,
    total_spent: cust.totalSpent,
    outstanding_balance: cust.outstandingBalance,
  };
}

export function mapDbToProduct(db: any): Product {
  return {
    id: db.id,
    name: db.name,
    price: Number(db.selling_price ?? 0),
    cost: Number(db.cost_per_item ?? 0),
    stock: Number(db.stock_quantity ?? 0),
    category: db.category,
    icon: db.icon || 'Candy',
    status: db.status || 'In Stock',
  };
}

export function mapProductToDb(prod: Product): any {
  return {
    id: prod.id,
    name: prod.name,
    category: prod.category,
    cost_per_item: prod.cost,
    selling_price: prod.price,
    stock_quantity: prod.stock,
    icon: prod.icon,
    status: prod.status,
  };
}

export function mapDbToSale(dbSale: any, dbItems: any[]): Sale {
  return {
    id: dbSale.id,
    customerId: dbSale.customer_id || '',
    totalAmount: Number(dbSale.total_amount ?? 0),
    status: dbSale.payment_status === 'Paid' ? 'Paid' : 'Pending',
    date: dbSale.created_at || new Date().toISOString(),
    items: dbItems.map(item => ({
      productId: item.product_id,
      quantity: Number(item.quantity ?? 0),
      priceAtSale: Number(item.unit_price ?? 0)
    }))
  };
}

export function mapDbToPayment(db: any): Payment {
  return {
    id: db.id,
    customerId: db.customer_id || '',
    amount: Number(db.amount ?? 0),
    date: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    method: db.payment_method === 'E-transfer' ? 'E-transfer' : 'Cash',
    notes: db.notes || '',
  };
}

export function mapPaymentToDb(pay: Payment): any {
  return {
    id: pay.id,
    customer_id: pay.customerId,
    amount: pay.amount,
    payment_method: pay.method,
    notes: pay.notes,
    created_at: new Date(pay.date).toISOString()
  };
}

// --------------------------------------------------------
// SEED INITIAL DATABASE IF EMPTY IN SUPABASE
// --------------------------------------------------------
async function seedDatabaseIfEmpty() {
  if (!supabase) return;
  try {
    const { count, error } = await supabase.from('customers').select('*', { count: 'exact', head: true });
    if (error) return;

    if (count === 0) {
      console.log('Seeding initial Treat Tab records to Supabase...');
      // 1. Seed customers
      const dbCusts = INITIAL_CUSTOMERS.map(mapCustomerToDb);
      await supabase.from('customers').insert(dbCusts);

      // 2. Seed products
      const dbProds = INITIAL_PRODUCTS.map(mapProductToDb);
      await supabase.from('products').insert(dbProds);

      // 3. Seed sales
      for (const sale of INITIAL_SALES) {
        const totalProfit = sale.items.reduce((sum, item) => {
          const prod = INITIAL_PRODUCTS.find(p => p.id === item.productId);
          const cost = prod ? prod.cost : (item.priceAtSale * 0.5);
          return sum + (item.priceAtSale - cost) * item.quantity;
        }, 0);

        await supabase.from('sales').insert({
          id: sale.id,
          customer_id: sale.customerId || null,
          total_amount: sale.totalAmount,
          total_profit: totalProfit,
          payment_status: sale.status,
          created_at: sale.date
        });

        const dbSaleItems = sale.items.map((item, idx) => {
          const prod = INITIAL_PRODUCTS.find(p => p.id === item.productId);
          const itemCost = prod ? prod.cost : (item.priceAtSale * 0.5);
          const lineTotal = item.quantity * item.priceAtSale;
          const lineProfit = lineTotal - (item.quantity * itemCost);
          
          return {
            id: `${sale.id}_item_${idx}`,
            sale_id: sale.id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.priceAtSale,
            unit_cost: itemCost,
            line_total: lineTotal,
            line_profit: lineProfit
          };
        });
        await supabase.from('sale_items').insert(dbSaleItems);
      }

      // 4. Seed payments
      const dbPayments = INITIAL_PAYMENTS.map(mapPaymentToDb);
      await supabase.from('payments').insert(dbPayments);
      console.log('Seeding completed successfully!');
    }
  } catch (err) {
    console.error('Could not seed database', err);
  }
}

// --------------------------------------------------------
// DATABASE SERVICE METHODS
// --------------------------------------------------------
function fallbackToLocalStorage() {
  const storedCusts = localStorage.getItem('treat_tab_customers');
  const storedProds = localStorage.getItem('treat_tab_products');
  const storedSales = localStorage.getItem('treat_tab_sales');
  const storedPays = localStorage.getItem('treat_tab_payments');

  const rawCusts: Customer[] = storedCusts ? JSON.parse(storedCusts) : INITIAL_CUSTOMERS;
  const rawProds: Product[] = storedProds ? JSON.parse(storedProds) : INITIAL_PRODUCTS;
  const rawSales: Sale[] = storedSales ? JSON.parse(storedSales) : INITIAL_SALES;
  const rawPays: Payment[] = storedPays ? JSON.parse(storedPays) : INITIAL_PAYMENTS;

  const customers = Array.from(new Map(rawCusts.map(c => [c.id, c])).values());
  const products = Array.from(new Map(rawProds.map(p => [p.id, p])).values());
  const sales = Array.from(new Map(rawSales.map(s => [s.id, s])).values());
  const payments = Array.from(new Map(rawPays.map(p => [p.id, p])).values());

  return {
    customers,
    products,
    sales,
    payments,
    supabaseActive: false
  };
}

export const databaseService = {
  // Fills/Loads state
  async loadAllData() {
    if (!isSupabaseConfigured || !supabase) {
      // LocalStorage Mode
      return fallbackToLocalStorage();
    }

    try {
      // Run seed check first
      await seedDatabaseIfEmpty();

      // Retrieve from Supabase
      const [custRes, prodRes, salesRes, itemsRes, payRes] = await Promise.all([
        supabase.from('customers').select('*').order('name'),
        supabase.from('products').select('*').order('name'),
        supabase.from('sales').select('*').order('created_at', { ascending: false }),
        supabase.from('sale_items').select('*'),
        supabase.from('payments').select('*').order('created_at', { ascending: false })
      ]);

      if (custRes.error || prodRes.error || salesRes.error || payRes.error) {
        // Quietly route to standard localStorage fallback
        return fallbackToLocalStorage();
      }

      const rawCusts = (custRes.data || []).map(mapDbToCustomer);
      const rawProds = (prodRes.data || []).map(mapDbToProduct);
      const rawPays = (payRes.data || []).map(mapDbToPayment);
      
      const rawSales = (salesRes.data || []).map(dbSale => {
        const saleItems = (itemsRes.data || []).filter(item => item.sale_id === dbSale.id);
        return mapDbToSale(dbSale, saleItems);
      });

      const customers = Array.from(new Map(rawCusts.map(c => [c.id, c])).values());
      const products = Array.from(new Map(rawProds.map(p => [p.id, p])).values());
      const sales = Array.from(new Map(rawSales.map(s => [s.id, s])).values());
      const payments = Array.from(new Map(rawPays.map(p => [p.id, p])).values());

      return {
        customers,
        products,
        sales,
        payments,
        supabaseActive: true
      };
    } catch (e) {
      return fallbackToLocalStorage();
    }
  },

  // Save/Update Customer
  async saveCustomer(cust: Customer, isNew: boolean, syncArray?: Customer[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbCust = mapCustomerToDb(cust);
        let error;
        if (isNew) {
          ({ error } = await supabase.from('customers').insert(dbCust));
        } else {
          ({ error } = await supabase.from('customers').update(dbCust).eq('id', cust.id));
        }
        if (!error) return;
        console.error('Supabase customer save error:', error);
      } catch (e) {
        console.error('Failed to save customer to Supabase', e);
      }
    }
    // Sync storage fallback
    if (syncArray) {
      let nextArr = [...syncArray];
      const existingIdx = nextArr.findIndex(c => c.id === cust.id);
      if (existingIdx >= 0) {
        nextArr[existingIdx] = cust;
      } else {
        nextArr.push(cust);
      }
      const uniqueArr = Array.from(new Map(nextArr.map(c => [c.id, c])).values());
      localStorage.setItem('treat_tab_customers', JSON.stringify(uniqueArr));
    }
  },

  // Delete Customer
  async deleteCustomer(id: string, syncArray?: Customer[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) console.error('Supabase customer delete error:', error);
      } catch (e) {
        console.error('Failed to delete customer', e);
      }
    }
    if (syncArray) {
      const nextArr = syncArray.filter(c => c.id !== id);
      localStorage.setItem('treat_tab_customers', JSON.stringify(nextArr));
    }
  },

  // Save/Update Product
  async saveProduct(prod: Product, isNew: boolean, syncArray?: Product[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbProd = mapProductToDb(prod);
        let error;
        if (isNew) {
          ({ error } = await supabase.from('products').insert(dbProd));
        } else {
          ({ error } = await supabase.from('products').update(dbProd).eq('id', prod.id));
        }
        if (!error) return;
        console.error('Supabase product save error:', error);
      } catch (e) {
        console.error('Failed to save product to Supabase', e);
      }
    }
    if (syncArray) {
      let nextArr = [...syncArray];
      const existingIdx = nextArr.findIndex(p => p.id === prod.id);
      if (existingIdx >= 0) {
        nextArr[existingIdx] = prod;
      } else {
        nextArr.push(prod);
      }
      const uniqueArr = Array.from(new Map(nextArr.map(p => [p.id, p])).values());
      localStorage.setItem('treat_tab_products', JSON.stringify(uniqueArr));
    }
  },

  // Delete Product
  async deleteProduct(id: string, syncArray?: Product[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Supabase product delete error:', error);
      } catch (e) {
        console.error('Failed to delete product', e);
      }
    }
    if (syncArray) {
      const nextArr = syncArray.filter(p => p.id !== id);
      localStorage.setItem('treat_tab_products', JSON.stringify(nextArr));
    }
  },

  // Save Sale & items
  async saveSale(sale: Sale, products: Product[], syncArray?: Sale[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        const totalProfit = sale.items.reduce((sum, item) => {
          const prod = products.find(p => p.id === item.productId);
          const cost = prod ? prod.cost : (item.priceAtSale * 0.5);
          return sum + (item.priceAtSale - cost) * item.quantity;
        }, 0);

        const { error: saleErr } = await supabase.from('sales').insert({
          id: sale.id,
          customer_id: sale.customerId || null,
          total_amount: sale.totalAmount,
          total_profit: totalProfit,
          payment_status: sale.status,
          created_at: sale.date
        });

        if (saleErr) {
          console.error('Supabase sale save error:', saleErr);
        } else {
          const dbSaleItems = sale.items.map((item, idx) => {
            const prod = products.find(p => p.id === item.productId);
            const itemCost = prod ? prod.cost : (item.priceAtSale * 0.5);
            const lineTotal = item.quantity * item.priceAtSale;
            const lineProfit = lineTotal - (item.quantity * itemCost);
            
            return {
              id: `${sale.id}_item_${idx}`,
              sale_id: sale.id,
              product_id: item.productId,
              quantity: item.quantity,
              unit_price: item.priceAtSale,
              unit_cost: itemCost,
              line_total: lineTotal,
              line_profit: lineProfit
            };
          });
          
          const { error: itemsErr } = await supabase.from('sale_items').insert(dbSaleItems);
          if (itemsErr) console.error('Supabase sale items save error:', itemsErr);
        }
      } catch (e) {
        console.error('Failed to save sale to Supabase', e);
      }
    }
    if (syncArray) {
      let nextArr = [...syncArray];
      const existingIdx = nextArr.findIndex(s => s.id === sale.id);
      if (existingIdx >= 0) {
        nextArr[existingIdx] = sale;
      } else {
        nextArr = [sale, ...nextArr];
      }
      const uniqueArr = Array.from(new Map(nextArr.map(s => [s.id, s])).values());
      localStorage.setItem('treat_tab_sales', JSON.stringify(uniqueArr));
    }
  },

  // Save Payment
  async savePayment(payment: Payment, syncArray?: Payment[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbPay = mapPaymentToDb(payment);
        const { error } = await supabase.from('payments').insert(dbPay);
        if (error) console.error('Supabase payment save error:', error);
      } catch (e) {
        console.error('Failed to save payment to Supabase', e);
      }
    }
    if (syncArray) {
      let nextArr = [...syncArray];
      const existingIdx = nextArr.findIndex(p => p.id === payment.id);
      if (existingIdx >= 0) {
        nextArr[existingIdx] = payment;
      } else {
        nextArr = [payment, ...nextArr];
      }
      const uniqueArr = Array.from(new Map(nextArr.map(p => [p.id, p])).values());
      localStorage.setItem('treat_tab_payments', JSON.stringify(uniqueArr));
    }
  },

  // Reset/Clear all sales and payment history for a fresh start
  async clearAllSalesAndHistory() {
    if (isSupabaseConfigured && supabase) {
      try {
        // Delete all payments, sale items, and sales from database
        await supabase.from('payments').delete().neq('id', '_none_');
        await supabase.from('sale_items').delete().neq('id', '_none_');
        await supabase.from('sales').delete().neq('id', '_none_');

        // Reset metrics for customers in database
        const { data: dbCusts } = await supabase.from('customers').select('id');
        if (dbCusts && dbCusts.length > 0) {
          for (const c of dbCusts) {
            await supabase.from('customers').update({
              purchase_count: 0,
              total_spent: 0,
              outstanding_balance: 0
            }).eq('id', c.id);
          }
        }
      } catch (e) {
        console.error('Failed to clear Supabase sales history', e);
      }
    }

    // Always flush/clear local storage records
    localStorage.setItem('treat_tab_sales', JSON.stringify([]));
    localStorage.setItem('treat_tab_payments', JSON.stringify([]));

    const storedCusts = localStorage.getItem('treat_tab_customers');
    if (storedCusts) {
      try {
        const custs: Customer[] = JSON.parse(storedCusts);
        const resetCusts = custs.map(c => ({
          ...c,
          purchaseCount: 0,
          totalSpent: 0,
          outstandingBalance: 0
        }));
        localStorage.setItem('treat_tab_customers', JSON.stringify(resetCusts));
      } catch (e) {
        console.error('Error resetting customers from local storage', e);
      }
    } else {
      const resetCusts = INITIAL_CUSTOMERS.map(c => ({
        ...c,
        purchaseCount: 0,
        totalSpent: 0,
        outstandingBalance: 0
      }));
      localStorage.setItem('treat_tab_customers', JSON.stringify(resetCusts));
    }
  }
};
