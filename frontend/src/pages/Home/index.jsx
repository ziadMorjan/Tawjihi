import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Award, Star, Zap, Target } from 'lucide-react';
import styled from 'styled-components';
import { MainLayout }    from '../../shared/components/layout/MainLayout';
import { CoursesGrid }   from '../../components/CoursesGrid';
import { Button, Badge, Spinner } from '../../shared/components';
import useCourses        from '../../features/courses/hooks/useCourses';
import { useTeachers }   from '../../features/teachers';

/* ─── Animations ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/* ─── Styles ─── */
const HeroSection = styled.section`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  overflow: hidden;
  position: relative;

  /* خلفية هندسية خفيفة */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 60% at 50% -20%,
      ${({ theme }) => theme.colors.primaryLight} 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[4]}`};
  }
`;

const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[16]};
  align-items: center;
  position: relative;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;

  span {
    color: ${({ theme }) => theme.colors.primary};
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      right: 0;
      left: 0;
      height: 3px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 999px;
      opacity: 0.3;
    }
  }

  ${({ theme }) => theme.media.maxMd} {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 480px;

  ${({ theme }) => theme.media.maxMd} { max-width: 100%; }
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    justify-content: center;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.maxMd} {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatNumber = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HeroVisual = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ${({ theme }) => theme.media.maxMd} { display: none; }
`;

const FloatingCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  position: absolute;
  white-space: nowrap;
`;

const HeroImage = styled.div`
  width: 380px;
  height: 380px;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgTertiary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[4]}`};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  gap: ${({ theme }) => theme.spacing[4]};

  ${({ theme }) => theme.media.maxSm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

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
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const FeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

const TeachersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
`;

const TeacherCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-3px);
  }
`;

const TeacherAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; }
  span { font-size: 24px; font-weight: 700; color: ${({ theme }) => theme.colors.primary}; }
`;

const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CTASection = styled.section`
  background: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 120%, rgba(255,255,255,0.1) 0%, transparent 70%);
  }
`;

const CTAInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

/* ─── Component ─── */
export default function Home() {
  const navigate = useNavigate();

  const { data: rawData, isLoading: coursesLoading } = useCourses({ limit: 8 });
  const { data: teachersData } = useTeachers({ limit: 6 });

  const courses  = rawData?.data?.docs ?? rawData?.data ?? [];
  const teachers = teachersData?.teachers ?? [];

  const features = [
    {
      icon: <BookOpen size={22} />,
      title: 'محتوى شامل',
      desc:  'كورسات تغطي جميع مواد التوجيهي مع شروحات مفصلة ومسائل محلولة',
    },
    {
      icon: <Target size={22} />,
      title: 'منهجية مركزة',
      desc:  'تعلّم بأسلوب مدروس يوفر وقتك ويضمن استيعابك الكامل للمادة',
    },
    {
      icon: <Zap size={22} />,
      title: 'متابعة فورية',
      desc:  'تواصل مع المعلمين وأجب عن أسئلتك في أي وقت',
    },
  ];

  return (
    <MainLayout>

      {/* Hero */}
      <HeroSection>
        <HeroInner>
          <HeroContent
            as={motion.div}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="primary" icon={<Award size={14} />}>
                منصة التوجيهي الأولى في فلسطين
              </Badge>
            </motion.div>

            <motion.div variants={fadeUp}>
              <HeroTitle>
                استعد لتوجيهيك مع
                <br />
                <span>أفضل المعلمين</span>
              </HeroTitle>
            </motion.div>

            <motion.div variants={fadeUp}>
              <HeroSubtitle>
                كورسات شاملة لجميع مواد التوجيهي، شروحات مفصلة وتمارين تفاعلية
                تساعدك على التفوق في الامتحان.
              </HeroSubtitle>
            </motion.div>

            <motion.div variants={fadeUp}>
              <HeroActions>
                <Button
                  size="lg"
                  onClick={() => navigate('/courses')}
                  rightIcon={<ArrowLeft size={18} />}
                >
                  تصفح الكورسات
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/auth/register')}
                >
                  ابدأ مجاناً
                </Button>
              </HeroActions>
            </motion.div>

            <motion.div variants={fadeUp}>
              <StatsRow>
                {[
                  { value: '+٥٠٠', label: 'كورس متاح'     },
                  { value: '+١٠٠٠٠', label: 'طالب مسجل'  },
                  { value: '+٥٠',  label: 'معلم محترف'   },
                ].map(stat => (
                  <StatItem key={stat.label}>
                    <StatNumber>{stat.value}</StatNumber>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </StatsRow>
            </motion.div>
          </HeroContent>

          {/* Visual مع Floating Cards */}
          <HeroVisual>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <HeroImage>
                <img src="/assets/img/learning.png" alt="تعلم" />
              </HeroImage>
            </motion.div>

            {/* Floating card — أعلى يسار */}
            <FloatingCard
              style={{ top: 20, right: -40 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#EFF6FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Star size={18} color="#1B4FD8" fill="#1B4FD8" />
              </div>
              تقييم ٤.٩ من ٥
            </FloatingCard>

            {/* Floating card — أسفل يسار */}
            <FloatingCard
              style={{ bottom: 40, right: -20 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#F0FDF4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={18} color="#16A34A" />
              </div>
              +١٠٠٠ طالب هذا الشهر
            </FloatingCard>
          </HeroVisual>
        </HeroInner>
      </HeroSection>

      {/* Features */}
      <Section>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader>
              <div>
                <SectionTitle>لماذا توجيهي؟</SectionTitle>
                <SectionSubtitle>كل ما تحتاجه للنجاح في مكان واحد</SectionSubtitle>
              </div>
            </SectionHeader>
          </motion.div>

          <FeaturesGrid>
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FeatureCard whileHover={{ scale: 1.02 }}>
                  <FeatureIcon>{f.icon}</FeatureIcon>
                  <FeatureTitle>{f.title}</FeatureTitle>
                  <FeatureDesc>{f.desc}</FeatureDesc>
                </FeatureCard>
              </motion.div>
            ))}
          </FeaturesGrid>
        </motion.div>
      </Section>

      {/* Latest Courses */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeIn}
        style={{ background: '#F8FAFC' }}
      >
        <Section>
          <SectionHeader>
            <div>
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

          <CoursesGrid
            courses={courses}
            isLoading={coursesLoading}
          />
        </Section>
      </motion.div>

      {/* Teachers */}
      {teachers.length > 0 && (
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
                  <SectionTitle>معلمونا</SectionTitle>
                  <SectionSubtitle>نخبة من أفضل معلمي التوجيهي</SectionSubtitle>
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
      )}

      {/* CTA */}
      <CTASection>
        <CTAInner
          as={motion.div}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'white', margin: 0 }}>
              ابدأ رحلتك التعليمية اليوم
            </h2>
          </motion.div>
          <motion.div variants={fadeUp}>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: 480 }}>
              انضم لأكثر من ١٠٠٠٠ طالب يدرسون معنا ويحققون نتائج متميزة
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/auth/register')}
              >
                إنشاء حساب مجاني
              </Button>
              <Button
                size="lg"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}
                onClick={() => navigate('/courses')}
              >
                تصفح الكورسات
              </Button>
            </div>
          </motion.div>
        </CTAInner>
      </CTASection>

    </MainLayout>
  );
}