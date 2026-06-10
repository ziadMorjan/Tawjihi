import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { commentsApi } from '../api/commentsApi';
import { COMMENTS_QUERY_KEY } from './useComments';

export function useAddComment(lessonId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENTS_QUERY_KEY, lessonId],
      });
      toast.success('تم إضافة تعليقك');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'حدث خطأ');
    },
  });
}