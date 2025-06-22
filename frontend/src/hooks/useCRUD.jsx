//react
import { useContext } from "react";
//Actions
import { Actions } from "../constant/ACTIONS";
//Context
import { AppContext } from "../context/WishAndCartListContext";

export const useCRUD = () => {
  const {state, dispatch } = useContext(AppContext);

  // Ensure wishlist is an array
  // This prevents errors if wishlist is not initialized properly
  const wishlist = Array.isArray(state.wishlist) ? state.wishlist : [];

  // Ensure cart is an array
  // This prevents errors if cart is not initialized properly
  const cart = Array.isArray(state.cart) ? state.cart : [];

  //Wish List Management

  const addToWishList = (item) => {
    if (!wishlist.some((wish) => wish._id === item._id)) {
      dispatch({ type: Actions.AddToWishList, payload: item });
    }
  };

  const removeFromWishList = (itemId) => {
    dispatch({ type: Actions.RemoveFromWishList, payload: itemId });
  };

  const isInWishList = (itemId) => {
    return wishlist.some((item) => item._id === itemId);
  };

  // Cart Management
  const addToCartList = (item) => {
    if (!cart.some((cartItem) => cartItem._id === item._id)) {
      dispatch({ type: Actions.AddToCartList, payload: item });
    }
  };

  const removeFromCartList = (itemId) => {
    dispatch({ type: Actions.RemoveFromCartList, payload: itemId });
  };

  const isInCartList = (itemId) => {
    return cart.some((item) => item._id === itemId);
  };

  return {
    wishlist,
    cart,
    /** Wish List Actions **/
    addToWishList,
    removeFromWishList,
    setWishList: (items) =>
      dispatch({ type: Actions.SetWishList, payload: items }),
    isInWishList,

    /** Cart Actions **/
    addToCartList,
    removeFromCartList,
    setCartList: (items) =>
      dispatch({ type: Actions.SetCartList, payload: items }),
    isInCartList,
  };
};
