const validator = require('express-validator');
const { validationMiddleware } = require('../../middlewares/validationMiddleware');
const Branch = require('../../models/Branch');
const CustomError = require('../CustomError');

const createBranchValidator = [
    validator.check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (value) => {
            let branch = await Branch.findOne({ name: value });
            if (branch) {
                throw new CustomError('Branch already exists', 400);
            }
            return true;
        }),
    validator.check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validationMiddleware
];

const updateBranchValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Branch ID is required")
        .isMongoId()
        .withMessage("Invalid Branch ID"),

    validator.check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (value) => {
            let branch = await Branch.findOne({ name: value });
            if (branch) {
                throw new CustomError('Branch already exists', 400);
            }
            return true;
        }),
    validator.check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validationMiddleware
];

const getBranchValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Branch ID is required")
        .isMongoId()
        .withMessage("Invalid Branch ID"),

    validationMiddleware
];

const deleteBranchValidator = [
    validator.check("id")
        .notEmpty()
        .withMessage("Branch ID is required")
        .isMongoId()
        .withMessage("Invalid Branch ID"),

    validationMiddleware
];

module.exports = {
    createBranchValidator,
    updateBranchValidator,
    getBranchValidator,
    deleteBranchValidator
}