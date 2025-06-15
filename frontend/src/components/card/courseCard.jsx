//react
import { useState } from "react";
import axios from "axios";

// styles
import {
  CardDiv,
  IconStarDiv,
  StarWrapper,
  TeacherInfo,
  TeacherInfoAndCourse,
  ActionIcons,
  PriceBadge,
  RatingStarsContainer,
} from "./style";

//global styles
import { WrapperElementFlexSpace } from "../../styles/style";

// components
import { Pargrahph } from "../typography";
import { EmptyStar, FullStar, HalfStar } from "../Star";
import { CartIcon, HeartIcon } from "../Icon/cartAndWishIcon";

//URL
import { API_URL } from "../../config";
// hooks
import { useCRUD } from "../../hooks/useCRUD";

// Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoadingOverlay = ({ text = "جارٍ التنفيذ..." }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255,255,255,0.6)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
      fontSize: "16px",
    }}
  >
    <div className="loader" />
    <span style={{ marginTop: "8px", fontWeight: "bold", color: "#333" }}>
      {text}
    </span>
  </div>
);

export const Card = ({
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

  const handleClickHeart = async () => {
    setLoadingWish(true);
    try {
      if (isInWishList(id)) {
        await axios.delete(`${API_URL}/wishlist/${id}`, {
          withCredentials: true,
        });
        removeFromWishList(id);
        toast.info("تمت إزالة الدورة من قائمة الرغبات");
      } else {
        await axios.post(
          `${API_URL}/wishlist/${id}`,
          { itemId: id },
          { withCredentials: true }
        );
        addToWishList(item);
        toast.success("تمت إضافة الدورة إلى قائمة الرغبات");
      }
    } catch (e) {
      console.error("Wishlist error:", e.message);
      toast.error("حدث خطأ أثناء تحديث قائمة الرغبات");
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

  return (
    <CardDiv style={{ position: "relative" }}>
      {(loadingCart || loadingWish) && <LoadingOverlay />}

      <ActionIcons>
        <CartIcon
          active={loadingCart || isInCartList(id)}
          onClick={handleClickCart}
        />
        <HeartIcon
          active={loadingWish || isInWishList(id)}
          onClick={handleClickHeart}
        />
      </ActionIcons>

      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "الدورة"}`} />}
      <WrapperElementFlexSpace style={{ padding: "16px" }}>
        <Pargrahph size="25px">الدورة : {name}</Pargrahph>
        <Pargrahph size="18px">الفرع : {branch}</Pargrahph>
        <Pargrahph size="14px">المادة: {subject}</Pargrahph>

        <TeacherInfo>
          {teacherImg && <img src={teacherImg} alt={`صورة ${teacherName}`} />}
          <TeacherInfoAndCourse>
            {teacherName && (
              <>
                <span>المعلم : </span>
                <span>{teacherName}</span>
              </>
            )}
          </TeacherInfoAndCourse>
        </TeacherInfo>
      </WrapperElementFlexSpace>

      {desc && (
        <span style={{ padding: "0 20px", marginTop: "4px" }}>
          <strong>{desc}</strong>
        </span>
      )}

      <IconStarDiv>
        <RatingStarsContainer>
          <StarWrapper>
            {Array.from({ length: fullStars }).map((_, i) => (
              <FullStar key={`full-${i}`} />
            ))}
            {hasHalfStar && <HalfStar />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <EmptyStar key={`empty-${i}`} />
            ))}
          </StarWrapper>
        </RatingStarsContainer>

        {price !== undefined && (
          <PriceBadge>
            {price === 0 ? (
              <>مجاني</>
            ) : (
              <>
                {price} ₪{" "}
                {priceAfterDiscount && (
                  <del
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                      marginLeft: "6px",
                    }}
                  >
                    {priceAfterDiscount} ₪
                  </del>
                )}
              </>
            )}
          </PriceBadge>
        )}
      </IconStarDiv>
    </CardDiv>
  );
};
