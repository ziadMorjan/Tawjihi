import { useQuery } from '@tanstack/react-query';
import { commentsApi } from '../api/commentsApi';

export const COMMENTS_QUERY_KEY = ['comments', 'lesson'];

export function useComments(lessonId) {
  return useQuery({
    queryKey: [...COMMENTS_QUERY_KEY, lessonId],
    queryFn: () => commentsApi.getByLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.docs ?? [],
  });
}