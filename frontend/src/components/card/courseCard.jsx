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

// SVG components
const FullStar = () => (
  <svg
    width="24"
    height="24"
    fill="#facc15"
    stroke="#fbbf24"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const HalfStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="halfGrad" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="50%" stopColor="#e5e7eb" />
      </linearGradient>
    </defs>
    <path
      fill="url(#halfGrad)"
      stroke="#fbbf24"
      strokeWidth="1.5"
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

const EmptyStar = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="#d1d5db"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const CartIcon = ({ active, onClick }) => (
  <svg
    onClick={onClick}
    style={{
      cursor: "pointer",
      fill: active ? "#1e40af" : "none",
      stroke: "#2563eb",
      transition: "fill 0.3s ease, transform 0.2s ease",
      transform: active ? "scale(1.2)" : "scale(1)",
    }}
    width="24"
    height="24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="9" cy="21" r="1" fill={active ? "#1e40af" : "#2563eb"} />
    <circle cx="20" cy="21" r="1" fill={active ? "#1e40af" : "#2563eb"} />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = ({ active, onClick }) => (
  <svg
    onClick={onClick}
    style={{
      cursor: "pointer",
      fill: active ? "#dc2626" : "none",
      stroke: "#ef4444",
      transition: "fill 0.3s ease, transform 0.2s ease",
      transform: active ? "scale(1.2)" : "scale(1)",
    }}
    width="24"
    height="24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.78 0L12 5.62l-1.02-1.02a5.5 5.5 0 0 0-7.78 7.78l1.02 1.02L12 21.23l7.78-7.78 1.02-1.02a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
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
}) => {
  const [cartActive, setCartActive] = React.useState(false);
  const [heartActive, setHeartActive] = React.useState(false);

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
