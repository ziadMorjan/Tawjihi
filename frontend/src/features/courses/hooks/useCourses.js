// src/features/courses/hooks/useCourses.js
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';

export const COURSES_QUERY_KEY = ['courses'];

export default function useCourses(params = {}) {
  return useQuery({
    queryKey: [...COURSES_QUERY_KEY, params],
    queryFn: () => coursesApi.getAll(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}