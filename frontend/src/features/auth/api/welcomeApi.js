import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const welcomeApi = {
  // إخبار الـ Backend أن المستخدم شاف الـ Welcome Popup
  markWelcomeSeen: async () => {
    const { data } = await axiosInstance.patch('/auth/welcome-seen');
    return data;
  },
};
