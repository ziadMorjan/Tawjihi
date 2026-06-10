import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { commentsApi } from '../api/commentsApi';
import { COMMENTS_QUERY_KEY } from './useComments';

export function useDeleteComment(lessonId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.deleteComment,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: [...COMMENTS_QUERY_KEY, lessonId] });
      const prev = queryClient.getQueryData([...COMMENTS_QUERY_KEY, lessonId]);
      queryClient.setQueryData([...COMMENTS_QUERY_KEY, lessonId], (old = []) =>
        old.filter(c => c._id !== commentId)
      );
      return { prev };
    },
    onError: (err, id, ctx) => {
      queryClient.setQueryData([...COMMENTS_QUERY_KEY, lessonId], ctx.prev);
      toast.error('حدث خطأ أثناء الحذف');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...COMMENTS_QUERY_KEY, lessonId] });
      toast.success('تم حذف التعليق');
    },
  });
}