import { config } from '@/config/env.config';
import { db, type SqlExecutor } from '@/db/postgres';
import { runAsScript } from '@/db/script-runner';
import { categoriesData } from '@/db/seeds/data/categories.data';
import { contentPagesData } from '@/db/seeds/data/pages.data';
import { productsData } from '@/db/seeds/data/products.data';
import { reviewsData } from '@/db/seeds/data/reviews.data';
import {
  highlightsData,
  paymentOptionsData,
  storeSettingsData,
  usersData,
} from '@/db/seeds/data/store.data';

/**
 * Every table is filled with ONE set-based INSERT that reads a JSON array through
 * `jsonb_to_recordset`. Values are bound as a parameter, never interpolated into SQL.
 */
const insertJson = async (tx: SqlExecutor, sql: string, rows: readonly object[]): Promise<number> => {
  const result = await tx.query(sql, [JSON.stringify(rows)]);
  return result.rowCount ?? 0;
};

const seedCategories = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO categories (slug, name, tagline, description, image_url, sort_order)
     SELECT slug, name, tagline, description, "imageUrl", "sortOrder"
     FROM jsonb_to_recordset($1::jsonb) AS t(
       slug text, name text, tagline text, description text, "imageUrl" text, "sortOrder" int
     )`,
    categoriesData.map((category, index) => ({ ...category, sortOrder: index })),
  );

const seedProducts = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO products (slug, name, category_id, short_description, description, price, compare_at_price,
                           badge, image_url, gallery_urls, materials, dimensions, stock_quantity,
                           is_featured, is_customizable, care_instructions, created_at)
     SELECT t.slug, t.name, c.id, t."shortDescription", t.description, t.price, t."compareAtPrice",
            t.badge, t."imageUrl", COALESCE(t."galleryUrls", '{}'), t.materials, t.dimensions, t."stockQuantity",
            COALESCE(t."isFeatured", FALSE), COALESCE(t."isCustomizable", FALSE),
            'Keep away from water and direct sunlight. Dust gently with a soft, dry brush.',
            NOW() - make_interval(days => t."ageDays")
     FROM jsonb_to_recordset($1::jsonb) AS t(
       slug text, name text, "categorySlug" text, "shortDescription" text, description text,
       price numeric, "compareAtPrice" numeric, badge product_badge, "imageUrl" text, "galleryUrls" text[],
       materials text[], dimensions text, "stockQuantity" int, "isFeatured" boolean, "isCustomizable" boolean,
       "ageDays" int
     )
     JOIN categories c ON c.slug = t."categorySlug"`,
    // Spread creation dates so the "Newest" sort is meaningful.
    productsData.map(({ variants: _variants, ...product }, index) => ({ ...product, ageDays: index * 3 })),
  );

const seedVariants = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO product_variants (product_id, name, price, sort_order)
     SELECT p.id, t.name, t.price, t."sortOrder"
     FROM jsonb_to_recordset($1::jsonb) AS t("productSlug" text, name text, price numeric, "sortOrder" int)
     JOIN products p ON p.slug = t."productSlug"`,
    productsData.flatMap((product) =>
      (product.variants ?? []).map((variant, index) => ({ ...variant, productSlug: product.slug, sortOrder: index })),
    ),
  );

const seedReviews = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO reviews (product_id, author_name, city, rating, comment, is_featured, created_at)
     SELECT p.id, t."authorName", t.city, t.rating, t.comment, COALESCE(t."isFeatured", FALSE),
            NOW() - make_interval(days => t."daysAgo")
     FROM jsonb_to_recordset($1::jsonb) AS t(
       "productSlug" text, "authorName" text, city text, rating smallint, comment text,
       "isFeatured" boolean, "daysAgo" int
     )
     LEFT JOIN products p ON p.slug = t."productSlug"`,
    reviewsData,
  );

