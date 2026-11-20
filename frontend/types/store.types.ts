import type { PaymentMethod } from '@/types/order.types';

export interface SocialLinks {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
}

export interface StoreSettings {
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
  social: SocialLinks;
}

export interface PaymentOption {
  method: PaymentMethod;
  label: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string;
}

export interface StoreHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface StoreStats {
  productCount: number;
  categoryCount: number;
  reviewCount: number;
  averageRating: number | null;
  ordersDelivered: number;
}

export interface StoreConfig {
  settings: StoreSettings;
  paymentOptions: PaymentOption[];
  highlights: StoreHighlight[];
  stats: StoreStats;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export interface ContentPage {
  slug: string;
  title: string;
  summary: string;
  sections: ContentSection[];
  updatedAt: string;
}

export interface ContentPageLink {
  slug: string;
  title: string;
}

export interface InquiryReceipt {
  id: string;
  createdAt: string;
}

export interface CustomOrderPayload {
  name: string;
  phone: string;
  email: string;
  categorySlug: string | null;
  budget: number | null;
  neededBy: string | null;
  description: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
