/** A cart line stores a display snapshot; the server re-prices everything at checkout. */
export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  variantId: string | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
}

export type NewCartItem = Omit<CartItem, 'key' | 'quantity'>;
