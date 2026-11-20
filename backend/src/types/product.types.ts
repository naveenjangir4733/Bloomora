import type { PaginationParams } from '@/types/common.types';
import type { Review } from '@/types/review.types';

export const PRODUCT_BADGES = ['best_seller', 'new', 'gift_idea', 'limited'] as const;
export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export const PRODUCT_SORTS = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export interface ProductCategoryRef {
  slug: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

/** Lightweight shape used by listing grids and cards. */
export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  badge: ProductBadge | null;
  imageUrl: string;
  category: ProductCategoryRef;
  rating: number | null;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
}

/** Full shape used by the product page. */
export interface ProductDetail extends ProductSummary {
  description: string;
  galleryUrls: string[];
  materials: string[];
  dimensions: string | null;
  careInstructions: string | null;
  stockQuantity: number;
  isCustomizable: boolean;
  variants: ProductVariant[];
  reviews: Review[];
  related: ProductSummary[];
}

export interface ProductFilters extends PaginationParams {
  search?: string;
  categorySlug?: string;
  featured?: boolean;
  badge?: ProductBadge;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort: ProductSort;
}

/** Pricing/stock data needed to validate and price a cart at checkout. */
export interface PurchasableProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  variants: ProductVariant[];
}
