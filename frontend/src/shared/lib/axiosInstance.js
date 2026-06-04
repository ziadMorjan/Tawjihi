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
    const isAuthEndpoint =
      error.config?.url?.includes('/users/me') ||
      error.config?.url?.includes('/auth/');

    // الـ redirect بس لو مش auth endpoint
    // يعني لو حاول يوصل لصفحة محمية وهو مش logged in
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);