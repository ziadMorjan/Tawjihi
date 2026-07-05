import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

/* ─── Keyframes ─── */
export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

export const tickIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
`;

/* Hero */
export const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

export const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) =>
    theme.colors.bgPrimary === '#FFFFFF'
      ? 'radial-gradient(ellipse 80% 60% at 60% -10%, rgba(27,79,216,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(124,58,237,0.08) 0%, transparent 50%)'
      : 'radial-gradient(ellipse 80% 60% at 60% -10%, rgba(27,79,216,0.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(124,58,237,0.14) 0%, transparent 50%)'
  };
  pointer-events: none;
`;

export const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]} ${theme.spacing[12]}`};
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: ${({ theme }) => theme.spacing[16]};
  align-items: center;
  position: relative;
  width: 100%;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[4]} ${theme.spacing[8]}`};
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const HeroBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  width: fit-content;
`;

export const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  letter-spacing: -0.02em;

  ${({ theme }) => theme.media.maxMd} {
    font-size: 2.5rem;
  }
`;

export const HeroHighlight = styled.span`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
`;

export const HeroSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 520px;

  ${({ theme }) => theme.media.maxMd} { max-width: 100%; }
`;

export const HeroActions = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    justify-content: flex-start;
  }
`;

export const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px ${({ theme }) => theme.colors.primary}40;
  }
`;

export const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  background: ${({ theme }) => theme.colors.bgTertiary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export const StatsRow = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    gap: ${({ theme }) => theme.spacing[5]};
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StatNumber = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

/* Clock */
export const ClockWidget = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[5]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  position: absolute;
  bottom: -20px;
  left: -30px;
  html[dir="ltr"] & {
    left: auto;
    right: -30px;
  }
  z-index: 10;
  min-width: 180px;

  ${({ theme }) => theme.media.maxMd} { display: none; }
`;

export const ClockLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const ClockTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  direction: ltr;
`;

export const ClockDigit = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 4px 8px;
  min-width: 52px;
  text-align: center;
  animation: ${tickIn} 0.3s ease;
`;

export const ClockSeparator = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ClockDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

/* Slider Visual */
export const HeroVisual = styled.div`
  position: relative;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.media.maxMd} { display: none; }
`;

export const SlideCanvas = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

export const SlideInner = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ gradient }) => gradient};
  color: white;
  text-align: center;
`;

export const SlideIcon = styled.div`
  opacity: 0.9;
  animation: ${float} 6s ease-in-out infinite;
`;

export const SlideTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

export const SlideSub = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
`;

export const SliderDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

export const Dot = styled.button`
  width: ${({ $active }) => ($active ? '24px' : '8px')};
  height: 8px;
  border-radius: 999px;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const SliderArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $right }) => $right ? 'right: -16px;' : 'left: -16px;'}
  z-index: 20;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-50%) scale(1.1);
  }
`;

/* Sections */
export const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[4]}`};
  }
`;

export const AltBg = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[10]};
  gap: ${({ theme }) => theme.spacing[4]};

  ${({ theme }) => theme.media.maxSm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SectionTag = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

/* Features */
export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}44;
    box-shadow: 0 20px 40px ${({ theme }) => theme.colors.primary}11;
    transform: translateY(-6px);

    &::before { opacity: 1; }
  }
`;

export const FeatureIconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

export const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

export const FeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

/* Teachers */
export const TeachersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const TeacherCard = styled(motion.div)`
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
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 12px 28px ${({ theme }) => theme.colors.primary}20;
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
  position: relative;

  img { width: 100%; height: 100%; object-fit: cover; }
  span { font-size: 28px; font-weight: 700; color: ${({ theme }) => theme.colors.primary}; }
`;

export const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* CTA */
export const CTASection = styled.section`
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  text-align: center;
  background: ${({ theme }) => theme.colors.primary};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 80% at 50% 110%, rgba(255,255,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

export const CTAInner = styled(motion.div)`
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.2;

  ${({ theme }) => theme.media.maxMd} {
    font-size: 2rem;
  }
`;

export const CTASub = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: rgba(255,255,255,0.85);
  margin: 0;
  max-width: 480px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const CTAActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`;

export const CTAPrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.2);
  }
`;

export const CTASecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  background: rgba(255,255,255,0.15);
  color: white;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255,255,255,0.25);
    transform: translateY(-2px);
  }
`;
