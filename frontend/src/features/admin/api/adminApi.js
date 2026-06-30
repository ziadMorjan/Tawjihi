import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const adminApi = {
  getAdminStats: async () => {
    const { data } = await axiosInstance.get('/admin/stats');
    return data.data;
  },

  getPendingTeachers: async () => {
    const { data } = await axiosInstance.get('/users', {
      params: { role: 'teacher', isActive: false },
    });
    return data.data.docs ?? [];
  },

  getAllUsers: async () => {
    const { data } = await axiosInstance.get('/users', {
      params: { role: 'user' },
    });
    return data.data.docs ?? [];
  },

  getAllCourses: async () => {
    const { data } = await axiosInstance.get('/courses');
    return data.data.docs ?? [];
  },

  getAllTeacherIds: async () => {
    const { data } = await axiosInstance.get('/users', {
      params: { role: 'teacher' },
    });
    return (data.data.docs ?? []).map((u) => u._id);
  },

  approveTeacher: async (id) => {
    const { data } = await axiosInstance.patch(`/users/${id}`, { isActive: true });
    return data;
  },

  rejectTeacher: async (id) => {
    const { data } = await axiosInstance.delete(`/users/${id}`);
    return data;
  },

  updateUser: async ({ id, ...body }) => {
    const { data } = await axiosInstance.patch(`/users/${id}`, body);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await axiosInstance.delete(`/users/${id}`);
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

  // ── Branches ──────────────────────────────────────────────────────────────

  getBranches: async () => {
    const { data } = await axiosInstance.get('/branches');
    return data.data.docs ?? [];
  },

  createBranch: async (name) => {
    const { data } = await axiosInstance.post('/branches', { name });
    return data;
  },

  updateBranch: async ({ id, name }) => {
    const { data } = await axiosInstance.patch(`/branches/${id}`, { name });
    return data;
  },

  deleteBranch: async (id) => {
    const { data } = await axiosInstance.delete(`/branches/${id}`);
    return data;
  },

  // ── Subjects ──────────────────────────────────────────────────────────────

  getSubjects: async () => {
    const { data } = await axiosInstance.get('/subjects');
    return data.data.docs ?? [];
  },

  createSubject: async ({ name, branch }) => {
    const { data } = await axiosInstance.post('/subjects', { name, branch });
    return data;
  },

  updateSubject: async ({ id, name, branch }) => {
    const { data } = await axiosInstance.patch(`/subjects/${id}`, { name, branch });
    return data;
  },

  deleteSubject: async (id) => {
    const { data } = await axiosInstance.delete(`/subjects/${id}`);
    return data;
  },

  // ── Coupons ───────────────────────────────────────────────────────────────

  getCoupons: async () => {
    const { data } = await axiosInstance.get('/coupons');
    return data.data.docs ?? [];
  },

  createCoupon: async ({ name, discount, expire }) => {
    const { data } = await axiosInstance.post('/coupons', { name, discount, expire });
    return data;
  },

  updateCoupon: async ({ id, ...body }) => {
    const { data } = await axiosInstance.patch(`/coupons/${id}`, body);
    return data;
  },

  deleteCoupon: async (id) => {
    const { data } = await axiosInstance.delete(`/coupons/${id}`);
    return data;
  },

  // ── News ──────────────────────────────────────────────────────────────────

  getNews: async () => {
    const { data } = await axiosInstance.get('/news');
    return data.data.docs ?? [];
  },

  createNews: async (formData) => {
    const { data } = await axiosInstance.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateNews: async ({ id, formData }) => {
    const { data } = await axiosInstance.patch(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteNews: async (id) => {
    const { data } = await axiosInstance.delete(`/news/${id}`);
    return data;
  },

  // ── Notifications ─────────────────────────────────────────────────────────

  broadcastNotification: async ({ title, body, type }) => {
    const { data } = await axiosInstance.post('/notifications/broadcast', { title, body, type });
    return data;
  },

  broadcastToSpecific: async ({ title, body, recipients, type }) => {
    const { data } = await axiosInstance.post('/notifications/broadcast', {
      title,
      body,
      recipients,
      type,
    });
    return data;
  },

  sendToStudents: async ({ title, message }) => {
    const { data } = await axiosInstance.post('/notifications/send-to-students', {
      title,
      message,
    });
    return data;
  },
};
