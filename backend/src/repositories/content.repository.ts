import type { SqlExecutor } from '@/db/postgres';
import type { ContentPage, ContentPageLink, ContentSection } from '@/types/content.types';

interface ContentPageRow {
  slug: string;
  title: string;
  summary: string;
  sections: ContentSection[];
  updated_at: Date;
}

export class ContentRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async findBySlug(slug: string): Promise<ContentPage | null> {
    const result = await this.db.query<ContentPageRow>(
      'SELECT slug, title, summary, sections, updated_at FROM content_pages WHERE slug = $1',
      [slug],
    );
    const row = result.rows[0];
    if (!row) {
      return null;
    }
    return {
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      sections: row.sections,
      updatedAt: row.updated_at.toISOString(),
    };
  }

  public async findLinks(): Promise<ContentPageLink[]> {
    const result = await this.db.query<ContentPageLink>('SELECT slug, title FROM content_pages ORDER BY title');
    return result.rows;
  }
}
