import { useNavigate }        from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Award, Star,
   Target, Clock, ChevronLeft, ChevronRight,
  GraduationCap, TrendingUp, Shield,
} from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { useState, useEffect, useCallback }  from 'react';
import { MainLayout }    from '../../shared/components/layout/MainLayout';
import { CoursesGrid }   from '../../components/CoursesGrid';
import { Button } from '../../shared/components';
import useCourses        from '../../features/courses/hooks/useCourses';
import { useTeachers }   from '../../features/teachers';

/* ─── Keyframes ─── */
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const tickIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
`;

/* ─── Animations ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:   (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, transition: { duration: 0.45 } }),
};

const heroSlides = [
  {
    badge: 'منصة كورسات التوجيهي',
    title: 'استعد لتوجيهيك مع',
    highlight: 'أفضل المعلمين',
    sub: 'كورسات شاملة لجميع مواد التوجيهي، شروحات مفصلة وتمارين تساعدك على الفهم الحقيقي.',
    gradient: 'linear-gradient(145deg, #0B6B8A 0%, #0a4f68 100%)',
    icon: <GraduationCap size={80} strokeWidth={1.2} />,
    accent: '#0B6B8A',
  },
  {
    badge: 'تعلّم في أي وقت ومن أي مكان',
    title: 'محتوى تعليمي',
    highlight: 'متاح ٢٤ ساعة',
    sub: 'وصول كامل لجميع الدروس والمحاضرات عند اشتراكك، ابدأ الآن واستثمر وقتك بذكاء.',
    gradient: 'linear-gradient(145deg, #0f6b4a 0%, #0a4f36 100%)',
    icon: <Clock size={80} strokeWidth={1.2} />,
    accent: '#0f6b4a',
  },
  {
    badge: 'معلمون خبراء ومتميزون',
    title: 'تعلّم من',
    highlight: 'أساتذة متخصصين',
    sub: 'نخبة من معلمي التوجيهي في فلسطين يقدمون المادة بأسلوب واضح وسهل الفهم.',
    gradient: 'linear-gradient(145deg, #8a5a0b 0%, #6b4208 100%)',
    icon: <TrendingUp size={80} strokeWidth={1.2} />,
    accent: '#8a5a0b',
  },
];

/* ─── Styled Components ─── */

/* Hero */
const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) =>
    theme.colors.bgPrimary === '#FFFFFF'
      ? 'radial-gradient(ellipse 80% 60% at 60% -10%, rgba(27,79,216,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(124,58,237,0.08) 0%, transparent 50%)'
      : 'radial-gradient(ellipse 80% 60% at 60% -10%, rgba(27,79,216,0.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 0% 80%, rgba(124,58,237,0.14) 0%, transparent 50%)'
  };
  pointer-events: none;
`;



const HeroInner = styled.div`
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

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const HeroBadge = styled(motion.div)`
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

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  letter-spacing: -0.02em;

  ${({ theme }) => theme.media.maxMd} {
    font-size: 2.5rem;
  }
`;

const HeroHighlight = styled.span`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 520px;

  ${({ theme }) => theme.media.maxMd} { max-width: 100%; }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    justify-content: flex-start;
  }
`;

const PrimaryBtn = styled.button`
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

const SecondaryBtn = styled.button`
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

const StatsRow = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    gap: ${({ theme }) => theme.spacing[5]};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatNumber = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

/* Clock */
const ClockWidget = styled(motion.div)`
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
  z-index: 10;
  min-width: 180px;

  ${({ theme }) => theme.media.maxMd} { display: none; }
`;

const ClockLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const ClockTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ClockDigit = styled.span`
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

const ClockSeparator = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ClockDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;



/* Slider Visual */
const HeroVisual = styled.div`
  position: relative;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.media.maxMd} { display: none; }
`;

const SlideCanvas = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const SlideInner = styled(motion.div)`
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

const SlideIcon = styled.div`
  opacity: 0.9;
  animation: ${float} 6s ease-in-out infinite;
`;

const SlideTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const SlideSub = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
`;

const SliderDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const Dot = styled.button`
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

const SliderArrow = styled.button`
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
const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[4]}`};
  }
`;

const AltBg = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const SectionHeader = styled.div`
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

const SectionTag = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

/* Features */
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
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

const FeatureIconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const FeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

/* Teachers */
const TeachersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
`;

const TeacherCard = styled(motion.div)`
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

const TeacherAvatar = styled.div`
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

const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* CTA */
const CTASection = styled.section`
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

const CTAInner = styled(motion.div)`
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.2;

  ${({ theme }) => theme.media.maxMd} {
    font-size: 2rem;
  }
`;

const CTASub = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: rgba(255,255,255,0.85);
  margin: 0;
  max-width: 480px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const CTAActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`;

const CTAPrimaryBtn = styled.button`
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

const CTASecondaryBtn = styled.button`
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

