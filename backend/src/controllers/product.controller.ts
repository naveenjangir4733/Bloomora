import type { ProductService } from '@/services/product.service';
import type { NoParams } from '@/types/http.types';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { SlugParams } from '@/validators/common.validator';
import type { ProductQueryDto } from '@/validators/product.validator';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  public readonly list = asyncHandler<NoParams, unknown, ProductQueryDto>(async (req, res): Promise<void> => {
    res.json(ApiResponse.paginated(await this.productService.list(req.query)));
  });

  public readonly getBySlug = asyncHandler<SlugParams>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.productService.getBySlug(req.params.slug)));
  });
}
