import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { teachersApi } from '../api/teachersApi';

export const TEACHER_REVIEWS_KEY = ['teacherReviews'];

export function useTeacherReviews(teacherId) {
  return useQuery({
    queryKey: [...TEACHER_REVIEWS_KEY, teacherId],
    queryFn: () => teachersApi.getReviews(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.docs ?? [],
  });
}

export function useAddTeacherReview(teacherId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rating, comment }) =>
      teachersApi.addReview({ teacherId, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...TEACHER_REVIEWS_KEY, teacherId],
      });
      queryClient.invalidateQueries({ queryKey: ['teachers', teacherId] });
      toast.success('تم إضافة تقييمك بنجاح');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'حدث خطأ، حاول مجدداً');
    },
  });
}

export function useDeleteTeacherReview(teacherId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) =>
      teachersApi.deleteReview({ teacherId, reviewId }),
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({
        queryKey: [...TEACHER_REVIEWS_KEY, teacherId],
      });
      const prev = queryClient.getQueryData([...TEACHER_REVIEWS_KEY, teacherId]);
      queryClient.setQueryData(
        [...TEACHER_REVIEWS_KEY, teacherId],
        (old = []) => old.filter(r => r._id !== reviewId)
      );
      return { prev };
    },
    onError: (err, id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(
          [...TEACHER_REVIEWS_KEY, teacherId], ctx.prev
        );
      }
      toast.error('حدث خطأ أثناء الحذف');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...TEACHER_REVIEWS_KEY, teacherId],
      });
      toast.success('تم حذف التقييم');
    },
  });
}