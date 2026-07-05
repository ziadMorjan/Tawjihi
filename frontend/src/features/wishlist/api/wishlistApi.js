import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const wishlistApi = {
  // GET /wishlist → { status, wishlist: [courseId, ...] }
  getWishlist: async () => {
    const { data } = await axiosInstance.get('/wishlist');
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