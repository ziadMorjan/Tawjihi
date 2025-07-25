import { check } from 'express-validator';
import User from '../../models/User.js';
import Subject from '../../models/Subject.js';
import Branch from '../../models/Branch.js';
import Course from '../../models/Course.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCourseValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    check("teacher")
        .notEmpty()
        .withMessage("Course must belong to teacher")
        .isMongoId()
        .withMessage("Invalid teacher id format")
        .custom(async function (value) {
            let teacher = await User.findById(value);
            if (!teacher)
                throw new CustomError("The provided teacher does not exist in the db", 404);
            if (teacher.id !== value)
                throw new CustomError("You can not create a course for another teacher", 403);
            return true;
        }),

    check("subject")
        .notEmpty()
        .withMessage("Course must belong to subject")
        .isMongoId()
        .withMessage("Invalid subject id format")
        .custom(async function (value) {
            let subject = await Subject.findById(value);
            if (!subject)
                throw new CustomError("The provided subject does not exist in the db", 404);

            return true;
        }),

    check("branches")
        .notEmpty()
        .withMessage("Course must belong to at least one branch")
        .isArray()
        .withMessage("Branches must be an array")
        .custom(async function (branchIds) {
            if (!Array.isArray(branchIds) || branchIds.length === 0)
                throw new CustomError("Course must belong to at least one branch", 404);

            let promises = branchIds.map(id => Branch.findById(id));
            let branches = await Promise.all(promises);
            let result = branches.every(item => item != null);

            if (!result)
                throw new CustomError("One or more provided branches do not exist in the db", 404);
            return true;
        }),

    check("price")
        .notEmpty().withMessage("price is required")
        .isNumeric().withMessage("price must be number"),

    check("priceAfterDiscount")
        .optional()
        .custom((value, { req }) => {
            if (req.body.price) {
                if (value > req.body.price)
                    throw new CustomError("priceAfterDiscount must be less than price", 400);
            }
            return true;
        }),

    validationMiddleware
];

export const updateCourseValidator = [
    check("id")
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Invalid Course ID").
        custom(async function (courseId) {
            let course = await Course.findById(courseId);
            if (!course)
                throw new CustomError("No course found", 404);
            return true;
        }),

    check('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    check("teacher")
        .optional()
        .notEmpty()
        .withMessage("Course must belong to teacher")
        .isMongoId()
        .withMessage("Invalid teacher id format")
        .custom(async function (value) {
            let teacher = await User.findById(value);
            if (!teacher)
                throw new CustomError("The provided teacher does not exist in the db", 404);
            return true;
        }),

    check("subject")
        .optional()
        .notEmpty()
        .withMessage("Course must belong to subject")
        .isMongoId()
        .withMessage("Invalid subject id format")
        .custom(async function (value) {
            let subject = await Subject.findById(value);
            if (!subject)
                throw new CustomError("The provided subject does not exist in the db", 404);

            return true;
        }),

    check("branches")
        .optional()
        .notEmpty()
        .withMessage("Course must belong to at least one branch")
        .isArray()
        .withMessage("Branches must be an array")
        .custom(async function (branchIds) {
            if (!Array.isArray(branchIds) || branchIds.length === 0)
                throw new CustomError("Course must belong to at least one branch", 404);

            let promises = branchIds.map(id => Branch.findById(id));
            let branches = await Promise.all(promises);
            let result = branches.every(item => item != null);

            if (!result)
                throw new CustomError("One or more provided branches do not exist in the db", 404);
            return true;
        }),


    check("price")
        .optional()
        .notEmpty().withMessage("price is required")
        .isNumeric().withMessage("price must be number"),

    check("priceAfterDiscount")
        .optional()
        .custom((value, { req }) => {
            if (req.body.price) {
                if (value > req.body.price)
                    throw new CustomError("priceAfterDiscount must be less than price", 400);
            }
            return true;
        }),


    validationMiddleware
];

export const getCourseValidator = [
    check("id")
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Invalid Course ID"),

    validationMiddleware
];

export const deleteCourseValidator = [
    check("id")
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Invalid Course ID").
        custom(async function (courseId) {
            let course = await Course.findById(courseId);
            if (!course)
                throw new CustomError("No course found", 404);
            return true;
        }),

    validationMiddleware
];
