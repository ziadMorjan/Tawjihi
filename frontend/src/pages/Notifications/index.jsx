import { useState, useMemo } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../features/notifications';
import { useNotificationActions } from '../../features/notifications';
import { getNotificationTypeConfig } from '../../features/notifications/utils/notificationTypes';
import { useLanguage } from '../../shared/hooks/useLanguage';
import {
  PageWrapper, Header, TitleRow, Title, MarkAllBtn,
  FilterRow, FilterBtn,
  NotificationItem, IconCircle, ReadDot, Content, ItemTitle, ItemBody, ItemDate,
  EmptyState, EmptyIcon, EmptyText,
  DateGroup, DateLabel,
} from './styles';

function groupByDate(notifications, t) {
  const groups = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  for (const n of notifications) {
    const d = new Date(n.createdAt);
    const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let label;
    if (dStart.getTime() === today.getTime()) label = t('notifications.today');
    else if (dStart.getTime() === yesterday.getTime()) label = t('notifications.yesterday');
    else if (dStart >= weekAgo) label = t('notifications.thisWeek');
    else label = t('notifications.older');

    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }

  const order = [t('notifications.today'), t('notifications.yesterday'), t('notifications.thisWeek'), t('notifications.older')];
  return order.filter((k) => groups[k]).map((k) => ({ label: k, items: groups[k] }));
}

function FILTERS(t) {
  return [
    { key: 'all', label: t('notifications.all') },
    { key: 'course', label: t('notifications.courses') },
    { key: 'news', label: t('notifications.news') },
    { key: 'message', label: t('notifications.messages') },
  ];
}

function formatDate(dateStr, t) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t('notifications.now');
  if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
  if (hours < 24) return t('notifications.hoursAgo', { count: hours });
  if (days < 7) return t('notifications.daysAgo', { count: days });
  return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const { t } = useLanguage();
  const { notifications, unreadCount } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationActions();
  const [filter, setFilter] = useState('all');

  const filters = useMemo(() => FILTERS(t), [t]);

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const groups = useMemo(() => groupByDate(filtered, t), [filtered, t]);

  return (
    <PageWrapper>
      <Header>
        <TitleRow>
          <Bell size={24} />
          <Title>{t('notifications.title')}</Title>
        </TitleRow>
        {unreadCount > 0 && (
          <MarkAllBtn onClick={markAllAsRead}>{t('notifications.markAllRead')}</MarkAllBtn>
        )}
      </Header>

      <FilterRow>
        {filters.map((f) => (
          <FilterBtn key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </FilterBtn>
        ))}
      </FilterRow>

      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Bell /></EmptyIcon>
          <EmptyText>{t('notifications.empty')}</EmptyText>
        </EmptyState>
      ) : (
        groups.map((g) => (
          <DateGroup key={g.label}>
            <DateLabel>{g.label}</DateLabel>
            {g.items.map((n) => {
              const config = getNotificationTypeConfig(n.type);
              const Icon = config.icon;
              return (
                <NotificationItem
                  key={n._id}
                  $unread={!n.isRead}
                  onClick={() => { if (!n.isRead) markAsRead(n._id); }}
                >
                  <IconCircle $color={config.color}>
                    <Icon />
                    <ReadDot $read={n.isRead} />
                  </IconCircle>
                  <Content>
                    <ItemTitle>{n.title}</ItemTitle>
                    {n.body && <ItemBody>{n.body}</ItemBody>}
                    <ItemDate>{formatDate(n.createdAt, t)}</ItemDate>
                  </Content>
                </NotificationItem>
              );
            })}
          </DateGroup>
        ))
      )}
    </PageWrapper>
  );
}
