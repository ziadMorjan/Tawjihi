import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { BRANCHES_KEY } from './useAdminActions';

export function useBranches() {
  const { data, isLoading } = useQuery({
    queryKey: BRANCHES_KEY,
    queryFn: adminApi.getBranches,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
  return { branches: data ?? [], isLoading };
}
