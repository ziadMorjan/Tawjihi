import styled from 'styled-components';

export const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const MarkAllBtn = styled.button`
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

export const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

export const FilterBtn = styled.button`
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

export const NotificationItem = styled.div`
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

export const IconCircle = styled.div`
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

export const ReadDot = styled.span`
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

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px;
`;

export const ItemBody = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 6px;
  line-height: 1.5;
`;

export const ItemDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyIcon = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  opacity: 0.3;

  svg {
    width: 48px;
    height: 48px;
  }
`;

export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
`;

export const DateGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const DateLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
  padding: 0 ${({ theme }) => theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
