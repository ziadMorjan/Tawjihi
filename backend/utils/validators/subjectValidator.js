import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Subject from '../../models/Subject.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createSubjectValidator = [
    check('name')
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
    check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validationMiddleware
];

export const updateSubjectValidator = [
    check("id")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    check('name')
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
    check('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters long'),

    validationMiddleware
];

export const getSubjectValidator = [
    check("id")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    validationMiddleware
];

export const deleteSubjectValidator = [
    check("id")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    validationMiddleware
];
