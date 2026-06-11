import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const teachersApi = {
  // GET /users?role=teacher
  getAll: async (params = {}) => {
    const { data } = await axiosInstance.get('/users', {
      params: { role: 'teacher', ...params },
    });
    return data;
  },

  // GET /users/:id
  getById: async (id) => {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  },

  // GET /users/:teacherId/teacherReviews
  getReviews: async (teacherId) => {
    const { data } = await axiosInstance.get(
      `/users/${teacherId}/teacherReviews`
    );
    return data;
  },

  // POST /users/:teacherId/teacherReviews
  addReview: async ({ teacherId, rating, comment }) => {
    const { data } = await axiosInstance.post(
      `/users/${teacherId}/teacherReviews`,
      { rating, comment }
    );
    return data;
  },

  // DELETE /users/:teacherId/teacherReviews/:id
  deleteReview: async ({ teacherId, reviewId }) => {
    await axiosInstance.delete(
      `/users/${teacherId}/teacherReviews/${reviewId}`
    );
  },

  // GET /courses?teacher=:teacherId
  getCourses: async (teacherId) => {
    const { data } = await axiosInstance.get('/courses', {
      params: { teacher: teacherId },
    });
    return data;
  },
};