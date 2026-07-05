import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const commentsApi = {
  getByLesson: async (lessonId) => {
    const { data } = await axiosInstance.get('/comments', {
      params: { lesson: lessonId },
    });
    return data;
  },

  addComment: async ({ lessonId, content }) => {
    const { data } = await axiosInstance.post('/comments', {
      lesson:  lessonId,
      content: content,
    });
    return data;
  },

  updateComment: async (commentId, { content }) => {
    const { data } = await axiosInstance.patch(`/comments/${commentId}`, { content });
    return data;
  },

  deleteComment: async (commentId) => {
    await axiosInstance.delete(`/comments/${commentId}`);
  },
};