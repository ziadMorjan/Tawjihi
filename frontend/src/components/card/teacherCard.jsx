//global style
import { WrapperElementFlexSpace } from "../../styles/style";

//style
import {
  CardDiv,
  IconStarDiv,
  StarWrapper,
  RatingStarsContainer,
} from "./style";
import { Pargrahph } from "../typography";
import { Fragment } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

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

export const TeacherCard = ({ imgSrc, name, desc, starIcon = 0, id }) => {
  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const navigate = useNavigate();
  
  return (

    
    <CardDiv onClick={() => navigate(`/teachers/${id}`)}>
      {console.log(id)}
      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "المعلم"}`} />}

      <WrapperElementFlexSpace style={{ padding: "16px" }}>
        <Pargrahph size="25px">المعلم : {name} </Pargrahph>
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
      </IconStarDiv>
    </CardDiv>
  );
};
