import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminApi } from '../api/adminApi';
import { ADMIN_STATS_QUERY_KEY } from './useAdminStats';

export const PENDING_TEACHERS_KEY = ['pending-teachers'];
export const ALL_USERS_KEY = ['all-users'];
export const ALL_COURSES_KEY = ['all-courses'];
export const BRANCHES_KEY = ['branches'];
export const SUBJECTS_KEY = ['subjects'];
export const COUPONS_KEY = ['coupons'];
export const NEWS_KEY = ['news'];

export function useAdminActions() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: PENDING_TEACHERS_KEY });
    queryClient.invalidateQueries({ queryKey: ALL_USERS_KEY });
    queryClient.invalidateQueries({ queryKey: ALL_COURSES_KEY });
    queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
    queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
    queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
    queryClient.invalidateQueries({ queryKey: NEWS_KEY });
  };

  const approveTeacher = useMutation({
    mutationFn: adminApi.approveTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_TEACHERS_KEY });
      toast.success('تم قبول المعلم بنجاح');
    },
    onError: () => toast.error('فشل قبول المعلم'),
  });

  const rejectTeacher = useMutation({
    mutationFn: adminApi.rejectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_TEACHERS_KEY });
      toast.success('تم رفض المعلم');
    },
    onError: () => toast.error('فشل رفض المعلم'),
  });

  const deleteUser = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_USERS_KEY });
      toast.success('تم حذف المستخدم');
    },
    onError: () => toast.error('فشل حذف المستخدم'),
  });

  const deleteCourse = useMutation({
    mutationFn: adminApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_KEY });
      toast.success('تم حذف الكورس');
    },
    onError: () => toast.error('فشل حذف الكورس'),
  });

  const updateUser = useMutation({
    mutationFn: adminApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_USERS_KEY });
      toast.success('تم تحديث المستخدم');
    },
    onError: () => toast.error('فشل تحديث المستخدم'),
  });

  const createBranch = useMutation({
    mutationFn: adminApi.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
      toast.success('تم إضافة الفرع');
    },
    onError: () => toast.error('فشل إضافة الفرع'),
  });

  const updateBranch = useMutation({
    mutationFn: adminApi.updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
      toast.success('تم تحديث الفرع');
    },
    onError: () => toast.error('فشل تحديث الفرع'),
  });

  const deleteBranch = useMutation({
    mutationFn: adminApi.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success('تم حذف الفرع');
    },
    onError: () => toast.error('فشل حذف الفرع'),
  });

  const createSubject = useMutation({
    mutationFn: adminApi.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success('تم إضافة المادة');
    },
    onError: () => toast.error('فشل إضافة المادة'),
  });

  const updateSubject = useMutation({
    mutationFn: adminApi.updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success('تم تحديث المادة');
    },
    onError: () => toast.error('فشل تحديث المادة'),
  });

  const deleteSubject = useMutation({
    mutationFn: adminApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success('تم حذف المادة');
    },
    onError: () => toast.error('فشل حذف المادة'),
  });

  const createCoupon = useMutation({
    mutationFn: adminApi.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success('تم إضافة الكوبون');
    },
    onError: () => toast.error('فشل إضافة الكوبون'),
  });

  const updateCoupon = useMutation({
    mutationFn: adminApi.updateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success('تم تحديث الكوبون');
    },
    onError: () => toast.error('فشل تحديث الكوبون'),
  });

  const updateCourse = useMutation({
    mutationFn: adminApi.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_KEY });
      toast.success('تم تحديث الكورس');
    },
    onError: () => toast.error('فشل تحديث الكورس'),
  });

  const deleteCoupon = useMutation({
    mutationFn: adminApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success('تم حذف الكوبون');
    },
    onError: () => toast.error('فشل حذف الكوبون'),
  });

  const createNews = useMutation({
    mutationFn: adminApi.createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEY });
      toast.success('تم إضافة الخبر');
    },
    onError: () => toast.error('فشل إضافة الخبر'),
  });

  const updateNews = useMutation({
    mutationFn: adminApi.updateNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEY });
      toast.success('تم تحديث الخبر');
    },
    onError: () => toast.error('فشل تحديث الخبر'),
  });

  const deleteNews = useMutation({
    mutationFn: adminApi.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEY });
      toast.success('تم حذف الخبر');
    },
    onError: () => toast.error('فشل حذف الخبر'),
  });

  const broadcastNotification = useMutation({
    mutationFn: adminApi.broadcastNotification,
    onSuccess: (res) => {
      const count = res?.data?.created ?? 0;
      toast.success(`تم إرسال الإشعار لـ ${count} مستخدم`);
    },
    onError: () => toast.error('فشل إرسال الإشعار'),
  });

  const broadcastToSpecific = useMutation({
    mutationFn: adminApi.broadcastToSpecific,
    onSuccess: (res) => {
      const count = res?.data?.created ?? 0;
      toast.success(`تم إرسال الإشعار لـ ${count} مستخدم`);
    },
    onError: () => toast.error('فشل إرسال الإشعار'),
  });

  return {
    approveTeacher: approveTeacher.mutate,
    rejectTeacher: rejectTeacher.mutate,
    updateUser: updateUser.mutate,
    deleteUser: deleteUser.mutate,
    updateCourse: updateCourse.mutate,
    deleteCourse: deleteCourse.mutate,
    createBranch: createBranch.mutate,
    updateBranch: updateBranch.mutate,
    deleteBranch: deleteBranch.mutate,
    createSubject: createSubject.mutate,
    updateSubject: updateSubject.mutate,
    deleteSubject: deleteSubject.mutate,
    createCoupon: createCoupon.mutate,
    updateCoupon: updateCoupon.mutate,
    deleteCoupon: deleteCoupon.mutate,
    createNews: createNews.mutate,
    updateNews: updateNews.mutate,
    deleteNews: deleteNews.mutate,
    broadcastNotification: broadcastNotification.mutate,
    broadcastToSpecific: broadcastToSpecific.mutate,
    isApproving: approveTeacher.isPending,
    isRejecting: rejectTeacher.isPending,
    isUpdatingUser: updateUser.isPending,
    isDeletingUser: deleteUser.isPending,
    isUpdatingCourse: updateCourse.isPending,
    isDeletingCourse: deleteCourse.isPending,
    isCreatingBranch: createBranch.isPending,
    isUpdatingBranch: updateBranch.isPending,
    isDeletingBranch: deleteBranch.isPending,
    isCreatingSubject: createSubject.isPending,
    isUpdatingSubject: updateSubject.isPending,
    isDeletingSubject: deleteSubject.isPending,
    isCreatingCoupon: createCoupon.isPending,
    isUpdatingCoupon: updateCoupon.isPending,
    isDeletingCoupon: deleteCoupon.isPending,
    isCreatingNews: createNews.isPending,
    isUpdatingNews: updateNews.isPending,
    isDeletingNews: deleteNews.isPending,
    isBroadcasting: broadcastNotification.isPending || broadcastToSpecific.isPending,
  };
}
