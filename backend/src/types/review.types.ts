export interface Review {
  id: string;
  authorName: string;
  city: string;
  rating: number;
  comment: string;
  productName: string | null;
  productSlug: string | null;
  createdAt: string;
}

export interface ReviewFilters {
  productId?: string;
  featuredOnly?: boolean;
  limit: number;
}
