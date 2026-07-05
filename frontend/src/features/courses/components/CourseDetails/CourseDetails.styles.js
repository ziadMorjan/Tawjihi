import styled from 'styled-components';

export const PageWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  min-height: 100vh;
`;

/* ─── Hero ─── */
export const HeroSection = styled.div`
  background: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[4]}`};
  }
`;

export const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: start;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  padding-top: ${({ theme }) => theme.spacing[4]};
`;

export const CourseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

export const CourseTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  ${({ theme }) => theme.media.maxMd} {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

export const CourseDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: rgba(255,255,255,0.75);
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 600px;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  padding: ${({ theme }) => `${theme.spacing[4]} 0`};
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255,255,255,0.75);
  svg { flex-shrink: 0; }
`;

export const TeacherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(255,255,255,0.08);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: fit-content;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255,255,255,0.12);
  }
`;

export const TeacherAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const TeacherMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TeacherLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: rgba(255,255,255,0.5);
`;

export const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: rgba(255,255,255,0.9);
`;

/* ─── Purchase Card ─── */
export const PurchaseCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0,0,0,0.3);
  position: sticky;
  top: 80px;

  ${({ theme }) => theme.media.maxMd} {
    position: static;
    margin-top: ${({ theme }) => theme.spacing[6]};
  }
`;

export const CardImage = styled.div`
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.bgTertiary};
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

export const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const OldPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.successLight};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

/* ─── Content Area ─── */
export const ContentArea = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[6]}`};
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: start;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

export const Section = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const SectionText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

/* ─── Sidebar Sticky ─── */
export const SidebarSticky = styled.div`
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  ${({ theme }) => theme.media.maxMd} {
    display: none;
  }
`;

export const InstructorCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[5]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const InstructorTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InstructorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  cursor: pointer;

  &:hover h4 {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const InstructorAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const InstructorName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: ${({ theme }) => theme.transitions.fast};
`;

export const InstructorRole = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;



export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

export const SectionIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`;