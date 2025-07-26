import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Coupon from '../../models/Coupon.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCouponValidator = [
	check('name')
		.notEmpty()
		.withMessage('Name is required')
		.custom(async (value) => {
			const coupon = await Coupon.findOne({ name: value });
			if (coupon) {
				throw new CustomError('Coupon already exists', 400);
			}
			return true;
		}),

	check('discount')
		.notEmpty()
		.withMessage('discount is required')
		.isNumeric()
		.withMessage('discount must be number'),

	check('expire')
		.notEmpty()
		.withMessage('expire is required')
		.isDate()
		.withMessage('expire must be date'),

	validationMiddleware,
];

export const updateCouponValidator = [
	check('id')
		.notEmpty()
		.withMessage('Coupon ID is required')
		.isMongoId()
		.withMessage('Invalid Coupon ID'),

	check('name')
		.optional()
		.notEmpty()
		.withMessage('Name is required')
		.custom(async (value) => {
			const coupon = await Coupon.findOne({ name: value });
			if (coupon) {
				throw new CustomError('Coupon already exists', 400);
			}
			return true;
		}),

	check('discount')
		.optional()
		.notEmpty()
		.withMessage('discount is required')
		.isNumeric()
		.withMessage('discount must be number'),

	check('expire')
		.optional()
		.notEmpty()
		.withMessage('expire is required')
		.isDate()
		.withMessage('expire must be date'),

	validationMiddleware,
];

export const getCouponValidator = [
	check('id')
		.notEmpty()
		.withMessage('Coupon ID is required')
		.isMongoId()
		.withMessage('Invalid Coupon ID'),

	validationMiddleware,
];

export const deleteCouponValidator = [
	check('id')
		.notEmpty()
		.withMessage('Coupon ID is required')
		.isMongoId()
		.withMessage('Invalid Coupon ID'),

	validationMiddleware,
];
