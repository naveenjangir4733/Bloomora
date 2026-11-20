import type { ContentService } from '@/services/content.service';
import type { StoreService } from '@/services/store.service';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { SlugParams } from '@/validators/common.validator';

export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly contentService: ContentService,
  ) {}

  public readonly getConfig = asyncHandler(async (_req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.storeService.getConfig()));
  });

  public readonly listPages = asyncHandler(async (_req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.contentService.listLinks()));
  });

  public readonly getPage = asyncHandler<SlugParams>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.contentService.getPage(req.params.slug)));
  });
}
