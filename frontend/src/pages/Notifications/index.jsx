import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../features/notifications';
import { useNotificationActions } from '../../features/notifications';
import { getNotificationTypeConfig } from '../../features/notifications/utils/notificationTypes';

const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MarkAllBtn = styled.button`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) => $active ? '#fff' : theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.bgSecondary};
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $unread }) =>
    $unread ? theme.colors.primaryLight + '30' : 'transparent'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
`;

const IconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $color }) => theme.colors[$color] + '15'};
  color: ${({ theme, $color }) => theme.colors[$color]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ReadDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme, $read }) =>
    $read ? 'transparent' : theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.bgPrimary};
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px;
`;

const ItemBody = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 6px;
  line-height: 1.5;
`;

const ItemDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyIcon = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  opacity: 0.3;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
`;

const DateGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const DateLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
  padding: 0 ${({ theme }) => theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

function groupByDate(notifications) {
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
    if (dStart.getTime() === today.getTime()) label = 'اليوم';
    else if (dStart.getTime() === yesterday.getTime()) label = 'أمس';
    else if (dStart >= weekAgo) label = 'هذا الأسبوع';
    else label = 'أقدم';

    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }

  const order = ['اليوم', 'أمس', 'هذا الأسبوع', 'أقدم'];
  return order.filter((k) => groups[k]).map((k) => ({ label: k, items: groups[k] }));
}

const FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'course', label: 'كورسات' },
  { key: 'news', label: 'أخبار' },
  { key: 'message', label: 'رسائل' },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const { notifications, unreadCount } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationActions();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <PageWrapper>
      <Header>
        <TitleRow>
          <Bell size={24} />
          <Title>الإشعارات</Title>
        </TitleRow>
        {unreadCount > 0 && (
          <MarkAllBtn onClick={markAllAsRead}>تعليم الكل كمقروء</MarkAllBtn>
        )}
      </Header>

      <FilterRow>
        {FILTERS.map((f) => (
          <FilterBtn key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </FilterBtn>
        ))}
      </FilterRow>

      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Bell /></EmptyIcon>
          <EmptyText>لا توجد إشعارات</EmptyText>
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
                    <ItemDate>{formatDate(n.createdAt)}</ItemDate>
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
