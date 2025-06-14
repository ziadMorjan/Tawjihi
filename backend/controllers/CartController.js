const Cart = require("../models/Cart");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const Course = require("../models/Course");
const Coupon = require("../models/Coupon");
const CustomError = require("../utils/CustomError");

const sendRes = async (res, cart) => {
    res.status(200).json({
        status: "success",
        cart
    });
}

const getLoggedUserCart = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
        cart = await Cart.create({ user: req.user.id });

    sendRes(res, cart);
});

const addToCart = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    const course = await Course.findById(req.body.course);

    // 1- user have no cart
    if (!cart) {
        cart = await Cart.create({
            user: req.user.id,
            cartItems: [{
                course: course.id,
                price: course.price
            }],
            totalPrice: course.price
        });
    }
    // 2- user have cart
    else {
        let index = cart.cartItems.findIndex(item => item.course.toString() === course.id);
        if (index === -1) {
            cart.cartItems.push({ course: course.id, price: course.price });
            cart.totalPrice += course.price;
            await cart.save();
        }
    }
    sendRes(res, cart);
});

const removeFromCart = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart)
        cart = await Cart.create({ user: req.user.id });
    else {
        let index = cart.cartItems.findIndex(item => item.course.toString() === req.params.course);
        if (index !== -1) {
            let item = cart.cartItems[index]
            cart.cartItems.pull(item);
            cart.totalPrice -= item.price;
            await cart.save();
        }
    }

    sendRes(res, cart);
});

const clearCart = asyncErrorHandler(async function (req, res) {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        {
            cartItems: [],
            totalPrice: 0,
            totalPriceAfterDiscount: undefined
        },
        { new: true }
    );

    sendRes(res, cart);
});

const applyCoupon = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    let coupon = await Coupon.findOne({ name: req.body.coupon });

    if (cart.cartItems.length !== 0) {
        const index = cart.appliedCoupons.findIndex(item => item.toString() === coupon.id);
        if (index !== -1)
            throw new CustomError(`you have applied this coupon '${coupon.name}' before`);

        cart.totalPriceAfterDiscount = parseFloat(((cart.totalPrice - (coupon.discount / 100) * cart.totalPrice)).toFixed(2));
        cart.appliedCoupons.push(coupon.id);
        await cart.save();
    }

    sendRes(res, cart);
});

module.exports = {
    getLoggedUserCart,
    addToCart,
    removeFromCart,
    clearCart,
    applyCoupon
}