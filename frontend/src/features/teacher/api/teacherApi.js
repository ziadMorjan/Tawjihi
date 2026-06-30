import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const teacherApi = {
  getTeacherStats: async () => {
    const { data } = await axiosInstance.get('/teacher/stats');
    return data.data;
  },

  getMyCourses: async (teacherId) => {
    const { data } = await axiosInstance.get('/courses', {
      params: { teacher: teacherId },
    });
    return data.data.docs ?? [];
  },

  createCourse: async (formData) => {
    const { data } = await axiosInstance.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateCourse: async ({ id, formData }) => {
    const { data } = await axiosInstance.patch(`/courses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteCourse: async (id) => {
    const { data } = await axiosInstance.delete(`/courses/${id}`);
    return data;
  },

	getMyComments: async () => {
		const { data } = await axiosInstance.get('/comments/teacher');
		return data.data.docs ?? [];
	},

	replyToComment: async ({ id, text }) => {
		const { data } = await axiosInstance.post(`/comments/${id}/reply`, { text });
		return data;
	},

	editReply: async ({ commentId, replyId, text }) => {
		const { data } = await axiosInstance.patch(`/comments/${commentId}/replies/${replyId}`, { text });
		return data;
	},

	deleteReply: async ({ commentId, replyId }) => {
		await axiosInstance.delete(`/comments/${commentId}/replies/${replyId}`);
	},

	deleteComment: async (id) => {
		await axiosInstance.delete(`/comments/${id}`);
	},

  getMyReviews: async (courseIds) => {
    const results = await Promise.all(
      courseIds.map((cid) =>
        axiosInstance.get(`/courses/${cid}/reviews`).then((r) => r.data.data.docs ?? []),
      ),
    );
    return results.flat();
  },

  deleteReview: async (id) => {
    await axiosInstance.delete(`/reviews/${id}`);
  },

  sendNotificationToStudents: async ({ title, message }) => {
    const { data } = await axiosInstance.post('/notifications/send-to-students', {
      title,
      message,
    });
    return data;
  },
};
