const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Enrollment = require('../../models/Enrollment');
const CustomError = require('../CustomError');
const Course = require('../../models/Course');

const createEnrollmentValidator = [
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
            if (enrollment) {
                throw new CustomError('You have already enrolled to this course', 400);
            }
            return true;
        }),

    validator.check('user')
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validationMiddleware
];


const getEnrollmentValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

    validationMiddleware
];

const updateEnrollmentValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

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
            if (enrollment) {
                throw new CustomError('You have already enrolled to this course', 400);
            }
            return true;
        }),

    validator.check('user')
        .optional()
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validationMiddleware
];

const deleteEnrollmentValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

    validationMiddleware
];

module.exports = {
    createEnrollmentValidator,
    getEnrollmentValidator,
    updateEnrollmentValidator,
    deleteEnrollmentValidator
}