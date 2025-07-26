import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import User from '../../models/User.js';
import TeacherReview from '../../models/TeacherReview.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createTeacherReviewValidator = [
	check('teacher')
		.notEmpty()
		.withMessage('teacher is required')
		.isMongoId()
		.withMessage('invalid teacher id')
		.custom(async (value) => {
			console.log(value);
			const teacher = await User.findOne({
				_id: value,
				isActive: true,
				role: 'teacher',
			});
			if (!teacher) {
				throw new CustomError('No teacher found', 404);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const tReview = await TeacherReview.findOne({
				teacher: value,
				user: req.user.id,
			});
			if (tReview) {
				throw new CustomError('You have already reviewed this teacher', 400);
			}
			return true;
		}),

	check('user')
		.notEmpty()
		.withMessage('user is required')
		.isMongoId()
		.withMessage('invalid user id'),

	check('comment')
		.notEmpty()
		.withMessage('Review comment is required')
		.isLength({ max: 500 })
		.withMessage('Review comment must be less than 500 characters'),

	check('rating')
		.notEmpty()
		.withMessage('Review rating is required')
		.isNumeric()
		.withMessage('Review rating must be a number')
		.isFloat({ min: 1, max: 5 })
		.withMessage('Review rating must be between 1 and 5'),

	validationMiddleware,
];

export const getTeacherReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage('Review ID is required')
		.isMongoId()
		.withMessage('Invalid Review ID')
		.custom(async (value) => {
			const tReview = await TeacherReview.findById(value);
			if (!tReview) {
				throw new CustomError('No review found', 404);
			}
		}),

	validationMiddleware,
];

export const updateTeacherReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage('Review ID is required')
		.isMongoId()
		.withMessage('Invalid Review ID')
		.custom(async (value) => {
			const tReview = await TeacherReview.findById(value);
			if (!tReview) {
				throw new CustomError('No review found', 404);
			}
		}),

	check('teacher')
		.optional()
		.notEmpty()
		.withMessage('teacher is required')
		.isMongoId()
		.withMessage('invalid teacher id')
		.custom(async (value) => {
			console.log(value);
			const teacher = await User.findOne({
				_id: value,
				isActive: true,
				role: 'teacher',
			});
			console.log(teacher);
			if (!teacher) {
				throw new CustomError('No teacher found', 404);
			}
			return true;
		}),

	check('user')
		.optional()
		.notEmpty()
		.withMessage('user is required')
		.isMongoId()
		.withMessage('invalid user id'),

	check('comment')
		.optional()
		.notEmpty()
		.withMessage('Review comment is required')
		.isLength({ max: 500 })
		.withMessage('Review comment must be less than 500 characters'),

	check('rating')
		.optional()
		.notEmpty()
		.withMessage('Review rating is required')
		.isNumeric()
		.withMessage('Review rating must be a number')
		.isFloat({ min: 1, max: 5 })
		.withMessage('Review rating must be between 1 and 5'),

	validationMiddleware,
];

export const deleteTeacherReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage('Review ID is required')
		.isMongoId()
		.withMessage('Invalid Review ID')
		.custom(async (value) => {
			const tReview = await TeacherReview.findById(value);
			if (!tReview) {
				throw new CustomError('No review found', 404);
			}
		}),

	validationMiddleware,
];
