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

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
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
  customer: {
    name: string;
    phone: string;
    email: string | null;
    city: string;
    address: string;
    notes: string | null;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
}

export interface OrderConfirmation {
  order: Order;
  paymentOption: PaymentOption | null;
}

export interface CreateOrderPayload {
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  items: Array<{ productId: string; variantId: string | null; quantity: number }>;
}
