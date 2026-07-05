import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import Coupon from '../models/Coupon.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

const sendRes = (res, cart) =>
	res.status(200).json({
		status: 'success',
		cart,
	});

export const getLoggedUserCart = asyncErrorHandler(async (req, res) => {
	let cart = await Cart.findOne({ user: req.user.id });
	if (!cart) cart = await Cart.create({ user: req.user.id });

	sendRes(res, cart);
});

// controllers/CartController.js

export const addToCart = asyncErrorHandler(async (req, res) => {
	let cart = await Cart.findOne({ user: req.user.id });
	const course = await Course.findById(req.params.courseId);

	// دائماً نضيف السعر الأصلي للـ totalPrice (قبل أي خصم كوبون)
	// priceAfterDiscount هو خصم الكورس نفسه — يُعرض في الواجهة لكن الحساب يعتمد على course.price
	const priceToAdd = course.price;

	if (!cart) {
		// إصلاح الخلل: إضافة الكورس مباشرة عند إنشاء السلة لأول مرة
		cart = await Cart.create({
			user: req.user.id,
			courses: [course.id],
			totalPrice: priceToAdd,
		});
		cart = await cart.populate('courses');
	} else {
		const index = cart.courses.findIndex((item) => item.id === course.id);
		if (index === -1) {
			cart = await Cart.findOneAndUpdate(
				{ user: req.user.id },
				{
					$push: { courses: course.id },
					$inc: { totalPrice: priceToAdd },
					$set: { appliedCoupons: [] }, // إزالة الكوبونات السابقة لضمان صحة الحساب
					$unset: { totalPriceAfterDiscount: 1 },
				},
				{ new: true },
			).populate('courses'); // إجبار الـ backend على إرسال بيانات الكورس كاملة وليس فقط الـ ID
		}
	}

	sendRes(res, cart);
});

export const removeFromCart = asyncErrorHandler(async (req, res) => {
	let cart = await Cart.findOne({ user: req.user.id });
	const course = await Course.findById(req.params.courseId);

	if (!cart) {
		cart = await Cart.create({ user: req.user.id });
	} else {
		const index = cart.courses.findIndex((item) => item.id === course.id);
		if (index !== -1) {
			const priceToRemove = course.price; // دائماً السعر الأصلي لأنه هو المضاف في totalPrice
			cart = await Cart.findOneAndUpdate(
				{ user: req.user.id },
				{
					$pull: { courses: course.id },
					$inc: { totalPrice: -priceToRemove },
					$set: { appliedCoupons: [] },
					$unset: { totalPriceAfterDiscount: 1 },
				},
				{ new: true },
			).populate('courses');
		}
	}

	sendRes(res, cart);
});
export const clearCart = asyncErrorHandler(async (req, res) => {
	const cart = await Cart.findOneAndUpdate(
		{ user: req.user.id },
		{
			courses: [],
			totalPrice: 0,
			totalPriceAfterDiscount: undefined,
		},
		{ new: true },
	);

	sendRes(res, cart);
});

export const applyCoupon = asyncErrorHandler(async (req, res) => {
	const cart = await Cart.findOne({ user: req.user.id });
	const coupon = await Coupon.findOne({ name: req.body.coupon });

	if (!coupon) throw new CustomError(req.__('cart.invalid_coupon'), 400);

	if (cart.courses.length === 0) throw new CustomError(req.__('cart.cart_empty'), 400);

	// منع تطبيق أي كوبون إذا كان هناك خصم مطبق مسبقاً (كوبون آخر أو نفس الكوبون)
	if (cart.appliedCoupons.length > 0)
		throw new CustomError(
			req.__('cart.coupon_already_applied', { coupon_name: coupon.name }),
			400,
		);

	// تأكد إضافي: فحص إذا كان هذا الكوبون بالذات موجود (بمقارنة ObjectId صحيحة)
	const alreadyUsed = cart.appliedCoupons.some((id) => id.toString() === coupon._id.toString());
	if (alreadyUsed)
		throw new CustomError(
			req.__('cart.coupon_already_applied', { coupon_name: coupon.name }),
			400,
		);

	// حساب السعر بعد الخصم بناءً على totalPrice (السعر الأصلي دائماً)
	cart.totalPriceAfterDiscount = parseFloat(
		(cart.totalPrice - (coupon.discount / 100) * cart.totalPrice).toFixed(2),
	);
	cart.appliedCoupons.push(coupon._id);
	await cart.save();

	await cart.populate('courses');

	sendRes(res, cart);
});
