// src/features/search/useSearch.js
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../courses/api/coursesApi';
import { teachersApi } from '../teachers/api/teachersApi';

/**
 * Runs both courses + teachers queries in parallel for a given keyword.
 * Only fires when `keyword` is a non-empty trimmed string.
 *
 * @param {string} keyword - debounced search term
 * @param {{ limit?: number }} options
 */
export function useSearch(keyword, { limit = 20 } = {}) {
  const enabled = !!keyword?.trim();

  const coursesQuery = useQuery({
    queryKey: ['search', 'courses', keyword, limit],
    queryFn:  () => coursesApi.getAll({ keyword, limit }),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const teachersQuery = useQuery({
    queryKey: ['search', 'teachers', keyword, limit],
    queryFn:  () => teachersApi.getAll({ keyword, limit }),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const courses  = coursesQuery.data?.data?.docs
    ?? coursesQuery.data?.data
    ?? coursesQuery.data?.docs
    ?? [];

  const teachers = teachersQuery.data?.data?.docs
    ?? teachersQuery.data?.data
    ?? teachersQuery.data?.users
    ?? teachersQuery.data?.teachers
    ?? [];

  return {
    courses,
    teachers,
    isLoading: coursesQuery.isLoading || teachersQuery.isLoading,
    isFetching: coursesQuery.isFetching || teachersQuery.isFetching,
    hasResults: courses.length > 0 || teachers.length > 0,
  };
}
