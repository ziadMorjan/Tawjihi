// src/features/wishlist/hooks/useWishlist.js
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { wishlistApi } from '../api/wishlistApi';
import { axiosInstance } from '../../../shared/lib/axiosInstance';

export const WISHLIST_QUERY_KEY = ['wishlist'];

export function useWishlist() {
  const { user } = useAuth();

  // 1. جلب الـ IDs
  const { data: wishlistIds = [], isLoading: isIdsLoading } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const res = await wishlistApi.getWishlist();
      return res?.wishlist ?? [];
    },
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 2. جلب تفاصيل الكورسات بناءً على الـ IDs الصافية
  const { data: courses = [], isLoading: isCoursesLoading, isSuccess: isCoursesSuccess } = useQuery({
    queryKey: ['wishlist-courses', wishlistIds],
    queryFn: async () => {
      if (!wishlistIds.length) return [];
      
      const promises = wishlistIds.map((item) => {
        // تأمين الحصول على الـ ID الصافي سواء كان الـ item نص أو كائن
        const actualId = item?._id ?? item; 
        
        return axiosInstance
          .get(`/courses/${actualId}`)
          .then((res) => res.data?.data?.doc ?? res.data?.data ?? null)
          .catch(() => null);
      });
      
      const results = await Promise.all(promises);
      return results.filter(Boolean); // يحذف أي قيم null ناتجة عن فشل الإرسال
    },
    enabled: wishlistIds.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isInWishlist = (courseId) =>
    wishlistIds.some((id) => (id?._id ?? id) === courseId);

  return {
    wishlistIds,
    courses,
    isInWishlist,
    isIdsLoading,
    isCoursesLoading,
    isCoursesSuccess,
    isLoading: isIdsLoading || isCoursesLoading,
  };
}