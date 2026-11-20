import type { CategoryRepository } from '@/repositories/category.repository';
import type { InquiryRepository } from '@/repositories/inquiry.repository';
import type { InquiryReceipt } from '@/types/inquiry.types';
import { AppError } from '@/utils/app-error.util';
import type { ContactMessageDto, CustomOrderDto } from '@/validators/inquiry.validator';

export class InquiryService {
  constructor(
    private readonly inquiries: InquiryRepository,
    private readonly categories: CategoryRepository,
  ) {}

  public async submitCustomOrder(dto: CustomOrderDto): Promise<InquiryReceipt> {
    const { categorySlug, ...request } = dto;
    const categoryId = categorySlug ? await this.categories.findIdBySlug(categorySlug) : null;
    if (categorySlug && !categoryId) {
      throw AppError.badRequest(`Unknown category '${categorySlug}'`);
    }
    return this.inquiries.createCustomOrderRequest({ ...request, categoryId });
  }

  public submitContactMessage(dto: ContactMessageDto): Promise<InquiryReceipt> {
    return this.inquiries.createContactMessage(dto);
  }
}
