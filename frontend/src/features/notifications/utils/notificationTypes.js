import { BookOpen, Megaphone, MessageCircle } from 'lucide-react';

export const NOTIFICATION_TYPES = {
  course: {
    icon: BookOpen,
    color: 'primary',
    labelKey: 'notifications.types.course',
  },
  news: {
    icon: Megaphone,
    color: 'warning',
    labelKey: 'notifications.types.news',
  },
  message: {
    icon: MessageCircle,
    color: 'success',
    labelKey: 'notifications.types.message',
  },
};

export function getNotificationTypeConfig(type) {
  return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.message;
}
