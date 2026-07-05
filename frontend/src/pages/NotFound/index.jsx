import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../constants';
import { motion }      from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Home, ArrowLeft, BookOpen, Search } from 'lucide-react';

/* ─── Keyframes ─── */
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-18px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.05); }
`;

const orbit = keyframes`
  from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
`;

const orbitReverse = keyframes`
  from { transform: rotate(0deg) translateX(75px) rotate(0deg); }
  to   { transform: rotate(-360deg) translateX(75px) rotate(360deg); }
`;

const scanline = keyframes`
  0%   { top: 0; opacity: 0.5; }
  50%  { opacity: 1; }
  100% { top: 100%; opacity: 0.5; }
`;

/* ─── Styled Components ─── */
const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgPrimary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
  position: relative;
  overflow: hidden;
  text-align: center;
`;

/* خلفية هندسية بنقاط */
const BgDots = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.border} 1px,
    transparent 1px
  );
  background-size: 32px 32px;
  opacity: 0.5;
  pointer-events: none;
`;

/* دوائر توهج في الخلفية */
const GlowCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;

  &.top-right {
    width: 500px;
    height: 500px;
    top: -180px;
    right: -120px;
    background: ${({ theme }) => theme.colors.primaryLight};
    animation: ${pulse} 5s ease-in-out infinite;
  }

  &.bottom-left {
    width: 400px;
    height: 400px;
    bottom: -140px;
    left: -100px;
    background: ${({ theme }) => theme.colors.accentLight};
    animation: ${pulse} 7s ease-in-out infinite 1s;
  }
`;

/* الرقم الضخم */
const BigNumber = styled.div`
  position: relative;
  font-size: clamp(7rem, 18vw, 14rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.05em;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.accent} 60%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

/* أيقونة "صفحة فارغة" تطفو داخل الـ 404 */
const FloatingIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FloatingSearch = styled.div`
  animation: ${float} 4s ease-in-out infinite;
  opacity: 0.12;
  svg { width: clamp(60px, 10vw, 100px); height: auto; }
  color: ${({ theme }) => theme.colors.primary};
`;

/* حلقة تدور حول الرقم */
const OrbitRing = styled.div`
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;

  &.inner {
    width: 170px;
    height: 170px;
  }
`;

const OrbitDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  margin: -6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  animation: ${orbit} 6s linear infinite;
`;

const OrbitDotSmall = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.accent};
  animation: ${orbitReverse} 4s linear infinite;
`;

/* Visual wrapper */
const VisualWrap = styled.div`
  position: relative;
  width: 260px;
  height: 260px;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.media.maxMd} {
    width: 180px;
    height: 180px;
  }
`;

/* مربع terminal يحاكي خطأ نظام */
const TerminalBox = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[5]};
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: left;
  direction: ltr;
  max-width: 380px;
  width: 100%;
  margin: 0 auto ${({ theme }) => theme.spacing[8]};
  position: relative;
  overflow: hidden;

  /* خط مسح يتحرك */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}66, transparent);
    animation: ${scanline} 3s linear infinite;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TerminalDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: inline-block;
`;

const TerminalLine = styled.p`
  margin: 4px 0;
  color: ${({ $color, theme }) => $color || theme.colors.textMuted};
  font-size: 0.78rem;

  span { color: ${({ theme }) => theme.colors.primary}; }
`;

/* عنوان + وصف */
const Heading = styled(motion.h1)`
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
  letter-spacing: -0.02em;
`;

const Sub = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 420px;
  margin: 0 auto ${({ theme }) => theme.spacing[8]};
`;

/* أزرار */
const Actions = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px ${({ theme }) => theme.colors.primary}44;
  }
`;

const GhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
  }
`;

/* Quick links */
const QuickLinks = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[10]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  max-width: 480px;
`;

const QuickLink = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/* ─── Animations ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Component ─── */
export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <PageWrap>
      <BgDots />
      <GlowCircle className="top-right" />
      <GlowCircle className="bottom-left" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* ── الرقم الضخم + حلقات مدارية ── */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <VisualWrap>
            <OrbitRing />
            <OrbitRing className="inner" />
            <OrbitDot />
            <OrbitDotSmall />

            <BigNumber>
              404
              <FloatingIcon>
                <FloatingSearch>
                  <Search />
                </FloatingSearch>
              </FloatingIcon>
            </BigNumber>
          </VisualWrap>
        </motion.div>

        {/* ── Terminal ── */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <TerminalBox>
            <TerminalHeader>
              <TerminalDot color="#FF5F57" />
              <TerminalDot color="#FEBC2E" />
              <TerminalDot color="#28C840" />
            </TerminalHeader>
            <TerminalLine $color="#8B949E">$ tawjihi navigate --path /unknown-route</TerminalLine>
            <TerminalLine $color="#F85149">✗ Error: Route not found (404)</TerminalLine>
            <TerminalLine>→ The page you requested does not exist.</TerminalLine>
            <TerminalLine $color="#3FB950">
              ✓ Suggestion: <span>tawjihi go --home</span>
            </TerminalLine>
          </TerminalBox>
        </motion.div>

        {/* ── Heading ── */}
        <Heading
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {t('common.notFound')}
        </Heading>

        <Sub
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
        >
          {t('search.noResultsSub')}
        </Sub>

        {/* ── Buttons ── */}
        <Actions
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          <PrimaryBtn onClick={() => navigate(PATH.home)}>
            <Home size={18} />
            {t('nav.home')}
          </PrimaryBtn>
          <GhostBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            {t('common.back')}
          </GhostBtn>
        </Actions>

        {/* ── Quick Links ── */}
        <QuickLinks
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
        >
          <QuickLink onClick={() => navigate(PATH.courses)}>
            <BookOpen size={14} />
            {t('nav.courses')}
          </QuickLink>
          <QuickLink onClick={() => navigate(PATH.teachers)}>
            <Search size={14} />
            {t('nav.teachers')}
          </QuickLink>
          <QuickLink onClick={() => navigate(PATH.login)}>
            <ArrowLeft size={14} />
            {t('nav.login')}
          </QuickLink>
        </QuickLinks>
      </motion.div>
    </PageWrap>
  );
}
