import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { ALL_USERS_KEY } from './useAdminActions';

export function useAllUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ALL_USERS_KEY,
    queryFn: adminApi.getAllUsers,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { users: data ?? [], isLoading };
}
