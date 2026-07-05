import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { ALL_COURSES_KEY } from './useAdminActions';

export function useAllCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ALL_COURSES_KEY,
    queryFn: adminApi.getAllCourses,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { courses: data ?? [], isLoading };
}
