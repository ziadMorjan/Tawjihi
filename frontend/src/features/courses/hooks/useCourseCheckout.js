// src/features/courses/hooks/useCourseCheckout.js
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { enrollmentsApi } from '../../enrollments/api/enrollmentsApi';

export function useCourseCheckout(courseId) {
  const checkoutMutation = useMutation({
    mutationFn: () => enrollmentsApi.createCheckoutSession(courseId),
    onSuccess: (data) => {
      // التوجيه لصفحة الدفع Stripe بأمان
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error('حدث خطأ أثناء الانتقال لبوابة الدفع، حاول مجدداً');
    },
  });

  return {
    checkout: checkoutMutation.mutate,
    isCheckoutLoading: checkoutMutation.isPending,
  };
}