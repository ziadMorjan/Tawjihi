import { useNavigate }        from 'react-router-dom';
import { useTranslation }    from 'react-i18next';
import { PATH }              from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Award, Star,
   Target, Clock, ChevronLeft, ChevronRight,
  GraduationCap, TrendingUp, Shield,
} from 'lucide-react';
import { useState, useEffect, useCallback }  from 'react';
import { MainLayout }    from '../../shared/components/layout/MainLayout';
import { CoursesGrid }   from '../../components/CoursesGrid';
import { Button } from '../../shared/components';
import useCourses        from '../../features/courses/hooks/useCourses';
import { useTeachers }   from '../../features/teachers';
import {
  HeroSection, HeroBg, HeroInner, HeroContent, HeroBadge,
  HeroTitle, HeroHighlight, HeroSubtitle, HeroActions,
  PrimaryBtn, SecondaryBtn, StatsRow, StatItem, StatNumber, StatLabel,
  ClockWidget, ClockLabel, ClockTime, ClockDigit, ClockSeparator, ClockDate,
  HeroVisual, SlideCanvas, SlideInner, SlideIcon, SlideTitle, SlideSub,
  SliderDots, Dot, SliderArrow,
  Section, AltBg, SectionHeader, SectionTag, SectionTitle,
  FeaturesGrid, FeatureCard, FeatureIconWrap, FeatureTitle, FeatureDesc,
  TeachersRow, TeacherCard, TeacherAvatar, TeacherName,
  CTASection, CTAInner, CTATitle, CTASub, CTAActions, CTAPrimaryBtn, CTASecondaryBtn,
} from './styles';
import { fadeUp, stagger, fadeIn, slideVariants } from './animations';

/* ─── Clock Hook ─── */
function useClock() {
  const { i18n } = useTranslation();
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const isAr = i18n.language.startsWith('ar');

  const raw   = time.getHours();
  const ampm  = isAr ? (raw >= 12 ? 'م' : 'ص') : (raw >= 12 ? 'PM' : 'AM');
  const hours12 = raw % 12 || 12;

  const locale = isAr ? 'ar-EG' : 'en-US';
  const dateStr = time.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });

  return {
    hours:   pad(hours12),
    minutes: pad(time.getMinutes()),
    seconds: pad(time.getSeconds()),
    ampm,
    dateStr,
  };
}

