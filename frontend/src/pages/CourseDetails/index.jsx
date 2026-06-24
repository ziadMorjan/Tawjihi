import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PATH } from "../../constants";
import {
  Users,
  Star,
  User,
  Heart,
  ShoppingCart,
  BookOpen,
  Award,
} from "lucide-react";
import { Button, Badge, Spinner } from "../../shared/components";
import { useCourse } from "../../features/courses/hooks/useCourse";
import { useCourseActions } from "../../features/courses/hooks/useCourseActions";
import { CourseCurriculum } from "../../features/courses/components/CourseDetails/CourseCurriculum";
import { CourseIncludes } from "../../features/courses/components/CourseDetails/CourseIncludes";
import { CourseReviews } from "../../features/courses/components/CourseDetails/CourseReviews";
import { useAuth } from "../../features/auth";
import { useMyEnrollments } from "../../features/enrollments/hooks/useMyEnrollments";
import { useCourseCheckout } from "../../features/courses/hooks/useCourseCheckout";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import {
  PageWrapper,
  HeroSection,
  HeroInner,
  HeroContent,
  CourseMeta,
  CourseTitle,
  CourseDescription,
  StatsRow,
  StatItem,
  TeacherInfo,
  TeacherAvatar,
  TeacherMeta,
  TeacherLabel,
  TeacherName,
  PurchaseCard,
  CardImage,
  CardBody,
  PriceRow,
  CurrentPrice,
  OldPrice,
  DiscountBadge,
  Divider,
  ContentArea,
  MainContent,
  Section,
  SectionTitle,
  SectionText,
  SidebarSticky,
  InstructorCard,
  InstructorTitle,
  InstructorInfo,
  InstructorAvatar,
  InstructorName,
  InstructorRole,
} from "../../features/courses/components/CourseDetails/CourseDetails.styles";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: course, isLoading, isError } = useCourse(id);
  const { isEnrolled } = useMyEnrollments();
  const { checkout, isCheckoutLoading } = useCourseCheckout(id);
  const { isInCart, isInWishlist, toggleCart, toggleWishlist } =
    useCourseActions();

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <MainLayout>
        <div
          style={{
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  /* ─── Error ─── */
  if (isError || !course) {
    return (
      <MainLayout>
        <div
          style={{
            height: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <p style={{ color: "#475569" }}>{t('courseDetails.errorLoading')}</p>
          <Button onClick={() => navigate(PATH.courses)}>{t('courseDetails.backToCourses')}</Button>
        </div>
      </MainLayout>
    );
  }

  const {
    _id,
    name,
    description,
    coverImage,
    price = 0,
    priceAfterDiscount,
    averageRating = 0,
    reviewsQuantity = 0,
    teacher,
    subject,
    branches = [],
    studentsCount = 0,
    lessonsCount = 0,
  } = course;

  const courseId = _id ?? course.id ?? id;

  const discountPercent =
    price > 0 && priceAfterDiscount
      ? Math.round((1 - priceAfterDiscount / price) * 100)
      : 0;

  const handleMainAction = () => {
    if (isEnrolled(courseId)) {
      navigate(PATH.learn(courseId));
      return;
    }
    if (!user) {
      navigate(PATH.login, {
        state: { from: { pathname: PATH.courseDetails(courseId) } },
      });
      return;
    }
    checkout();
  };

  const enrolled = isEnrolled(courseId);

  /* ─── Purchase Card Content (reused in hero + sidebar) ─── */
  const PurchaseCardContent = (
    <CardBody>
      {/* Price */}
      <PriceRow>
        {price === 0 ? (
          <Badge
            variant="success"
            style={{ fontSize: 18, padding: "8px 20px" }}
          >
            {t('courseDetails.freeBadge')}
          </Badge>
        ) : (
          <>
            <CurrentPrice>{priceAfterDiscount ?? price} ₪</CurrentPrice>
            {priceAfterDiscount && (
              <>
                <OldPrice>{price} ₪</OldPrice>
                {discountPercent > 0 && (
                  <DiscountBadge>{t('courseDetails.discount')} {discountPercent}%</DiscountBadge>
                )}
              </>
            )}
          </>
        )}
      </PriceRow>

      {/* CTA */}
      <Button
        fullWidth
        size="lg"
        isLoading={isCheckoutLoading}
        onClick={handleMainAction}
        variant={enrolled ? "secondary" : "primary"}
      >
        {enrolled
          ? t('courseDetails.continueLearning')
          : price === 0
            ? t('courseDetails.startFree')
            : t('courseDetails.buyNow')}
      </Button>

      {/* Cart & Wishlist */}
      {!enrolled && (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            fullWidth
            size="sm"
            variant={isInCart(courseId) ? "primary" : "secondary"}
            onClick={() => toggleCart(courseId)}
            leftIcon={<ShoppingCart size={16} />}
          >
            {isInCart(courseId) ? t('courseDetails.removeFromCart') : t('courseDetails.addToCart')}
          </Button>
          <button
            onClick={() => toggleWishlist(courseId)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              flexShrink: 0,
              border: `1.5px solid ${isInWishlist(courseId) ? "#DC2626" : "#E2E8F0"}`,
              background: isInWishlist(courseId) ? "#FEF2F2" : "white",
              color: isInWishlist(courseId) ? "#DC2626" : "#94A3B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Heart
              size={16}
              fill={isInWishlist(courseId) ? "currentColor" : "none"}
            />
          </button>
        </div>
      )}

      <Divider />

      {/* Includes */}
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
            color: "#0F172A",
          }}
        >
          {t('courseDetails.includes')}
        </p>
        <CourseIncludes lessonsCount={lessonsCount} />
      </div>
    </CardBody>
  );

  return (
    <MainLayout>
      <PageWrapper>
        {/* ─── Hero ─── */}
        <HeroSection>
          <HeroInner>
            <HeroContent>
              {/* Badges */}
              <CourseMeta>
                {subject?.name && (
                  <Badge variant="primary">{subject.name}</Badge>
                )}
                {branches[0]?.name && (
                  <Badge variant="gray">{branches[0].name}</Badge>
                )}
                {averageRating > 0 && (
                  <Badge variant="warning" icon={<Award size={12} />}>
                    {averageRating.toFixed(1)} {t('courseDetails.ratingCount')}
                  </Badge>
                )}
              </CourseMeta>

              {/* Title */}
              <CourseTitle>{name}</CourseTitle>

              {/* Description */}
              {description && (
                <CourseDescription>
                  {description.length > 180
                    ? `${description.slice(0, 180)}...`
                    : description}
                </CourseDescription>
              )}

              {/* Stats */}
              <StatsRow>
                {averageRating > 0 && (
                  <StatItem>
                    <Star size={15} fill="#F59E0B" color="#F59E0B" />
                    <strong style={{ color: "#F59E0B" }}>
                      {averageRating.toFixed(1)}
                    </strong>
                    <span>({reviewsQuantity} {t('courseDetails.ratingCount')})</span>
                  </StatItem>
                )}
                {studentsCount > 0 && (
                  <StatItem>
                    <Users size={15} />
                    <span>{studentsCount.toLocaleString()} {t('courses.students')}</span>
                  </StatItem>
                )}
                {lessonsCount > 0 && (
                  <StatItem>
                    <BookOpen size={15} />
                    <span>{lessonsCount} {t('courses.lessons')}</span>
                  </StatItem>
                )}
              </StatsRow>

              {/* Teacher */}
              {teacher && (
                <TeacherInfo
                  onClick={() => navigate(PATH.teacherProfile(teacher._id))}
                >
                  <TeacherAvatar>
                    {teacher.coverImage ? (
                      <img src={teacher.coverImage} alt={teacher.name} />
                    ) : (
                      <User size={20} color="#2563EB" />
                    )}
                  </TeacherAvatar>
                  <TeacherMeta>
                    <TeacherLabel>{t('courseDetails.taughtBy')}</TeacherLabel>
                    <TeacherName>{teacher.name}</TeacherName>
                  </TeacherMeta>
                </TeacherInfo>
              )}
            </HeroContent>

            {/* Purchase Card — Hero */}
            <PurchaseCard>
              <CardImage>
                <img src={coverImage || "/assets/img/logo.png"} alt={name} />
              </CardImage>
              {PurchaseCardContent}
            </PurchaseCard>
          </HeroInner>
        </HeroSection>

        {/* ─── Content ─── */}
        <ContentArea>
          <MainContent>
            {description && (
              <Section>
                <SectionTitle>
                  <BookOpen size={20} color="#1B4FD8" />
                  {t('courseDetails.about')}
                </SectionTitle>
                <SectionText>{description}</SectionText>
              </Section>
            )}
            <Section>
              <CourseCurriculum courseId={courseId} isEnrolled={enrolled} />
            </Section>
            <Section>
              <CourseReviews courseId={courseId} />
            </Section>
          </MainContent>

          {/* Sidebar — بس Instructor، مش Purchase Card */}
          <SidebarSticky>
            {teacher && (
              <InstructorCard>
                <InstructorTitle>{t('courseDetails.instructor')}</InstructorTitle>
                <InstructorInfo
                  onClick={() => navigate(PATH.teacherProfile(teacher._id))}
                >
                  <InstructorAvatar>
                    {teacher.coverImage ? (
                      <img src={teacher.coverImage} alt={teacher.name} />
                    ) : (
                      <User size={22} color="#2563EB" />
                    )}
                  </InstructorAvatar>
                  <div>
                    <InstructorName>{teacher.name}</InstructorName>
                    <InstructorRole>{t('teachers.certified')}</InstructorRole>
                  </div>
                </InstructorInfo>
              </InstructorCard>
            )}
          </SidebarSticky>
        </ContentArea>
      </PageWrapper>
    </MainLayout>
  );
}
