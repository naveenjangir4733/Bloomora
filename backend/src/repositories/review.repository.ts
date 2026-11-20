import type { SqlExecutor } from '@/db/postgres';
import { SqlConditionBuilder } from '@/db/sql-builder';
import type { Review, ReviewFilters } from '@/types/review.types';

interface ReviewRow {
  id: string;
  author_name: string;
  city: string;
  rating: number;
  comment: string;
  product_name: string | null;
  product_slug: string | null;
  created_at: Date;
}

const toReview = (row: ReviewRow): Review => ({
  id: row.id,
  authorName: row.author_name,
  city: row.city,
  rating: row.rating,
  comment: row.comment,
  productName: row.product_name,
  productSlug: row.product_slug,
  createdAt: row.created_at.toISOString(),
});

export class ReviewRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async findMany(filters: ReviewFilters): Promise<Review[]> {
    const conditions = new SqlConditionBuilder()
      .add(filters.productId, (ph): string => `r.product_id = ${ph}`)
      .add(filters.featuredOnly ? true : undefined, (ph): string => `r.is_featured = ${ph}`);
    const limit = conditions.bind(filters.limit);

    const result = await this.db.query<ReviewRow>(
      `SELECT r.id, r.author_name, r.city, r.rating, r.comment, r.created_at,
              p.name AS product_name, p.slug AS product_slug
       FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       ${conditions.toWhere()}
       ORDER BY r.created_at DESC, r.id
       LIMIT ${limit}`,
      conditions.getValues(),
    );
    return result.rows.map(toReview);
  }
}
