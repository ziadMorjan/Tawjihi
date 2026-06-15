import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';

// src/features/courses/hooks/useCourse.js
export function useCourse(id) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => {
      // جرب كل الاحتمالات
      const course = data?.data?.doc
        ?? data?.data?.course
        ?? data?.data
        ?? data?.course
        ?? data;
      return course;
      
    },
  });
}