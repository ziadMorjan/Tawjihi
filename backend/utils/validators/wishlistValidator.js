import { check } from 'express-validator';
import Course from '../../models/Course.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const wishlistValidator = [
    check('courseId')
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Invalid Course ID")
        .custom(async function (courseId) {
            let course = await Course.findById(courseId);
            if (!course)
                throw new CustomError("No course found", 404);
            return true;
        }),

    validationMiddleware
];
