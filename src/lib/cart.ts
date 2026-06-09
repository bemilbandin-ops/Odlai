import { getProduct } from './catalog.js';
import type { CartItem, DemoOrder } from '../types/catalog.js';

const CART_KEY = 'odlai-cart';
const ORDER_KEY = 'odlai-demo-order';
const SHIPPING = 79;

export const getCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => getProduct(item.productSlug) && item.quantity > 0) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]): void => localStorage.setItem(CART_KEY, JSON.stringify(items));

export const addToCart = (productSlug: string, quantity = 1): CartItem[] => {
  const cart = getCart();
  const existing = cart.find((item) => item.productSlug === productSlug);
  if (existing) existing.quantity += quantity;
  else cart.push({ productSlug, quantity });
  saveCart(cart);
  window.dispatchEvent(new CustomEvent('cart:changed'));
  return cart;
};

export const updateQuantity = (productSlug: string, quantity: number): CartItem[] => {
  const cart = getCart().map((item) => (item.productSlug === productSlug ? { ...item, quantity } : item)).filter((item) => item.quantity > 0);
  saveCart(cart);
  window.dispatchEvent(new CustomEvent('cart:changed'));
  return cart;
};

export const removeFromCart = (productSlug: string): CartItem[] => updateQuantity(productSlug, 0);

export const clearCart = (): void => {
  saveCart([]);
  window.dispatchEvent(new CustomEvent('cart:changed'));
};

export const cartSubtotal = (items = getCart()): number =>
  items.reduce((sum, item) => sum + (getProduct(item.productSlug)?.price ?? 0) * item.quantity, 0);

export const estimatedShipping = (items = getCart()): number => (items.length > 0 ? SHIPPING : 0);

export const cartTotal = (items = getCart()): number => cartSubtotal(items) + estimatedShipping(items);

export const cartCount = (items = getCart()): number => items.reduce((sum, item) => sum + item.quantity, 0);

export const saveDemoOrder = (order: DemoOrder): void => localStorage.setItem(ORDER_KEY, JSON.stringify(order));

export const getDemoOrder = (): DemoOrder | undefined => {
  try {
    const stored = localStorage.getItem(ORDER_KEY);
    return stored ? (JSON.parse(stored) as DemoOrder) : undefined;
  } catch {
    return undefined;
  }
};
