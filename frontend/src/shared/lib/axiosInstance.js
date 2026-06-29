// src/shared/lib/axiosInstance.js

import axios from 'axios';
import { PATH } from '../../constants';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // مرة واحدة هنا — مش في كل request
});

// اعتراض الطلبات لإضافة لغة الموقع الحالية في الـ Headers لكي يفهمها السيرفر ويرد بالترجمة الصحيحة
axiosInstance.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('tawjihi-language') || 'ar';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


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
      window.location.href = PATH.login;
    }

    return Promise.reject(error);
  }
);