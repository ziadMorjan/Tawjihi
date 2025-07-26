import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Lesson from '../../models/Lesson.js';
import Comment from '../../models/Comment.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCommentValidator = [
	check('lesson')
		.notEmpty()
		.withMessage('lesson is required')
		.isMongoId()
		.withMessage('invalid lesson id')
		.custom(async (value, { req }) => {
			const lesson = await Lesson.findById(value);
			if (!lesson) {
				throw new CustomError('No lesson found', 404);
			}
			const enrollment = await Enrollment.findOne({
				course: lesson.course,
				user: req.user.id,
			});
			if (!enrollment) {
				throw new CustomError(
					'You can not make a Comment on lesson on course you not enrolled in',
					403,
				);
			}
			return true;
		}),

	check('user')
		.notEmpty()
		.withMessage('user is required')
		.isMongoId()
		.withMessage('invalid user id'),

	check('content').notEmpty().withMessage('comment is required'),

	validationMiddleware,
];

export const getCommentValidator = [
	check('id')
		.notEmpty()
		.withMessage('Comment ID is required')
		.isMongoId()
		.withMessage('Invalid Comment ID')
		.custom(async (value) => {
			const comment = await Comment.findById(value);
			if (!comment) {
				throw new CustomError('No Comment found', 404);
			}
		}),

	validationMiddleware,
];

export const updateCommentValidator = [
	check('id')
		.notEmpty()
		.withMessage('Comment ID is required')
		.isMongoId()
		.withMessage('Invalid Comment ID')
		.custom(async (value) => {
			const comment = await Comment.findById(value);
			if (!comment) {
				throw new CustomError('No Comment found', 404);
			}
		}),

	check('lesson')
		.optional()
		.notEmpty()
		.withMessage('lesson is required')
		.isMongoId()
		.withMessage('invalid lesson id')
		.custom(async (value, { req }) => {
			const lesson = await Lesson.findById(value);
			if (!lesson) {
				throw new CustomError('No lesson found', 404);
			}
			const enrollment = await Enrollment.findOne({
				course: lesson.course,
				user: req.user.id,
			});
			if (!enrollment) {
				throw new CustomError(
					'You can not make a Comment on lesson on course you not enrolled in',
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

	check('content').optional().notEmpty().withMessage('comment is required'),

	validationMiddleware,
];

export const deleteCommentValidator = [
	check('id')
		.notEmpty()
		.withMessage('Comment ID is required')
		.isMongoId()
		.withMessage('Invalid Comment ID')
		.custom(async (value) => {
			const comment = await Comment.findById(value);
			if (!comment) {
				throw new CustomError('No Comment found', 404);
			}
		}),

	validationMiddleware,
];
