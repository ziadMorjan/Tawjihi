import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '../api/lessonsApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { LESSONS_QUERY_KEY } from './useLessons';

export function useGenerateAI(courseId) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId) => lessonsApi.getAIContent(lessonId),
    onSuccess: () => {
      // Invalidate lessons of the course so the UI updates and gets the new AI summary and flashcards
      queryClient.invalidateQueries({ queryKey: [...LESSONS_QUERY_KEY, courseId] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? t('aiSummary.error'));
    },
  });
}
