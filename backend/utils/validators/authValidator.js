import { check } from 'express-validator';
import User from '../../models/User.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check("email")
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (user) {
                throw new CustomError('User already exists', 400);
            }
            return true;
        }),

    check('password')
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

    check('phone')
        .isMobilePhone(["ar-PS", "he-IL"])
        .withMessage('invalid phone number format')
        .custom(async (value) => {
            let user = await User.findOne({ phone: value });
            if (user) {
                throw new CustomError('this phone number is used try another one', 400);
            }
            return true;
        }),

    check("role")
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

export const loginValidator = [
    check("email")
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (!user) {
                throw new CustomError('Wrong email or password', 400);
            }
            return true;
        }),

    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 chars'),

    validationMiddleware
]

export const forgetPasswordValidator = [
    check("email")
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (!user) {
                throw new CustomError('No user found with this email', 404);
            }
            return true;
        }),

    validationMiddleware
]

export const verifyResetCodValidator = [
    check("resetCode")
        .notEmpty()
        .withMessage('resetCode is required')
        .custom(async (value) => {
            if (value < 100000 || value > 999999) {
                throw new CustomError('Invalid reset code', 400);
            }
            return true;
        }),

    validationMiddleware
]

export const resetPasswordValidator = [
    check("email")
        .notEmpty()
        .withMessage('email is required')
        .custom(async (value) => {
            let user = await User.findOne({ email: value });
            if (!user) {
                throw new CustomError('No user found', 404);
            }
            return true;
        }),

    check('newPassword')
        .notEmpty()
        .withMessage('newPassword is required')
        .isLength({ min: 8 })
        .withMessage('newPassword must be at least 8 chars')
        .custom(async (value, { req }) => {
            if (req.body.newConfirmPassword !== value) {
                throw new CustomError('newPassword does not match new confirm password', 400);
            }
            return true;
        }),


    validationMiddleware
]