const seedStoreSettings = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO store_settings (store_name, tagline, description, hero_title, hero_subtitle, hero_image_url,
                                 announcements, currency_code, shipping_fee, free_shipping_threshold,
                                 contact_email, contact_phone, whatsapp_number,
                                 instagram_url, facebook_url, tiktok_url, youtube_url)
     SELECT "storeName", tagline, description, "heroTitle", "heroSubtitle", "heroImageUrl",
            announcements, "currencyCode", "shippingFee", "freeShippingThreshold",
            "contactEmail", "contactPhone", "whatsappNumber",
            "instagramUrl", "facebookUrl", "tiktokUrl", "youtubeUrl"
     FROM jsonb_to_recordset($1::jsonb) AS t(
       "storeName" text, tagline text, description text, "heroTitle" text, "heroSubtitle" text,
       "heroImageUrl" text, announcements text[], "currencyCode" text, "shippingFee" numeric,
       "freeShippingThreshold" numeric, "contactEmail" text, "contactPhone" text, "whatsappNumber" text,
       "instagramUrl" text, "facebookUrl" text, "tiktokUrl" text, "youtubeUrl" text
     )`,
    [storeSettingsData],
  );

const seedPaymentOptions = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO payment_options (method, label, account_title, account_number, instructions, sort_order)
     SELECT method, label, "accountTitle", "accountNumber", instructions, "sortOrder"
     FROM jsonb_to_recordset($1::jsonb) AS t(
       method payment_method, label text, "accountTitle" text, "accountNumber" text, instructions text, "sortOrder" int
     )`,
    paymentOptionsData.map((option, index) => ({ ...option, sortOrder: index })),
  );

const seedHighlights = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO store_highlights (icon, title, description, sort_order)
     SELECT icon, title, description, "sortOrder"
     FROM jsonb_to_recordset($1::jsonb) AS t(icon text, title text, description text, "sortOrder" int)`,
    highlightsData.map((highlight, index) => ({ ...highlight, sortOrder: index })),
  );

const seedContentPages = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO content_pages (slug, title, summary, sections)
     SELECT slug, title, summary, sections
     FROM jsonb_to_recordset($1::jsonb) AS t(slug text, title text, summary text, sections jsonb)`,
    contentPagesData,
  );

const seedUsers = (tx: SqlExecutor): Promise<number> =>
  insertJson(
    tx,
    `INSERT INTO users (name, email, role)
     SELECT name, email, role
     FROM jsonb_to_recordset($1::jsonb) AS t(name text, email text, role user_role)`,
    usersData,
  );

/** Ordered so that referenced rows exist before the rows that point at them. */
const SEEDERS: ReadonlyArray<[label: string, seed: (tx: SqlExecutor) => Promise<number>]> = [
  ['categories', seedCategories],
  ['products', seedProducts],
  ['product variants', seedVariants],
  ['reviews', seedReviews],
  ['store settings', seedStoreSettings],
  ['payment options', seedPaymentOptions],
  ['store highlights', seedHighlights],
  ['content pages', seedContentPages],
  ['users', seedUsers],
];

const SEEDED_TABLES = [
  'order_items',
  'orders',
  'custom_order_requests',
  'contact_messages',
  'reviews',
  'product_variants',
  'products',
  'categories',
  'store_settings',
  'payment_options',
  'store_highlights',
  'content_pages',
  'users',
].join(', ');

/** Wipes demo tables and re-inserts the demo dataset inside a single transaction. */
export const seedDatabase = async (): Promise<void> => {
  if (config.isProduction) {
    throw new Error('Refusing to seed demo data in production.');
  }

  await db.transaction(async (tx): Promise<void> => {
    await tx.query(`TRUNCATE ${SEEDED_TABLES} RESTART IDENTITY CASCADE`);
    await SEEDERS.reduce(
      (previous: Promise<void>, [label, seed]): Promise<void> =>
        previous.then(async (): Promise<void> => {
          const count = await seed(tx);
          console.info(`🌱 [Seed]: ${String(count).padStart(3)} ${label}`);
        }),
      Promise.resolve(),
    );
  });

  console.info('✨ [Seed]: Demo data loaded.');
};

if (require.main === module) {
  runAsScript(seedDatabase);
}
