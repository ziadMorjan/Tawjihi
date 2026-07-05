import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { teacherApi } from '../api/teacherApi';
import { TEACHER_STATS_QUERY_KEY } from './useTeacherStats';
import { useLanguage } from '../../../shared/hooks/useLanguage';

export const MY_COURSES_KEY = ['my-courses'];
export const MY_COMMENTS_KEY = ['my-comments'];
export const MY_REVIEWS_KEY = ['my-reviews'];

export function useTeacherActions() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const replyToComment = useMutation({
    mutationFn: teacherApi.replyToComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
      toast.success(t('teacherDashboard.toasts.replyAdded'));
    },
    onError: () => toast.error(t('teacherDashboard.toasts.replyAddFail')),
  });

  const sendNotification = useMutation({
    mutationFn: teacherApi.sendNotificationToStudents,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: TEACHER_STATS_QUERY_KEY });
      const count = res?.data?.sentTo ?? 0;
      toast.success(t('teacherDashboard.toasts.notificationSent', { count }));
    },
    onError: () => toast.error(t('teacherDashboard.toasts.notificationSendFail')),
  });

  const createCourse = useMutation({
    mutationFn: teacherApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: TEACHER_STATS_QUERY_KEY });
      toast.success(t('teacherDashboard.toasts.courseCreated'));
    },
    onError: () => toast.error(t('teacherDashboard.toasts.courseCreateFail')),
  });

  const updateCourse = useMutation({
    mutationFn: teacherApi.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COURSES_KEY });
      toast.success(t('teacherDashboard.toasts.courseUpdated'));
    },
    onError: () => toast.error(t('teacherDashboard.toasts.courseUpdateFail')),
  });

 	const deleteCourse = useMutation({
		mutationFn: teacherApi.deleteCourse,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COURSES_KEY });
			queryClient.invalidateQueries({ queryKey: TEACHER_STATS_QUERY_KEY });
			toast.success(t('teacherDashboard.toasts.courseDeleted'));
		},
		onError: () => toast.error(t('teacherDashboard.toasts.courseDeleteFail')),
	});

	const editReply = useMutation({
		mutationFn: teacherApi.editReply,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
			toast.success(t('teacherDashboard.toasts.replyEdited'));
		},
		onError: () => toast.error(t('teacherDashboard.toasts.replyEditFail')),
	});

	const deleteReply = useMutation({
		mutationFn: teacherApi.deleteReply,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
			toast.success(t('teacherDashboard.toasts.replyDeleted'));
		},
		onError: () => toast.error(t('teacherDashboard.toasts.replyDeleteFail')),
	});

	const deleteComment = useMutation({
		mutationFn: teacherApi.deleteComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
			toast.success(t('teacherDashboard.toasts.commentDeleted'));
		},
		onError: () => toast.error(t('teacherDashboard.toasts.commentDeleteFail')),
	});

	const deleteReview = useMutation({
		mutationFn: teacherApi.deleteReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_REVIEWS_KEY });
			toast.success(t('teacherDashboard.toasts.reviewDeleted'));
		},
		onError: () => toast.error(t('teacherDashboard.toasts.reviewDeleteFail')),
	});

	return {
		replyToComment: replyToComment.mutate,
		sendNotification: sendNotification.mutate,
		createCourse: createCourse.mutate,
		updateCourse: updateCourse.mutate,
		deleteCourse: deleteCourse.mutate,
		editReply: editReply.mutate,
		deleteReply: deleteReply.mutate,
		deleteComment: deleteComment.mutate,
		deleteReview: deleteReview.mutate,
		isReplying: replyToComment.isPending,
		isSending: sendNotification.isPending,
		isCreating: createCourse.isPending,
		isUpdating: updateCourse.isPending,
		isDeleting: deleteCourse.isPending,
		isEditingReply: editReply.isPending,
		isDeletingReply: deleteReply.isPending,
		isDeletingComment: deleteComment.isPending,
		isDeletingReview: deleteReview.isPending,
	};
}
