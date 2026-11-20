import { PRODUCT_SORTS, type ProductBadge, type ProductSort } from '@/types/catalog.types';
import type { OrderStatus, PaymentMethod } from '@/types/order.types';
import type { BadgeVariant, SelectOption } from '@/types/ui.types';

export interface BadgeStyle {
  label: string;
  variant: BadgeVariant;
}

/* Each map is a Record over a union, so a new enum value fails to compile until it is labelled. */

export const PRODUCT_BADGE_STYLES: Record<ProductBadge, BadgeStyle> = {
  best_seller: { label: 'Best Seller', variant: 'rose' },
  new: { label: 'New', variant: 'sky' },
  gift_idea: { label: 'Gift Idea', variant: 'amber' },
  limited: { label: 'Limited', variant: 'neutral' },
};

export const PRODUCT_SORT_LABELS: Record<ProductSort, string> = {
  featured: 'Featured',
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
};

export const PRODUCT_SORT_OPTIONS: SelectOption<ProductSort>[] = PRODUCT_SORTS.map(
  (value): SelectOption<ProductSort> => ({ value, label: PRODUCT_SORT_LABELS[value] }),
);

export const ORDER_STATUS_STYLES: Record<OrderStatus, BadgeStyle> = {
  pending_payment: { label: 'Awaiting payment', variant: 'amber' },
  payment_confirmed: { label: 'Payment confirmed', variant: 'sky' },
  in_production: { label: 'Being handmade', variant: 'rose' },
  shipped: { label: 'Shipped', variant: 'sky' },
  delivered: { label: 'Delivered', variant: 'sage' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

/** The happy-path order journey shown as a progress timeline. */
export const ORDER_PROGRESS: OrderStatus[] = [
  'pending_payment',
  'payment_confirmed',
  'in_production',
  'shipped',
  'delivered',
];

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  bank_transfer: '🏦',
  easypaisa: '📱',
  jazzcash: '📲',
};
