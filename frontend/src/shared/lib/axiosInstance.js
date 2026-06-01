// src/shared/lib/axiosInstance.js

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // مرة واحدة هنا — مش في كل request
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // امسح بيانات المستخدم وارجعه للـ login
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);