// src/pages/Home/index.jsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, Award } from "lucide-react";
import useCourses from "../../features/courses/hooks/useCourses";
import { Button, Badge } from "../../shared/components";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { CoursesGrid } from "../../components/CoursesGrid";
/* ────────── Hero ────────── */
const HeroSection = styled.section`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};

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
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme }) => theme.media.maxMd} {
    font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 480px;

  ${({ theme }) => theme.media.maxMd} {
    max-width: 100%;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxMd} {
    justify-content: center;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[4]};
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

const HeroImage = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius["2xl"]};
  overflow: hidden;
  aspect-ratio: 4/3;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${({ theme }) => theme.media.maxMd} {
    display: none;
  }
`;

/* ────────── Section ────────── */
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
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

/* ────────── Component ────────── */
export default function Home() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useCourses({ limit: 8 });

  const courses = data?.data?.docs ?? data?.data ?? [];
  return (
    <MainLayout>
      {/* Hero */}
      <HeroSection>
        <HeroInner>
          <HeroContent>
            <Badge variant="primary" icon={<Award size={14} />}>
              منصة التوجيهي الأولى في فلسطين
            </Badge>

            <HeroTitle>
              استعد لتوجيهيك مع
              <br />
              <span>أفضل المعلمين</span>
            </HeroTitle>

            <HeroSubtitle>
              كورسات شاملة لجميع مواد التوجيهي، شروحات مفصلة وتمارين تفاعلية
              تساعدك على التفوق في الامتحان.
            </HeroSubtitle>

            <HeroActions>
              <Button
                size="lg"
                onClick={() => navigate("/courses")}
                rightIcon={<ArrowLeft size={18} />}
              >
                تصفح الكورسات
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth/register")}
              >
                ابدأ مجاناً
              </Button>
            </HeroActions>

            <StatsRow>
              <StatItem>
                <StatNumber>+٥٠٠</StatNumber>
                <StatLabel>كورس متاح</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>+١٠٠٠٠</StatNumber>
                <StatLabel>طالب مسجل</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>+٥٠</StatNumber>
                <StatLabel>معلم محترف</StatLabel>
              </StatItem>
            </StatsRow>
          </HeroContent>

          <HeroImage>
            <img src="/assets/img/hero.png" alt="طلاب يتعلمون" />
          </HeroImage>
        </HeroInner>
      </HeroSection>

      {/* Latest Courses */}
      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>أحدث الكورسات</SectionTitle>
            <SectionSubtitle>
              اكتشف كورسات جديدة أضافها معلمونا مؤخراً
            </SectionSubtitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/courses")}
          >
            عرض الكل
          </Button>
        </SectionHeader>

        <CoursesGrid
          courses={courses}
          isLoading={isLoading}
          isError={isError}
        />
      </Section>
    </MainLayout>
  );
}
