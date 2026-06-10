import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const userApi = {
  // PATCH /users/updateMe — يقبل FormData (صورة + بيانات)
  updateMe: async (formData) => {
    const { data } = await axiosInstance.patch('/users/updateMe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // PATCH /users/changePassword
  changePassword: async ({ currentPassword, newPassword, newConfirmPassword }) => {
    const { data } = await axiosInstance.patch('/users/changePassword', {
      currentPassword,
      newPassword,
      newConfirmPassword,
    });
    return data;
  },
};