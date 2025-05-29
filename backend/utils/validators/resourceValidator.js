const validator = require("express-validator");
const { validationMiddleware } = require("../../middlewares/validationMiddleware");
const CustomError = require("../CustomError");
const Lesson = require("../../models/Lesson");

const getAllResourceValidator = [
    validator.check("lessonId")
        .notEmpty()
        .withMessage("lesson ID is required")
        .isMongoId()
        .withMessage("lesson ID must be a valid MongoDB ObjectId")
        .custom(async (lessonId, { req }) => {
            let lesson = await Lesson.findById(lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);
            return true;
        }),

    validationMiddleware
]

const createResourceValidator = [
    validator.check("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .escape(),

    validator.check("content")
        .notEmpty()
        .withMessage("content is required"),

    validator.check("lessonId")
        .notEmpty()
        .withMessage("lesson ID is required")
        .isMongoId()
        .withMessage("lesson ID must be a valid MongoDB ObjectId")
        .custom(async lessonId => {
            let lesson = await Lesson.findById(lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);
            return true;
        }),

    validationMiddleware
]

const getResourceValidator = [
    validator.check("lessonId")
        .notEmpty()
        .withMessage("lesson ID is required")
        .isMongoId()
        .withMessage("lesson ID must be a valid MongoDB ObjectId")
        .custom(async lessonId => {
            let lesson = await Lesson.findById(lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);
            return true;
        }),

    validator.check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId")
        .custom(async (id, { req }) => {
            let lesson = await Lesson.findById(req.params.lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);

            let resource = lesson.resources.find(reso => reso._id.toString() === id);
            if (!resource)
                throw new CustomError("No resource found", 404);

            return true;
        }),
    validationMiddleware
]

const updateResourceValidator = [
    validator.check("name")
        .optional()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .escape(),

    validator.check("content")
        .optional()
        .notEmpty()
        .withMessage("content is required"),

    validator.check("lessonId")
        .notEmpty()
        .withMessage("lesson ID is required")
        .isMongoId()
        .withMessage("lesson ID must be a valid MongoDB ObjectId")
        .custom(async lessonId => {
            let lesson = await Lesson.findById(lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);
            return true;
        }),

    validator.check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId")
        .custom(async (id, { req }) => {
            let lesson = await Lesson.findById(req.params.lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);

            let resource = lesson.resources.find(reso => reso._id.toString() === id);
            if (!resource)
                throw new CustomError("No resource found", 404);

            return true;
        }),
    validationMiddleware
]

const deleteResourceValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId"),

    validator.check("lessonId")
        .notEmpty()
        .withMessage("lesson ID is required")
        .isMongoId()
        .withMessage("lesson ID must be a valid MongoDB ObjectId")
        .custom(async lessonId => {
            let lesson = await Lesson.findById(lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);
            return true;
        }),

    validator.check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId")
        .custom(async (id, { req }) => {
            let lesson = await Lesson.findById(req.params.lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);

            let resource = lesson.resources.find(reso => reso._id.toString() === id);
            if (!resource)
                throw new CustomError("No resource found", 404);

            return true;
        }),

    validationMiddleware
]

module.exports = {
    getAllResourceValidator,
    createResourceValidator,
    getResourceValidator,
    updateResourceValidator,
    deleteResourceValidator
}