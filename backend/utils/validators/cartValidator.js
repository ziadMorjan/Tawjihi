import { check } from 'express-validator';
import Course from '../../models/Course.js';
import Coupon from '../../models/Coupon.js';
import Enrollment from '../../models/Enrollment.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const cartValidator = [
	check('courseId')
		.notEmpty()
		.withMessage('course is required')
		.isMongoId()
		.withMessage('invalid course id')
		.custom(async (value, { req }) => {
			const course = await Course.findById(value);
			if (!course) throw new CustomError('no course found', 404);
			const enrollment = await Enrollment.findOne({
				course: value,
				user: req.user.id,
			});
			if (enrollment) throw new CustomError('You are already enrolled in this course', 400);
			return true;
		}),

	validationMiddleware,
];

export const applyCouponValidator = [
	check('coupon')
		.notEmpty()
		.withMessage('coupon is required')
		.custom(async (value) => {
			const coupon = await Coupon.findOne({
				name: value,
				expire: { $gte: Date.now() },
			});
			if (!coupon) throw new CustomError('Invalid or expired coupon', 404);
			return true;
		}),

	validationMiddleware,
];
