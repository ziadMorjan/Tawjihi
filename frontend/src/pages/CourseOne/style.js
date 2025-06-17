import { Button } from "@mui/material";
import styled from "styled-components";

export const PageWrapper = styled.section`
  padding: 20px;
`;

export const StyledCourseWrapper = styled.section`
  width: 100%;
  padding: 20px;
  background-color: #f5f5f5;
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
  color: #333;
`;

export const LeftWrapper = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
  max-width: 800px;
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
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ReviewCard = styled.div`
  display: flex;
  gap: 16px;
  background-color: #f1f5f9;
  padding: 16px;
  border-radius: 10px;
`;

export const AvatarCircle = styled.div`
  background-color: #3f51b5;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

export const ReviewContent = styled.div`
  flex: 1;
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const ReviewerName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #222;
`;

export const ReviewText = styled.p`
  font-size: 14px;
  color: #444;
  margin: 0;
  line-height: 1.6;
`;

export const LeaveCommentWrapper = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  resize: vertical;
`;


export const SubmitButton = styled('button')`
  align-self: flex-end;
  padding: 10px 24px;
  font-size: 15px;
  border-radius: 8px;
  text-transform: none;
  box-shadow: none;
  border: none;
  color: #fff;
  background-color: #1976d2;
  transition: background-color 0.3s ease;
  margin-top: 15px;
  cursor: pointer;

  &:hover {
    background-color: #155fa0;
  }

  &:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
  }
`;