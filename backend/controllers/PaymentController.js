import Stripe from 'stripe';
import i18n from '../config/i18n.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import { getAll, getOne } from './controller.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const getPayments = getAll(Payment);

export const getPayment = getOne(Payment, 'Payment');

export const createCheckoutSession = asyncErrorHandler(async (req, res) => {
	const { ids } = req.body;
	const promises = ids.map((id) => Course.findById(id));
	const courses = await Promise.all(promises);

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: courses.map((item) => ({
			price_data: {
				currency: 'ils',
				product_data: {
					name: item.name,
				},
				unit_amount: item.price * 100,
			},
			quantity: 1,
		})),
		metadata: {
			courses: ids.join(' '),
			user: req.user.id,
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
	const sig = req.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		const errorMessage = i18n.__(
			{ phrase: 'generic.webhook_error', locale: 'en' },
			{ error_message: err.message },
		);
		console.error(errorMessage);
		return res.status(400).send(errorMessage);
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		const { metadata } = session;
		const ids = metadata.courses.split(' ');

		await Payment.create({ user: metadata.user, amount: session.amount_total / 100 });

		const promises = ids.map((id) => Enrollment.create({ user: metadata.user, course: id }));
		await Promise.all(promises);
	}

	res.status(200).json({ status: i18n.__({ phrase: 'generic.received', locale: 'en' }) });
});
