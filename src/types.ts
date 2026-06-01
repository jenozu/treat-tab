export interface Customer {
  id: string;
  name: string;
  discount: number; // percentage discount (e.g. 10 for 10%)
  avatar: string;
  purchaseCount: number;
  totalSpent: number;
  outstandingBalance: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category: 'Candy' | 'Ice Cream' | 'Cookies' | 'Cakes' | 'Other';
  icon: string; // lucide icon name
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface SaleItem {
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  status: 'Paid' | 'Pending'; // 'Pending' means added to the user's tab
  date: string; // ISO string
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  method: 'Cash' | 'E-transfer';
  notes: string;
}

export type ViewType = 
  | 'dashboard' 
  | 'customers' 
  | 'products' 
  | 'add-sale' 
  | 'payments' 
  | 'outstanding';
