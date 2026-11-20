import type { ContentSection } from '@/types/content.types';
import type { PaymentMethod } from '@/types/order.types';
import type { ProductBadge } from '@/types/product.types';
import type { UserRole } from '@/types/user.types';

export interface CategorySeed {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
}

export interface VariantSeed {
  name: string;
  price: number;
}

export interface ProductSeed {
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  badge?: ProductBadge;
  imageUrl: string;
  galleryUrls?: string[];
  materials: string[];
  dimensions?: string;
  stockQuantity: number;
  isFeatured?: boolean;
  isCustomizable?: boolean;
  variants?: VariantSeed[];
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ReviewSeed {
  productSlug: string | null;
  authorName: string;
  city: string;
  rating: Rating;
  comment: string;
  isFeatured?: boolean;
  daysAgo: number;
}

export interface StoreSettingsSeed {
  storeName: string;
  tagline: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  announcements: string[];
  currencyCode: string;
  shippingFee: number;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}

export interface PaymentOptionSeed {
  method: PaymentMethod;
  label: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string;
}

export interface HighlightSeed {
  icon: string;
  title: string;
  description: string;
}

export interface ContentPageSeed {
  slug: string;
  title: string;
  summary: string;
  sections: ContentSection[];
}

export interface UserSeed {
  name: string;
  email: string;
  role: UserRole;
}
