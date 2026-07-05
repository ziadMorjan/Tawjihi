import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const cartApi = {
  // GET /cart → { status, cart: { _id, courses: [...], totalPrice, totalPriceAfterDiscount } }
  getCart: async () => {
    const { data } = await axiosInstance.get('/cart');
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

  clearCart: async () => {
    const { data } = await axiosInstance.delete('/cart');
    return data;
  },

  applyCoupon: async (coupon) => {
    const { data } = await axiosInstance.post('/cart/applyCoupon', { coupon });
    return data;
  },

  checkout: async (courseIds) => {
    const { data } = await axiosInstance.post('/payment/create-checkout-session', {
      ids: courseIds,
    });
    return data;
  },
};