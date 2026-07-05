import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../constants';
import { Star, BookOpen, MessageSquare, Trash2 } from 'lucide-react';
import { MainLayout }      from '../../shared/components/layout/MainLayout';
import { Button, Badge, Spinner } from '../../shared/components';
import { CourseCard }      from '../../features/courses/components/CourseCard';
import { CourseCardSkeleton } from '../../features/courses/components/CourseCard/CourseCardSkeleton';
import { StarRating }      from '../../features/courses/components/CourseCard/StarRating';
import { useAuth }         from '../../features/auth';
import {
  useTeacher,
  useTeacherCourses,
  useTeacherReviews,
  useAddTeacherReview,
  useDeleteTeacherReview,
} from '../../features/teachers';
import {
  PageWrapper, HeroSection, HeroInner, TeacherAvatar,
  TeacherInfo, TeacherName, TeacherDesc, StatsRow,
  StatItem, StatValue, StatLabel, ContentWrapper,
  Section, SectionTitle, CoursesGrid, ReviewCard,
  ReviewHeader, ReviewAvatar, ReviewerName, ReviewText,
  AddReviewForm, EmptyMsg,
} from './TeacherProfile.styles';

export default function TeacherProfile() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const { user } = useAuth();

  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState('');

  const { data: teacher,  isLoading: teacherLoading  } = useTeacher(id);
  const { data: courses,  isLoading: coursesLoading  } = useTeacherCourses(id);
  const { data: reviews = [], isLoading: reviewsLoading } = useTeacherReviews(id);

  const addReview    = useAddTeacherReview(id);
  const deleteReview = useDeleteTeacherReview(id);

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) return;
    await addReview.mutateAsync({ rating, comment });
    setRating(0);
    setComment('');
  };

  if (teacherLoading) {
    return (
      <MainLayout>
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!teacher) {
    return (
      <MainLayout>
        <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <p style={{ color: '#475569' }}>{t('teachers.notFound')}</p>
          <Button onClick={() => navigate(PATH.teachers)}>{t('teachers.backToTeachers')}</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageWrapper>

        {/* Hero */}
        <HeroSection>
          <HeroInner>
            <TeacherAvatar>
              {teacher.coverImage
                ? <img src={teacher.coverImage} alt={teacher.name} />
                : <span>{teacher.name?.charAt(0)?.toUpperCase()}</span>
              }
            </TeacherAvatar>

            <TeacherInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <TeacherName>{teacher.name}</TeacherName>
                <Badge variant="primary">{t('teachers.certified')}</Badge>
              </div>

              {teacher.description && (
                <TeacherDesc>{teacher.description}</TeacherDesc>
              )}

              <StatsRow>
                {teacher.averageRating > 0 && (
                  <StatItem>
                    <StatValue style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B' }}>
                      <Star size={16} fill="#F59E0B" color="#F59E0B" />
                      {teacher.averageRating?.toFixed(1)}
                    </StatValue>
                    <StatLabel>{t('teachers.averageRating')}</StatLabel>
                  </StatItem>
                )}
                {teacher.reviewsQuantity > 0 && (
                  <StatItem>
                    <StatValue>{teacher.reviewsQuantity}</StatValue>
                    <StatLabel>{t('teachers.reviewsCount')}</StatLabel>
                  </StatItem>
                )}
                {courses?.length > 0 && (
                  <StatItem>
                    <StatValue>{courses.length}</StatValue>
                    <StatLabel>{t('teachers.coursesCount')}</StatLabel>
                  </StatItem>
                )}
              </StatsRow>
            </TeacherInfo>
          </HeroInner>
        </HeroSection>

        <ContentWrapper>

          {/* Courses */}
          <Section>
            <SectionTitle>
              <BookOpen size={20} color="#1B4FD8" />
              {t('teachers.teacherCourses')} ({courses?.length ?? 0})
            </SectionTitle>

            {coursesLoading ? (
              <CoursesGrid>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </CoursesGrid>
            ) : courses?.length === 0 ? (
              <EmptyMsg>{t('teachers.noCourses')}</EmptyMsg>
            ) : (
              <CoursesGrid>
                {courses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </CoursesGrid>
            )}
          </Section>

          {/* Reviews */}
          <Section>
            <SectionTitle>
              <MessageSquare size={20} color="#1B4FD8" />
              {t('teachers.studentReviews')} ({reviews.length})
            </SectionTitle>

            {/* Add Review */}
            {user && user.role === 'user' && (
              <AddReviewForm>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                  {t('teachers.rateTeacher')}
                </p>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star
                        size={24}
                        fill={s <= rating ? '#F59E0B' : 'none'}
                        color={s <= rating ? '#F59E0B' : '#CBD5E1'}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={t('teachers.reviewPlaceholder')}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1.5px solid #E2E8F0', borderRadius: 10,
                    fontFamily: 'inherit', fontSize: 14,
                    resize: 'vertical', outline: 'none',
                  }}
                />

                <Button
                  size="sm"
                  onClick={handleSubmitReview}
                  isLoading={addReview.isPending}
                  disabled={!rating || !comment.trim()}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {t('teachers.submitReview')}
                </Button>
              </AddReviewForm>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <Spinner size="md" />
              </div>
            ) : reviews.length === 0 ? (
              <EmptyMsg>{t('teachers.noReviews')}</EmptyMsg>
            ) : (
              reviews.map(review => {
                const isOwner = user?._id === review.user?._id;
                return (
                  <ReviewCard key={review._id}>
                    <ReviewHeader>
                      <ReviewAvatar>
                        {review.user?.name?.charAt(0) ?? '؟'}
                      </ReviewAvatar>
                      <div style={{ flex: 1 }}>
                        <ReviewerName>{review.user?.name ?? t('teachers.anonymous')}</ReviewerName>
                        <StarRating rating={review.rating} showText={false} />
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => deleteReview.mutate(review._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </ReviewHeader>
                    {review.comment && (
                      <ReviewText>{review.comment}</ReviewText>
                    )}
                  </ReviewCard>
                );
              })
            )}
          </Section>

        </ContentWrapper>
      </PageWrapper>
    </MainLayout>
  );
}