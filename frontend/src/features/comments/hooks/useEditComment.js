import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { commentsApi } from '../api/commentsApi';
import { COMMENTS_QUERY_KEY } from './useComments';

export function useEditComment(lessonId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentsApi.updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...COMMENTS_QUERY_KEY, lessonId] });
      toast.success('تم تعديل التعليق');
    },
    onError: () => toast.error('حدث خطأ أثناء التعديل'),
  });
}