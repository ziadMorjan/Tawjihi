import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const lessonsApi = {
  // GET /lessons?course=:courseId (sorted by order)
  getByCourse: async (courseId) => {
    const { data } = await axiosInstance.get('/lessons', {
      params: { course: courseId, sort: 'order' },
    });
    return data;
  },

  // POST /lessons (multipart/form-data)
  createLesson: async ({ formData, onUploadProgress }) => {
    const { data } = await axiosInstance.post('/lessons', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return data;
  },

  // PATCH /lessons/:id (multipart/form-data)
  updateLesson: async ({ id, formData, onUploadProgress }) => {
    const { data } = await axiosInstance.patch(`/lessons/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return data;
  },

  // DELETE /lessons/:id
  deleteLesson: async (id) => {
    await axiosInstance.delete(`/lessons/${id}`);
  },

  // PATCH /lessons/reorder
  reorderLessons: async ({ courseId, lessons }) => {
    const { data } = await axiosInstance.patch('/lessons/reorder', { courseId, lessons });
    return data;
  },

  // POST /lessons/:id/ai
  getAIContent: async (lessonId) => {
    const { data } = await axiosInstance.post(`/lessons/${lessonId}/ai`);
    return data;
  },

  // PATCH /enrollments/:courseId/progress
  markProgress: async ({ courseId, lessonId, completed }) => {
    const { data } = await axiosInstance.patch(`/enrollments/${courseId}/progress`, {
      lessonId,
      completed,
    });
    return data;
  },

  // POST /lessons/:lessonId/resources
  addResource: async ({ lessonId, formData, onUploadProgress }) => {
    const { data } = await axiosInstance.post(`/lessons/${lessonId}/resources`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return data;
  },

  // DELETE /lessons/:lessonId/resources/:resourceId
  deleteResource: async ({ lessonId, resourceId }) => {
    await axiosInstance.delete(`/lessons/${lessonId}/resources/${resourceId}`);
  },
};