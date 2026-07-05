// src/features/courses/api/coursesApi.js
import { axiosInstance } from '../../../shared/lib/axiosInstance';

// الـ backend يرجع { status, data: { docs, ... } } أو { status, data: [...] }
// نحتاج نصلح كل الـ functions

export const coursesApi = {
  getAll: async (params) => {
    const { data } = await axiosInstance.get('/courses', { params });
    // backend يرجع { status: 'success', data: { docs: [...] } }
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/courses/${id}`);
    return data;
  },

  getCart: async () => {
    const { data } = await axiosInstance.get('/cart');
    // backend يرجع { status: 'success', cart: { courses: [...] } }
    return data;
  },

  addToCart: async (courseId) => {
    const { data } = await axiosInstance.post(`/cart/${courseId}`);
    return data;
  },

  removeFromCart: async (courseId) => {
    const { data } = await axiosInstance.delete(`/cart/${courseId}`);
    return data;
  },

  getWishlist: async () => {
    const { data } = await axiosInstance.get('/wishlist');
    // backend يرجع { status: 'success', wishlist: [...] }  
    return data;
  },

  addToWishlist: async (courseId) => {
    const { data } = await axiosInstance.post(`/wishlist/${courseId}`);
    return data;
  },

  removeFromWishlist: async (courseId) => {
    const { data } = await axiosInstance.delete(`/wishlist/${courseId}`);
    return data;
  },
};