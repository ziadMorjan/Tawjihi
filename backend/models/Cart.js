const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        courses: [{
            type: mongoose.Types.ObjectId,
            ref: "Course"
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

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: "courses",
    });
    next();
});

module.exports = mongoose.model("Cart", cartSchema);