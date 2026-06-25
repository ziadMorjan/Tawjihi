import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const lessonsApi = {
  // GET /lessons?course=:courseId
  getByCourse: async (courseId) => {
    const { data } = await axiosInstance.get('/lessons', {
      params: { course: courseId },
    });
    return data;
  },
  getAIContent: async (lessonId) => {
    const { data } = await axiosInstance.post(`/lessons/${lessonId}/ai`);
    return data;
  },
};