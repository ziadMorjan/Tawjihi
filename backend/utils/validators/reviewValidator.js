const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Review = require('../../models/Review');
const CustomError = require('../CustomError');
const Course = require('../../models/Course');
const Enrollment = require('../../models/Enrollment');

const createReviewValidator = [
    validator.check('course')
        .notEmpty()
        .withMessage('course is required')
        .isMongoId()
        .withMessage("invalid course id")
        .custom(async (value) => {
            let course = await Course.findById(value);
            if (!course) {
                throw new CustomError('No course found', 404);
            }
            return true;
        })
        .custom(async (value, { req }) => {
            let enrollment = await Enrollment.findOne(
                {
                    course: value,
                    user: req.user.id
                }
            );
            if (!enrollment) {
                throw new CustomError('You can not make a review on course you not enrolled in', 403);
            }
            return true;
        })
        .custom(
            async (value, { req }) => {
                let review = await Review.findOne(
                    {
                        course: value,
                        user: req.user.id
                    }
                );
                if (review) {
                    throw new CustomError('You have already reviewed this course', 400);
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
        .isFloat({ min: 0, max: 5 })
        .withMessage('Review rating must be between 0 and 5'),

    validationMiddleware
];


const getReviewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Review ID is required")
        .isMongoId()
        .withMessage("Invalid Review ID")
        .custom(async (value) => {
            let review = await Review.findById(value);
            if (!review) {
                throw new CustomError('No review found', 404);
            }
        }),

    validationMiddleware
];

const updateReviewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Review ID is required")
        .isMongoId()
        .withMessage("Invalid Review ID")
        .custom(async (value) => {
            let review = await Review.findById(value);
            if (!review) {
                throw new CustomError('No review found', 404);
            }
        }),

    validator.check('course')
        .optional()
        .notEmpty()
        .withMessage('course is required')
        .isMongoId()
        .withMessage("invalid course id")
        .custom(async (value) => {
            let course = await Course.findById(value);
            if (!course) {
                throw new CustomError('No course found', 404);
            }
            return true;
        })
        .custom(async (value, { req }) => {
            let enrollment = await Enrollment.findOne(
                {
                    course: value,
                    user: req.user.id
                }
            );
            if (!enrollment) {
                throw new CustomError('You can not update review on course you not enrolled in', 403);
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
        .isFloat({ min: 0, max: 5 })
        .withMessage('Review rating must be between 0 and 5'),

    validationMiddleware
];

const deleteReviewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Review ID is required")
        .isMongoId()
        .withMessage("Invalid Review ID")
        .custom(async (value) => {
            let review = await Review.findById(value);
            if (!review) {
                throw new CustomError('No review found', 404);
            }
        }),

    validationMiddleware
];

module.exports = {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
}