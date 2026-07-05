import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useNotificationActions } from '../hooks/useNotificationActions';
import { getNotificationTypeConfig } from '../utils/notificationTypes';
import { PATH } from '../../../constants';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import {
  BellWrapper, BellBtn, Badge,
  Dropdown, DropdownHeader, DropdownTitle, MarkAllBtn,
  NotificationList, NotificationItem,
  IconCircle, ReadDot, ContentWrap, ItemTitle, ItemBody,
  EmptyState,
  SkeletonItem, SkeletonCircle, SkeletonLine,
  FooterLink,
} from './NotificationBell.styles';

export function NotificationBell() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationActions();

  const handleClickOutside = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleItemClick = (id) => {
    markAsRead(id);
    setOpen(false);
    navigate(PATH.notifications);
  };

  const handleMarkAll = () => {
    markAllAsRead();
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <BellWrapper ref={ref}>
      <BellBtn onClick={() => setOpen((p) => !p)} aria-label={t('notifications.title')}>
        <Bell size={20} />
        {unreadCount > 0 && <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>}
      </BellBtn>

      {open && (
        <Dropdown>
          <DropdownHeader>
            <DropdownTitle>{t('notifications.title')}</DropdownTitle>
            {unreadCount > 0 && (
              <MarkAllBtn onClick={handleMarkAll}>{t('notifications.markAllRead')}</MarkAllBtn>
            )}
          </DropdownHeader>

          <NotificationList>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonItem key={i}>
                  <SkeletonCircle />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <SkeletonLine $w="60%" />
                    <SkeletonLine $w="40%" />
                  </div>
                </SkeletonItem>
              ))
            ) : recentNotifications.length === 0 ? (
              <EmptyState>{t('notifications.empty')}</EmptyState>
            ) : (
              recentNotifications.map((n) => {
                const config = getNotificationTypeConfig(n.type);
                const Icon = config.icon;
                return (
                  <NotificationItem
                    key={n._id}
                    $unread={!n.isRead}
                    onClick={() => handleItemClick(n._id)}
                  >
                    <IconCircle $color={config.color}>
                      <Icon />
                      <ReadDot $read={n.isRead} />
                    </IconCircle>
                    <ContentWrap>
                      <ItemTitle>{n.title}</ItemTitle>
                      {n.body && <ItemBody>{n.body}</ItemBody>}
                    </ContentWrap>
                  </NotificationItem>
                );
              })
            )}
          </NotificationList>

          <FooterLink onClick={() => { setOpen(false); navigate(PATH.notifications); }}>
            {t('notifications.viewAll')}
          </FooterLink>
        </Dropdown>
      )}
    </BellWrapper>
  );
}
