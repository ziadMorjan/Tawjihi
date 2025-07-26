import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createNewValidator = [
	check('title')
		.notEmpty()
		.withMessage('title is required')
		.isLength({ min: 3 })
		.withMessage('title must be at least 3 characters long'),

	check('body')
		.isLength({ min: 10, max: 10000 })
		.withMessage('body must be between 10 and 10000 characters long'),

	validationMiddleware,
];

export const updateNewValidator = [
	check('id')
		.notEmpty()
		.withMessage('New ID is required')
		.isMongoId()
		.withMessage('Invalid New ID'),

	check('title')
		.optional()
		.notEmpty()
		.withMessage('title is required')
		.isLength({ min: 3 })
		.withMessage('title must be at least 3 characters long'),

	check('body')
		.optional()
		.isLength({ min: 10, max: 10000 })
		.withMessage('body must be between 10 and 10000 characters long'),

	validationMiddleware,
];

export const getNewValidator = [
	check('id')
		.notEmpty()
		.withMessage('New ID is required')
		.isMongoId()
		.withMessage('Invalid New ID'),

	validationMiddleware,
];

export const deleteNewValidator = [
	check('id')
		.notEmpty()
		.withMessage('New ID is required')
		.isMongoId()
		.withMessage('Invalid New ID'),

	validationMiddleware,
];
