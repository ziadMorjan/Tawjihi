import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createEnrollmentValidator = [
    check('course')
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

    check('user')
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validationMiddleware
];


export const getEnrollmentValidator = [
    check("id")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

    validationMiddleware
];

export const updateEnrollmentValidator = [
    check("id")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

    check('course')
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

    check('user')
        .optional()
        .notEmpty()
        .withMessage('user is required')
        .isMongoId()
        .withMessage("invalid user id"),

    validationMiddleware
];

export const deleteEnrollmentValidator = [
    check("id")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

    validationMiddleware
];
