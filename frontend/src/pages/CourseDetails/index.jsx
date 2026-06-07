// src/pages/CourseOne/index.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Spinner } from '../../shared/components';
import  {useCourse}         from '../../features//courses/hooks/useCourse';
import { useCourseActions } from '../../features/courses/hooks/useCourseActions';
import { StarRating }       from '../../features/courses/components/CourseCard/StarRating';
import { CourseCurriculum } from '../../features/courses/components/CourseDetails/CourseCurriculum';
import { CourseIncludes }   from '../../features/courses/components/CourseDetails/CourseIncludes';
import { CourseReviews }    from '../../features/courses/components/CourseDetails/CourseReviews';
import { useAuth }          from '../../features/auth';
import {
  PageWrapper, HeroSection, HeroInner, HeroContent,
  CourseMeta, CourseTitle, CourseDescription, StatsRow,
  StatItem, TeacherInfo, TeacherAvatar, TeacherName,
  PurchaseCard, CardImage, CardBody, PriceRow,
  CurrentPrice, OldPrice, DiscountBadge,
  ContentArea, MainContent, Section, SectionTitle, SectionText,
} from '../../features/courses/components/CourseDetails/CourseDetails.styles';
import {MainLayout} from "../../shared/components/layout/MainLayout"
import { Users, Star, BookOpen, User, Heart, ShoppingCart } from 'lucide-react';
import { useMyEnrollments } from '../../features/enrollments/hooks/useMyEnrollments';
import { useCourseCheckout } from '../../features/courses/hooks/useCourseCheckout';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();


  const { data: course, isLoading, isError } = useCourse(id);
  const { isEnrolled } = useMyEnrollments();
  const { checkout, isCheckoutLoading } = useCourseCheckout(id);
  const { isInCart, isInWishlist, toggleCart, toggleWishlist } = useCourseActions();


  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !course) {
    return (
      <MainLayout>
        <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <p>حدث خطأ في تحميل الكورس</p>
          <Button onClick={() => navigate('/courses')}>العودة للكورسات</Button>
        </div>
      </MainLayout>
    );
  }

  const {
    _id, name, description, img,
    price = 0, priceAfterDiscount,
    averageRating = 0, reviewsQuantity = 0,
    teacher, subject, branches = [],
    studentsCount = 0,
  } = course;

  const courseId = _id ?? course.id ?? id; // id من useParams كـ fallback

  const discountPercent = price > 0 && priceAfterDiscount
    ? Math.round((1 - priceAfterDiscount / price) * 100)
    : 0;

  const handleMainAction = () => {
    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }
    if (!user) {
      navigate('/auth/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    if (price === 0) {
      // كورس مجاني — enrollment مباشر
      checkout();
    } else {
      checkout();
    }
  };

  return (
    <MainLayout>
      <PageWrapper>

        {/* Hero */}
        <HeroSection>
          <HeroInner>
            <HeroContent>

              <CourseMeta>
                {subject?.name && (
                  <Badge variant="primary">{subject.name}</Badge>
                )}
                {branches[0]?.name && (
                  <Badge variant="gray">{branches[0].name}</Badge>
                )}
              </CourseMeta>

              <CourseTitle>{name}</CourseTitle>

              <CourseDescription>
                {description?.slice(0, 200)}
                {description?.length > 200 ? '...' : ''}
              </CourseDescription>

              <StatsRow>
                {averageRating > 0 && (
                  <StatItem>
                    <Star size={16} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ color: '#F59E0B', fontWeight: 600 }}>
                      {averageRating.toFixed(1)}
                    </span>
                    <span>({reviewsQuantity} تقييم)</span>
                  </StatItem>
                )}
                {studentsCount > 0 && (
                  <StatItem>
                    <Users size={16} />
                    {studentsCount} طالب
                  </StatItem>
                )}
              </StatsRow>

              {teacher && (
                <TeacherInfo>
                  <TeacherAvatar>
                    {teacher.coverImage
                      ? <img src={teacher.coverImage} alt={teacher.name} />
                      : <User size={20} color="#2563EB" style={{ margin: 'auto' }} />
                    }
                  </TeacherAvatar>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>المعلم</div>
                    <TeacherName
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/teachers/${teacher.courseId}`)}
                    >
                      {teacher.name}
                    </TeacherName>
                  </div>
                </TeacherInfo>
              )}

            </HeroContent>

            {/* Purchase Card — Desktop */}
            <PurchaseCard>
              <CardImage>
                <img src={img || '/assets/img/logo.png'} alt={name} />
              </CardImage>

              <CardBody>
                <PriceRow>
                  {price === 0 ? (
                    <Badge variant="success" style={{ fontSize: 20, padding: '8px 16px' }}>
                      مجاني
                    </Badge>
                  ) : (
                    <>
                      <CurrentPrice>
                        {priceAfterDiscount ?? price} ₪
                      </CurrentPrice>
                      {priceAfterDiscount && (
                        <>
                          <OldPrice>{price} ₪</OldPrice>
                          {discountPercent > 0 && (
                            <DiscountBadge>خصم {discountPercent}%</DiscountBadge>
                          )}
                        </>
                      )}
                    </>
                  )}
                </PriceRow>

                {/* Main CTA */}
                <Button
                  fullWidth
                  size="lg"
                  isLoading={isCheckoutLoading}
                  onClick={handleMainAction}
                  variant={isEnrolled ? 'secondary' : 'primary'}
                >
                  {isEnrolled
                    ? 'متابعة التعلم'
                    : price === 0
                    ? 'ابدأ مجاناً'
                    : 'اشترِ الآن'
                  }
                </Button>

                {/* Cart & Wishlist — فقط لو مش enrolled */}
            {!isEnrolled && (
  <div style={{ display: 'flex', gap: 8 }}>

    {/* زر السلة */}
    <Button
      fullWidth
      size="sm"
      variant={isInCart(courseId) ? 'primary' : 'secondary'}
      onClick={() => toggleCart(courseId)}
      leftIcon={<ShoppingCart size={16} />}
    >
      {isInCart(courseId) ? 'إزالة من السلة' : 'أضف للسلة'}
    </Button>

    {/* زر المفضلة */}
    <button
      onClick={() => toggleWishlist(courseId)}
      aria-label={isInWishlist(courseId) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        border: `1.5px solid ${isInWishlist(courseId) ? '#DC2626' : '#E2E8F0'}`,
        background: isInWishlist(courseId) ? '#FEF2F2' : 'white',
        color: isInWishlist(courseId) ? '#DC2626' : '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      <Heart
        size={18}
        fill={isInWishlist(courseId) ? 'currentColor' : 'none'}
      />
    </button>

  </div>
)}
                {/* ما يتضمنه الكورس */}
                <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                    يتضمن هذا الكورس:
                  </p>
                  <CourseIncludes lessonsCount={course.lessonsCount ?? 0} />
                </div>

              </CardBody>
            </PurchaseCard>
          </HeroInner>
        </HeroSection>

        {/* Main Content */}
        <ContentArea>
          <MainContent>

            {/* Description */}
            {description && (
              <Section>
                <SectionTitle>عن الكورس</SectionTitle>
                <SectionText>{description}</SectionText>
              </Section>
            )}

            {/* Curriculum */}
            <Section>
              <CourseCurriculum courseId={courseId} isEnrolled={isEnrolled} />
            </Section>

            {/* Reviews */}
            <Section>
              <CourseReviews courseId={courseId} />
            </Section>

          </MainContent>

          {/* Purchase Card — Mobile (تظهر تحت المحتوى) */}
          <div style={{ display: 'none' }} className="mobile-purchase-card">
            {/* نفس الـ PurchaseCard — سنتعامل معها بـ CSS */}
          </div>

        </ContentArea>
      </PageWrapper>
    </MainLayout>
  );
}