import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '../api/teacherApi';
import { MY_COURSES_KEY } from './useTeacherActions';
import { useAuth } from '../../auth';

export function useTeacherCourses() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: MY_COURSES_KEY,
    queryFn: () => teacherApi.getMyCourses(user?._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { courses: data ?? [], isLoading };
}
