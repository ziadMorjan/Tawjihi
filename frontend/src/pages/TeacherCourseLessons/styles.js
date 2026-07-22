import styled, { keyframes, css } from 'styled-components';

// ── Animations ────────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Page ──────────────────────────────────────────────────────────────────────
export const PageInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
  animation: ${fadeIn} 0.35s ease;

  @media (max-width: 600px) {
    padding: 16px 12px;
  }
`;

// ── Page Header ───────────────────────────────────────────────────────────────
export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: 1.3;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 600px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

export const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

// ── Unsaved Order Banner ───────────────────────────────────────────────────────
export const UnsavedBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.warning[50]};
  border: 1px solid ${({ theme }) => theme.colors.warning[500]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  animation: ${slideDown} 0.25s ease;

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.warning[600]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

// ── Lesson List ───────────────────────────────────────────────────────────────
export const LessonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// ── Sortable Lesson Card ──────────────────────────────────────────────────────
export const LessonCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1.5px solid ${({ $isDragging, theme }) =>
    $isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: ${({ $isDragging, theme }) =>
    $isDragging
      ? `0 12px 28px rgba(13, 127, 163, 0.18), 0 0 0 2px ${theme.colors.primary}`
      : theme.shadows.card};
  transform: ${({ $isDragging }) => ($isDragging ? 'scale(1.02)' : 'scale(1)')};
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'default')};
  user-select: none;

  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.spacing[2]};
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  }
`;

// Drag handle
export const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.colors.textTertiary};
  cursor: grab;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  flex-shrink: 0;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:active { cursor: grabbing; }
`;

// Order number badge
export const OrderBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`;

export const LessonInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const LessonName = styled.p`
  margin: 0 0 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

export const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'duration':
        return css`
          background: ${theme.colors.bgSecondary};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
      case 'free':
        return css`
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        `;
      default:
        return '';
    }
  }}
`;

export const LessonActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  flex-shrink: 0;
`;

export const ActionIconBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger[500] : theme.colors.textSecondary)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger[50] : theme.colors.primaryLight};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger[600] : theme.colors.primary};
    border-color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger[500] : theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[4]}`};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg { opacity: 0.35; }

  h3 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    max-width: 300px;
  }
`;

// ── Skeleton ──────────────────────────────────────────────────────────────────
const shimmerGradient = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgSecondary} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.bgSecondary} 75%
  );
  background-size: 200% auto;
  animation: ${shimmer} 1.4s linear infinite;
`;

export const SkeletonCard = styled.div`
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  ${shimmerGradient}
`;

// ── Modal ─────────────────────────────────────────────────────────────────────
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]};
  animation: ${fadeIn} 0.25s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};

  span { color: ${({ theme }) => theme.colors.danger[500]}; margin-inline-start: 2px; }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1.5px solid ${({ $error, theme }) => ($error ? theme.colors.danger[500] : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &[type='file'] {
    padding: ${({ theme }) => theme.spacing[2]};
    cursor: pointer;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1.5px solid ${({ $error, theme }) => ($error ? theme.colors.danger[500] : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const HintText = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger[500]};
`;

// ── Upload Progress Bar ───────────────────────────────────────────────────────
export const UploadWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const ProgressBarInner = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

export const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

export const ResourceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;

  .info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const ProgressBarTrack = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, #0ea5e9);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.3s ease;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ── Free Preview Toggle ────────────────────────────────────────────────────────
export const ToggleRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  cursor: pointer;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1.5px solid ${({ $checked, theme }) => ($checked ? theme.colors.primary : theme.colors.border)};
  background: ${({ $checked, theme }) => ($checked ? theme.colors.primaryLight : theme.colors.bgPrimary)};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ToggleCheckbox = styled.input`
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  flex-shrink: 0;
`;

export const ToggleTextWrap = styled.div``;

export const ToggleLabel = styled.p`
  margin: 0 0 2px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ToggleHint = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// ── Form Actions ──────────────────────────────────────────────────────────────
export const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// ── Confirm Delete Inline ──────────────────────────────────────────────────────
export const ConfirmRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  animation: ${slideDown} 0.2s ease;
`;

export const ConfirmText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.danger[500]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;
