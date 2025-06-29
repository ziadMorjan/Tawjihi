const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Comment = require('../../models/Comment');
const CustomError = require('../CustomError');
const Lesson = require('../../models/Lesson');
const Enrollment = require('../../models/Enrollment');

const createCommentValidator = [
    validator.check('lesson')
        .notEmpty()
        .withMessage('lesson is required')
        .isMongoId()
        .withMessage("invalid lesson id")
        .custom(async (value, { req }) => {
            let lesson = await Lesson.findById(value);
            if (!lesson) {
                throw new CustomError('No lesson found', 404);
            }
            let enrollment = await Enrollment.findOne(
                {
                    course: lesson.course,
                    user: req.user.id
                }
            );
            if (!enrollment) {
                throw new CustomError('You can not make a Comment on lesson on course you not enrolled in', 403);
            }
            return true;
        }),

    validator.check('user')
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validator.check('content')
        .notEmpty()
        .withMessage('comment is required'),

    validationMiddleware
];


const getCommentValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Comment ID is required")
        .isMongoId()
        .withMessage("Invalid Comment ID")
        .custom(async (value) => {
            let comment = await Comment.findById(value);
            if (!comment) {
                throw new CustomError('No Comment found', 404);
            }
        }),

    validationMiddleware
];

const updateCommentValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Comment ID is required")
        .isMongoId()
        .withMessage("Invalid Comment ID")
        .custom(async (value) => {
            let comment = await Comment.findById(value);
            if (!comment) {
                throw new CustomError('No Comment found', 404);
            }
        }),


    validator.check('lesson')
        .optional()
        .notEmpty()
        .withMessage('lesson is required')
        .isMongoId()
        .withMessage("invalid lesson id")
        .custom(async (value, { req }) => {
            let lesson = await Lesson.findById(value);
            if (!lesson) {
                throw new CustomError('No lesson found', 404);
            }
            let enrollment = await Enrollment.findOne(
                {
                    course: lesson.course,
                    user: req.user.id
                }
            );
            if (!enrollment) {
                throw new CustomError('You can not make a Comment on lesson on course you not enrolled in', 403);
            }
            return true;
        }),

    validator.check('user')
        .optional()
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validator.check('content')
        .optional()
        .notEmpty()
        .withMessage('comment is required'),

    validationMiddleware
];

const deleteCommentValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Comment ID is required")
        .isMongoId()
        .withMessage("Invalid Comment ID")
        .custom(async (value) => {
            let comment = await Comment.findById(value);
            if (!comment) {
                throw new CustomError('No Comment found', 404);
            }
        }),

    validationMiddleware
];

module.exports = {
    createCommentValidator,
    getCommentValidator,
    updateCommentValidator,
    deleteCommentValidator
}