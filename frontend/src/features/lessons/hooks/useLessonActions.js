import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { lessonsApi } from '../api/lessonsApi';
import { LESSONS_QUERY_KEY } from './useLessons';

export function useLessonActions(courseId) {
  const queryClient = useQueryClient();
  const lessonKey = [...LESSONS_QUERY_KEY, courseId];

  const createLesson = useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      lessonsApi.createLesson({ formData, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success('تم إضافة الدرس بنجاح');
    },
    onError: () => toast.error('فشل إضافة الدرس'),
  });

  const updateLesson = useMutation({
    mutationFn: ({ id, formData, onUploadProgress }) =>
      lessonsApi.updateLesson({ id, formData, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success('تم تحديث الدرس بنجاح');
    },
    onError: () => toast.error('فشل تحديث الدرس'),
  });

  const deleteLesson = useMutation({
    mutationFn: lessonsApi.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success('تم حذف الدرس');
    },
    onError: () => toast.error('فشل حذف الدرس'),
  });

  const reorderLessons = useMutation({
    mutationFn: lessonsApi.reorderLessons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success('تم حفظ الترتيب');
    },
    onError: () => toast.error('فشل حفظ الترتيب'),
  });

  const markProgress = useMutation({
    mutationFn: lessonsApi.markProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: () => toast.error('فشل تحديث التقدم'),
  });

  const addResource = useMutation({
    mutationFn: ({ lessonId, formData, onUploadProgress }) =>
      lessonsApi.addResource({ lessonId, formData, onUploadProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success('تم رفع المرفق بنجاح');
    },
    onError: () => toast.error('فشل رفع المرفق'),
  });

  const deleteResource = useMutation({
    mutationFn: lessonsApi.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKey });
      toast.success('تم حذف المرفق بنجاح');
    },
    onError: () => toast.error('فشل حذف المرفق'),
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
