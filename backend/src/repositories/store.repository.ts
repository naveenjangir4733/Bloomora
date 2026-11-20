import type { SqlExecutor } from '@/db/postgres';
import type { PaymentMethod } from '@/types/order.types';
import type { PaymentOption, StoreHighlight, StoreSettings, StoreStats } from '@/types/store.types';

interface StoreSettingsRow {
  store_name: string;
  tagline: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  announcements: string[];
  currency_code: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
}

interface PaymentOptionRow {
  method: PaymentMethod;
  label: string;
  account_title: string;
  account_number: string;
  instructions: string;
}

interface StoreStatsRow {
  product_count: number;
  category_count: number;
  review_count: number;
  average_rating: number | null;
  orders_delivered: number;
}

const SELECT_PAYMENT_OPTIONS = `
  SELECT method, label, account_title, account_number, instructions
  FROM payment_options`;

const toPaymentOption = (row: PaymentOptionRow): PaymentOption => ({
  method: row.method,
  label: row.label,
  accountTitle: row.account_title,
  accountNumber: row.account_number,
  instructions: row.instructions,
});

export class StoreRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async getSettings(executor: SqlExecutor = this.db): Promise<StoreSettings | null> {
    const result = await executor.query<StoreSettingsRow>(
      `SELECT store_name, tagline, description, hero_title, hero_subtitle, hero_image_url, announcements,
              currency_code, shipping_fee::float8 AS shipping_fee,
              free_shipping_threshold::float8 AS free_shipping_threshold,
              contact_email, contact_phone, whatsapp_number,
              instagram_url, facebook_url, tiktok_url, youtube_url
       FROM store_settings
       WHERE id = 1`,
    );
    const row = result.rows[0];
    if (!row) {
      return null;
    }
    return {
      storeName: row.store_name,
      tagline: row.tagline,
      description: row.description,
      heroTitle: row.hero_title,
      heroSubtitle: row.hero_subtitle,
      heroImageUrl: row.hero_image_url,
      announcements: row.announcements,
      currencyCode: row.currency_code,
      shippingFee: row.shipping_fee,
      freeShippingThreshold: row.free_shipping_threshold,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      whatsappNumber: row.whatsapp_number,
      social: {
        instagram: row.instagram_url,
        facebook: row.facebook_url,
        tiktok: row.tiktok_url,
        youtube: row.youtube_url,
      },
    };
  }

  public async getPaymentOptions(): Promise<PaymentOption[]> {
    const result = await this.db.query<PaymentOptionRow>(`${SELECT_PAYMENT_OPTIONS} ORDER BY sort_order`);
    return result.rows.map(toPaymentOption);
  }

  public async getPaymentOption(method: PaymentMethod): Promise<PaymentOption | null> {
    const result = await this.db.query<PaymentOptionRow>(`${SELECT_PAYMENT_OPTIONS} WHERE method = $1`, [method]);
    const row = result.rows[0];
    return row ? toPaymentOption(row) : null;
  }

  public async getHighlights(): Promise<StoreHighlight[]> {
    const result = await this.db.query<StoreHighlight>(
      'SELECT id, icon, title, description FROM store_highlights ORDER BY sort_order',
    );
    return result.rows;
  }

  public async getStats(): Promise<StoreStats> {
    const result = await this.db.query<StoreStatsRow>(
      `SELECT (SELECT COUNT(*)::int FROM products)                       AS product_count,
              (SELECT COUNT(*)::int FROM categories)                     AS category_count,
              (SELECT COUNT(*)::int FROM reviews)                        AS review_count,
              (SELECT ROUND(AVG(rating)::numeric, 1)::float8 FROM reviews) AS average_rating,
              (SELECT COUNT(*)::int FROM orders WHERE status = 'delivered') AS orders_delivered`,
    );
    const row = result.rows[0];
    return {
      productCount: row?.product_count ?? 0,
      categoryCount: row?.category_count ?? 0,
      reviewCount: row?.review_count ?? 0,
      averageRating: row?.average_rating ?? null,
      ordersDelivered: row?.orders_delivered ?? 0,
    };
  }
}
