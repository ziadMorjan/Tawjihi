// src/features/courses/hooks/useCourseActions.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { coursesApi } from '../api/coursesApi';
import { useAuth } from '../../auth';

export const CART_QUERY_KEY     = ['cart'];
export const WISHLIST_QUERY_KEY = ['wishlist'];

export function useCourseActions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const data = await coursesApi.getCart();
      // backend: { status, cart: { courses: [...] } }
      return data?.cart?.courses ?? [];
    },
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: wishlistItems = [] } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const data = await coursesApi.getWishlist();
      // backend: { status, wishlist: [...] } — wishlist موجود في الـ user object
      return data?.wishlist ?? data?.data?.wishlist ?? [];
    },
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isInCart     = (courseId) => cartItems.some(item =>
    (item._id ?? item) === courseId
  );
  const isInWishlist = (courseId) => wishlistItems.some(item =>
    (item._id ?? item) === courseId
  );

  const addToCartMutation = useMutation({
    mutationFn: coursesApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('تمت الإضافة إلى السلة');
    },
    onError: () => toast.error('حدث خطأ، حاول مجدداً'),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: coursesApi.removeFromCart,
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const prev = queryClient.getQueryData(CART_QUERY_KEY);
      queryClient.setQueryData(CART_QUERY_KEY, (old = []) =>
        old.filter(item => (item._id ?? item) !== courseId)
      );
      return { prev };
    },
    onError: (err, id, ctx) => {
      queryClient.setQueryData(CART_QUERY_KEY, ctx.prev);
      toast.error('حدث خطأ، حاول مجدداً');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.info('تمت الإزالة من السلة');
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: coursesApi.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success('تمت الإضافة إلى المفضلة');
    },
    onError: () => toast.error('حدث خطأ، حاول مجدداً'),
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: coursesApi.removeFromWishlist,
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const prev = queryClient.getQueryData(WISHLIST_QUERY_KEY);
      queryClient.setQueryData(WISHLIST_QUERY_KEY, (old = []) =>
        old.filter(item => (item._id ?? item) !== courseId)
      );
      return { prev };
    },
    onError: (err, id, ctx) => {
      queryClient.setQueryData(WISHLIST_QUERY_KEY, ctx.prev);
      toast.error('حدث خطأ، حاول مجدداً');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.info('تمت الإزالة من المفضلة');
    },
  });

  const toggleCart = (courseId) => {
    if (!user) { toast.info('سجّل دخولك أولاً'); return; }
    isInCart(courseId)
      ? removeFromCartMutation.mutate(courseId)
      : addToCartMutation.mutate(courseId);
  };

  const toggleWishlist = (courseId) => {
    if (!user) { toast.info('سجّل دخولك أولاً'); return; }
    isInWishlist(courseId)
      ? removeFromWishlistMutation.mutate(courseId)
      : addToWishlistMutation.mutate(courseId);
  };

  return {
    cartItems, wishlistItems,
    isInCart, isInWishlist,
    toggleCart, toggleWishlist,
    isCartLoading:     addToCartMutation.isPending || removeFromCartMutation.isPending,
    isWishlistLoading: addToWishlistMutation.isPending || removeFromWishlistMutation.isPending,
  };
}