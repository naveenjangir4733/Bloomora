import type { CategoryRepository } from '@/repositories/category.repository';
import type { Category } from '@/types/category.types';
import { AppError } from '@/utils/app-error.util';

export class CategoryService {
  constructor(private readonly categories: CategoryRepository) {}

  public list(): Promise<Category[]> {
    return this.categories.findAll();
  }

  public async getBySlug(slug: string): Promise<Category> {
    const category = await this.categories.findBySlug(slug);
    if (!category) {
      throw AppError.notFound(`Category '${slug}' not found`);
    }
    return category;
  }
}
