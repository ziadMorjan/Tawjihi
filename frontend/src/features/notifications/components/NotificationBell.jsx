import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import styled from 'styled-components';
import { useNotifications } from '../hooks/useNotifications';
import { useNotificationActions } from '../hooks/useNotificationActions';
import { getNotificationTypeConfig } from '../utils/notificationTypes';
import { PATH } from '../../../constants';

const BellWrapper = styled.div`
  position: relative;
`;

const BellBtn = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  z-index: 200;
  animation: dropIn 0.15s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DropdownTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MarkAllBtn = styled.button`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

const NotificationItem = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: ${({ theme, $unread }) =>
    $unread ? theme.colors.primaryLight + '40' : 'transparent'};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-family: inherit;
  text-align: right;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $color }) => theme.colors[$color] + '15'};
  color: ${({ theme, $color }) => theme.colors[$color]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ReadDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $read }) =>
    $read ? 'transparent' : theme.colors.primary};
  border: 2px solid ${({ theme, $read }) =>
    $read ? 'transparent' : theme.colors.bgPrimary};
`;

const ContentWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemBody = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[4]}`};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const SkeletonItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child { border-bottom: none; }
`;

const SkeletonCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgTertiary};
  animation: pulse 1.5s ease-in-out infinite;
`;

const SkeletonLine = styled.div`
  height: 12px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.bgTertiary};
  animation: pulse 1.5s ease-in-out infinite;
  width: ${({ $w }) => $w || '80%'};

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const FooterLink = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: background 0.15s;
  text-align: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export function NotificationBell() {
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
      <BellBtn onClick={() => setOpen((p) => !p)} aria-label="الإشعارات">
        <Bell size={20} />
        {unreadCount > 0 && <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>}
      </BellBtn>

      {open && (
        <Dropdown>
          <DropdownHeader>
            <DropdownTitle>الإشعارات</DropdownTitle>
            {unreadCount > 0 && (
              <MarkAllBtn onClick={handleMarkAll}>تعليم الكل كمقروء</MarkAllBtn>
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
              <EmptyState>لا توجد إشعارات</EmptyState>
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
            عرض الكل
          </FooterLink>
        </Dropdown>
      )}
    </BellWrapper>
  );
}
