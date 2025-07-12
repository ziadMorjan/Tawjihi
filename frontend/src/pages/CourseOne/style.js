import styled from "styled-components";

export const PageWrapper = styled.section`
  padding: 20px;
`;

export const StyledCourseWrapper = styled.section`
  width: 100%;
  padding: 20px;
  background-color: ${({theme}) => theme.background_secondary};
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  margin: 15px 0px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CourseImage = styled.img`
  width: 35%;
  min-width: 250px;
  border-radius: 8px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DetailsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const StartButtonWrapper = styled.div`
  align-self: flex-start;
  margin-top: 20px;
`;

export const Label = styled.span`
  font-weight: 500;
  font-size: 16px;
`;

export const WatchText = styled.span`
  font-size: 14px;
  color: ${({theme}) => theme.color};
`;

export const LeftWrapper = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
  max-width: 800px;
  background-color: ${({theme}) => theme.background};
`;

// Right side wrapper for TeacherCard
export const RightWrapper = styled.div`
  flex: 1 1 35%;
  min-width: 250px;
  max-width: 350px;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0px;

  @media (max-width:767px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
  }
`;

export const AboutCourseDiv = styled(StyledCourseWrapper)`

`

export const ReviewSection = styled.div`
  background-color: ${({theme}) => theme.background_secondary};
  border-radius: 12px;
  padding: 24px;
  margin-top: 2rem;
  box-shadow: 0 2px 12px ${({theme}) => theme.box_shadow};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;





export const VideoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PlayerContainer = styled.div`
  flex: 2;
  min-width: 300px;

  iframe {
    width: 100%;
    height: 500px;
    border: none;
    border-radius: 10px;
  }
`;

export const ListContainer = styled.div`
  flex: 1;
  min-width: 400px;
`;
