const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const TeacherReview = require('../../models/TeacherReview');
const User = require('../../models/User');
const CustomError = require('../CustomError');

const createTeacherReviewValidator = [
    validator.check('teacher')
        .notEmpty()
        .withMessage('teacher is required')
        .isMongoId()
        .withMessage("invalid teacher id")
        .custom(async (value) => {
            console.log(value);
            let teacher = await User.findOne({
                _id: value,
                isActive: true,
                role: "teacher"
            });
            if (!teacher) {
                throw new CustomError('No teacher found', 404);
            }
            return true;
        })
        .custom(
            async (value, { req }) => {
                let tReview = await TeacherReview.findOne(
                    {
                        teacher: value,
                        user: req.user.id
                    }
                );
                if (tReview) {
                    throw new CustomError('You have already reviewed this teacher', 400);
                }
                return true;
            }
        ),

    validator.check('user')
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validator.check('comment')
        .notEmpty()
        .withMessage('Review comment is required')
        .isLength({ max: 500 })
        .withMessage('Review comment must be less than 500 characters'),

    validator.check('rating')
        .notEmpty()
        .withMessage('Review rating is required')
        .isNumeric()
        .withMessage('Review rating must be a number')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Review rating must be between 1 and 5'),

    validationMiddleware
];


const getTeacherReviewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Review ID is required")
        .isMongoId()
        .withMessage("Invalid Review ID")
        .custom(async (value) => {
            let tReview = await TeacherReview.findById(value);
            if (!tReview) {
                throw new CustomError('No review found', 404);
            }
        }),

    validationMiddleware
];

const updateTeacherReviewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Review ID is required")
        .isMongoId()
        .withMessage("Invalid Review ID")
        .custom(async (value) => {
            let tReview = await TeacherReview.findById(value);
            if (!tReview) {
                throw new CustomError('No review found', 404);
            }
        }),

    validator.check('teacher')
        .optional()
        .notEmpty()
        .withMessage('teacher is required')
        .isMongoId()
        .withMessage("invalid teacher id")
        .custom(async (value) => {
            console.log(value);
            let teacher = await User.findOne({
                _id: value,
                isActive: true,
                role: "teacher"
            });
            console.log(teacher);
            if (!teacher) {
                throw new CustomError('No teacher found', 404);
            }
            return true;
        }),


    validator.check('user')
        .optional()
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validator.check('comment')
        .optional()
        .notEmpty()
        .withMessage('Review comment is required')
        .isLength({ max: 500 })
        .withMessage('Review comment must be less than 500 characters'),

    validator.check('rating')
        .optional()
        .notEmpty()
        .withMessage('Review rating is required')
        .isNumeric()
        .withMessage('Review rating must be a number')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Review rating must be between 1 and 5'),

    validationMiddleware
];

const deleteTeacherReviewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Review ID is required")
        .isMongoId()
        .withMessage("Invalid Review ID")
        .custom(async (value) => {
            let tReview = await TeacherReview.findById(value);
            if (!tReview) {
                throw new CustomError('No review found', 404);
            }
        }),

    validationMiddleware
];

module.exports = {
    createTeacherReviewValidator,
    getTeacherReviewValidator,
    updateTeacherReviewValidator,
    deleteTeacherReviewValidator
}