import styled from "styled-components";
import { Pargrahph } from "../typography";
import { WrapperElementFlexSpace } from "../../styles/style";


export const CardDiv = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 20px;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }

  & img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 24px 24px 0 0;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  & > span {
    padding: 0 20px;
    margin-top: 12px;
    font-size: 15px;
    line-height: 1.6;
    color: #374151;
  }

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  @media (max-width: 767px) {
    width: 100%;
    margin: 16px 0;
  }

  /* Optional scroll animation: uncomment to enable */
  /*
  animation: cardAnim 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);

  @keyframes cardAnim {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
  }
  */
`;


export const IconStarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 16px;
  flex-wrap: wrap;
  gap: 10px;
`;

export const StarWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

export const TeacherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  & img {
    width: 35px;
    height: 35px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #d1d5db;
  }
`;

export const TeacherInfoAndCourse = styled.div`
  display: flex;
  align-items:center;
  justify-content: center;
  gap: 4px;

  & span {
    font-size: 14px;
    opacity: 0.7;
  }
`;

export const ActionIcons = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 10px;
  z-index: 100;
`;

export const PriceBadge = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1e3a8a;
  background-color: #e0f2fe;
  padding: 4px 12px;
  border-radius: 9999px;
  display: inline-block;
  margin-right: auto;
`;

export const RatingStarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & span {
    font-size: 14px;
    color: #6b7280;
  }
`;


export const Card = styled.div`
  position: relative;
  cursor: pointer;
  padding: 24px 16px 28px;
  max-width: 340px;
  margin: auto;
  border-radius: 24px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  margin-top: 20px ;

`;

export const Badge = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: var(--color-link, #007bff);
  color: white;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 50px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

export const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

export const Img = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary, #007bff);
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
  }
`;

export const NameWrapper = styled(WrapperElementFlexSpace)`
  justify-content: center;
  padding-bottom: 10px;
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledPargrahph = styled(Pargrahph)`
  display: inline-block;
  font-weight: 800;
  color: var(--color-primary-dark, #004085);
  text-align: center;
  width: 100%;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary, #007bff);
  }
`;

export const UnderlineBar = styled.div`
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 40px;
  background-color: var(--color-primary, #007bff);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
  left: 50%;
  transform: translateX(-50%);

  ${NameWrapper}:hover & {
    opacity: 1;
  }
`;

export const Description = styled.p`
  color: #444;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  padding: 0 16px;
  line-height: 1.5;
  /* min-height: 30px; */
`;

export const StyledIconStarDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4px;
`;

export const StyledRatingStarsContainer = styled.div`
  font-size: 20px;
`;
