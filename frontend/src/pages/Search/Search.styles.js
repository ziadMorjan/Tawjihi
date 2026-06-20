import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  min-height: 80vh;

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

export const SearchHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const SearchTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SearchMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── Tabs ── */
export const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0;
`;

export const Tab = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[5]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-family: inherit;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textMuted};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TabCount = styled.span`
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.bgTertiary};
  color: ${({ $active }) => $active ? '#fff' : 'inherit'};
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 7px;
  transition: all 0.2s;
`;

/* ── Section title ── */
export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  svg { color: ${({ theme }) => theme.colors.primary}; }
`;

/* ── Courses grid ── */
export const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};
`;

/* ── Teachers grid ── */
export const TeachersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};
`;

export const TeacherCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 12px 28px ${({ theme }) => theme.colors.primary}18;
    transform: translateY(-4px);
  }
`;

export const TeacherAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.primaryLight};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img  { width: 100%; height: 100%; object-fit: cover; }
  span { font-size: 28px; font-weight: 700; color: ${({ theme }) => theme.colors.primary}; }
`;

export const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TeacherRole = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── Empty / no-query state ── */
export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  max-width: 360px;
`;

/* ── Skeleton ── */
export const SkeletonCard = styled.div`
  background: linear-gradient(90deg,
    ${({ theme }) => theme.colors.bgSecondary} 25%,
    ${({ theme }) => theme.colors.bgTertiary} 50%,
    ${({ theme }) => theme.colors.bgSecondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  height: ${({ $h }) => $h || '200px'};
`;
