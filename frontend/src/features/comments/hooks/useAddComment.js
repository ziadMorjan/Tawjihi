import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { commentsApi } from '../api/commentsApi';
import { COMMENTS_QUERY_KEY } from './useComments';

export function useAddComment(lessonId) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENTS_QUERY_KEY, lessonId],
      });
      toast.success(t('video.commentAdded'));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? t('video.commentError'));
    },
  });
}