import styled from "styled-components";

export const CardDiv = styled.div`
  width: 320px;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s linear;
  margin-top: 0px;

  & img {
    width: 100%;
    border-bottom: 1px solid var(--color-primary);
    border-radius: 8px 8px 0 0;
  }

  & span {
    display: block;
    margin: 5px 0px;
  }

  &:hover {
    box-shadow: 0px 0px 1px 1px var(--color-primary);
  }

  @media (max-width: 767px) {
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const IconStarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StarWrapper = styled.div`
  display: flex;
  gap: 4px;
  font-size: 18px;
`;


export const TeacherInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 10px;

  & img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid #ccc;
  }

  & span {
    font-weight: 500;
    color: #333;
  }
`;
