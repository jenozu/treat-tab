export type TabType = 'dashboard' | 'sales' | 'customers' | 'products';
export type ModalType =
  | 'none'
  | 'outstanding'
  | 'add-sale'
  | 'add-payment'
  | 'add-customer'
  | 'add-product'
  | 'reset-confirm'
  | 'settings';

export const WEEK_REVENUE_GOAL = 1500;
export const PRODUCT_CATEGORIES = ['Candy', 'Ice Cream', 'Cookies', 'Cakes', 'Other'] as const;
