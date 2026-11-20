export const PRODUCT_BADGES = ['best_seller', 'new', 'gift_idea', 'limited'] as const;
export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export const PRODUCT_SORTS = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

export interface Review {
  id: string;
  authorName: string;
  city: string;
  rating: number;
  comment: string;
  productName: string | null;
  productSlug: string | null;
  createdAt: string;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  badge: ProductBadge | null;
  imageUrl: string;
  category: { slug: string; name: string };
  rating: number | null;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
}

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

/** Query accepted by `GET /products`. Undefined values are omitted from the URL. */
export interface ProductQuery {
  search?: string;
  category?: string;
  featured?: boolean;
  badge?: ProductBadge;
  inStock?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}
