import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '../api/teacherApi';
import { MY_REVIEWS_KEY } from './useTeacherActions';
import { useTeacherCourses } from './useTeacherCourses';

export function useTeacherReviews() {
  const { courses, isLoading: coursesLoading } = useTeacherCourses();
  const courseIds = courses.map((c) => c._id);

  const { data, isLoading } = useQuery({
    queryKey: [...MY_REVIEWS_KEY, courseIds],
    queryFn: () => teacherApi.getMyReviews(courseIds),
    enabled: !coursesLoading && courseIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return { reviews: data ?? [], isLoading: coursesLoading || isLoading };
}
