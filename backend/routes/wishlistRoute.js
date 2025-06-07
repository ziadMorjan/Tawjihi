const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { wishlistValidator } = require("../utils/validators/wishlistValidator");
const {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/WishlistController");

let router = express.Router();

router.use(protect, allowedTo("user"));

router.get("/", getUserWishlist);

router.route("/:courseId")
    .post(wishlistValidator, addToWishlist)
    .delete(wishlistValidator, removeFromWishlist);

module.exports = router;