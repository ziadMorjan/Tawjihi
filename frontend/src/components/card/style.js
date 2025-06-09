import styled from "styled-components";


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
  z-index: 2;
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
