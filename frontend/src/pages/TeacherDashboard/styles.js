import styled from 'styled-components';

export const PageInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};

  @media (max-width: 600px) {
    padding: 16px 12px;
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const StatIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  svg { width: 24px; height: 24px; }
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
`;

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Th = styled.th`
  text-align: right;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;
`;

export const ActionsCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

export const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  color: ${({ theme, $color }) => theme.colors[$color] || theme.colors.textSecondary};
  &:hover {
    background: ${({ theme, $color }) => $color ? theme.colors[$color] + '18' : theme.colors.bgSecondary};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export const RowHover = styled.tr`
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSecondary}; }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success + '20' :
      $type === 'warning' ? theme.colors.warning + '20' :
        $type === 'danger' ? theme.colors.danger + '20' : theme.colors.primaryLight};
  color: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success :
      $type === 'warning' ? theme.colors.warning :
        $type === 'danger' ? theme.colors.danger : theme.colors.primary};
`;

export const Form = styled.form`
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const StyledInput = styled.input`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
`;

export const StyledTextarea = styled.textarea`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  resize: vertical;
  min-height: 120px;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
`;

export const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
`;

export const FilterRow = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const FilterLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

export const CourseSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none; cursor: pointer;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const CommentCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-inline-start: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  transition: box-shadow 0.2s;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.lg}; }
`;

export const CommentUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const UserAvatar = styled.div`
  width: 36px; height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex; align-items: center; justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const CommentName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-left: 5px;
`;

export const CommentLesson = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CommentActions = styled.div`
  margin-inline-start: auto;
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing[1]};
`;

export const IconBtn = styled.button`
  background: none; border: none; cursor: pointer; padding: 4px;
  border-radius: 6px; color: ${({ theme }) => theme.colors.textMuted};
  display: flex; align-items: center; font-family: inherit;
  &:hover { background: ${({ theme }) => theme.colors.bgTertiary}; color: ${({ theme }) => theme.colors.textPrimary}; }
`;

export const ConfirmGroup = styled.div`
  display: flex; align-items: center; gap: 2px;
`;

export const ConfirmBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  padding: 3px; border-radius: 4px; border: none; cursor: pointer;
  font-family: inherit; line-height: 1;
  background: ${({ $variant, theme }) => $variant === 'confirm' ? theme.colors.success + '20' : theme.colors.danger + '15'};
  color: ${({ $variant, theme }) => $variant === 'confirm' ? theme.colors.success : theme.colors.danger};
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const CommentText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
  line-height: 1.6;
`;

export const ReplyBtn = styled.button`
  display: inline-flex; align-items: center; gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none; border: none; padding: 0; cursor: pointer; font-family: inherit;
  &:hover { opacity: 0.8; }
`;

export const ReplyInputWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  display: flex; gap: ${({ theme }) => theme.spacing[2]};
`;

export const ReplyInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
`;

export const RepliesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing[3]};
`;

export const ReplyItem = styled.div`
  display: flex; align-items: flex-start; gap: ${({ theme }) => theme.spacing[2]};
  position: relative;
`;

export const ReplyThreadLine = styled.div`
  position: absolute;
  top: 28px; bottom: -12px;
  inset-inline-start: 13px;
  width: 2px;
  background: ${({ theme }) => theme.colors.border};
  &:last-child { display: none; }
`;

export const ReplyAvatar = styled.div`
  width: 28px; height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex; align-items: center; justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 10px; color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0; overflow: hidden; z-index: 1;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const ReplyContent = styled.div`
  flex: 1; min-width: 0;
`;

export const ReplyHeader = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing[2]};
`;

export const ReplyName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ReplyTime = styled.span`
  font-size: 10px; color: ${({ theme }) => theme.colors.textMuted};
`;

export const ReplyActions = styled.div`
  margin-inline-start: auto;
  display: flex; align-items: center; gap: 1px;
`;

export const ReplyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 2px 0 0; line-height: 1.5;
`;

export const EditReplyWrap = styled.div`
  display: flex; align-items: center; gap: 4px; margin-top: 4px;
`;

export const EditReplyInput = styled.input`
  flex: 1; min-width: 0;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const EditReplyBtns = styled.div`
  display: flex; align-items: center; gap: 2px;
`;

export const SkeletonCard = styled.div`
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.bgTertiary};
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
`;

export const OldPrice = styled.span`
  text-decoration: line-through; color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

export const Note = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: ${({ theme }) => theme.spacing[2]} 0 0;
`;

export const ChartCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  min-height: 280px;
`;

export const LtrChartWrap = styled.div`
  direction: ltr;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    max-width: 100%;
    overflow-x: auto;
  }
`;

export const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
`;

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: ${({ theme }) => theme.spacing[8]} 0 ${({ theme }) => theme.spacing[4]};
`;

export const EmptyMiniData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 230px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;

  @media (max-width: 600px) {
    width: 90vw;
    padding: 16px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]};
`;

export const StatsRow = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

export const StatBox = styled.div`
  flex: 1; min-width: 140px;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
`;

export const ReviewStatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const DistBar = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  &:not(:last-child) { margin-bottom: 3px; }
`;

export const DistFill = styled.div`
  flex: 1; height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.bgTertiary};
  overflow: hidden;
`;

export const DistInner = styled.div`
  height: 100%;
  border-radius: 3px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.colors.accent};
  transition: width 0.3s;
`;
