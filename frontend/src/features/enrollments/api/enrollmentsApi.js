// src/features/enrollments/api/enrollmentsApi.js
import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const enrollmentsApi = {
  // 1. جلب الكورسات المشترك بها المستخدم
  getMyEnrollments: async (userId) => {
    const { data } = await axiosInstance.get('/enrollments', {
      params: { user: userId },
    });
    return data;
  },

  // 2. فحص كورس محدد (إذا لزم الأمر مستقبلاً)
  isEnrolled: async (userId, courseId) => {
    const { data } = await axiosInstance.get('/enrollments', {
      params: { user: userId, course: courseId },
    });
    return (data?.data?.docs ?? []).length > 0;
  },

  // 3. دالة الدفع التي كانت ضائعة في الملف القديم (تم نقلها هنا)
  createCheckoutSession: async (courseId) => {
    const { data } = await axiosInstance.post('/payment/create-checkout-session', {
      courseId,
    });
    return data;
  },
};