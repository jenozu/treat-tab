import { Customer, Product, Sale, Payment } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Gummy Bears (Large)',
    price: 4.50,
    cost: 2.10,
    stock: 45,
    category: 'Candy',
    icon: 'Candy',
    status: 'In Stock'
  },
  {
    id: 'p2',
    name: 'Choco Bar Mix',
    price: 2.00,
    cost: 1.10,
    stock: 5,
    category: 'Cookies',
    icon: 'Cookie',
    status: 'Low Stock'
  },
  {
    id: 'p3',
    name: 'Sour Rings Bulk',
    price: 12.00,
    cost: 6.50,
    stock: 18,
    category: 'Candy',
    icon: 'Dessert',
    status: 'In Stock'
  },
  {
    id: 'p4',
    name: 'Strawberry Cupcake',
    price: 3.50,
    cost: 1.80,
    stock: 24,
    category: 'Cakes',
    icon: 'Cake',
    status: 'In Stock'
  },
  {
    id: 'p5',
    name: 'Vanilla Fudge Ice Cream',
    price: 5.00,
    cost: 2.30,
    stock: 30,
    category: 'Ice Cream',
    icon: 'IceCream',
    status: 'In Stock'
  },
  {
    id: 'p6',
    name: 'Choco Chip Cookie Pack',
    price: 4.00,
    cost: 2.00,
    stock: 12,
    category: 'Cookies',
    icon: 'Cookie',
    status: 'In Stock'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Marcus Chen',
    discount: 0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
    purchaseCount: 0,
    totalSpent: 0.00,
    outstandingBalance: 0.00
  },
  {
    id: 'c2',
    name: 'Sarah Miller',
    discount: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
    purchaseCount: 0,
    totalSpent: 0.00,
    outstandingBalance: 0.00
  },
  {
    id: 'c3',
    name: 'Jerome Bell',
    discount: 15,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    purchaseCount: 0,
    totalSpent: 0.00,
    outstandingBalance: 0.00
  },
  {
    id: 'c4',
    name: 'Albert Smith',
    discount: 10,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80',
    purchaseCount: 0,
    totalSpent: 0.00,
    outstandingBalance: 0.00
  },
  {
    id: 'c5',
    name: 'Kristin Henry',
    discount: 20,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    purchaseCount: 0,
    totalSpent: 0.00,
    outstandingBalance: 0.00
  },
  {
    id: 'c6',
    name: 'Leslie Williams',
    discount: 0,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    purchaseCount: 0,
    totalSpent: 0.00,
    outstandingBalance: 0.00
  }
];

export const INITIAL_SALES: Sale[] = [];

export const INITIAL_PAYMENTS: Payment[] = [];
