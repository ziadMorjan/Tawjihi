import React, { useContext, useState } from "react";
import axios from "axios";
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

import { WrapperElementFlexSpace } from "../../styles/style";
import { Pargrahph } from "../typography";
import { EmptyStar, FullStar, HalfStar } from "../Star";
import { CartIcon, HeartIcon } from "../Icon/cartAndWishIcon";
import { API_URL } from "../../config";
import { useCRUD } from "../../hooks/useCRUD";
import { WishListContext } from "../../context/WishListContext";

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
  const [cartActive, setCartActive] = useState(false);

  const { setShowAlertWishList } = useContext(WishListContext);
  const { addToWishList, removeFromWishList, isInWishList, setWishList } =
    useCRUD();

  const [heartActive, setHeartActive] = useState(() => isInWishList(id));

  const handleClickHeart = async () => {
    const currentlyInWishlist = isInWishList(id);
    setHeartActive(!currentlyInWishlist);

    try {
      if (currentlyInWishlist) {
        const res = await axios.delete(`${API_URL}/wishlist/${id}`, {
          withCredentials: true,
        });
        setWishList(res.data.wishlist);
        removeFromWishList(item._id);
      } else {
        const res = await axios.post(
          `${API_URL}/wishlist/${id}`,
          { itemId: id },
          { withCredentials: true }
        );
        setWishList(res.data.wishlist);
        addToWishList(item);
      }
      setShowAlertWishList(true);
    } catch (e) {
      console.error("Error toggling wishlist:", e.message);
    }
  };

  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <CardDiv className="card-div">
      <ActionIcons>
        <CartIcon
          active={cartActive}
          onClick={() => setCartActive(!cartActive)}
        />
        <HeartIcon active={heartActive} onClick={handleClickHeart} />
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
            {hasHalfStar && <HalfStar key="half" />}
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
