import type { SqlExecutor } from '@/db/postgres';
import { SqlConditionBuilder } from '@/db/sql-builder';
import type { PaginatedResult } from '@/types/common.types';
import type {
  ProductBadge,
  ProductDetail,
  ProductFilters,
  ProductSort,
  ProductSummary,
  ProductVariant,
  PurchasableProduct,
} from '@/types/product.types';
import { buildPaginationMeta, toOffset } from '@/utils/pagination.util';

interface ProductSummaryRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  badge: ProductBadge | null;
  image_url: string;
  stock_quantity: number;
  is_featured: boolean;
  category_slug: string;
  category_name: string;
  avg_rating: number | null;
  review_count: number;
  has_variants: boolean;
}

interface ProductDetailRow extends ProductSummaryRow {
  category_id: string;
  description: string;
  gallery_urls: string[];
  materials: string[];
  dimensions: string | null;
  care_instructions: string | null;
  is_customizable: boolean;
}

interface PurchasableRow {
  id: string;
  name: string;
  image_url: string;
  price: number;
  stock_quantity: number;
  variants: ProductVariant[];
}

/** Product detail data owned by this repository; reviews and related items are composed by the service. */
export type ProductDetailRecord = Omit<ProductDetail, 'reviews' | 'related'> & { categoryId: string };

export interface StockDecrement {
  productId: string;
  quantity: number;
}

const FROM_PRODUCTS = `
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN LATERAL (
    SELECT ROUND(AVG(rv.rating)::numeric, 1)::float8 AS avg_rating, COUNT(*)::int AS review_count
    FROM reviews rv
    WHERE rv.product_id = p.id
  ) r ON TRUE`;

const SUMMARY_COLUMNS = `
  p.id, p.slug, p.name, p.short_description,
  p.price::float8 AS price, p.compare_at_price::float8 AS compare_at_price,
  p.badge, p.image_url, p.stock_quantity, p.is_featured,
  c.slug AS category_slug, c.name AS category_name,
  r.avg_rating, COALESCE(r.review_count, 0)::int AS review_count,
  EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id) AS has_variants`;

const DETAIL_COLUMNS = `${SUMMARY_COLUMNS},
  p.category_id, p.description, p.gallery_urls, p.materials,
  p.dimensions, p.care_instructions, p.is_customizable`;

/** Exhaustive by construction: adding a ProductSort without an ORDER BY fails to compile. */
const ORDER_BY: Record<ProductSort, string> = {
  featured: 'p.is_featured DESC, review_count DESC, p.created_at DESC',
  newest: 'p.created_at DESC',
  'price-asc': 'p.price ASC',
  'price-desc': 'p.price DESC',
  rating: 'r.avg_rating DESC NULLS LAST, review_count DESC',
};

const toSummary = (row: ProductSummaryRow): ProductSummary => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  shortDescription: row.short_description,
  price: row.price,
  compareAtPrice: row.compare_at_price,
  badge: row.badge,
  imageUrl: row.image_url,
  category: { slug: row.category_slug, name: row.category_name },
  rating: row.avg_rating,
  reviewCount: row.review_count,
  inStock: row.stock_quantity > 0,
  isFeatured: row.is_featured,
  hasVariants: row.has_variants,
});

const buildFilterConditions = (filters: ProductFilters): SqlConditionBuilder =>
  new SqlConditionBuilder()
    .add(filters.search ? `%${filters.search}%` : undefined, (ph): string =>
      `(p.name ILIKE ${ph} OR p.short_description ILIKE ${ph} OR c.name ILIKE ${ph})`,
    )
    .add(filters.categorySlug, (ph): string => `c.slug = ${ph}`)
    .add(filters.featured, (ph): string => `p.is_featured = ${ph}`)
    .add(filters.badge, (ph): string => `p.badge = ${ph}`)
    .add(filters.minPrice, (ph): string => `p.price >= ${ph}`)
    .add(filters.maxPrice, (ph): string => `p.price <= ${ph}`)
    .add(filters.inStock === undefined ? undefined : 0, (ph): string =>
      filters.inStock ? `p.stock_quantity > ${ph}` : `p.stock_quantity = ${ph}`,
    );

