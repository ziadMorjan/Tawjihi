import styled from 'styled-components';

export const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
`;

export const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: start;
  ${({ theme }) => theme.media.maxMd} { grid-template-columns: 1fr; }
`;

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const CartItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  ${({ theme }) => theme.media.maxSm} { flex-direction: column; }
`;

export const ItemImage = styled.div`
  width: 120px;
  aspect-ratio: 16/9;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.bgTertiary};
  cursor: pointer;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
  &:hover img { transform: scale(1.05); }
  ${({ theme }) => theme.media.maxSm} { width: 100%; }
`;

export const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

export const ItemTeacher = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ItemPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: auto;
`;

export const RemoveBtn = styled.button`
  align-self: flex-start;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  white-space: nowrap;
  &:hover {
    border-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerLight};
  }
`;

export const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const SummaryTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  &.total {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding-top: ${({ theme }) => theme.spacing[4]};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin-top: ${({ theme }) => theme.spacing[2]};
  }
`;

export const CouponRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  svg { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;