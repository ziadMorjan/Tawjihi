import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { wishlistApi } from '../api/wishlistApi';
import { WISHLIST_QUERY_KEY } from './useWishlist';
import { useAuth } from '../../auth';

export function useWishlistActions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateWishlist = () =>
    queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });

  const addMutation = useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      invalidateWishlist();
      toast.success('تمت الإضافة إلى المفضلة');
    },
    onError: () => toast.error('حدث خطأ، حاول مجدداً'),
  });

  const removeMutation = useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const prev = queryClient.getQueryData(WISHLIST_QUERY_KEY);
      queryClient.setQueryData(WISHLIST_QUERY_KEY, (old = []) =>
        old.filter((id) => (id?._id ?? id) !== courseId)
      );
      return { prev };
    },
    onError: (err, id, ctx) => {
      queryClient.setQueryData(WISHLIST_QUERY_KEY, ctx.prev);
      toast.error('حدث خطأ، حاول مجدداً');
    },
    onSettled: () => {
      invalidateWishlist();
      toast.info('تمت الإزالة من المفضلة');
    },
  });

  const toggleWishlist = (courseId) => {
    if (!user) { toast.info('سجّل دخولك أولاً'); return; }
    const ids = queryClient.getQueryData(WISHLIST_QUERY_KEY) ?? [];
    const inWishlist = ids.some((id) => (id?._id ?? id) === courseId);
    inWishlist
      ? removeMutation.mutate(courseId)
      : addMutation.mutate(courseId);
  };

  return {
    toggleWishlist,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}