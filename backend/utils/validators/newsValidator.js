const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');

const createNewValidator = [
    validator.check('title')
        .notEmpty()
        .withMessage('title is required')
        .isLength({ min: 3 })
        .withMessage('title must be at least 3 characters long'),

    validator.check('body')
        .isLength({ min: 10, max: 10000 })
        .withMessage('body must be between 10 and 10000 characters long'),

    validationMiddleware
];

const updateNewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("New ID is required")
        .isMongoId()
        .withMessage("Invalid New ID"),

    validator.check('title')
        .optional()
        .notEmpty()
        .withMessage('title is required')
        .isLength({ min: 3 })
        .withMessage('title must be at least 3 characters long'),

    validator.check('body')
        .optional()
        .isLength({ min: 10, max: 10000 })
        .withMessage('body must be between 10 and 10000 characters long'),

    validationMiddleware
];

const getNewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("New ID is required")
        .isMongoId()
        .withMessage("Invalid New ID"),

    validationMiddleware
];

const deleteNewValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("New ID is required")
        .isMongoId()
        .withMessage("Invalid New ID"),

    validationMiddleware
];

module.exports = {
    createNewValidator,
    updateNewValidator,
    getNewValidator,
    deleteNewValidator
}