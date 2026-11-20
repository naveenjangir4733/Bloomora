import type { ReviewRepository } from '@/repositories/review.repository';
import type { Review } from '@/types/review.types';
import type { ReviewQueryDto } from '@/validators/review.validator';

export class ReviewService {
  constructor(private readonly reviews: ReviewRepository) {}

  public list(query: ReviewQueryDto): Promise<Review[]> {
    return this.reviews.findMany({ featuredOnly: query.featured, limit: query.limit });
  }
}
