import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { cartApi } from '../api/cartApi';

export const CART_QUERY_KEY = ['cart'];

export function useCart() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const res = await cartApi.getCart();
      // backend: { status, cart: { courses: [...], totalPrice } }
      return res?.cart ?? null;
    },
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    cart: data ?? null,
    // courses هنا IDs فقط — نحتاج populate لاحقاً
    cartItems:  data?.courses  ?? [],
    totalPrice: data?.totalPrice ?? 0,
    totalPriceAfterDiscount: data?.totalPriceAfterDiscount ?? null,
    isLoading,
  };
}