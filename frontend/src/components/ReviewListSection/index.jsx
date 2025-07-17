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

import { StarRating } from "../Star/starRating";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import SkeletonComment from "../Loading/SkeletonComment";
import {
  Typography,
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const ReviewListSection = ({ courseId, lessonId, from }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setReviewsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  useEffect(() => {
    const getReviews = async () => {
      try {
        setReviewsLoading(true);
        let response = {}

        if (from === 'videoPage') {
          response = await axios.get(`${API_URL}/lessons/${lessonId}/comments`, { withCredentials: true });
        } else if (from === 'coursePage') {
          response = await axios.get(`${API_URL}/courses/${courseId}/reviews`, { withCredentials: true });
        }

        setReviews(response.data.data.docs)
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    }
    getReviews();
  }, [courseId, lessonId]);

  const handleDelete = async (clickedReviewId) => {
    try {
      let response = {};
      if (from === 'videoPage') {
        response = await axios.delete(`${API_URL}/lessons/${lessonId}/comments/${clickedReviewId}`, { withCredentials: true });
      } else if (from === 'coursePage') {
        response = await axios.delete(`${API_URL}/courses/${courseId}/reviews/${clickedReviewId}`, { withCredentials: true });
      }

      setReviews(reviews.filter(review => review._id !== clickedReviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  const openEditModal = (reviewId, currentContent) => {
    setEditReviewId(reviewId);
    setEditContent(currentContent);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      let response;
      if (from === 'videoPage') {
        response = await axios.patch(
          `${API_URL}/lessons/${lessonId}/comments/${editReviewId}`,
          { content: editContent },
          { withCredentials: true }
        );
      } else if (from === 'coursePage') {
        response = await axios.patch(
          `${API_URL}/courses/${courseId}/reviews/${editReviewId}`,
          { comment: editContent },
          { withCredentials: true }
        );
      }

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === editReviewId
            ? {
                ...review,
                ...(from === 'videoPage' ? { content: editContent } : { comment: editContent }),
              }
            : review
        )
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <ReviewList>
        {isReviewsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonComment key={i} />
          ))
        ) : reviews.length === 0 ? (
          <Typography style={{ padding: "10px 0px" }}>
            لا توجد مراجعات حتى الآن
          </Typography>
        ) : (
          reviews.map((review, index) => (
            <ReviewCard key={index}>
              <AvatarCircle>{review.user.name.charAt(0).toUpperCase()}</AvatarCircle>
              <ReviewContent>
                <ReviewHeader>
                  <ReviewerName>{review.user.name}</ReviewerName>
                  <ReviewActions>
                    {review.user._id === userId && (
                      <>
                        <FaEdit
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            openEditModal(
                              review._id,
                              from === 'videoPage' ? review.content : review.comment
                            )
                          }
                        />
                        <FaTrash
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(review._id)}
                        />
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
          ))
        )}
      </ReviewList>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            تعديل المراجعة
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={isUpdating}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              onClick={() => setModalOpen(false)}
              disabled={isUpdating}
            >
              إلغاء
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "تحديث"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ReviewListSection;
