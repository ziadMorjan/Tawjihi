import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, Clock } from 'lucide-react';
import styled from 'styled-components';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { Button, Badge } from '../../shared/components';
import { CourseCardSkeleton } from '../../features/courses/components/CourseCard/CourseCardSkeleton';
import { useMyEnrollments } from '../../features/enrollments';

const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const EnrolledCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const Thumbnail = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.bgTertiary};
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
  ${EnrolledCard}:hover img { transform: scale(1.04); }
`;

const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.fast};
  ${EnrolledCard}:hover & { opacity: 1; }
  svg { color: white; }
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CourseTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TeacherName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EnrolledDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  svg { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export default function MyCourses() {
  const navigate = useNavigate();
  const { enrollments, isLoading } = useMyEnrollments();

  return (
    <MainLayout>
      <PageWrapper>
        <PageTitle>
          <BookOpen size={28} color="#1B4FD8" />
          كورساتي
          {enrollments.length > 0 && (
            <Badge variant="primary">{enrollments.length} كورس</Badge>
          )}
        </PageTitle>

        {isLoading ? (
          <Grid>
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </Grid>
        ) : enrollments.length === 0 ? (
          <EmptyState>
            <BookOpen size={64} />
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F172A' }}>
              لم تسجل في أي كورس بعد
            </h2>
            <p style={{ color: '#475569' }}>ابدأ رحلتك التعليمية الآن</p>
            <Button onClick={() => navigate('/courses')}>تصفح الكورسات</Button>
          </EmptyState>
        ) : (
          <Grid>
            {enrollments.map((enrollment) => {
              const course = enrollment?.course;
              if (!course) return null;

              const courseId    = course._id ?? course;
              const enrolledAt  = enrollment?.createdAt
                ? new Date(enrollment.createdAt).toLocaleDateString('ar-EG')
                : null;

              return (
                <EnrolledCard
                  key={enrollment._id}
                  onClick={() => navigate(`/learn/${courseId}`)}
                >
                  <Thumbnail>
                    <img
                      src={course.img || '/assets/img/logo.png'}
                      alt={course.name}
                      loading="lazy"
                    />
                    <PlayOverlay>
                      <PlayCircle size={48} />
                    </PlayOverlay>
                  </Thumbnail>

                  <CardContent>
                    <CourseTitle>{course.name}</CourseTitle>
                    {course.teacher?.name && (
                      <TeacherName>{course.teacher.name}</TeacherName>
                    )}
                    <CardFooter>
                      <Badge variant="success">مسجّل</Badge>
                      {enrolledAt && (
                        <EnrolledDate>
                          <Clock size={12} />
                          {enrolledAt}
                        </EnrolledDate>
                      )}
                    </CardFooter>
                  </CardContent>
                </EnrolledCard>
              );
            })}
          </Grid>
        )}
      </PageWrapper>
    </MainLayout>
  );
}