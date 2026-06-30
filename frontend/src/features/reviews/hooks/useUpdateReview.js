import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { reviewsApi } from '../api/reviewsApi';
import { REVIEWS_QUERY_KEY } from './useReviews';

export function useUpdateReview(courseId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }) => reviewsApi.updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...REVIEWS_QUERY_KEY, courseId],
      });
      toast.success('تم تحديث تقييمك بنجاح');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'حدث خطأ');
    },
  });
}
