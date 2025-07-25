import { check } from "express-validator";
import CustomError from "../CustomError.js";
import Lesson from "../../models/Lesson.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";


export const getAllResourceValidator = [
    check("lessonId")
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

export const createResourceValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .escape(),

    check("content")
        .notEmpty()
        .withMessage("content is required"),

    check("lessonId")
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

export const getResourceValidator = [
    check("lessonId")
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

    check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId")
        .custom(async (id, { req }) => {
            let lesson = await Lesson.findById(req.params.lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);

            let resource = lesson.resources.find(resource => resource._id.toString() === id);
            if (!resource)
                throw new CustomError("No resource found", 404);

            return true;
        }),
    validationMiddleware
]

export const updateResourceValidator = [
    check("name")
        .optional()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .escape(),

    check("content")
        .optional()
        .notEmpty()
        .withMessage("content is required"),

    check("lessonId")
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

    check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId")
        .custom(async (id, { req }) => {
            let lesson = await Lesson.findById(req.params.lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);

            let resource = lesson.resources.find(resource => resource._id.toString() === id);
            if (!resource)
                throw new CustomError("No resource found", 404);

            return true;
        }),
    validationMiddleware
]

export const deleteResourceValidator = [
    check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId"),

    check("lessonId")
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

    check("id")
        .notEmpty()
        .withMessage("resource ID is required")
        .isMongoId()
        .withMessage("resource ID must be a valid MongoDB ObjectId")
        .custom(async (id, { req }) => {
            let lesson = await Lesson.findById(req.params.lessonId);
            if (!lesson)
                throw new CustomError("lesson not found", 404);

            let resource = lesson.resources.find(resource => resource._id.toString() === id);
            if (!resource)
                throw new CustomError("No resource found", 404);

            return true;
        }),

    validationMiddleware
]
