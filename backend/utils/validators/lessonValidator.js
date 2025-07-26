import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createLessonValidator = [
	check('name')
		.notEmpty()
		.withMessage('Name is required')
		.isString()
		.withMessage('Name must be a string')
		.trim()
		.escape(),

	check('description')
		.notEmpty()
		.withMessage('Description is required')
		.isString()
		.withMessage('Description must be a string')
		.trim()
		.escape(),

	check('video').notEmpty().withMessage('Video is required'),

	check('course')
		.notEmpty()
		.withMessage('Course ID is required')
		.isMongoId()
		.withMessage('Course ID must be a valid MongoDB ObjectId')
		.custom(async (courseId) => {
			const course = await Course.findById(courseId);
			if (!course) throw new CustomError('Course not found', 404);
			return true;
		}),

	validationMiddleware,
];

export const getLessonValidator = [
	check('id')
		.notEmpty()
		.withMessage('Lesson ID is required')
		.isMongoId()
		.withMessage('Lesson ID must be a valid MongoDB ObjectId'),

	validationMiddleware,
];

export const updateLessonValidator = [
	check('name')
		.optional()
		.notEmpty()
		.withMessage('Name is required')
		.isString()
		.withMessage('Name must be a string')
		.trim()
		.escape(),

	check('description')
		.optional()
		.notEmpty()
		.withMessage('Description is required')
		.isString()
		.withMessage('Description must be a string')
		.trim()
		.escape(),

	check('video').optional().notEmpty().withMessage('Video is required'),

	check('course')
		.optional()
		.notEmpty()
		.withMessage('Course ID is required')
		.isMongoId()
		.withMessage('Course ID must be a valid MongoDB ObjectId')
		.custom(async (courseId) => {
			const course = await Course.findById(courseId);
			if (!course) throw new CustomError('Course not found', 404);
			return true;
		}),

	validationMiddleware,
];

export const deleteLessonValidator = [
	check('id')
		.notEmpty()
		.withMessage('Lesson ID is required')
		.isMongoId()
		.withMessage('Lesson ID must be a valid MongoDB ObjectId'),

	validationMiddleware,
];
