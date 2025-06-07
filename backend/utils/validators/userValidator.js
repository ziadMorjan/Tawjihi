const validator = require('express-validator');
const bcryptjs = require("bcryptjs");
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

const changePasswordValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validator.check('currentPassword')
        .notEmpty()
        .withMessage('current password is required')
        .custom(async (value, { req }) => {
            let user = await User.findById(req.user.id).select("+password");

            if (!bcryptjs.compareSync(value, user.password)) {
                throw new CustomError('Wrong current password', 400);
            }
            return true;
        }),

    validator.check('newPassword')
        .notEmpty()
        .withMessage('new password is required')
        .isLength({ min: 8 })
        .withMessage('new password must be at least 8 chars')
        .custom(async (value, { req }) => {
            if (req.body.newConfirmPassword !== value) {
                throw new CustomError('new password does not match confirm new password', 400);
            }
            return true;
        }),

    validationMiddleware
];


const activateUserValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validationMiddleware
];


const deactivateUserValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validationMiddleware
];

const acceptTeacherValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID")
        .custom(async (value) => {
            let user = await User.findById(value);
            if (!user) {
                throw new CustomError("No teacher found", 404);
            }
            if (user.role !== "teacher") {
                throw new CustomError("this user is not a teacher", 400);
            }
            if (user.isActive === true) {
                throw new CustomError("this teacher is already active", 400);
            }
            return true;
        }),

    validationMiddleware
];

const refuseTeacherValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID")
        .custom(async (value) => {
            let user = await User.findById(value);
            if (!user) {
                throw new CustomError("No teacher found", 404);
            }
            if (user.role !== "teacher") {
                throw new CustomError("this user is not a teacher", 400);
            }
            return true;
        }),

    validationMiddleware
];

module.exports = {
    createUserValidator,
    updateUserValidator,
    getUserValidator,
    deleteUserValidator,
    changePasswordValidator,
    activateUserValidator,
    deactivateUserValidator,
    acceptTeacherValidator,
    refuseTeacherValidator
}