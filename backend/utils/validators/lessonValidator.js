const validator = require("express-validator");
const { validationMiddleware } = require("../../middlewares/validationMiddleware");
const Course = require("../../models/Course");
const CustomError = require("../CustomError");

const createLessonValidator = [
    validator.check("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .escape(),

    validator.check("description")
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string")
        .trim()
        .escape(),

    validator.check("video")
        .notEmpty()
        .withMessage("Video is required"),

    validator.check("course")
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Course ID must be a valid MongoDB ObjectId")
        .custom(async courseId => {
            let course = await Course.findById(courseId);
            if (!course)
                throw new CustomError("Course not found", 404);
            return true;
        }),

    validationMiddleware
]

const getLessonValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Lesson ID is required")
        .isMongoId()
        .withMessage("Lesson ID must be a valid MongoDB ObjectId"),

    validationMiddleware
]

const updateLessonValidator = [
    validator.check("name")
        .optional()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .escape(),

    validator.check("description")
        .optional()
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string")
        .trim()
        .escape(),

    validator.check("video")
        .optional()
        .notEmpty()
        .withMessage("Video is required"),

    validator.check("course")
        .optional()
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Course ID must be a valid MongoDB ObjectId")
        .custom(async courseId => {
            let course = await Course.findById(courseId);
            if (!course)
                throw new CustomError("Course not found", 404);
            return true;
        }),

    validationMiddleware
]

const deleteLessonValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Lesson ID is required")
        .isMongoId()
        .withMessage("Lesson ID must be a valid MongoDB ObjectId"),

    validationMiddleware
]

module.exports = {
    createLessonValidator,
    getLessonValidator,
    updateLessonValidator,
    deleteLessonValidator
}