import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { lessonsApi } from '../api/lessonsApi';
import { LESSONS_QUERY_KEY } from './useLessons';

export function useLessonActions(courseId) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const lessonKey = [...LESSONS_QUERY_KEY, courseId];

  const createLesson = useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      lessonsApi.createLesson({ formData, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success(t('lessons.actions.createSuccess'));
    },
    onError: () => toast.error(t('lessons.actions.createError')),
  });

  const updateLesson = useMutation({
    mutationFn: ({ id, formData, onUploadProgress }) =>
      lessonsApi.updateLesson({ id, formData, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success(t('lessons.actions.updateSuccess'));
    },
    onError: () => toast.error(t('lessons.actions.updateError')),
  });

  const deleteLesson = useMutation({
    mutationFn: lessonsApi.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success(t('lessons.actions.deleteSuccess'));
    },
    onError: () => toast.error(t('lessons.actions.deleteError')),
  });

  const reorderLessons = useMutation({
    mutationFn: lessonsApi.reorderLessons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success(t('lessons.actions.reorderSuccess'));
    },
    onError: () => toast.error(t('lessons.actions.reorderError')),
  });

  const markProgress = useMutation({
    mutationFn: lessonsApi.markProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: () => toast.error(t('lessons.actions.progressError')),
  });

  const addResource = useMutation({
    mutationFn: ({ lessonId, formData, onUploadProgress }) =>
      lessonsApi.addResource({ lessonId, formData, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success(t('lessons.actions.resourceUploadSuccess'));
    },
    onError: () => toast.error(t('lessons.actions.resourceUploadError')),
  });

  const deleteResource = useMutation({
    mutationFn: lessonsApi.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success(t('lessons.actions.resourceDeleteSuccess'));
    },
    onError: () => toast.error(t('lessons.actions.resourceDeleteError')),
  });

  return {
    createLesson: createLesson.mutateAsync,
    updateLesson: updateLesson.mutateAsync,
    deleteLesson: deleteLesson.mutate,
    reorderLessons: reorderLessons.mutate,
    markProgress: markProgress.mutate,
    addResource: addResource.mutateAsync,
    deleteResource: deleteResource.mutate,
    isCreating: createLesson.isPending,
    isUpdating: updateLesson.isPending,
    isDeleting: deleteLesson.isPending,
    isReordering: reorderLessons.isPending,
    isAddingResource: addResource.isPending,
    isDeletingResource: deleteResource.isPending,
  };
}
