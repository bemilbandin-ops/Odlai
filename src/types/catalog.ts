export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  stockStatus: StockStatus;
  image: string;
  specifications: Record<string, string>;
  beginnerFriendly: boolean;
  hidden?: boolean;
}

export interface CartItem {
  productSlug: string;
  quantity: number;
}

export interface DemoOrder {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  total: number;
  items: CartItem[];
}
