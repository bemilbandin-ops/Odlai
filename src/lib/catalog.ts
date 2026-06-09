import { categories, products } from '../data/catalog.js';
import type { Category, Product, StockStatus } from '../types/catalog.js';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

export interface ProductFilters {
  category?: string;
  query?: string;
  beginner?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
}

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(price);

export const getVisibleProducts = (): Product[] => products.filter((product) => !product.hidden);

export const getCategories = (): Category[] => categories;

export const getCategory = (slug: string): Category | undefined => categories.find((category) => category.slug === slug);

export const getProduct = (slug: string): Product | undefined => getVisibleProducts().find((product) => product.slug === slug);

export const getProductsByCategory = (categorySlug: string): Product[] =>
  getVisibleProducts().filter((product) => product.categorySlug === categorySlug);

export const getFeaturedProducts = (): Product[] =>
  getVisibleProducts().filter((product) => product.beginnerFriendly && product.stockStatus !== 'out-of-stock').slice(0, 6);

export const getRelatedProducts = (product: Product): Product[] =>
  getVisibleProducts()
    .filter((candidate) => candidate.slug !== product.slug && candidate.categorySlug === product.categorySlug)
    .slice(0, 3);

export const stockLabel = (status: StockStatus): string => {
  if (status === 'in-stock') return 'I lager';
  if (status === 'low-stock') return 'Få kvar';
  return 'Tillfälligt slut';
};

export const filterProducts = (filters: ProductFilters): Product[] => {
  const query = filters.query?.trim().toLocaleLowerCase('sv-SE') ?? '';
  const sorted = getVisibleProducts().filter((product) => {
    const searchable = `${product.name} ${product.shortDescription} ${product.longDescription}`.toLocaleLowerCase('sv-SE');
    const matchesQuery = query.length === 0 || searchable.includes(query);
    const matchesCategory = !filters.category || product.categorySlug === filters.category;
    const matchesBeginner = !filters.beginner || product.beginnerFriendly;
    const matchesStock = !filters.inStock || product.stockStatus !== 'out-of-stock';
    const matchesMin = filters.minPrice === undefined || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || product.price <= filters.maxPrice;
    return matchesQuery && matchesCategory && matchesBeginner && matchesStock && matchesMin && matchesMax;
  });

  if (filters.sort === 'price-asc') return sorted.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') return sorted.sort((a, b) => b.price - a.price);
  if (filters.sort === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name, 'sv-SE'));
  return sorted;
};

export const ensureUniqueSlugs = (): boolean => new Set(products.map((product) => product.slug)).size === products.length;
