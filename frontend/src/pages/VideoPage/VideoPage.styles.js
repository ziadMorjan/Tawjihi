import styled, { css } from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgSecondary};
  display: flex;
  flex-direction: column;
`;

/* ─── Header ─── */
export const VideoHeader = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const VideoTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;

  ${({ theme }) => theme.media.maxMd} {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

export const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const NavHint = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgTertiary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  ${({ theme }) => theme.media.maxSm} {
    display: none;
  }
`;

/* ─── Main Layout ─── */
export const ContentWrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[6]};
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: start;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const PlayerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

/* ─── Video Player ─── */
export const PlayerWrapper = styled.div`
  background: #000;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  aspect-ratio: 16/9;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    outline: none;
  }
`;

export const NoVideoPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ─── Playlist ─── */
export const PlaylistWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.media.maxMd} {
    position: static;
    max-height: 400px;
  }
`;

export const PlaylistHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const PlaylistTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

export const PlaylistCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgTertiary};
  padding: ${({ theme }) => `2px ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

export const PlaylistScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[2]};

  /* Scrollbar */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 999px;
  }
`;

export const LessonItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: none;
  background: transparent;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: right;
  font-family: ${({ theme }) => theme.typography.fontFamily.base};

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }

  ${({ $active, theme }) => $active && css`
    background: ${theme.colors.primaryLight};
    &:hover { background: ${theme.colors.primaryLight}; }
  `}
`;

export const LessonNumber = styled.span`
  min-width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.bgTertiary
  };
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textMuted
  };
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: ${({ theme }) => theme.transitions.fast};
`;

export const LessonInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const LessonTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.regular
  };
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textPrimary
  };
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LessonDuration = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* ─── Nav Buttons ─── */
export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};

  ${({ theme }) => theme.media.maxSm} {
    flex-direction: column;
  }
`;

/* ─── Reviews ─── */
export const ReviewsSection = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const ReviewsTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`;

export const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const ReviewAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
`;

export const ReviewerName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ReviewText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

export const AddReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

/* ─── Empty / Error States ─── */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  text-align: center;

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;