// src/features/courses/components/CourseCard/index.jsx
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, BookOpen } from "lucide-react";
import { useCourseActions } from "../../hooks/useCourseActions";
import { StarRating } from "./StarRating";
import { Badge } from "../../../../shared/components";
import {
  CardWrapper,
  ImageWrapper,
  CourseImage,
  ActionButtons,
  ActionBtn,
  CardBody,
  CourseMeta,
  CourseTitle,
  TeacherName,
  CardFooter,
  PriceWrapper,
  CurrentPrice,
  OldPrice,
} from "./CourseCard.styles";

export function CourseCard({ course }) {
  const navigate = useNavigate();
  const { isInCart, isInWishlist, toggleCart, toggleWishlist } =
    useCourseActions();

  // 🟡 [تحسين] destructuring هنا بدل ما نمرر 10 props منفصلة
  const {
    _id,
    name,
    description,
    coverImage,
    price,
    priceAfterDiscount,
    averageRating = 0,
    teacher,
    subject,
    branches = [],
  } = course;


  const courseId = _id ?? course.id ?? course._id;

  const handleCardClick = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleCartClick = (e) => {
    // 🟡 نوقف الـ event عشان ما يفتح صفحة الكورس
    e.stopPropagation();
    toggleCart(courseId);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(courseId);
  };

  return (
    <CardWrapper onClick={handleCardClick} role="article">
      <ImageWrapper>
        <CourseImage
          src={coverImage || "/assets/img/logo.png"}
          alt={name}
          loading="lazy"
        />

        <ActionButtons>
          <ActionBtn
            onClick={handleCartClick}
            $active={isInCart(courseId)}
            aria-label={isInCart(courseId) ? "إزالة من السلة" : "إضافة للسلة"}
          >
            <ShoppingCart size={16} />
          </ActionBtn>

          <ActionBtn
            onClick={handleWishlistClick}
            $active={isInWishlist(courseId)}
            aria-label={
              isInWishlist(courseId) ? "إزالة من المفضلة" : "إضافة للمفضلة"
            }
          >
            <Heart
              size={16}
              fill={isInWishlist(courseId) ? "currentColor" : "none"}
            />
          </ActionBtn>
        </ActionButtons>
      </ImageWrapper>

      <CardBody>
        <CourseMeta>
          {subject?.name && <Badge variant="primary">{subject.name}</Badge>}
          {branches[0]?.name && (
            <Badge variant="gray">{branches[0].name}</Badge>
          )}
        </CourseMeta>

        <CourseTitle>{name}</CourseTitle>

        {teacher?.name && (
          <TeacherName>
            <User size={14} />
            {teacher.name}
          </TeacherName>
        )}

        <StarRating rating={averageRating} />

        <CardFooter>
          <PriceWrapper>
            {price === 0 ? (
              <Badge variant="success">مجاني</Badge>
            ) : (
              <>
                <CurrentPrice>{priceAfterDiscount ?? price} ₪</CurrentPrice>
                {priceAfterDiscount && <OldPrice>{price} ₪</OldPrice>}
              </>
            )}
          </PriceWrapper>

          {averageRating > 0 && (
            <Badge variant="warning" icon={<BookOpen size={12} />}>
              {averageRating.toFixed(1)}
            </Badge>
          )}
        </CardFooter>
      </CardBody>
    </CardWrapper>
  );
}
