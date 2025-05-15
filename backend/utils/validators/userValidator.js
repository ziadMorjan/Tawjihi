const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const User = require('../../models/User');
const CustomError = require('../CustomError');

const createUserValidator = [
    validator.check('name')
        .notEmpty()
        .withMessage('Name is required'),
    validator.check("email")
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (user) {
                throw new CustomError('User already exists', 400);
            }
            return true;
        }),

    validator.check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 chars')
        .custom(async (value, { req }) => {
            if (req.body.confirmPassword !== value) {
                throw new CustomError('password does not match confirm password', 400);
            }
            return true;
        }),

    validator.check('phone')
        .optional()
        .isMobilePhone(["ar-PS"])
        .withMessage('invalid phone number format'),

    validator.check("role")
        .optional()
        .isIn(["admin", "teacher", "user"])
        .withMessage("invalid role"),

    validationMiddleware
];

const updateUserValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validator.check('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required'),

    validator.check("email")
        .optional()
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (user) {
                throw new CustomError('User already exists', 400);
            }
            return true;
        }),

    validator.check('password')
        .optional()
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 chars')
        .custom(async (value, { req }) => {
            if (req.body.confirmPassword !== value) {
                throw new CustomError('password does not match confirm password', 400);
            }
            return true;
        }),


    validator.check('phone')
        .optional()
        .isMobilePhone(["ar-PS"])
        .withMessage('invalid phone number format'),

    validator.check("role")
        .optional()
        .isIn(["admin", "teacher", "user"])
        .withMessage("invalid role"),

    validationMiddleware
];

const getUserValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validationMiddleware
];

const deleteUserValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validationMiddleware
];

module.exports = {
    createUserValidator,
    updateUserValidator,
    getUserValidator,
    deleteUserValidator
}