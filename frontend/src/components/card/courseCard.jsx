import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Import your existing hooks and config
import { useCRUD } from "../../hooks/useCRUD";
import { API_URL } from "../../config";
import { PATH } from "../../routes";

import {
  CourseCardContainer,
  ActionIcons,
  ActionBtn,
  ActionIcon,
  ImageContainer,
  CourseImage,
  ImageOverlay,
  CardContent,
  CourseHeader,
  CourseInfo,
  CourseTitle,
  CourseMeta,
  MetaItem,
  MetaIcon,
  TeacherInfo,
  TeacherAvatar,
  AvatarImage,
  AvatarPlaceholder,
  TeacherDetails,
  TeacherLabel,
  TeacherName,
  CourseDescription,
  CardFooter,
  RatingContainer,
  StarsContainer,
  StarIcon,
  RatingText,
  PriceContainer,
  FreeBadge,
  PriceInfo,
  OldPrice,
  CurrentPrice,
} from "./style";

// Custom SVG Icons
const HeartIcon = ({ filled, className }) => (
  <ActionIcon
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </ActionIcon>
);

const CartIcon = ({ className }) => (
  <ActionIcon
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </ActionIcon>
);

const StarIconComponent = ({ filled, half, className }) => {
  if (half) {
    return (
      <StarIcon
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="url(#half-fill)"
        />
      </StarIcon>
    );
  }

  return (
    <StarIcon
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </StarIcon>
  );
};

const BookIcon = ({ className }) => (
  <MetaIcon
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </MetaIcon>
);

const GraduationCapIcon = ({ className }) => (
  <MetaIcon
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </MetaIcon>
);

const UserIcon = ({ className }) => (
  <AvatarPlaceholder
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </AvatarPlaceholder>
);

export const CourseCard = ({
  imgSrc,
  teacherName,
  teacherImg,
  name,
  desc,
  starIcon = 0,
  price,
  priceAfterDiscount,
  branch,
  subject,
  id,
  item,
}) => {
  const {
    addToWishList,
    removeFromWishList,
    isInWishList,
    addToCartList,
    removeFromCartList,
    isInCartList,
  } = useCRUD();

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);
  const navigate = useNavigate();

  const handleClickHeart = async () => {
    setLoadingWish(true);
    try {
      if (isInWishList(id)) {
        await axios.delete(`${API_URL}/wishlist/${id}`, {
          withCredentials: true,
        });
        removeFromWishList(id);
        toast.info("تمت إزالة الدورة من قائمة المفضلة");
      } else {
        await axios.post(
          `${API_URL}/wishlist/${id}`,
          { itemId: id },
          { withCredentials: true }
        );
        addToWishList(item);
        toast.success("تمت إضافة الدورة إلى قائمة المفضلة");
      }
    } catch (e) {
      console.error("Wishlist error:", e.message);
      toast.error("حدث خطأ أثناء تحديث قائمة المفضلة");
    } finally {
      setLoadingWish(false);
    }
  };

  const handleClickCart = async () => {
    setLoadingCart(true);
    try {
      if (isInCartList(id)) {
        await axios.delete(`${API_URL}/cart/${id}`, { withCredentials: true });
        removeFromCartList(id);
        toast.info("تمت إزالة الدورة من السلة");
      } else {
        await axios.post(
          `${API_URL}/cart/${id}`,
          { itemId: id },
          { withCredentials: true }
        );
        addToCartList(item);
        toast.success("تمت إضافة الدورة إلى السلة");
      }
    } catch (e) {
      console.error("Cart error:", e.message);
      toast.error("حدث خطأ أثناء تحديث السلة");
    } finally {
      setLoadingCart(false);
    }
  };

  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconComponent
          key={`full-${i}`}
          filled={true}
          className="star-filled"
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarIconComponent key="half" half={true} className="star-half" />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIconComponent
          key={`empty-${i}`}
          filled={false}
          className="star-empty"
        />
      );
    }

    return stars;
  };

  return (
    <CourseCardContainer>
      {/* Action Icons */}
      <ActionIcons>
        <ActionBtn
          className={`${isInCartList(id) ? "active" : ""} ${
            loadingCart ? "loading" : ""
          }`}
          onClick={handleClickCart}
          disabled={loadingCart}
        >
          <CartIcon />
        </ActionBtn>
        <ActionBtn
          className={`${isInWishList(id) ? "active wishlist-active" : ""} ${
            loadingWish ? "loading" : ""
          }`}
          onClick={handleClickHeart}
          disabled={loadingWish}
        >
          <HeartIcon filled={isInWishList(id)} />
        </ActionBtn>
      </ActionIcons>

      {/* Course Image */}
      {imgSrc && (
        <ImageContainer>
          <CourseImage
            src={imgSrc || "/placeholder.svg"}
            alt={`صورة تخص ${name || "الدورة"}`}
          />
          <ImageOverlay />
        </ImageContainer>
      )}

      <CardContent>
        {/* Course Header */}
        <CourseHeader
          onClick={() => {
            navigate(`/${PATH.Courses}/${name}/${id}`, { replace: true });
          }}
        >
          <CourseInfo>
            <CourseTitle>{name}</CourseTitle>

            <CourseMeta>
              <MetaItem>
                <BookIcon />
                <span>المادة: {subject}</span>
              </MetaItem>
              <MetaItem>
                <GraduationCapIcon />
                <span>{branch}</span>
              </MetaItem>
            </CourseMeta>
          </CourseInfo>

          {/* Teacher Info */}
          {teacherName && (
            <TeacherInfo>
              <TeacherDetails>
                <UserIcon />
                <TeacherLabel>المعلم: </TeacherLabel>
                <TeacherName>{teacherName}</TeacherName>
              </TeacherDetails>
            </TeacherInfo>
          )}

          {/* Description */}
          {desc && <CourseDescription>{desc}</CourseDescription>}
        </CourseHeader>

        {/* Footer */}
        <CardFooter>
          {/* Rating */}
          <RatingContainer>
            <StarsContainer>{renderStars()}</StarsContainer>
            <RatingText>({starIcon.toFixed(1)})</RatingText>
          </RatingContainer>

          {/* Price */}
          {price !== undefined && (
            <PriceContainer>
              {price === 0 ? (
                <FreeBadge>مجاني</FreeBadge>
              ) : (
                <PriceInfo>
                  {priceAfterDiscount ? (
                    <>
                      <OldPrice>{price} ₪</OldPrice>
                      <CurrentPrice>{priceAfterDiscount} ₪</CurrentPrice>
                    </>
                  ) : (
                    <CurrentPrice>{price} ₪</CurrentPrice>
                  )}
                </PriceInfo>
              )}
            </PriceContainer>
          )}
        </CardFooter>
      </CardContent>
    </CourseCardContainer>
  );
};
