import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ---------------- Styled Components ----------------

const Card = styled.div`
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border || "#e5e7eb"};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 20px auto;
  cursor: pointer;
  min-width: 30%;

  @media (max-width: 767px) {
    max-width: 100%;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const BadgeIcon = styled.svg`
  width: 12px;
  height: 12px;
`;

const CardContent = styled.div`
  padding: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
`;

const ImageSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const GlowEffect = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.05;
  transform: scale(1.1);
  transition: opacity 0.3s ease;

  ${Card}:hover & {
    opacity: 0.1;
  }
`;

const Avatar = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.svg`
  width: 48px;
  height: 48px;
  color: #6b7280;
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const TeacherName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.color || "#000"};
  margin: 0;
  transition: color 0.2s ease;

  ${Card}:hover & {
    color: #2563eb;
  }
`;

const NameUnderline = styled.div`
  width: 48px;
  height: 4px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s ease;

  ${Card}:hover & {
    width: 80px;
  }
`;

const Description = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  padding: 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const StarSvg = styled.svg`
  width: 16px;
  height: 16px;

  &.star-filled {
    color: #fbbf24;
    fill: currentColor;
  }

  &.star-half {
    color: #fbbf24;
  }

  &.star-empty {
    color: #d1d5db;
  }
`;

const RatingText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(59, 130, 246, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  ${Card}:hover & {
    opacity: 1;
  }
`;

// ---------------- Icons ----------------

const StarIcon = ({ filled, half, className }) => {
  if (half) {
    return (
      <StarSvg
        className={`${className} star-half`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <defs>
          <linearGradient id="half-fill-teacher">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="url(#half-fill-teacher)"
        />
      </StarSvg>
    );
  }

  return (
    <StarSvg
      className={`${className} ${filled ? "star-filled" : "star-empty"}`}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </StarSvg>
  );
};

// ---------------- Main Component ----------------

export const TeacherCard = ({
  imgSrc,
  name,
  desc,
  starIcon = 0,
  id,
  badge,
}) => {
  const navigate = useNavigate();
  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} filled={true} />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" half={true} />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} filled={false} />);
    }

    return stars;
  };

  const handleClick = () => navigate(`/teachers/${id}`);
  const handleKeyDown = (e) =>
    (e.key === "Enter" || e.key === " ") && handleClick();

  return (
    <Card
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
    >
      {badge && (
        <Badge>
          <BadgeIcon
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
          </BadgeIcon>
          {badge}
        </Badge>
      )}

      <CardContent>
        {imgSrc && (
          <ImageSection>
            <GlowEffect />
            <Avatar>
              {imgSrc ? (
                <AvatarImage
                  src={imgSrc}
                  alt={`صورة تخص ${name || "المعلم"}`}
                />
              ) : (
                <AvatarPlaceholder
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </AvatarPlaceholder>
              )}
            </Avatar>
          </ImageSection>
        )}

        <NameSection>
          <TeacherName>{name}</TeacherName>
          <NameUnderline />
        </NameSection>

        {desc && <Description>{desc}</Description>}

        <RatingSection>
          <Stars>{renderStars()}</Stars>
          <RatingText>({starIcon.toFixed(1)})</RatingText>
        </RatingSection>

        <HoverOverlay />
      </CardContent>
    </Card>
  );
};
