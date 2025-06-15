//global style
import { WrapperElementFlexSpace } from "../../styles/style";

//style
import {
  CardDiv,
  IconStarDiv,
  StarWrapper,
  RatingStarsContainer,
} from "./style";

//components
import { EmptyStar, FullStar, HalfStar } from "../Star";
import { Pargrahph } from "../typography";
import { useNavigate } from "react-router-dom";

export const TeacherCard = ({ imgSrc, name, desc, starIcon = 0 , id}) => {
  //calc the star empty and full and half
  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const navigate = useNavigate();

  return (
    <CardDiv onClick={()=>navigate(`/teachers/${id}`)} style={{ cursor: "pointer" }}>
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