const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Subject = require('../../models/Subject');
const CustomError = require('../CustomError');

const createSubjectValidator = [
    validator.check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (value) => {
            let subject = await Subject.findOne({ name: value });
            if (subject) {
                throw new CustomError('Subject already exists', 400);
            }
            return true;
        }),
    validator.check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validationMiddleware
];

const updateSubjectValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    validator.check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (value) => {
            let subject = await Subject.findOne({ name: value });
            if (subject) {
                throw new CustomError('Subject already exists', 400);
            }
            return true;
        }),
    validator.check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validationMiddleware
];

const getSubjectValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    validationMiddleware
];

const deleteSubjectValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    validationMiddleware
];

module.exports = {
    createSubjectValidator,
    updateSubjectValidator,
    getSubjectValidator,
    deleteSubjectValidator
}