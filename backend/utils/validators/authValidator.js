const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const User = require('../../models/User');
const CustomError = require('../CustomError');

const signupValidator = [
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
        .isMobilePhone(["ar-PS", "he-IL"])
        .withMessage('invalid phone number format')
        .custom(async (value) => {
            let user = await User.findOne({ phone: value });
            if (user) {
                throw new CustomError('this phone number is used try another one', 400);
            }
            return true;
        }),

    validator.check("role")
        .optional()
        .isIn(["admin", "teacher", "user"])
        .withMessage("invalid role")
        .custom((value) => {
            if (value === "admin")
                throw new CustomError("You can not signup as an admin", 400);
            return true;
        }),

    validationMiddleware
];

const loginValidator = [
    validator.check("email")
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (!user) {
                throw new CustomError('Wrong email or password', 400);
            }
            return true;
        }),

    validator.check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 chars'),

    validationMiddleware
]

module.exports = {
    signupValidator,
    loginValidator
}