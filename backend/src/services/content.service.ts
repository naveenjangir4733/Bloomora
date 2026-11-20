import type { ContentRepository } from '@/repositories/content.repository';
import type { ContentPage, ContentPageLink } from '@/types/content.types';
import { AppError } from '@/utils/app-error.util';

export class ContentService {
  constructor(private readonly content: ContentRepository) {}

  public listLinks(): Promise<ContentPageLink[]> {
    return this.content.findLinks();
  }

  public async getPage(slug: string): Promise<ContentPage> {
    const page = await this.content.findBySlug(slug);
    if (!page) {
      throw AppError.notFound(`Page '${slug}' not found`);
    }
    return page;
  }
}
