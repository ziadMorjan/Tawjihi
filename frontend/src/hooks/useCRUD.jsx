import { useContext } from "react";
import { Actions } from "../constant/ACTIONS";
import { WishListContext } from "../context/WishListContext";

export const useCRUD = () => {
  const { wishlist, dispatch } = useContext(WishListContext);

  const addToWishList = (item) => {
    const exists = wishlist.some(
      (wish) => wish._id === item._id || wish.id === item.id
    );
    if (!exists) {
      dispatch({ type: Actions.AddToWishList, payload: item });
    }
  };

  const removeFromWishList = (itemId) => {
    dispatch({ type: Actions.RemoveFromWishList, payload: itemId });
  };

  const setWishList = (items) => {
    dispatch({ type: Actions.SetWishList, payload: items });
  };

  const isInWishList = (itemId) => {
    return wishlist.some((item) => item.id === itemId || item._id === itemId);
  };

  return {
    wishlist,
    addToWishList,
    removeFromWishList,
    isInWishList,
    setWishList,
  };
};
