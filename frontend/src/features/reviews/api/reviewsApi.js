import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const reviewsApi = {
  getByCourse: async (courseId) => {
    const { data } = await axiosInstance.get('/reviews', {
      params: { course: courseId },
    });
    return data;
  },

  addReview: async ({ courseId, rating, review }) => {
    const { data } = await axiosInstance.post('/reviews', {
      course:  courseId,
      rating:  rating,
      comment: review,
    });
    return data;
  },

  updateReview: async (reviewId, { rating, review }) => {
    const { data } = await axiosInstance.patch(`/reviews/${reviewId}`, {
      rating,
      comment: review,
    });
    return data;
  },

  deleteReview: async (reviewId) => {
    await axiosInstance.delete(`/reviews/${reviewId}`);
  },
};