import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const authApi = {
  login: async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },

  // register يدعم FormData
  register: async (userData) => {
    const isFormData = userData instanceof FormData;
    const { data } = await axiosInstance.post('/auth/signup', userData, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
    });
    return data;
  },


  getMe: async () => {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },

  logout: async () => {
    await axiosInstance.get('/auth/logout');
  },

  googleAuth: () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  },

  forgotPassword: async (email) => {
    const { data } = await axiosInstance.post('/auth/forgetPassword', { email });
    return data;
  },

  verifyResetCode: async (resetCode) => {
    const { data } = await axiosInstance.post('/auth/verifyResetCode', { resetCode });
    return data;
  },

  resetPassword: async ({ email, newPassword, newConfirmPassword }) => {
    const { data } = await axiosInstance.patch('/auth/resetPassword', {
      email,
      newPassword,
      newConfirmPassword,
    });
    return data;
  },
};