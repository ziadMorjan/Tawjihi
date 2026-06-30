import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { notificationsApi } from '../api/notificationsApi';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export function useNotifications() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationsApi.getMyNotifications,
    enabled: !!user,
    refetchInterval: 20000,
    staleTime: 0,
    retry: false,
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
  };
}
