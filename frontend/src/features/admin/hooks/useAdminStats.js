import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const ADMIN_STATS_QUERY_KEY = ['admin-stats'];

export function useAdminStats() {
  const { data, isLoading } = useQuery({
    queryKey: ADMIN_STATS_QUERY_KEY,
    queryFn: adminApi.getAdminStats,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    stats: data ?? null,
    isLoading,
  };
}
