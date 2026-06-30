import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '../api/teacherApi';

export const TEACHER_STATS_QUERY_KEY = ['teacher-stats'];

export function useTeacherStats() {
  const { data, isLoading } = useQuery({
    queryKey: TEACHER_STATS_QUERY_KEY,
    queryFn: teacherApi.getTeacherStats,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    stats: data ?? null,
    isLoading,
  };
}
