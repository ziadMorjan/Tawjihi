import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { PENDING_TEACHERS_KEY } from './useAdminActions';

export function usePendingTeachers() {
  const { data, isLoading } = useQuery({
    queryKey: PENDING_TEACHERS_KEY,
    queryFn: adminApi.getPendingTeachers,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
  return { pendingTeachers: data ?? [], isLoading };
}