/* ─── Clock Hook ─── */
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  const raw   = time.getHours();
  const ampm  = raw >= 12 ? 'م' : 'ص';
  const hours12 = raw % 12 || 12;

  return {
    hours:   pad(hours12),
    minutes: pad(time.getMinutes()),
    seconds: pad(time.getSeconds()),
    ampm,
    dateStr: `${dayNames[time.getDay()]}، ${time.getDate()} ${monthNames[time.getMonth()]}`,
  };
}

/* ─── Component ─── */
export default function Home() {
  const navigate = useNavigate();
  const clock = useClock();

  const { data: rawData, isLoading: coursesLoading } = useCourses({ limit: 8 });
  const { data: teachersData } = useTeachers({ limit: 6 });

  const courses  = rawData?.data?.docs ?? rawData?.data ?? [];
  const teachers = teachersData?.teachers ?? [];

  /* Slider state */
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);

  const goTo = useCallback((next) => {
    setDirection(next > slide ? 1 : -1);
    setSlide(next);
  }, [slide]);

  const goNext = useCallback(() => goTo((slide + 1) % heroSlides.length), [slide, goTo]);
  const goPrev = useCallback(() => goTo((slide - 1 + heroSlides.length) % heroSlides.length), [slide, goTo]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, [autoplay, goNext]);

  const currentSlide = heroSlides[slide];

  const features = [
    {
      icon: <BookOpen size={26} />,
      title: 'محتوى شامل ومتكامل',
      desc: 'كورسات تغطي جميع مواد التوجيهي مع شروحات مفصلة ومسائل محلولة خطوة بخطوة',
    },
    {
      icon: <Target size={26} />,
      title: 'منهجية تعليمية مركزة',
      desc: 'تعلّم بأسلوب مدروس يوفر وقتك ويضمن استيعابك الكامل للمادة بأقل جهد',
    },
    {
      icon: <Shield size={26} />,
      title: 'متابعة فورية مضمونة',
      desc: 'تواصل مع المعلمين وأجب عن أسئلتك في أي وقت، دعم مستمر طوال رحلتك',
    },
  ];

  return (
    <MainLayout>

      {/* ══════════════ HERO ══════════════ */}
      <HeroSection>
        <HeroBg />

        <HeroInner>
          {/* Left: Content */}
          <HeroContent
            as={motion.div}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <HeroBadge variants={fadeUp}>
              <Award size={14} />
              {currentSlide.badge}
            </HeroBadge>

            <motion.div variants={fadeUp}>
              <HeroTitle>
                {currentSlide.title}
                <HeroHighlight>{currentSlide.highlight}</HeroHighlight>
              </HeroTitle>
            </motion.div>

            <HeroSubtitle variants={fadeUp}>
              {currentSlide.sub}
            </HeroSubtitle>

            <HeroActions variants={fadeUp}>
              <PrimaryBtn onClick={() => navigate('/courses')}>
                <ArrowLeft size={18} />
                تصفح الكورسات
              </PrimaryBtn>
              <SecondaryBtn onClick={() => navigate('/auth/register')}>
                ابدأ مجاناً
              </SecondaryBtn>
            </HeroActions>

            <StatsRow variants={fadeUp}>
              {[
                { value: 'جميع المواد', label: 'رياضيات، فيزياء، كيمياء والمزيد' },
                { value: 'شرح مفصّل', label: 'خطوة بخطوة مع تمارين' },
                { value: 'معلمون متخصصون', label: 'خبرة حقيقية في التوجيهي' },
              ].map(stat => (
                <StatItem key={stat.label}>
                  <StatNumber>{stat.value}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </StatsRow>
          </HeroContent>

          {/* Right: Swiper Visual */}
          <HeroVisual>
            {/* Arrow prev */}
            <SliderArrow onClick={() => { goPrev(); setAutoplay(false); }}>
              <ChevronRight size={18} />
            </SliderArrow>

            <SlideCanvas
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              <AnimatePresence custom={direction} initial={false}>
                <SlideInner
                  key={slide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  gradient={currentSlide.gradient}
                >
                  <SlideIcon>{currentSlide.icon}</SlideIcon>
                  <SlideTitle>{currentSlide.highlight}</SlideTitle>
                  <SlideSub>{currentSlide.sub}</SlideSub>

                  <SliderDots>
                    {heroSlides.map((_, i) => (
                      <Dot
                        key={i}
                        $active={i === slide}
                        onClick={() => { goTo(i); setAutoplay(false); }}
                      />
                    ))}
                  </SliderDots>
                </SlideInner>
              </AnimatePresence>
            </SlideCanvas>

            {/* Arrow next */}
            <SliderArrow $right onClick={() => { goNext(); setAutoplay(false); }}>
              <ChevronLeft size={18} />
            </SliderArrow>

            {/* Clock Widget */}
            <ClockWidget
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <ClockLabel>
                <Clock size={12} style={{ display: 'inline', marginLeft: 4 }} />
                الوقت الحالي
              </ClockLabel>
              <ClockTime>
                <ClockDigit key={`s-${clock.seconds}`}>{clock.seconds}</ClockDigit>
                <ClockSeparator>:</ClockSeparator>
                <ClockDigit key={`m-${clock.minutes}`}>{clock.minutes}</ClockDigit>
                <ClockSeparator>:</ClockSeparator>
                <ClockDigit key={`h-${clock.hours}`}>{clock.hours}</ClockDigit>
              </ClockTime>
              <ClockDate>{clock.ampm} — {clock.dateStr}</ClockDate>
            </ClockWidget>
          </HeroVisual>
        </HeroInner>
      </HeroSection>

      {/* ══════════════ FEATURES ══════════════ */}
      <AltBg>
        <Section>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader>
                <div>
                  <SectionTag>مميزاتنا</SectionTag>
                  <SectionTitle>ليش تختار توجيهي؟</SectionTitle>
                  <SectionSubtitle>كل ما تحتاجه للتحضير للتوجيهي في مكان واحد</SectionSubtitle>
                </div>
              </SectionHeader>
            </motion.div>

            <FeaturesGrid>
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <FeatureCard>
                    <FeatureIconWrap>{f.icon}</FeatureIconWrap>
                    <FeatureTitle>{f.title}</FeatureTitle>
                    <FeatureDesc>{f.desc}</FeatureDesc>
                  </FeatureCard>
                </motion.div>
              ))}
            </FeaturesGrid>
          </motion.div>
        </Section>
      </AltBg>

      {/* ══════════════ LATEST COURSES ══════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeIn}
      >
        <Section>
          <SectionHeader>
            <div>
              <SectionTag>أحدث ما أضفناه</SectionTag>
              <SectionTitle>أحدث الكورسات</SectionTitle>
              <SectionSubtitle>اكتشف كورسات جديدة أضافها معلمونا مؤخراً</SectionSubtitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/courses')}
            >
              عرض الكل
            </Button>
          </SectionHeader>

          <CoursesGrid courses={courses} isLoading={coursesLoading} />
        </Section>
      </motion.div>

      {/* ══════════════ TEACHERS ══════════════ */}
      {teachers.length > 0 && (
        <AltBg>
          <Section>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.div variants={fadeUp}>
                <SectionHeader>
                  <div>
                    <SectionTag>نخبة المعلمين</SectionTag>
                    <SectionTitle>معلمونا</SectionTitle>
                    <SectionSubtitle>نخبة من أفضل معلمي التوجيهي في فلسطين</SectionSubtitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowLeft size={16} />}
                    onClick={() => navigate('/teachers')}
                  >
                    جميع المعلمين
                  </Button>
                </SectionHeader>
              </motion.div>

              <TeachersRow>
                {teachers.map((teacher, i) => (
                  <motion.div key={teacher._id} variants={fadeUp}>
                    <TeacherCard
                      onClick={() => navigate(`/teachers/${teacher._id}`)}
                      whileHover={{ y: -4 }}
                    >
                      <TeacherAvatar>
                        {teacher.coverImage
                          ? <img src={teacher.coverImage} alt={teacher.name} />
                          : <span>{teacher.name?.charAt(0)?.toUpperCase()}</span>
                        }
                      </TeacherAvatar>
                      <TeacherName>{teacher.name}</TeacherName>
                      {teacher.averageRating > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={12} fill="#F59E0B" color="#F59E0B" />
                          <span style={{ fontSize: 12, color: '#94A3B8' }}>
                            {teacher.averageRating?.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </TeacherCard>
                  </motion.div>
                ))}
              </TeachersRow>
            </motion.div>
          </Section>
        </AltBg>
      )}

      {/* ══════════════ CTA ══════════════ */}
      <CTASection>
        <CTAInner
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <CTATitle>جاهز تبدأ تحضيرك للتوجيهي؟</CTATitle>
          </motion.div>
          <motion.div variants={fadeUp}>
            <CTASub>
              اشترك الآن واستفد من كورسات توجيهي مع أفضل المعلمين في فلسطين
            </CTASub>
          </motion.div>
          <motion.div variants={fadeUp}>
            <CTAActions>
              <CTAPrimaryBtn onClick={() => navigate('/auth/register')}>
                <GraduationCap size={18} />
                إنشاء حساب مجاني
              </CTAPrimaryBtn>
              <CTASecondaryBtn onClick={() => navigate('/courses')}>
                <ArrowLeft size={18} />
                تصفح الكورسات
              </CTASecondaryBtn>
            </CTAActions>
          </motion.div>
        </CTAInner>
      </CTASection>

    </MainLayout>
  );
}