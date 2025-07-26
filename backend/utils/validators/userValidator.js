import { check } from 'express-validator';
import { compareSync } from 'bcryptjs';
import User from '../../models/User.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createUserValidator = [
	check('name').notEmpty().withMessage('Name is required'),
	check('email')
		.notEmpty()
		.withMessage('email is required')
		.custom(async (value) => {
			const user = await User.findOne({ email: value });
			if (user) {
				throw new CustomError('User already exists', 400);
			}
			return true;
		}),

	check('password')
		.notEmpty()
		.withMessage('password is required')
		.isLength({ min: 8 })
		.withMessage('password must be at least 8 chars')
		.custom((value, { req }) => {
			if (req.body.confirmPassword !== value) {
				throw new CustomError('password does not match confirm password', 400);
			}
			return true;
		}),

	check('phone')
		.isMobilePhone(['ar-PS', 'he-IL'])
		.withMessage('invalid phone number format')
		.custom(async (value) => {
			const user = await User.findOne({ phone: value });
			if (user) {
				throw new CustomError('this phone number is used try another one', 400);
			}
			return true;
		}),

	check('role').optional().isIn(['admin', 'teacher', 'user']).withMessage('invalid role'),

	validationMiddleware,
];

export const updateUserValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID'),

	check('name').optional().notEmpty().withMessage('Name is required'),

	check('email')
		.optional()
		.notEmpty()
		.withMessage('email is required')
		.custom(async (value, { req }) => {
			if (value !== req.user.email) {
				const user = await User.findOne({ email: value });
				if (user) {
					throw new CustomError('User already exists', 400);
				}
			}
			return true;
		}),

	check('password')
		.optional()
		.notEmpty()
		.withMessage('password is required')
		.isLength({ min: 8 })
		.withMessage('password must be at least 8 chars')
		.custom((value, { req }) => {
			if (req.body.confirmPassword !== value) {
				throw new CustomError('password does not match confirm password', 400);
			}
			return true;
		}),

	check('phone')
		.optional()
		.isMobilePhone(['ar-PS', 'he-IL'])
		.withMessage('invalid phone number format')
		.custom(async (value) => {
			const user = await User.findOne({ phone: value });
			if (user) {
				throw new CustomError('this phone number is used try another one', 400);
			}
			return true;
		}),

	check('role').optional().isIn(['admin', 'teacher', 'user']).withMessage('invalid role'),

	validationMiddleware,
];

export const getUserValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID'),

	validationMiddleware,
];

export const deleteUserValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID'),

	validationMiddleware,
];

export const changePasswordValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID'),

	check('currentPassword')
		.notEmpty()
		.withMessage('current password is required')
		.custom(async (value, { req }) => {
			const user = await User.findById(req.user.id).select('+password');

			if (!compareSync(value, user.password)) {
				throw new CustomError('Wrong current password', 400);
			}
			return true;
		}),

	check('newPassword')
		.notEmpty()
		.withMessage('new password is required')
		.isLength({ min: 8 })
		.withMessage('new password must be at least 8 chars')
		.custom((value, { req }) => {
			if (req.body.newConfirmPassword !== value) {
				throw new CustomError('new password does not match confirm new password', 400);
			}
			return true;
		}),

	validationMiddleware,
];

export const activateUserValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID'),

	validationMiddleware,
];

export const deactivateUserValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID'),

	validationMiddleware,
];

export const acceptTeacherValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID')
		.custom(async (value) => {
			const user = await User.findById(value);
			if (!user) {
				throw new CustomError('No teacher found', 404);
			}
			if (user.role !== 'teacher') {
				throw new CustomError('this user is not a teacher', 400);
			}
			if (user.isActive === true) {
				throw new CustomError('this teacher is already active', 400);
			}
			return true;
		}),

	validationMiddleware,
];

export const refuseTeacherValidator = [
	check('id')
		.notEmpty()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID')
		.custom(async (value) => {
			const user = await User.findById(value);
			if (!user) {
				throw new CustomError('No teacher found', 404);
			}
			if (user.role !== 'teacher') {
				throw new CustomError('this user is not a teacher', 400);
			}
			return true;
		}),

	validationMiddleware,
];
