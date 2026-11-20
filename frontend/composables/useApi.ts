import type {
  ApiResponse,
  PaginatedResponse,
  HealthCheckData,
  User,
  CreateUserPayload,
} from '@/types';

export interface UseApiReturn {
  getHealth: () => Promise<ApiResponse<HealthCheckData>>;
  getUsers: (page?: number, limit?: number) => Promise<PaginatedResponse<User>>;
  createUser: (payload: CreateUserPayload) => Promise<ApiResponse<User>>;
  deleteUser: (id: string) => Promise<ApiResponse<null>>;
}

export const useApi = (): UseApiReturn => {
  const config = useRuntimeConfig();
  const baseUrl: string = config.public?.apiBaseUrl || 'http://localhost:5000/api/v1';

  const request = async <T>(
    endpoint: string,
    options: Record<string, unknown> = {},
  ): Promise<T> => {
    const rawHeaders = (options['headers'] as Record<string, string> | undefined) || {};
    return await $fetch<T>(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...rawHeaders,
      },
    });
  };

  const getHealth = async (): Promise<ApiResponse<HealthCheckData>> => {
    return await request<ApiResponse<HealthCheckData>>('/health');
  };

  const getUsers = async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<User>> => {
    return await request<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
  };

  const createUser = async (
    payload: CreateUserPayload,
  ): Promise<ApiResponse<User>> => {
    return await request<ApiResponse<User>>('/users', {
      method: 'POST',
      body: payload,
    });
  };

  const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
    return await request<ApiResponse<null>>(`/users/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getHealth,
    getUsers,
    createUser,
    deleteUser,
  };
};
