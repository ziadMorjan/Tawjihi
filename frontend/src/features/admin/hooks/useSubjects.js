import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { SUBJECTS_KEY } from './useAdminActions';

export function useSubjects() {
  const { data, isLoading } = useQuery({
    queryKey: SUBJECTS_KEY,
    queryFn: adminApi.getSubjects,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
  return { subjects: data ?? [], isLoading };
}
