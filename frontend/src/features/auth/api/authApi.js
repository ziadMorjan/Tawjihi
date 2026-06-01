// src/features/auth/api/authApi.js

import { axiosInstance } from "../../../shared/lib/axiosInstance";


export const authApi = {
  // تسجيل الدخول
  login: async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },

  // التسجيل
  register: async (userData) => {
    const { data } = await axiosInstance.post('/auth/register', userData);
    return data;
  },

  // تسجيل الخروج
  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },


  getMe: async () => {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },

  // OAuth
  googleAuth: () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  },

  // نسيت كلمة المرور
  forgotPassword: async (email) => {
    const { data } = await axiosInstance.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async ({ token, newPassword }) => {
    const { data } = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  },

  verifyEmail: async (code) => {
    const { data } = await axiosInstance.post('/auth/verify', { code });
    return data;
  },
};