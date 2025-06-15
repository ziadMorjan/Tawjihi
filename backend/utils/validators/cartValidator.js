const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const CustomError = require('../CustomError');
const Course = require('../../models/Course');
const Coupon = require('../../models/Coupon');

const cartValidator = [
    validator.check("courseId")
        .notEmpty()
        .withMessage("course is required")
        .isMongoId()
        .withMessage("invalid course id")
        .custom(async (value) => {
            const course = await Course.findById(value);
            if (!course)
                throw new CustomError("no course found", 404);
            return true;
        }),

    validationMiddleware
];

const applyCouponValidator = [
    validator.check("coupon")
        .notEmpty()
        .withMessage("coupon is required")
        .custom(async (value) => {
            const coupon = await Coupon.findOne(
                {
                    name: value,
                    expire: { $gte: Date.now() }
                }
            );
            if (!coupon)
                throw new CustomError("Invalid or expired coupon", 404);
            return true;
        }),

    validationMiddleware
];

module.exports = {
    cartValidator,
    applyCouponValidator
}