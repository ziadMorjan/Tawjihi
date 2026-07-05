import { useQuery } from '@tanstack/react-query';
import { lessonsApi } from '../api/lessonsApi';

export const LESSONS_QUERY_KEY = ['lessons'];

export function useLessons(courseId) {
  return useQuery({
    queryKey: [...LESSONS_QUERY_KEY, courseId],
    queryFn: () => lessonsApi.getByCourse(courseId),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.docs ?? data?.data ?? data?.lessons ?? [],
  });
}