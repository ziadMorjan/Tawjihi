// src/features/courses/hooks/useEnrollment.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../shared/lib/axiosInstance';
import { useAuth } from '../../auth';
import { toast } from 'react-toastify';

const enrollmentApi = {
  getMyEnrollments: async (userId) => {
    const { data } = await axiosInstance.get('/enrollments', {
      params: { user: userId }
    });
    return data;
  },

  createCheckoutSession: async (courseId) => {
    const { data } = await axiosInstance.post(
      '/payment/create-checkout-session',
      { courseId }
    );
    return data;
  },
};

export const ENROLLMENTS_QUERY_KEY = ['enrollments', 'my'];

export function useEnrollment(courseId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // جلب كل الكورسات اللي اشتراها المستخدم
  const { data: enrollmentsData } = useQuery({
    queryKey: ENROLLMENTS_QUERY_KEY,
    queryFn: enrollmentApi.getMyEnrollments,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data ?? data?.enrollments ?? data,
  });

  const enrollments = Array.isArray(enrollmentsData)
    ? enrollmentsData
    : [];

  // هل مسجل في هذا الكورس؟
  const isEnrolled = enrollments.some(
    e => e.course?._id === courseId || e.course === courseId
  );

  // Mutation للدفع
  const checkoutMutation = useMutation({
    mutationFn: () => enrollmentApi.createCheckoutSession(courseId),
    onSuccess: (data) => {
      // الـ backend يرجع Stripe checkout URL
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: () => toast.error('حدث خطأ، حاول مجدداً'),
  });

  return {
    isEnrolled,
    enrollments,
    checkout: checkoutMutation.mutate,
    isCheckoutLoading: checkoutMutation.isPending,
  };
}