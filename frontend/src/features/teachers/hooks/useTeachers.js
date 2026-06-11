import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachersApi';

export const TEACHERS_QUERY_KEY = ['teachers'];

export function useTeachers(params = {}) {
  return useQuery({
    queryKey: [...TEACHERS_QUERY_KEY, params],
    queryFn: () => teachersApi.getAll(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => ({
      teachers:   data?.data?.docs ?? [],
      pagination: data?.pagination ?? null,
    }),
  });
}