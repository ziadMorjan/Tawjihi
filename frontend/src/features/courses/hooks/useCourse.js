import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';

export function useCourse(id) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => {
      // backend يرجع { status, data: { course } } أو { status, data: {...} }
      return data?.data?.course ?? data?.data ?? data;
    },
  });
}