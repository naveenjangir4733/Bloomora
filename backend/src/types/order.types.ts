import type { PaymentOption } from '@/types/store.types';

export const ORDER_STATUSES = [
  'pending_payment',
  'payment_confirmed',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ['bank_transfer', 'easypaisa', 'jazzcash'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  notes: string | null;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  variantName: string | null;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
}

/** Returned after checkout so the customer knows where to send the advance payment. */
export interface OrderConfirmation {
  order: Order;
  paymentOption: PaymentOption | null;
}

/** A priced, validated order line ready to be persisted. */
export interface NewOrderItem {
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface NewOrder {
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  items: NewOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}
