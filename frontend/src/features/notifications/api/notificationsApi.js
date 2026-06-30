import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const notificationsApi = {
  getMyNotifications: async () => {
    const { data } = await axiosInstance.get('/notifications/me');
    return { notifications: data.data.docs ?? [], unreadCount: data.data.unreadCount ?? 0 };
  },

  markAsRead: async (id) => {
    const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await axiosInstance.patch('/notifications/me/read-all');
    return data;
  },
};