/* ─── Component ─── */
export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clock = useClock();

  const { data: rawData, isLoading: coursesLoading } = useCourses({ limit: 8 });
  const { data: teachersData } = useTeachers({ limit: 6 });

  const courses  = rawData?.data?.docs ?? rawData?.data ?? [];
  const teachers = teachersData?.teachers ?? [];

  // ── heroSlides inside component so t() re-runs on language change ────────
  const heroSlides = [
    {
      badge:     t('home.slide1Badge'),
      title:     t('home.slide1Title'),
      highlight: t('home.slide1Highlight'),
      sub:       t('home.slide1Sub'),
      gradient:  'linear-gradient(145deg, #0B6B8A 0%, #0a4f68 100%)',
      icon:      <GraduationCap size={80} strokeWidth={1.2} />,
    },
    {
      badge:     t('home.slide2Badge'),
      title:     t('home.slide2Title'),
      highlight: t('home.slide2Highlight'),
      sub:       t('home.slide2Sub'),
      gradient:  'linear-gradient(145deg, #0f6b4a 0%, #0a4f36 100%)',
      icon:      <Clock size={80} strokeWidth={1.2} />,
    },
    {
      badge:     t('home.slide3Badge'),
      title:     t('home.slide3Title'),
      highlight: t('home.slide3Highlight'),
      sub:       t('home.slide3Sub'),
      gradient:  'linear-gradient(145deg, #8a5a0b 0%, #6b4208 100%)',
      icon:      <TrendingUp size={80} strokeWidth={1.2} />,
    },
  ];

  /* Slider state */
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);

  const goTo = useCallback((next) => {
    setDirection(next > slide ? 1 : -1);
    setSlide(next);
  }, [slide]);

  const goNext = useCallback(() => goTo((slide + 1) % heroSlides.length), [slide, goTo, heroSlides.length]);
  const goPrev = useCallback(() => goTo((slide - 1 + heroSlides.length) % heroSlides.length), [slide, goTo, heroSlides.length]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, [autoplay, goNext]);

  const currentSlide = heroSlides[slide];

  // ── features inside component so t() re-runs on language change ──────────
  const features = [
    { icon: <BookOpen size={26} />, title: t('home.feat1Title'), desc: t('home.feat1Desc') },
    { icon: <Target  size={26} />, title: t('home.feat2Title'), desc: t('home.feat2Desc') },
    { icon: <Shield  size={26} />, title: t('home.feat3Title'), desc: t('home.feat3Desc') },
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
              <PrimaryBtn onClick={() => navigate(PATH.courses)}>
                <ArrowLeft size={18} />
                {t('home.heroBtn')}
              </PrimaryBtn>
              <SecondaryBtn onClick={() => navigate(PATH.register)}>
                {t('home.heroBtnSecondary')}
              </SecondaryBtn>
            </HeroActions>

            <StatsRow variants={fadeUp}>
              {[
                { value: t('home.statsStudents'), label: t('home.slide1Badge') },
                { value: t('home.statsCourses'),  label: t('home.feat1Title') },
                { value: t('home.statsTeachers'), label: t('home.feat3Title') },
              ].map(stat => (
                <StatItem key={stat.value}>
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
                <Clock size={12} style={{ display: 'inline', marginInlineEnd: 4 }} />
                {t('home.clockLabel')}
              </ClockLabel>
              <ClockTime>
                <ClockDigit key={`h-${clock.hours}`}>{clock.hours}</ClockDigit>
                <ClockSeparator>:</ClockSeparator>
                <ClockDigit key={`m-${clock.minutes}`}>{clock.minutes}</ClockDigit>
                <ClockSeparator>:</ClockSeparator>
                <ClockDigit key={`s-${clock.seconds}`}>{clock.seconds}</ClockDigit>
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
                  <SectionTag>{t('home.whyTag')}</SectionTag>
                  <SectionTitle>{t('home.whyTitle')}</SectionTitle>
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
              <SectionTag>{t('home.coursesTag')}</SectionTag>
              <SectionTitle>{t('home.coursesTitle')}</SectionTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(PATH.courses)}
            >
              {t('home.viewAllCourses')}
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
                    <SectionTag>{t('home.teachersTag')}</SectionTag>
                    <SectionTitle>{t('home.teachersTitle')}</SectionTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowLeft size={16} />}
                    onClick={() => navigate(PATH.teachers)}
                  >
                    {t('home.viewAllTeachers')}
                  </Button>
                </SectionHeader>
              </motion.div>

              <TeachersRow>
                {teachers.map((teacher, i) => (
                  <motion.div key={teacher._id} variants={fadeUp}>
                    <TeacherCard
                      onClick={() => navigate(PATH.teacherProfile(teacher._id))}
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
            <CTATitle>{t('home.ctaTitle')}</CTATitle>
          </motion.div>
          <motion.div variants={fadeUp}>
            <CTASub>{t('home.ctaSub')}</CTASub>
          </motion.div>
          <motion.div variants={fadeUp}>
            <CTAActions>
              <CTAPrimaryBtn onClick={() => navigate(PATH.register)}>
                <GraduationCap size={18} />
                {t('home.ctaBtn')}
              </CTAPrimaryBtn>
              <CTASecondaryBtn onClick={() => navigate(PATH.courses)}>
                <ArrowLeft size={18} />
                {t('home.ctaBtnSecondary')}
              </CTASecondaryBtn>
            </CTAActions>
          </motion.div>
        </CTAInner>
      </CTASection>

    </MainLayout>
  );
}