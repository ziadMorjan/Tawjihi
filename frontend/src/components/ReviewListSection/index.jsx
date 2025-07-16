//style
import {
  AvatarCircle,
  ReviewActions,
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
import { FaEdit, FaTrash } from "react-icons/fa";

const ReviewListSection = ({ courseId, lessonId, from }) => {

  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setReviewsLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  console.log("Course ID:", courseId);

  useEffect(() => {
    const getReviews = async () => {
      try {
        setReviewsLoading(true);
        let response = {}

        if (from === 'videoPage') {
                  console.log("the url:", `${API_URL}/lessons/${lessonId}/comments`);

          response = await axios.get(`${API_URL}/lessons/${lessonId}/comments`, { withCredentials: true });
        
        } else if (from === 'coursePage') {
          response = await axios.get(`${API_URL}/courses/${courseId}/reviews`, { withCredentials: true });
        }

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

  const handleDelete = async (clickedReviewId) => {
    try {

      let response = {};
      if (from === 'videoPage') {
        response = await axios.delete(`${API_URL}/lessons/${lessonId}/comments/${clickedReviewId}`, { withCredentials: true });
        
      } else if (from === 'coursePage') {
        response = await axios.delete(`${API_URL}/courses/${courseId}/reviews/${clickedReviewId}`, { withCredentials: true });
      }

      console.log("Review deleted successfully:", response);
      setReviews(reviews.filter(review => review._id !== clickedReviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }


  return (


    <ReviewList>


      {isReviewsLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <SkeletonComment key={i} />
        ))

      ) : (reviews.length === 0 ? (
        <Typography style={{ padding: "10px 0px" }}>
          لا توجد مراجعات حتى الآن
        </Typography>

      ) : (

        reviews.map((review, index) => (
          <ReviewCard key={index}>
            <AvatarCircle> {review.user.name.charAt(0).toUpperCase()} </AvatarCircle>
            <ReviewContent>
              <ReviewHeader>

                {/* أيقونات التعديل والحذف */}
                <ReviewerName>{review.user.name}</ReviewerName>
                <ReviewActions>
                  {review.user._id === userId && (
                    <>
                      <FaEdit />
                      <FaTrash onClick={() => handleDelete(review._id)} />
                    </>
                  )}
                </ReviewActions>
              </ReviewHeader>

              <ReviewText>
                {from === 'videoPage'
                  ? review.content
                  : from === 'coursePage'
                    ? review.comment
                    : null}
              </ReviewText>
            </ReviewContent>
          </ReviewCard>
        ))))}

    </ReviewList>
  )

};

export default ReviewListSection;
