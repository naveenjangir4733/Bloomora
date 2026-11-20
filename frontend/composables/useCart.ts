import type { ComputedRef, Ref } from 'vue';
import type { CartItem, NewCartItem } from '@/types/cart.types';

export const MAX_LINE_QUANTITY = 20;

export interface UseCartReturn {
  items: Ref<CartItem[]>;
  isDrawerOpen: Ref<boolean>;
  subtotal: ComputedRef<number>;
  totalCount: ComputedRef<number>;
  addItem: (item: NewCartItem, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const toKey = (productId: string, variantId: string | null): string => `${productId}:${variantId ?? 'base'}`;
const clampQuantity = (quantity: number): number => Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.round(quantity)));

/** SSR-safe cart state. Persistence to localStorage is handled by `plugins/cart-persistence.client.ts`. */
export const useCart = (): UseCartReturn => {
  const items = useState<CartItem[]>('cart-items', (): CartItem[] => []);
  const isDrawerOpen = useState<boolean>('cart-drawer-open', (): boolean => false);

  const subtotal = computed<number>((): number =>
    items.value.reduce((sum: number, item: CartItem): number => sum + item.unitPrice * item.quantity, 0),
  );
  const totalCount = computed<number>((): number =>
    items.value.reduce((sum: number, item: CartItem): number => sum + item.quantity, 0),
  );

  const findItem = (key: string): CartItem | undefined => items.value.find((item): boolean => item.key === key);

  const addItem = (newItem: NewCartItem, quantity = 1): void => {
    const key = toKey(newItem.productId, newItem.variantId);
    const existing = findItem(key);
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + quantity);
    } else {
      items.value.push({ ...newItem, key, quantity: clampQuantity(quantity) });
    }
    isDrawerOpen.value = true;
  };

  const setQuantity = (key: string, quantity: number): void => {
    const item = findItem(key);
    if (item) {
      item.quantity = clampQuantity(quantity);
    }
  };

  const removeItem = (key: string): void => {
    items.value = items.value.filter((item): boolean => item.key !== key);
  };

  const clearCart = (): void => {
    items.value = [];
  };

  const openDrawer = (): void => {
    isDrawerOpen.value = true;
  };

  const closeDrawer = (): void => {
    isDrawerOpen.value = false;
  };

  return {
    items,
    isDrawerOpen,
    subtotal,
    totalCount,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    openDrawer,
    closeDrawer,
  };
};
