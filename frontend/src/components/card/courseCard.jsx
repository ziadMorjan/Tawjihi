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
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes";

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
        toast.info(" تمت إزالة الدورة من قائمة المفضلة");
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

  const navigate = useNavigate();

  return (
    <CardDiv style={{ position: "relative" }}>
      <ActionIcons>
        <CartIcon
          active={isInCartList(id)}
          onClick={handleClickCart}
          className={loadingCart ? "loading-icon-cart" : ""}
        />
        <HeartIcon
          active={isInWishList(id)}
          onClick={handleClickHeart}
          className={loadingWish ? "loading-icon-heart" : ""}
        />
      </ActionIcons>
      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "الدورة"}`} />}
      <WrapperElementFlexSpace
        style={{ padding: "16px", cursor: "pointer" }}
        onClick={() => {
          navigate(`/${PATH.Courses}/${name}/${id}`, { replace: true });
        }}
      >
        <Pargrahph size="22px">الدورة : {name}</Pargrahph>

        <div style={{width:"100%",display:"flex" , alignItems:"center",justifyContent:"space-between"}}>

        <Pargrahph size="16px">المادة: {subject}</Pargrahph>
        <Pargrahph size="16px">{branch}</Pargrahph>

        </div>
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
