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
    const course = await Course.findById(req.params.courseId);

    // user have no cart
    if (!cart)
        cart = await Cart.create({ user: req.user.id });
    else {
        // user have cart
        let index = cart.courses.findIndex(item => item.id === course.id);
        if (index === -1) {
            cart = await Cart.findOneAndUpdate(
                { user: req.user.id },
                {
                    $push: { courses: course.id },
                    $inc: { totalPrice: course.price }
                },
                { new: true }
            );
        }
    }

    sendRes(res, cart);
});

const removeFromCart = asyncErrorHandler(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });
    const course = await Course.findById(req.params.courseId);

    if (!cart)
        cart = await Cart.create({ user: req.user.id });
    else {
        let index = cart.courses.findIndex(item => (item.id === course.id));
        if (index !== -1) {
            cart = await Cart.findOneAndUpdate(
                { user: req.user.id },
                {
                    $pull: { courses: course.id },
                    $inc: { totalPrice: -course.price }
                },
                { new: true }
            );
        }
    }

    sendRes(res, cart);
});

const clearCart = asyncErrorHandler(async function (req, res) {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        {
            courses: [],
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

    if (cart.courses.length !== 0) {
        const index = cart.appliedCoupons.findIndex(item => item.toString() === coupon.id);
        if (index !== -1)
            throw new CustomError(`you have applied this coupon '${coupon.name}' before`, 400);

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