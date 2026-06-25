import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { commentsApi } from '../api/commentsApi';
import { COMMENTS_QUERY_KEY } from './useComments';

export function useEditComment(lessonId) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentsApi.updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...COMMENTS_QUERY_KEY, lessonId] });
      toast.success(t('video.commentEdited'));
    },
    onError: () => toast.error(t('video.commentEditError')),
  });
}