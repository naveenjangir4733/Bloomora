import type { SqlExecutor } from '@/db/postgres';
import type { InquiryReceipt, NewContactMessage, NewCustomOrderRequest } from '@/types/inquiry.types';

interface ReceiptRow {
  id: string;
  created_at: Date;
}

const toReceipt = (row: ReceiptRow | undefined): InquiryReceipt => {
  if (!row) {
    throw new Error('Insert returned no row');
  }
  return { id: row.id, createdAt: row.created_at.toISOString() };
};

export class InquiryRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async createCustomOrderRequest(
    request: Omit<NewCustomOrderRequest, 'categorySlug'> & { categoryId: string | null },
  ): Promise<InquiryReceipt> {
    const result = await this.db.query<ReceiptRow>(
      `INSERT INTO custom_order_requests (name, phone, email, category_id, budget, needed_by, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        request.name,
        request.phone,
        request.email,
        request.categoryId,
        request.budget,
        request.neededBy,
        request.description,
      ],
    );
    return toReceipt(result.rows[0]);
  }

  public async createContactMessage(message: NewContactMessage): Promise<InquiryReceipt> {
    const result = await this.db.query<ReceiptRow>(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [message.name, message.email, message.phone, message.subject, message.message],
    );
    return toReceipt(result.rows[0]);
  }
}
