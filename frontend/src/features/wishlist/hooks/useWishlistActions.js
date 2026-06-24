import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { wishlistApi } from '../api/wishlistApi';
import { WISHLIST_QUERY_KEY } from './useWishlist';
import { useAuth } from '../../auth';

export function useWishlistActions() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateWishlist = () =>
    queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });

  const addMutation = useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      invalidateWishlist();
      toast.success(t('wishlist.added'));
    },
    onError: () => toast.error(t('wishlist.error')),
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
      toast.error(t('wishlist.error'));
    },
    onSettled: () => {
      invalidateWishlist();
      toast.info(t('wishlist.removed'));
    },
  });

  const toggleWishlist = (courseId) => {
    if (!user) { toast.info(t('wishlist.loginFirst')); return; }
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