//style
import {
  AvatarCircle,
  ReviewCard,
  ReviewContent,
  ReviewerName,
  ReviewHeader,
  ReviewList,
  ReviewText,
} from "./style";

//component
import { StarRating } from "../Star/starRating";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import SkeletonComment from "../Loading/SkeletonComment";
import { Typography } from "@mui/material";

const ReviewListSection = ({ courseId }) => {

  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setReviewsLoading] = useState(false);

  console.log("Course ID:", courseId);

  useEffect(() => {
    const getReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await axios.get(`${API_URL}/lessons/${courseId}/comments`, { withCredentials: true });

        console.log("Reviews fetched successfully:", response);
        setReviews(response.data.data.docs)
        // Process reviews as needed
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    }
    getReviews();
  }, [])


  return (


    <ReviewList>


      {isReviewsLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <SkeletonComment key={i} />
        ))

      ) : (reviews.length === 0 ? (
        <Typography>
          لا توجد مراجعات حتى الآن
        </Typography>
        
      ) : (

        reviews.map((review, index) => (

          <ReviewCard key={index}>
            <AvatarCircle>أ</AvatarCircle>
            <ReviewContent>
              <ReviewHeader>
                <ReviewerName>أحمد خالد</ReviewerName>
              </ReviewHeader>
              <ReviewText>
                {review.content}
              </ReviewText>
            </ReviewContent>
          </ReviewCard>

        ))))}

    </ReviewList>
  )

};

export default ReviewListSection;
