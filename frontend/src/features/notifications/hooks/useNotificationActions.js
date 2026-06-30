import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi';
import { NOTIFICATIONS_QUERY_KEY } from './useNotifications';

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: invalidate,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: invalidate,
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarking: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
}
