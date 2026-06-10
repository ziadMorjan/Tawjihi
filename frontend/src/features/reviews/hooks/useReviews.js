import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviewsApi';

export const REVIEWS_QUERY_KEY = ['reviews', 'course'];

export function useReviews(courseId) {
  return useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, courseId],
    queryFn: () => reviewsApi.getByCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.docs ?? [],
  });
}