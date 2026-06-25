import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { commentsApi } from '../api/commentsApi';
import { COMMENTS_QUERY_KEY } from './useComments';

export function useDeleteComment(lessonId) {
  const { t } = useTranslation();
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
    onSuccess: () => {
      // نُعلم الكاش بأن البيانات "قديمة" لكن لا نُعيد الجلب فوراً لتجنب إعادة تحميل الفيديو
      queryClient.invalidateQueries({
        queryKey: [...COMMENTS_QUERY_KEY, lessonId],
        refetchType: 'none',
      });
      toast.success(t('video.commentDeleted'));
    },
    onError: (err, _id, ctx) => {
      // استرجاع البيانات السابقة عند حدوث خطأ
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData([...COMMENTS_QUERY_KEY, lessonId], ctx.prev);
      }
      toast.error(t('video.commentDeleteError'));
    },
  });
}