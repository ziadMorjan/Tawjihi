import { check } from 'express-validator';
import Branch from '../../models/Branch.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createBranchValidator = [
	check('name')
		.notEmpty()
		.withMessage('Name is required')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters long')
		.custom(async (value) => {
			const branch = await Branch.findOne({ name: value });
			if (branch) {
				throw new CustomError('Branch already exists', 400);
			}
			return true;
		}),
	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage('Description must be between 10 and 1000 characters long'),

	validationMiddleware,
];

export const updateBranchValidator = [
	check('id')
		.notEmpty()
		.withMessage('Branch ID is required')
		.isMongoId()
		.withMessage('Invalid Branch ID'),

	check('name')
		.optional()
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters long')
		.custom(async (value) => {
			const branch = await Branch.findOne({ name: value });
			if (branch) {
				throw new CustomError('Branch already exists', 400);
			}
			return true;
		}),
	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage('Description must be between 10 and 1000 characters long'),

	validationMiddleware,
];

export const getBranchValidator = [
	check('id')
		.notEmpty()
		.withMessage('Branch ID is required')
		.isMongoId()
		.withMessage('Invalid Branch ID'),

	validationMiddleware,
];

export const deleteBranchValidator = [
	check('id')
		.notEmpty()
		.withMessage('Branch ID is required')
		.isMongoId()
		.withMessage('Invalid Branch ID'),

	validationMiddleware,
];
