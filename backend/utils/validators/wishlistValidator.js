const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Course = require('../../models/Course');
const CustomError = require('../CustomError');

const wishlistValidator = [
    validator.check('courseId')
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

module.exports = {
    wishlistValidator
}