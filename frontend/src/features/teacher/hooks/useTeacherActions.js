import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { teacherApi } from '../api/teacherApi';
import { TEACHER_STATS_QUERY_KEY } from './useTeacherStats';

export const MY_COURSES_KEY = ['my-courses'];
export const MY_COMMENTS_KEY = ['my-comments'];
export const MY_REVIEWS_KEY = ['my-reviews'];

export function useTeacherActions() {
  const queryClient = useQueryClient();

  const replyToComment = useMutation({
    mutationFn: teacherApi.replyToComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
      toast.success('تم إضافة الرد بنجاح');
    },
    onError: () => toast.error('فشل إضافة الرد'),
  });

  const sendNotification = useMutation({
    mutationFn: teacherApi.sendNotificationToStudents,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: TEACHER_STATS_QUERY_KEY });
      const count = res?.data?.sentTo ?? 0;
      toast.success(`تم إرسال الإشعار لـ ${count} طالب`);
    },
    onError: () => toast.error('فشل إرسال الإشعار'),
  });

  const createCourse = useMutation({
    mutationFn: teacherApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: TEACHER_STATS_QUERY_KEY });
      toast.success('تم إنشاء الكورس');
    },
    onError: () => toast.error('فشل إنشاء الكورس'),
  });

  const updateCourse = useMutation({
    mutationFn: teacherApi.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_COURSES_KEY });
      toast.success('تم تحديث الكورس');
    },
    onError: () => toast.error('فشل تحديث الكورس'),
  });

	const deleteCourse = useMutation({
		mutationFn: teacherApi.deleteCourse,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COURSES_KEY });
			queryClient.invalidateQueries({ queryKey: TEACHER_STATS_QUERY_KEY });
			toast.success('تم حذف الكورس');
		},
		onError: () => toast.error('فشل حذف الكورس'),
	});

	const editReply = useMutation({
		mutationFn: teacherApi.editReply,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
			toast.success('تم تعديل الرد');
		},
		onError: () => toast.error('فشل تعديل الرد'),
	});

	const deleteReply = useMutation({
		mutationFn: teacherApi.deleteReply,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
			toast.success('تم حذف الرد');
		},
		onError: () => toast.error('فشل حذف الرد'),
	});

	const deleteComment = useMutation({
		mutationFn: teacherApi.deleteComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_COMMENTS_KEY });
			toast.success('تم حذف التعليق');
		},
		onError: () => toast.error('فشل حذف التعليق'),
	});

	const deleteReview = useMutation({
		mutationFn: teacherApi.deleteReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_REVIEWS_KEY });
			toast.success('تم حذف التقييم');
		},
		onError: () => toast.error('فشل حذف التقييم'),
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
