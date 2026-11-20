import { HttpStatus } from '@/constants/http-status.constant';
import type { InquiryService } from '@/services/inquiry.service';
import type { NoParams } from '@/types/http.types';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { ContactMessageDto, CustomOrderDto } from '@/validators/inquiry.validator';

export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  public readonly createCustomOrder = asyncHandler<NoParams, CustomOrderDto>(async (req, res): Promise<void> => {
    const receipt = await this.inquiryService.submitCustomOrder(req.body);
    res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(receipt, 'Thank you! We will contact you within 24 hours with a quote.'));
  });

  public readonly createContactMessage = asyncHandler<NoParams, ContactMessageDto>(
    async (req, res): Promise<void> => {
      const receipt = await this.inquiryService.submitContactMessage(req.body);
      res.status(HttpStatus.CREATED).json(ApiResponse.success(receipt, 'Message received — we usually reply within a day.'));
    },
  );
}
