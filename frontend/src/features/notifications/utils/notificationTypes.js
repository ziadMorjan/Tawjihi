import { BookOpen, Megaphone, MessageCircle } from 'lucide-react';

export const NOTIFICATION_TYPES = {
  course: {
    icon: BookOpen,
    color: 'primary',
    label: 'كورس',
  },
  news: {
    icon: Megaphone,
    color: 'warning',
    label: 'خبر',
  },
  message: {
    icon: MessageCircle,
    color: 'success',
    label: 'رسالة',
  },
};

export function getNotificationTypeConfig(type) {
  return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.message;
}
