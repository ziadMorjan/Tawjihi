const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        cartItems: [{
            course: {
                type: mongoose.Types.ObjectId,
                ref: "Course"
            },
            price: Number
        }],
        totalPrice: {
            type: Number,
            default: 0
        },
        totalPriceAfterDiscount: Number,
        appliedCoupons: [{
            type: mongoose.Types.ObjectId,
            ref: "Coupon"
        }],
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cart", cartSchema);