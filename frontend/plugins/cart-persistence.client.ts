import type { CartItem } from '@/types/cart.types';
import { isNullableString, isRecord } from '@/utils/guards';

const STORAGE_KEY = 'bloomora:cart:v1';

/** Stored data is untrusted (older versions, manual edits), so every field is validated. */
const isCartItem = (value: unknown): value is CartItem =>
  isRecord(value) &&
  typeof value['key'] === 'string' &&
  typeof value['productId'] === 'string' &&
  typeof value['slug'] === 'string' &&
  typeof value['name'] === 'string' &&
  typeof value['imageUrl'] === 'string' &&
  typeof value['unitPrice'] === 'number' &&
  typeof value['quantity'] === 'number' &&
  isNullableString(value['variantId']) &&
  isNullableString(value['variantName']);

const readStoredCart = (): CartItem[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
};

const writeStoredCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage can be unavailable (private mode, quota) — the cart still works for this visit.
  }
};

/** Restores the cart after hydration and keeps localStorage in sync. */
export default defineNuxtPlugin((nuxtApp): void => {
  const { items } = useCart();

  nuxtApp.hook('app:mounted', (): void => {
    items.value = readStoredCart();
    watch(items, (value: CartItem[]): void => writeStoredCart(value), { deep: true });
  });
});