export class ProductRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async findMany(filters: ProductFilters): Promise<PaginatedResult<ProductSummary>> {
    const conditions = buildFilterConditions(filters);
    const where = conditions.toWhere();

    const countResult = await this.db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM products p JOIN categories c ON c.id = p.category_id ${where}`,
      conditions.getValues(),
    );

    const limit = conditions.bind(filters.limit);
    const offset = conditions.bind(toOffset(filters));
    const dataResult = await this.db.query<ProductSummaryRow>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PRODUCTS} ${where}
       ORDER BY ${ORDER_BY[filters.sort]}, p.id
       LIMIT ${limit} OFFSET ${offset}`,
      conditions.getValues(),
    );

    return {
      items: dataResult.rows.map(toSummary),
      meta: buildPaginationMeta(countResult.rows[0]?.total ?? 0, filters),
    };
  }

  public async findBySlug(slug: string): Promise<ProductDetailRecord | null> {
    const result = await this.db.query<ProductDetailRow>(`SELECT ${DETAIL_COLUMNS} ${FROM_PRODUCTS} WHERE p.slug = $1`, [
      slug,
    ]);
    const row = result.rows[0];
    if (!row) {
      return null;
    }
    return {
      ...toSummary(row),
      categoryId: row.category_id,
      description: row.description,
      galleryUrls: row.gallery_urls,
      materials: row.materials,
      dimensions: row.dimensions,
      careInstructions: row.care_instructions,
      stockQuantity: row.stock_quantity,
      isCustomizable: row.is_customizable,
      variants: await this.findVariants(row.id),
    };
  }

  public async findRelated(categoryId: string, excludeProductId: string, limit: number): Promise<ProductSummary[]> {
    const result = await this.db.query<ProductSummaryRow>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PRODUCTS}
       WHERE p.category_id = $1 AND p.id <> $2
       ORDER BY ${ORDER_BY.featured}
       LIMIT $3`,
      [categoryId, excludeProductId, limit],
    );
    return result.rows.map(toSummary);
  }

  public async findVariants(productId: string): Promise<ProductVariant[]> {
    const result = await this.db.query<ProductVariant>(
      `SELECT id, name, price::float8 AS price
       FROM product_variants
       WHERE product_id = $1
       ORDER BY sort_order, price`,
      [productId],
    );
    return result.rows;
  }

  public async findPurchasable(productIds: readonly string[], executor: SqlExecutor = this.db): Promise<PurchasableProduct[]> {
    const result = await executor.query<PurchasableRow>(
      `SELECT p.id, p.name, p.image_url, p.price::float8 AS price, p.stock_quantity,
              COALESCE(
                json_agg(json_build_object('id', v.id, 'name', v.name, 'price', v.price::float8) ORDER BY v.sort_order)
                  FILTER (WHERE v.id IS NOT NULL),
                '[]'
              ) AS variants
       FROM products p
       LEFT JOIN product_variants v ON v.product_id = p.id
       WHERE p.id = ANY($1::uuid[])
       GROUP BY p.id`,
      [productIds],
    );
    return result.rows.map(
      (row): PurchasableProduct => ({
        id: row.id,
        name: row.name,
        imageUrl: row.image_url,
        price: row.price,
        stockQuantity: row.stock_quantity,
        variants: row.variants,
      }),
    );
  }

  /**
   * Atomically decrements stock for every line. Rows with insufficient stock are skipped,
   * so the caller compares the returned ids against the request and rolls back on mismatch.
   */
  public async decrementStock(decrements: readonly StockDecrement[], executor: SqlExecutor = this.db): Promise<string[]> {
    const result = await executor.query<{ id: string }>(
      `UPDATE products p
       SET stock_quantity = p.stock_quantity - d.quantity
       FROM unnest($1::uuid[], $2::int[]) AS d(id, quantity)
       WHERE p.id = d.id AND p.stock_quantity >= d.quantity
       RETURNING p.id`,
      [decrements.map((item): string => item.productId), decrements.map((item): number => item.quantity)],
    );
    return result.rows.map((row): string => row.id);
  }
}
