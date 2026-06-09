import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const ENROLLMENTS_QUERY_KEY = ['enrollments', 'my'];

const fetchMyEnrollments = async (userId) => {
  const { data } = await axiosInstance.get('/enrollments', {
    params: { user: userId },
  });
  // backend: { status, data: { docs: [...] } }
  return data?.data?.docs ?? [];
};

export function useMyEnrollments() {
  const { user } = useAuth();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: [...ENROLLMENTS_QUERY_KEY, user?._id],
    queryFn: () => fetchMyEnrollments(user._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 🔴 المشكلة كانت هنا — المقارنة غلط
  // enrollment.course قد يكون object أو string ID
  const isEnrolled = (courseId) => {
    if (!courseId) return false;
    return enrollments.some((e) => {
      const enrolledCourseId = e?.course?._id ?? e?.course ?? e;
      return String(enrolledCourseId) === String(courseId);
    });
  };

  return { enrollments, isEnrolled, isLoading };
}