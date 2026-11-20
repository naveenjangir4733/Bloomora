import type { MaybeRefOrGetter } from 'vue';
import type { ApiAsyncData, PaginatedData } from '@/types/api.types';
import type { Category, ProductDetail, ProductQuery, ProductSummary, Review } from '@/types/catalog.types';

const emptyPage = (): PaginatedData<ProductSummary> => ({
  items: [],
  meta: { total: 0, page: 1, limit: 0, totalPages: 1, hasNext: false, hasPrev: false },
});

export const useCategories = (): ApiAsyncData<Category[]> => {
  const api = useApiClient();
  return useAsyncData('categories', (): Promise<Category[]> => api.get<Category[]>('/categories'), {
    default: (): Category[] => [],
  });
};

export const useCategory = (slug: string): ApiAsyncData<Category | null> => {
  const api = useApiClient();
  return useAsyncData(`category:${slug}`, (): Promise<Category> => api.get<Category>(`/categories/${slug}`), {
    default: (): null => null,
  });
};

/**
 * Paginated product listing. Re-fetches whenever the (reactive) query changes.
 * `key` must be unique per usage so different grids never share a cache entry.
 */
export const useProducts = (
  key: string,
  query: MaybeRefOrGetter<ProductQuery>,
): ApiAsyncData<PaginatedData<ProductSummary>> => {
  const api = useApiClient();
  return useAsyncData(
    key,
    (): Promise<PaginatedData<ProductSummary>> => api.getPage<ProductSummary>('/products', { ...toValue(query) }),
    { default: emptyPage, watch: [(): ProductQuery => toValue(query)] },
  );
};

export const useProduct = (slug: string): ApiAsyncData<ProductDetail | null> => {
  const api = useApiClient();
  return useAsyncData(`product:${slug}`, (): Promise<ProductDetail> => api.get<ProductDetail>(`/products/${slug}`), {
    default: (): null => null,
  });
};

export const useReviews = (key: string, query: { featured?: boolean; limit?: number }): ApiAsyncData<Review[]> => {
  const api = useApiClient();
  return useAsyncData(key, (): Promise<Review[]> => api.get<Review[]>('/reviews', { ...query }), {
    default: (): Review[] => [],
  });
};
