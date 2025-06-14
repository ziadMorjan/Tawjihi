const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Coupon = require('../../models/Coupon');
const CustomError = require('../CustomError');

const createCouponValidator = [
    validator.check('name')
        .notEmpty()
        .withMessage('Name is required')
        .custom(async (value) => {
            let coupon = await Coupon.findOne({ name: value });
            if (coupon) {
                throw new CustomError('Coupon already exists', 400);
            }
            return true;
        }),

    validator.check('discount')
        .notEmpty()
        .withMessage('discount is required')
        .isNumeric()
        .withMessage('discount must be number'),


    validator.check('expire')
        .notEmpty()
        .withMessage('expire is required')
        .isDate()
        .withMessage('expire must be date'),

    validationMiddleware
];

const updateCouponValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Coupon ID is required")
        .isMongoId()
        .withMessage("Invalid Coupon ID"),

    validator.check('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required')
        .custom(async (value) => {
            let coupon = await Coupon.findOne({ name: value });
            if (coupon) {
                throw new CustomError('Coupon already exists', 400);
            }
            return true;
        }),

    validator.check('discount')
        .optional()
        .notEmpty()
        .withMessage('discount is required')
        .isNumeric()
        .withMessage('discount must be number'),


    validator.check('expire')
        .optional()
        .notEmpty()
        .withMessage('expire is required')
        .isDate()
        .withMessage('expire must be date'),

    validationMiddleware
];

const getCouponValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Coupon ID is required")
        .isMongoId()
        .withMessage("Invalid Coupon ID"),

    validationMiddleware
];

const deleteCouponValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Coupon ID is required")
        .isMongoId()
        .withMessage("Invalid Coupon ID"),

    validationMiddleware
];

module.exports = {
    createCouponValidator,
    updateCouponValidator,
    getCouponValidator,
    deleteCouponValidator
}