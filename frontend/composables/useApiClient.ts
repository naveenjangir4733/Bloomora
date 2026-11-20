import type {
  ApiSuccessResponse,
  MutationResult,
  PaginatedData,
  QueryParams,
} from '@/types/api.types';
import { toApiRequestError } from '@/utils/api-error';

type CleanQuery = Record<string, string | number | boolean>;

export interface ApiClient {
  get: <T>(path: string, query?: QueryParams) => Promise<T>;
  getPage: <T>(path: string, query?: QueryParams) => Promise<PaginatedData<T>>;
  post: <T>(path: string, body: object) => Promise<MutationResult<T>>;
}

const EMPTY_META = { total: 0, page: 1, limit: 0, totalPages: 1, hasNext: false, hasPrev: false } as const;

/** Drops undefined/empty values so they never appear in the URL. */
const cleanQuery = (query: QueryParams): CleanQuery =>
  Object.entries(query).reduce<CleanQuery>((clean, [key, value]): CleanQuery => {
    if (value !== undefined && value !== '') {
      clean[key] = value;
    }
    return clean;
  }, {});

/**
 * Thin typed wrapper over `$fetch` that unwraps the standard API envelope and
 * converts every failure into an `ApiRequestError`.
 */
export const useApiClient = (): ApiClient => {
  const baseURL = useRuntimeConfig().public.apiBaseUrl;

  const request = async <T>(
    path: string,
    options: { method?: 'GET' | 'POST'; query?: QueryParams; body?: object },
  ): Promise<ApiSuccessResponse<T>> => {
    try {
      return await $fetch<ApiSuccessResponse<T>>(path, {
        baseURL,
        method: options.method ?? 'GET',
        query: options.query ? cleanQuery(options.query) : undefined,
        body: options.body,
      });
    } catch (error) {
      throw toApiRequestError(error);
    }
  };

  return {
    get: async <T>(path: string, query?: QueryParams): Promise<T> => (await request<T>(path, { query })).data,

    getPage: async <T>(path: string, query?: QueryParams): Promise<PaginatedData<T>> => {
      const response = await request<T[]>(path, { query });
      return { items: response.data, meta: response.meta ?? { ...EMPTY_META, limit: response.data.length } };
    },

    post: async <T>(path: string, body: object): Promise<MutationResult<T>> => {
      const response = await request<T>(path, { method: 'POST', body });
      return { data: response.data, message: response.message ?? null };
    },
  };
};
