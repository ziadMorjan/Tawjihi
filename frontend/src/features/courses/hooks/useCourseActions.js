// src/features/courses/hooks/useCourseActions.js
import { useCart, useCartActions } from "../../cart";
import { useWishlist, useWishlistActions } from "../../wishlist";

export function useCourseActions() {
  const { cartItems = [], isLoading: cartLoading } = useCart();
  const { wishlistIds = [], isLoading: wishlistLoading } = useWishlist();
  
  const { toggleCart } = useCartActions();
  const { toggleWishlist } = useWishlistActions();

  const isInCart = (courseId) =>
    cartItems.some((item) => (item?._id ?? item) === courseId);

  const isInWishlist = (courseId) =>
    wishlistIds.some((id) => (id?._id ?? id) === courseId);

  return {
    cartItems,
    wishlistIds,
    isInCart,
    isInWishlist,
    toggleCart,
    toggleWishlist,
    isCartLoading: cartLoading,
    isWishlistLoading: wishlistLoading,
  };
}