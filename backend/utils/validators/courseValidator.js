const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const User = require('../../models/User');
const Branch = require('../../models/Branch');
const CustomError = require('../CustomError');
const Course = require('../../models/Course');
const Subject = require('../../models/Subject');

const createCourseValidator = [
    validator.check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    validator.check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validator.check("teacher")
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

        validator.check("subject")
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

    validator.check("branches")
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

    validator.check("price")
        .notEmpty().withMessage("price is required")
        .isNumeric().withMessage("price must be number"),

    validator.check("priceAfterDiscount")
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

const updateCourseValidator = [
    validator.check("id")
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

    validator.check('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    validator.check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validator.check("teacher")
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

        validator.check("subject")
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

    validator.check("branches")
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


    validator.check("price")
        .optional()
        .notEmpty().withMessage("price is required")
        .isNumeric().withMessage("price must be number"),

    validator.check("priceAfterDiscount")
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

const getCourseValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Course ID is required")
        .isMongoId()
        .withMessage("Invalid Course ID"),

    validationMiddleware
];

const deleteCourseValidator = [
    validator.check("id")
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

module.exports = {
    createCourseValidator,
    updateCourseValidator,
    getCourseValidator,
    deleteCourseValidator
}
