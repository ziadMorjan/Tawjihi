import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Actions } from "../constant/ACTIONS";
import { API_URL } from "../config";

export const WishListContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case Actions.SetWishList:
            return action.payload;
        case Actions.AddToWishList:
            if (state.some((item) => item._id === action.payload._id)) return state;
            return [...state, action.payload];
        case Actions.RemoveFromWishList:
            return state.filter((item) => item._id !== action.payload);
        default:
            return state;
    }
};
  

export const WishListProvider = ({ children }) => {
    const [wishlist, dispatch] = useReducer(reducer, []);

    const [showAlertWishList, setShowAlertWishList] = useState(false);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get(`${API_URL}/wishlist`, {
                    withCredentials: true,
                });
                dispatch({ type: Actions.SetWishList, payload: res.data.wishlist });
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            }
        };
        fetchWishlist();
    }, []);

    return (
        <WishListContext.Provider
            value={{ wishlist, dispatch, showAlertWishList, setShowAlertWishList }}
        >
            {children}
        </WishListContext.Provider>
    );
};
