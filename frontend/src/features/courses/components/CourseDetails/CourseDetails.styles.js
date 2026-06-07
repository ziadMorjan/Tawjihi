import styled from 'styled-components';

export const PageWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  min-height: 100vh;
`;

export const HeroSection = styled.div`
  background: linear-gradient(160deg, #0B1120 0%, #162044 50%, #1A1B4B 100%);
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]} ${theme.spacing[12]}`};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 0% 30%, rgba(37, 99, 235, 0.12) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 100% 70%, rgba(139, 92, 246, 0.10) 0%, transparent 70%);
    pointer-events: none;
  }

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[4]} ${theme.spacing[8]}`};
  }
`;

export const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: start;
  position: relative;
  z-index: 1;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const CourseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

export const CourseTitle = styled.h1`
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

export const CourseDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.8;
  max-width: 640px;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);

  svg { opacity: 0.9; }
`;

export const TeacherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  background: rgba(255, 255, 255, 0.05);
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: fit-content;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

export const TeacherAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.3);

  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`;

export const TeacherLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
  letter-spacing: 0.3px;
`;

export const PurchaseCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 88px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 30px 60px -12px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  ${({ theme }) => theme.media.maxMd} {
    position: static;
    margin-top: ${({ theme }) => theme.spacing[6]};
  }
`;

export const CardImage = styled.div`
  aspect-ratio: 16 / 9;
  background: ${({ theme }) => theme.colors.bgTertiary};
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${PurchaseCard}:hover & img {
    transform: scale(1.04);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.15));
    pointer-events: none;
  }
`;

export const CardBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${({ $variant }) =>
    $variant === 'free'
      ? 'linear-gradient(135deg, #16A34A, #15803D)'
      : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  z-index: 2;
  letter-spacing: 0.3px;
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
  flex-wrap: wrap;
`;

export const CurrentPrice = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

export const OldPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.successLight};
  padding: 3px 8px;
  border-radius: 6px;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing[1]} 0;
`;

export const IncludesLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.3px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const WishlistBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid ${({ $active, theme }) => $active ? '#E11D48' : theme.colors.border};
  background: ${({ $active }) => $active ? '#FFF1F2' : 'transparent'};
  color: ${({ $active }) => $active ? '#E11D48' : '#94A3B8'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ $active }) => $active ? '#E11D48' : '#2563EB'};
    color: ${({ $active }) => $active ? '#E11D48' : '#2563EB'};
    background: ${({ $active }) => $active ? '#FFF1F2' : '#EFF6FF'};
  }
`;

export const ContentArea = styled.div`
  max-width: 1200px;
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
  gap: ${({ theme }) => theme.spacing[10]};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SectionText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
`;

export const LoadingWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ErrorWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
`;
