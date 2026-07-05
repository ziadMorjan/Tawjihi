import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { reviewsApi } from '../api/reviewsApi';
import { REVIEWS_QUERY_KEY } from './useReviews';

export function useDeleteReview(courseId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.deleteReview,
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: [...REVIEWS_QUERY_KEY, courseId] });
      const prev = queryClient.getQueryData([...REVIEWS_QUERY_KEY, courseId]);
      queryClient.setQueryData([...REVIEWS_QUERY_KEY, courseId], (old = []) =>
        old.filter(r => r._id !== reviewId)
      );
      return { prev };
    },
    onError: (err, id, ctx) => {
      queryClient.setQueryData([...REVIEWS_QUERY_KEY, courseId], ctx.prev);
      toast.error('حدث خطأ أثناء الحذف');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...REVIEWS_QUERY_KEY, courseId] });
      toast.success('تم حذف التقييم');
    },
  });
}