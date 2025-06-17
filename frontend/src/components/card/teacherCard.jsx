import { useNavigate } from "react-router-dom";
import { EmptyStar, FullStar, HalfStar } from "../Star";

import {
  Card,
  Badge,
  Description,
  ImageWrapper,
  Img,
  NameWrapper,
  StyledIconStarDiv,
  StyledPargrahph,
  StyledRatingStarsContainer,
  UnderlineBar,
} from "./style";

export const TeacherCard = ({
  imgSrc,
  name,
  desc,
  starIcon = 0,
  id,
  badge,
}) => {
  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/teachers/${id}`)}
      role="button"
      tabIndex={0}
    >
      {badge && <Badge>{badge}</Badge>}

      {imgSrc && (
        <ImageWrapper>
          <Img src={imgSrc} alt={`صورة تخص ${name || "المعلم"}`} />
        </ImageWrapper>
      )}

      <NameWrapper>
        <StyledPargrahph size="22px" title={name}>
          {name}
        </StyledPargrahph>
        <UnderlineBar />
      </NameWrapper>

      {desc && <Description title={desc}>{desc}</Description>}

      <StyledIconStarDiv>
        <StyledRatingStarsContainer>
          <div style={{ display: "flex", gap: "3px" }}>
            {Array.from({ length: fullStars }).map((_, index) => (
              <FullStar key={`full-${index}`} />
            ))}
            {hasHalfStar && <HalfStar key="half" />}
            {Array.from({ length: emptyStars }).map((_, index) => (
              <EmptyStar key={`empty-${index}`} />
            ))}
          </div>
        </StyledRatingStarsContainer>
      </StyledIconStarDiv>
    </Card>
  );
};
