import type { ApiAsyncData } from '@/types/api.types';
import type { ContentPage, ContentPageLink, StoreConfig } from '@/types/store.types';

/** Store settings, payment options, highlights and stats — fetched once and shared by key. */
export const useStoreConfig = (): ApiAsyncData<StoreConfig | null> => {
  const api = useApiClient();
  return useAsyncData('store-config', (): Promise<StoreConfig> => api.get<StoreConfig>('/store'), {
    default: (): null => null,
  });
};

export const useContentLinks = (): ApiAsyncData<ContentPageLink[]> => {
  const api = useApiClient();
  return useAsyncData('content-links', (): Promise<ContentPageLink[]> => api.get<ContentPageLink[]>('/pages'), {
    default: (): ContentPageLink[] => [],
  });
};

export const useContentPage = (slug: string): ApiAsyncData<ContentPage | null> => {
  const api = useApiClient();
  return useAsyncData(`page:${slug}`, (): Promise<ContentPage> => api.get<ContentPage>(`/pages/${slug}`), {
    default: (): null => null,
  });
};
