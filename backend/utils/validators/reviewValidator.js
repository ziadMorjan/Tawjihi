import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import Review from '../../models/Review.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createReviewValidator = [
	check('course')
		.notEmpty()
		.withMessage('course is required')
		.isMongoId()
		.withMessage('invalid course id')
		.custom(async (value) => {
			const course = await Course.findById(value);
			if (!course) {
				throw new CustomError('No course found', 404);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const enrollment = await Enrollment.findOne({
				course: value,
				user: req.user.id,
			});
			if (!enrollment) {
				throw new CustomError(
					'You can not make a review on course you not enrolled in',
					403,
				);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const review = await Review.findOne({
				course: value,
				user: req.user.id,
			});
			if (review) {
				throw new CustomError('You have already reviewed this course', 400);
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
		.isFloat({ min: 0, max: 5 })
		.withMessage('Review rating must be between 0 and 5'),

	validationMiddleware,
];

export const getReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage('Review ID is required')
		.isMongoId()
		.withMessage('Invalid Review ID')
		.custom(async (value) => {
			const review = await Review.findById(value);
			if (!review) {
				throw new CustomError('No review found', 404);
			}
		}),

	validationMiddleware,
];

export const updateReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage('Review ID is required')
		.isMongoId()
		.withMessage('Invalid Review ID')
		.custom(async (value) => {
			const review = await Review.findById(value);
			if (!review) {
				throw new CustomError('No review found', 404);
			}
		}),

	check('course')
		.optional()
		.notEmpty()
		.withMessage('course is required')
		.isMongoId()
		.withMessage('invalid course id')
		.custom(async (value) => {
			const course = await Course.findById(value);
			if (!course) {
				throw new CustomError('No course found', 404);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const enrollment = await Enrollment.findOne({
				course: value,
				user: req.user.id,
			});
			if (!enrollment) {
				throw new CustomError(
					'You can not update review on course you not enrolled in',
					403,
				);
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
		.isFloat({ min: 0, max: 5 })
		.withMessage('Review rating must be between 0 and 5'),

	validationMiddleware,
];

export const deleteReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage('Review ID is required')
		.isMongoId()
		.withMessage('Invalid Review ID')
		.custom(async (value) => {
			const review = await Review.findById(value);
			if (!review) {
				throw new CustomError('No review found', 404);
			}
		}),

	validationMiddleware,
];
