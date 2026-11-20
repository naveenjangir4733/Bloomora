import type { SqlExecutor } from '@/db/postgres';
import type { NewOrder, Order, OrderItem, OrderStatus, PaymentMethod } from '@/types/order.types';

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  city: string;
  address: string;
  notes: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: Date;
  items: OrderItem[];
}

const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  status: row.status,
  paymentMethod: row.payment_method,
  customer: {
    name: row.customer_name,
    phone: row.customer_phone,
    email: row.customer_email,
    city: row.city,
    address: row.address,
    notes: row.notes,
  },
  items: row.items,
  subtotal: row.subtotal,
  shippingFee: row.shipping_fee,
  total: row.total,
  createdAt: row.created_at.toISOString(),
});

export class OrderRepository {
  constructor(private readonly db: SqlExecutor) {}

  /** Inserts the order and its lines; must run inside the caller's transaction. */
  public async create(order: NewOrder, executor: SqlExecutor): Promise<string> {
    const { customer } = order;
    const inserted = await executor.query<{ order_number: string; id: string }>(
      `INSERT INTO orders (customer_name, customer_phone, customer_email, city, address, notes,
                           payment_method, subtotal, shipping_fee, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, order_number`,
      [
        customer.name,
        customer.phone,
        customer.email,
        customer.city,
        customer.address,
        customer.notes,
        order.paymentMethod,
        order.subtotal,
        order.shippingFee,
        order.total,
      ],
    );
    const created = inserted.rows[0];
    if (!created) {
      throw new Error('Order insert returned no row');
    }

    const items = order.items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.productName,
      variant_name: item.variantName,
      image_url: item.imageUrl,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      line_total: item.lineTotal,
    }));

    await executor.query(
      `INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_name,
                                image_url, unit_price, quantity, line_total)
       SELECT $1, product_id, variant_id, product_name, variant_name, image_url, unit_price, quantity, line_total
       FROM jsonb_to_recordset($2::jsonb) AS t(
         product_id uuid, variant_id uuid, product_name text, variant_name text,
         image_url text, unit_price numeric, quantity int, line_total numeric
       )`,
      [created.id, JSON.stringify(items)],
    );

    return created.order_number;
  }

  public async findByNumber(orderNumber: string, executor: SqlExecutor = this.db): Promise<Order | null> {
    const result = await executor.query<OrderRow>(
      `SELECT o.id, o.order_number, o.status, o.payment_method,
              o.customer_name, o.customer_phone, o.customer_email, o.city, o.address, o.notes,
              o.subtotal::float8 AS subtotal, o.shipping_fee::float8 AS shipping_fee, o.total::float8 AS total,
              o.created_at,
              COALESCE(
                json_agg(json_build_object(
                  'id', i.id, 'productId', i.product_id, 'productName', i.product_name,
                  'variantName', i.variant_name, 'imageUrl', i.image_url,
                  'unitPrice', i.unit_price::float8, 'quantity', i.quantity, 'lineTotal', i.line_total::float8
                ) ORDER BY i.product_name) FILTER (WHERE i.id IS NOT NULL),
                '[]'
              ) AS items
       FROM orders o
       LEFT JOIN order_items i ON i.order_id = o.id
       WHERE o.order_number = $1
       GROUP BY o.id`,
      [orderNumber],
    );
    const row = result.rows[0];
    return row ? toOrder(row) : null;
  }
}
