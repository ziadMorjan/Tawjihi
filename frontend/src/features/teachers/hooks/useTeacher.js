import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachersApi';

export function useTeacher(id) {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: () => teachersApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.doc ?? data?.data ?? data,
  });
}

export function useTeacherCourses(teacherId) {
  return useQuery({
    queryKey: ['teachers', teacherId, 'courses'],
    queryFn: () => teachersApi.getCourses(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.docs ?? [],
  });
}