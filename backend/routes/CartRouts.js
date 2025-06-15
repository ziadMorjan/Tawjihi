const express = require("express");

const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

const {
    cartValidator,
    applyCouponValidator
} = require("../utils/validators/cartValidator");

const {
    getLoggedUserCart,
    addToCart,
    removeFromCart,
    clearCart,
    applyCoupon
} = require("../controllers/CartController");

let router = express.Router();

router.use(protect, allowedTo("user"));

router.post("/applyCoupon", applyCouponValidator, applyCoupon);

router.route("/")
    .get(getLoggedUserCart)
    .delete(clearCart);

router.route("/:courseId")
    .post(cartValidator, addToCart)
    .delete(cartValidator, removeFromCart);

module.exports = router;