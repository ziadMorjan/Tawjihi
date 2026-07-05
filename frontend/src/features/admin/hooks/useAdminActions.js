import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminApi } from '../api/adminApi';
import { ADMIN_STATS_QUERY_KEY } from './useAdminStats';
import { useLanguage } from '../../../shared/hooks/useLanguage';

export const PENDING_TEACHERS_KEY = ['pending-teachers'];
export const ALL_USERS_KEY = ['all-users'];
export const ALL_COURSES_KEY = ['all-courses'];
export const BRANCHES_KEY = ['branches'];
export const SUBJECTS_KEY = ['subjects'];
export const COUPONS_KEY = ['coupons'];
export const NEWS_KEY = ['news'];

export function useAdminActions() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const approveTeacher = useMutation({
    mutationFn: adminApi.approveTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_TEACHERS_KEY });
      toast.success(t('adminDashboard.toasts.teacherApproved'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.teacherApproveFail')),
  });

  const rejectTeacher = useMutation({
    mutationFn: adminApi.rejectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_TEACHERS_KEY });
      toast.success(t('adminDashboard.toasts.teacherRejected'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.teacherRejectFail')),
  });

  const deleteUser = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_USERS_KEY });
      toast.success(t('adminDashboard.toasts.userDeleted'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.userDeleteFail')),
  });

  const deleteCourse = useMutation({
    mutationFn: adminApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_KEY });
      toast.success(t('adminDashboard.toasts.courseDeleted'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.courseDeleteFail')),
  });

  const updateUser = useMutation({
    mutationFn: adminApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_USERS_KEY });
      toast.success(t('adminDashboard.toasts.userUpdated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.userUpdateFail')),
  });

  const createBranch = useMutation({
    mutationFn: adminApi.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
      toast.success(t('adminDashboard.toasts.branchCreated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.branchCreateFail')),
  });

  const updateBranch = useMutation({
    mutationFn: adminApi.updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
      toast.success(t('adminDashboard.toasts.branchUpdated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.branchUpdateFail')),
  });

  const deleteBranch = useMutation({
    mutationFn: adminApi.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCHES_KEY });
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success(t('adminDashboard.toasts.branchDeleted'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.branchDeleteFail')),
  });

  const createSubject = useMutation({
    mutationFn: adminApi.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success(t('adminDashboard.toasts.subjectCreated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.subjectCreateFail')),
  });

  const updateSubject = useMutation({
    mutationFn: adminApi.updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success(t('adminDashboard.toasts.subjectUpdated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.subjectUpdateFail')),
  });

  const deleteSubject = useMutation({
    mutationFn: adminApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success(t('adminDashboard.toasts.subjectDeleted'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.subjectDeleteFail')),
  });

  const createCoupon = useMutation({
    mutationFn: adminApi.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success(t('adminDashboard.toasts.couponCreated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.couponCreateFail')),
  });

  const updateCoupon = useMutation({
    mutationFn: adminApi.updateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success(t('adminDashboard.toasts.couponUpdated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.couponUpdateFail')),
  });

  const updateCourse = useMutation({
    mutationFn: adminApi.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_KEY });
      toast.success(t('adminDashboard.toasts.courseUpdated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.courseUpdateFail')),
  });

  const deleteCoupon = useMutation({
    mutationFn: adminApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success(t('adminDashboard.toasts.couponDeleted'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.couponDeleteFail')),
  });

  const createNews = useMutation({
    mutationFn: adminApi.createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEY });
      toast.success(t('adminDashboard.toasts.newsCreated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.newsCreateFail')),
  });

  const updateNews = useMutation({
    mutationFn: adminApi.updateNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEY });
      toast.success(t('adminDashboard.toasts.newsUpdated'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.newsUpdateFail')),
  });

  const deleteNews = useMutation({
    mutationFn: adminApi.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEY });
      toast.success(t('adminDashboard.toasts.newsDeleted'));
    },
    onError: () => toast.error(t('adminDashboard.toasts.newsDeleteFail')),
  });

  const broadcastNotification = useMutation({
    mutationFn: adminApi.broadcastNotification,
    onSuccess: (res) => {
      const count = res?.data?.created ?? 0;
      toast.success(t('adminDashboard.toasts.broadcastSent', { count }));
    },
    onError: () => toast.error(t('adminDashboard.toasts.broadcastSendFail')),
  });

  const broadcastToSpecific = useMutation({
    mutationFn: adminApi.broadcastToSpecific,
    onSuccess: (res) => {
      const count = res?.data?.created ?? 0;
      toast.success(t('adminDashboard.toasts.broadcastSent', { count }));
    },
    onError: () => toast.error(t('adminDashboard.toasts.broadcastSendFail')),
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
