export const INQUIRY_STATUSES = ['new', 'in_review', 'quoted', 'closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface NewCustomOrderRequest {
  name: string;
  phone: string;
  email: string | null;
  categorySlug: string | null;
  budget: number | null;
  neededBy: string | null;
  description: string;
}

export interface NewContactMessage {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

/** Minimal acknowledgement returned after an inquiry is stored. */
export interface InquiryReceipt {
  id: string;
  createdAt: string;
}
