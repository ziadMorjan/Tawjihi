//react
import React from "react";

//global style
import { WrapperElementFlexSpace } from "../../styles/style";

//style
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

//components
import { Pargrahph } from "../typography";
import { EmptyStar, FullStar, HalfStar } from "../Star";
import { CartIcon, HeartIcon } from "../Icon/cartAndWishIcon";

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
}) => {
  const [cartActive, setCartActive] = React.useState(false);
  const [heartActive, setHeartActive] = React.useState(false);

  //calc the star empty and full and half
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
        <HeartIcon
          active={heartActive}
          onClick={() => setHeartActive(!heartActive)}
        />
      </ActionIcons>

      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "الدورة"}`} />}

      <WrapperElementFlexSpace style={{ padding: "16px" }}>
        <Pargrahph size="25px">الدورة : {name} </Pargrahph>
        <Pargrahph size="18px">الفرع : {branch} </Pargrahph>
        <Pargrahph size="14px"> المادة: {subject} </Pargrahph>

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
            {Array.from({ length: fullStars }).map((_, index) => (
              <FullStar key={`full-${index}`} />
            ))}
            {hasHalfStar && <HalfStar key="half" />}
            {Array.from({ length: emptyStars }).map((_, index) => (
              <EmptyStar key={`empty-${index}`} />
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
