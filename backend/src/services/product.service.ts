import type { ProductRepository } from '@/repositories/product.repository';
import type { ReviewRepository } from '@/repositories/review.repository';
import type { PaginatedResult } from '@/types/common.types';
import type { ProductDetail, ProductSummary } from '@/types/product.types';
import { AppError } from '@/utils/app-error.util';
import type { ProductQueryDto } from '@/validators/product.validator';

const RELATED_PRODUCTS_LIMIT = 4;
const PRODUCT_REVIEWS_LIMIT = 6;

export class ProductService {
  constructor(
    private readonly products: ProductRepository,
    private readonly reviews: ReviewRepository,
  ) {}

  public list(query: ProductQueryDto): Promise<PaginatedResult<ProductSummary>> {
    const { category, ...filters } = query;
    return this.products.findMany({ ...filters, categorySlug: category });
  }

  public async getBySlug(slug: string): Promise<ProductDetail> {
    const record = await this.products.findBySlug(slug);
    if (!record) {
      throw AppError.notFound(`Product '${slug}' not found`);
    }

    const { categoryId, ...product } = record;
    const [reviews, related] = await Promise.all([
      this.reviews.findMany({ productId: product.id, limit: PRODUCT_REVIEWS_LIMIT }),
      this.products.findRelated(categoryId, product.id, RELATED_PRODUCTS_LIMIT),
    ]);

    return { ...product, reviews, related };
  }
}
