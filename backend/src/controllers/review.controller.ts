import type { ReviewService } from '@/services/review.service';
import type { NoParams } from '@/types/http.types';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { ReviewQueryDto } from '@/validators/review.validator';

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  public readonly list = asyncHandler<NoParams, unknown, ReviewQueryDto>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.reviewService.list(req.query)));
  });
}
