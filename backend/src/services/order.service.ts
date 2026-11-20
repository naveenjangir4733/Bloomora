import type { Database } from '@/db/postgres';
import type { OrderRepository } from '@/repositories/order.repository';
import type { ProductRepository, StockDecrement } from '@/repositories/product.repository';
import type { StoreRepository } from '@/repositories/store.repository';
import type { NewOrderItem, OrderConfirmation } from '@/types/order.types';
import type { ProductVariant, PurchasableProduct } from '@/types/product.types';
import { AppError } from '@/utils/app-error.util';
import type { CreateOrderDto, CreateOrderItemDto } from '@/validators/order.validator';

const roundMoney = (amount: number): number => Math.round(amount * 100) / 100;

const lineKey = (item: CreateOrderItemDto): string => `${item.productId}:${item.variantId ?? ''}`;

/** Collapses duplicate cart lines (same product + variant) into one line. */
const mergeDuplicateLines = (items: readonly CreateOrderItemDto[]): CreateOrderItemDto[] => {
  const merged = new Map<string, CreateOrderItemDto>();
  items.forEach((item): void => {
    const existing = merged.get(lineKey(item));
    merged.set(lineKey(item), existing ? { ...existing, quantity: existing.quantity + item.quantity } : { ...item });
  });
  return [...merged.values()];
};

const resolveVariant = (product: PurchasableProduct, variantId: string | null): ProductVariant | null => {
  if (product.variants.length === 0) {
    return null;
  }
  const variant = product.variants.find((candidate): boolean => candidate.id === variantId);
  if (!variant) {
    throw AppError.unprocessable(`Please choose a valid size for "${product.name}"`);
  }
  return variant;
};

const priceLine = (item: CreateOrderItemDto, product: PurchasableProduct): NewOrderItem => {
  const variant = resolveVariant(product, item.variantId);
  const unitPrice = variant?.price ?? product.price;
  return {
    productId: product.id,
    variantId: variant?.id ?? null,
    productName: product.name,
    variantName: variant?.name ?? null,
    imageUrl: product.imageUrl,
    unitPrice,
    quantity: item.quantity,
    lineTotal: roundMoney(unitPrice * item.quantity),
  };
};

/** Sums quantities per product — variants share the parent product's stock. */
const toStockDecrements = (items: readonly NewOrderItem[]): StockDecrement[] => {
  const totals = new Map<string, number>();
  items.forEach((item): void => {
    totals.set(item.productId, (totals.get(item.productId) ?? 0) + item.quantity);
  });
  return [...totals.entries()].map(([productId, quantity]): StockDecrement => ({ productId, quantity }));
};

const assertStockAvailable = (decrements: readonly StockDecrement[], products: ReadonlyMap<string, PurchasableProduct>): void => {
  decrements.forEach(({ productId, quantity }): void => {
    const product = products.get(productId);
    if (product && product.stockQuantity < quantity) {
      const message =
        product.stockQuantity === 0
          ? `"${product.name}" is sold out`
          : `Only ${product.stockQuantity} of "${product.name}" left in stock`;
      throw AppError.unprocessable(message);
    }
  });
};

export class OrderService {
  constructor(
    private readonly database: Database,
    private readonly orders: OrderRepository,
    private readonly products: ProductRepository,
    private readonly store: StoreRepository,
  ) {}

  public async placeOrder(dto: CreateOrderDto): Promise<OrderConfirmation> {
    const lines = mergeDuplicateLines(dto.items);
    const items = await this.priceLines(lines);
    const settings = await this.store.getSettings();
    if (!settings) {
      throw AppError.unavailable('Store settings are missing');
    }

    const subtotal = roundMoney(items.reduce((sum: number, item: NewOrderItem): number => sum + item.lineTotal, 0));
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    const decrements = toStockDecrements(items);

    const orderNumber = await this.database.transaction(async (tx): Promise<string> => {
      const updated = await this.products.decrementStock(decrements, tx);
      if (updated.length !== decrements.length) {
        throw AppError.conflict('Stock changed while you were checking out. Please review your cart.');
      }
      return this.orders.create(
        {
          customer: dto.customer,
          paymentMethod: dto.paymentMethod,
          items,
          subtotal,
          shippingFee,
          total: roundMoney(subtotal + shippingFee),
        },
        tx,
      );
    });

    return this.getConfirmation(orderNumber);
  }

  /** Customers look up their order with the order number plus the phone used at checkout. */
  public async trackOrder(orderNumber: string, phone: string): Promise<OrderConfirmation> {
    const confirmation = await this.getConfirmation(orderNumber);
    if (confirmation.order.customer.phone !== phone) {
      throw AppError.notFound(`Order '${orderNumber}' not found`);
    }
    return confirmation;
  }

  private async priceLines(lines: readonly CreateOrderItemDto[]): Promise<NewOrderItem[]> {
    const productIds = [...new Set(lines.map((line): string => line.productId))];
    const found = await this.products.findPurchasable(productIds);
    const productsById = new Map(found.map((product): [string, PurchasableProduct] => [product.id, product]));

    const items = lines.map((line): NewOrderItem => {
      const product = productsById.get(line.productId);
      if (!product) {
        throw AppError.unprocessable('One of the products in your cart is no longer available');
      }
      return priceLine(line, product);
    });

    assertStockAvailable(toStockDecrements(items), productsById);
    return items;
  }

  private async getConfirmation(orderNumber: string): Promise<OrderConfirmation> {
    const order = await this.orders.findByNumber(orderNumber);
    if (!order) {
      throw AppError.notFound(`Order '${orderNumber}' not found`);
    }
    const paymentOption = await this.store.getPaymentOption(order.paymentMethod);
    return { order, paymentOption };
  }
}
