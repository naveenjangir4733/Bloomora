import type { SqlExecutor } from '@/db/postgres';
import type { Category } from '@/types/category.types';

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  product_count: number;
}

const SELECT_CATEGORIES = `
  SELECT c.id, c.slug, c.name, c.tagline, c.description, c.image_url,
         COUNT(p.id)::int AS product_count
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id`;

const toCategory = (row: CategoryRow): Category => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  tagline: row.tagline,
  description: row.description,
  imageUrl: row.image_url,
  productCount: row.product_count,
});

export class CategoryRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async findAll(): Promise<Category[]> {
    const result = await this.db.query<CategoryRow>(
      `${SELECT_CATEGORIES} GROUP BY c.id ORDER BY c.sort_order, c.name`,
    );
    return result.rows.map(toCategory);
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const result = await this.db.query<CategoryRow>(`${SELECT_CATEGORIES} WHERE c.slug = $1 GROUP BY c.id`, [slug]);
    const row = result.rows[0];
    return row ? toCategory(row) : null;
  }

  public async findIdBySlug(slug: string): Promise<string | null> {
    const result = await this.db.query<{ id: string }>('SELECT id FROM categories WHERE slug = $1', [slug]);
    return result.rows[0]?.id ?? null;
  }
}
