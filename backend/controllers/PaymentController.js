import Stripe from 'stripe';
import i18n from '../config/i18n.js';
import Course from '../models/Course.js';
import Cart from '../models/Cart.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import { getAll, getOne } from './controller.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const getPayments = getAll(Payment);

export const getPayment = getOne(Payment, 'Payment');

export const createCheckoutSession = asyncErrorHandler(async (req, res, next) => {
	// 1. جلب سلة المستخدم مع populate للكورسات
	const cart = await Cart.findOne({ user: req.user.id }).populate('courses');

	if (!cart || cart.courses.length === 0) {
		return res.status(400).json({ status: 'fail', message: 'السلة فارغة' });
	}

	// 2. حساب السعر الفعلي لكل كورس (بعد خصم الكورس نفسه إن وجد)
	// هذا هو السعر الذي يُعرض للمستخدم في الواجهة
	const effectivePrices = cart.courses.map((item) => item.priceAfterDiscount ?? item.price);
	const effectiveTotal = effectivePrices.reduce((sum, p) => sum + p, 0);

	// 3. حساب نسبة خصم الكوبون (إن وُجد)
	// totalPriceAfterDiscount مبني على totalPrice (الأسعار الأصلية) — نحتاج نُعيد حسابه على effectiveTotal
	let couponMultiplier = 1;
	if (cart.totalPriceAfterDiscount !== undefined && cart.totalPrice > 0) {
		// نسبة الخصم = (totalPrice - totalPriceAfterDiscount) / totalPrice
		const couponDiscountRatio =
			(cart.totalPrice - cart.totalPriceAfterDiscount) / cart.totalPrice;
		couponMultiplier = 1 - couponDiscountRatio;
	}

	// 4. إنشاء جلسة الدفع في Stripe
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: cart.courses.map((item, index) => {
			// السعر الفعلي للكورس (بعد خصم الكورس) ثم نطبق عليه نسبة خصم الكوبون
			const effectivePrice = effectivePrices[index];
			const finalPrice = effectivePrice * couponMultiplier;

			return {
				price_data: {
					currency: 'ils',
					product_data: {
						name: item.name,
					},
					// Stripe يتعامل بالأغورات/السنتات لذلك نضرب بـ 100
					unit_amount: Math.round(finalPrice * 100),
				},
				quantity: 1,
			};
		}),
		metadata: {
			courses: cart.courses.map((c) => c._id.toString()).join(' '),
			user: req.user.id.toString(),
		},
		mode: 'payment',
		success_url: `${process.env.FRONTEND_URL}/user/my-courses`,
		cancel_url: `${process.env.FRONTEND_URL}/cancel`,
	});

	res.status(201).json({
		status: 'success',
		sessionUrl: session.url,
	});
});

export const webhook = asyncErrorHandler(async (req, res) => {
	console.log('🔥 طلب جديد وصل للـ Webhook!'); // أضف هذا السطر في أول سطر في الدالة
	const sig = req.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
		// إضافة هذا السطر لرؤية نوع الحدث في الـ Terminal
		console.log('✅ Webhook Event Received:', event.type);
	} catch (err) {
		console.error('❌ Webhook Signature Error:', err.message);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		console.log('💰 Payment successful! Session ID:', session.id); // للتأكد أن العملية تمت
		const { metadata } = session;
		const ids = metadata.courses.split(' ');

		// إضافة هذا السطر للتأكد من البيانات القادمة من Stripe
		console.log('📦 Metadata Received:', metadata);

		await Payment.create({ user: metadata.user, amount: session.amount_total / 100 });

		const promises = ids.map((id) => Enrollment.create({ user: metadata.user, course: id }));
		await Promise.all(promises);
		console.log('🎉 Enrollment created successfully!'); // للتأكد من نجاح الإضافة
	}

	res.status(200).json({ received: true });
});
