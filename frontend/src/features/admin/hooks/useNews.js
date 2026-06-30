import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { NEWS_KEY } from './useAdminActions';

export function useNews() {
  const { data, isLoading } = useQuery({
    queryKey: NEWS_KEY,
    queryFn: adminApi.getNews,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { news: data ?? [], isLoading };
}
