import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { cartApi } from '../api/cartApi';
import { CART_QUERY_KEY } from './useCart';

export function useCartActions() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

  const addMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      invalidateCart();
      toast.success(t('cart.added'));
    },
    onError: () => toast.error(t('cart.error')),
  });

  const removeMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const prev = queryClient.getQueryData(CART_QUERY_KEY);
      queryClient.setQueryData(CART_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          courses: old.courses.filter(
            (id) => (id?._id ?? id) !== courseId
          ),
        };
      });
      return { prev };
    },
    onError: (err, id, ctx) => {
      queryClient.setQueryData(CART_QUERY_KEY, ctx.prev);
      toast.error(t('cart.error'));
    },
    onSettled: () => {
      invalidateCart();
      toast.info(t('cart.removed'));
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      invalidateCart();
      toast.info(t('cart.cleared'));
    },
  });

  // Apply Coupon
  const couponMutation = useMutation({
    mutationFn: cartApi.applyCoupon,
    onSuccess: (data) => {
      invalidateCart();
      const saved = data?.cart?.totalPrice - data?.cart?.totalPriceAfterDiscount;
      if (saved > 0) toast.success(t('cart.couponSuccess', { amount: saved.toFixed(2) }));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? t('cart.couponError'));
    },
  });

  // Checkout
  const checkoutMutation = useMutation({
    mutationFn: cartApi.checkout,
    onSuccess: (data) => {
      if (data?.sessionUrl) window.location.href = data.sessionUrl;
    },
    onError: () => toast.error(t('cart.checkoutError')),
  });


  const toggleCart = (courseId) => {
    const cartData = queryClient.getQueryData(CART_QUERY_KEY);
    const courses = cartData?.courses ?? [];

    const inCart = courses.some((id) => (id?._id ?? id) === courseId);
    inCart ? removeMutation.mutate(courseId) : addMutation.mutate(courseId)

  };

  return {
    toggleCart,
    addToCart: addMutation.mutate,
    removeFromCart: removeMutation.mutate,
    clearCart: clearMutation.mutate,
    applyCoupon: couponMutation.mutate,
    checkout: checkoutMutation.mutate,
    isAddLoading: addMutation.isPending,
    isRemoveLoading: removeMutation.isPending,
    isClearLoading: clearMutation.isPending,
    isCouponLoading: couponMutation.isPending,
    isCheckoutLoading: checkoutMutation.isPending,
    couponError: couponMutation.error,
  };
}