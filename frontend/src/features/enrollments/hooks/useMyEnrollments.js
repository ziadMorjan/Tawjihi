// src/features/enrollments/hooks/useMyEnrollments.js
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { enrollmentsApi } from '../api/enrollmentsApi';

export const ENROLLMENTS_QUERY_KEY = ['enrollments', 'my'];

export function useMyEnrollments() {
  const { user } = useAuth();

  const { data: enrollments = [], isLoading } = useQuery({
    // تمرير الـ ID لـ الـ queryKey لحماية الكاش لكل مستخدم
    queryKey: [...ENROLLMENTS_QUERY_KEY, user?._id],
    // الحل القاطع: Arrow function لتمرير الـ ID الصافي
    queryFn: () => enrollmentsApi.getMyEnrollments(user?._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // تصفية مرنة لتقبل الكورسات بأي طريقة تعيدها الـ backend
    select: (res) => res?.data?.docs ?? res?.data ?? res?.enrollments ?? [],
  });

  // دالة تفحص فوراً إذا كان المستخدم مسجلاً في كورس معين أم لا
  const isEnrolled = (courseId) =>
    enrollments.some((e) => (e.course?._id ?? e.course) === courseId);

  return {
    enrollments,
    isEnrolled,
    isLoading,
  };
}