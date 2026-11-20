import type { CategoryService } from '@/services/category.service';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { SlugParams } from '@/validators/common.validator';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  public readonly list = asyncHandler(async (_req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.categoryService.list()));
  });

  public readonly getBySlug = asyncHandler<SlugParams>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.categoryService.getBySlug(req.params.slug)));
  });
}
